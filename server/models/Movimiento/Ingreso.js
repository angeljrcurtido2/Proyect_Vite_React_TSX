import db from '../../db.js';

const Ingreso = {
  create: (data, callback) => {
    const query = `
    INSERT INTO ingresos (
      idventa, fecha, hora, monto, concepto, idtipo_ingreso, idformapago, observacion,
      idmovimiento, creado_por, idpago_deuda, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

    const values = [
      data.idventa || null,
      data.fecha,
      data.hora,
      data.monto,
      data.concepto,
      data.idtipo_ingreso,
      data.idformapago,
      data.observacion || '',
      data.idmovimiento,
      data.creado_por || 'sistema',
      data.idpago_deuda || null,
    ];

    db.query(query, values, callback);
  },

  findCobrosMensualesPorAnio: (anio, callback) => {
    const sql = `
        WITH RECURSIVE meses AS (
          SELECT 1 AS mes
          UNION ALL
          SELECT mes + 1 FROM meses WHERE mes < 12
        )
        SELECT
          m.mes,
          LPAD(m.mes,2,'0')              AS mes_str,
          MONTHNAME(STR_TO_DATE(m.mes,'%m')) AS nombre_mes,
          COALESCE(SUM(i.monto), 0)      AS total_cobrado
        FROM meses m
        LEFT JOIN ingresos i
              ON  i.deleted_at IS NULL
              AND i.idtipo_ingreso = 2
              AND YEAR(i.fecha) = ?
              AND MONTH(i.fecha) = m.mes
        GROUP BY m.mes
        ORDER BY m.mes;
      `;
    db.query(sql, [anio], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);             // rows.length === 12 siempre
    });
  },

  findCobrosDelDia: (fechaISO, callback) => {
    const sql = `
      SELECT 
        i.idingreso,
        i.monto,
        i.hora,
        i.concepto,
        i.idformapago
      FROM ingresos i
      WHERE i.deleted_at IS NULL
        AND i.idtipo_ingreso = 2
        AND DATE(i.fecha) = ?;
    `;

    db.query(sql, [fechaISO], (err, rows) => {
      if (err) return callback(err);

      const totalDia = rows.reduce(
        (acc, r) => acc + parseFloat(r.monto), 0
      ).toFixed(2);          // "122.13"

      callback(null, { totalDia, detalle: rows });
    });
  },

  findCobrosMensuales: (anio, mes, callback) => {
    const sql = `
      SELECT 
        DATE(i.fecha)             AS dia,
        SUM(i.monto)              AS monto_diario
      FROM ingresos i
      WHERE i.deleted_at IS NULL
        AND i.idtipo_ingreso = 2                 -- 2 = pago-deuda
        AND YEAR(i.fecha)  = ?
        AND MONTH(i.fecha) = ?
      GROUP BY dia
      ORDER BY dia;
    `;

    db.query(sql, [anio, mes], (err, rows) => {
      if (err) return callback(err);

      // total mensual: suma de todos los días
      const totalMensual = rows.reduce(
        (acc, r) => acc + parseFloat(r.monto_diario), 0
      );

      callback(null, { totalMensual, detalle: rows });
    });
  },

  updateTransferenciaId: (idingreso, iddetalle_transferencia_cobro, callback) => {
    const sql = `UPDATE ingresos SET iddetalle_transferencia_cobro = ? WHERE idingreso = ?`;
    db.query(sql, [iddetalle_transferencia_cobro, idingreso], callback);
  },

  updateTarjetasId: (idingreso, iddetalle_tarjeta_venta_cobro, callback) => {
    const sql = `UPDATE ingresos SET iddetalle_tarjeta_venta_cobro = ? WHERE idingreso = ?`;
    db.query(sql, [iddetalle_tarjeta_venta_cobro, idingreso], callback);
  },
  updateChequeId: (idingreso, iddetalle_cheque_venta_cobro, callback) => {
    const sql = `UPDATE ingresos SET iddetalle_cheque_venta_cobro = ? WHERE idingreso = ?`;
    db.query(sql, [iddetalle_cheque_venta_cobro, idingreso], callback);
  },

  getAll: (callback) => {
    const query = `
      SELECT i.*, t.descripcion AS tipo_ingreso
      FROM ingresos i
      JOIN tipo_ingreso t ON i.idtipo_ingreso = t.idtipo_ingreso
      WHERE i.deleted_at IS NULL
      ORDER BY i.created_at DESC
    `;
    db.query(query, callback);
  },

  findByMovimiento: (idmovimiento, callback) => {
    const sql = `
    SELECT 
      i.idingreso,
      DATE_FORMAT(i.fecha, '%d-%m-%Y') AS fecha,
      i.hora,
      i.monto,
      i.concepto,
      i.idtipo_ingreso,
      ti.descripcion  AS tipo_ingreso,
      i.idformapago,
      fp.descripcion  AS forma_pago,
      i.observacion,
      i.idventa,
      i.idpago_deuda,
      i.creado_por,
      CONCAT(u.nombre, ' ', u.apellido) AS creador
      
    FROM ingresos i
    LEFT JOIN tipo_ingreso ti  ON i.idtipo_ingreso  = ti.idtipo_ingreso
    LEFT JOIN formas_pago  fp   ON i.idformapago     = fp.idformapago
    LEFT JOIN usuarios u ON i.creado_por = u.idusuarios

    WHERE i.deleted_at IS NULL
      AND i.idmovimiento = ?
    ORDER BY i.created_at DESC
  `;
    db.query(sql, [idmovimiento], callback);
  },


  findAllPaginatedFiltered: (limit, offset, search, filtros, cb) => {
    const params = [];
    const buildFechaWhere = (f, params) => {
      const conds = [];
      if (f.fechaDesde) { conds.push('DATE(i.fecha) >= ?'); params.push(f.fechaDesde); }
      if (f.fechaHasta) { conds.push('DATE(i.fecha) <= ?'); params.push(f.fechaHasta); }
      return conds.length ? ' AND ' + conds.join(' AND ') : '';
    }

    const searchTerm = `%${search}%`;

    const sql = `
    SELECT 
      i.*,
      t.descripcion AS tipo_ingreso,
      (i.idventa IS NOT NULL OR i.idpago_deuda IS NOT NULL) AS relacionado
    FROM ingresos i
    JOIN tipo_ingreso t ON i.idtipo_ingreso = t.idtipo_ingreso
    WHERE i.deleted_at IS NULL
      AND (i.concepto LIKE ? OR t.descripcion LIKE ?)
      ${buildFechaWhere(filtros, params)}
    ORDER BY i.fecha DESC
    LIMIT ? OFFSET ?
  `;

    params.unshift(searchTerm, searchTerm); // search params al principio
    params.push(limit, offset);             // paginación al final
    db.query(sql, params, cb);
  },

  countFiltered: (search, filtros, cb) => {
    const params = [];
    const buildFechaWhere = (f, params) => {
      const conds = [];
      if (f.fechaDesde) { conds.push('DATE(i.fecha) >= ?'); params.push(f.fechaDesde); }
      if (f.fechaHasta) { conds.push('DATE(i.fecha) <= ?'); params.push(f.fechaHasta); }
      return conds.length ? ' AND ' + conds.join(' AND ') : '';
    }

    const searchTerm = `%${search}%`;

    const sql = `
    SELECT COUNT(*) AS total
    FROM ingresos i
    JOIN tipo_ingreso t ON i.idtipo_ingreso = t.idtipo_ingreso
    WHERE i.deleted_at IS NULL
      AND (i.concepto LIKE ? OR t.descripcion LIKE ?)
      ${buildFechaWhere(filtros, params)}
  `;

    params.unshift(searchTerm, searchTerm);
    db.query(sql, params, (err, rows) =>
      err ? cb(err) : cb(null, rows[0].total)
    );
  },

  // Verifica si un ingreso está relacionado a una venta
  checkIfIngresoRelacionado: (idingreso, callback) => {
    const query = `
    SELECT idingreso, idventa, idpago_deuda
    FROM ingresos
    WHERE idingreso = ? AND deleted_at IS NULL
    LIMIT 1
  `;
    db.query(query, [idingreso], (err, results) => {
      if (err) return callback(err);
      if (!results.length) return callback(null, null);

      const ingreso = results[0];
      const relacionado = ingreso.idventa != null || ingreso.idpago_deuda != null;
      callback(null, relacionado);
    });
  },

  softDeleteByVentaId: (idventa, callback) => {
    const query = `
      UPDATE ingresos
      SET deleted_at = NOW()
      WHERE idventa = ? AND deleted_at IS NULL
    `;
    db.query(query, [idventa], callback);
  },

  softDeleteByPagoDeudaId: (idpago_deuda, callback) => {
    const query = `
      UPDATE ingresos 
      SET deleted_at = NOW(), updated_at = NOW() 
      WHERE idpago_deuda = ?
    `;
    db.query(query, [idpago_deuda], callback);
  },

  softDelete: (idingreso, callback) => {
    const query = `
      UPDATE ingresos
      SET deleted_at = NOW()
      WHERE idingreso = ?
    `;
    db.query(query, [idingreso], callback);
  },

};

export default Ingreso;
