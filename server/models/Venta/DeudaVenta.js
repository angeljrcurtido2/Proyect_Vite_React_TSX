// models/Venta/DeudaVenta.js
import db from '../../db.js';

const DeudaVenta = {
  create: (data, callback) => {
    const saldo = parseFloat(data.total_deuda) - parseFloat(data.total_pagado || 0);
    const ganancia_credito = (parseFloat(data.total_pagado || 0) - parseFloat(data.costo_empresa || 0));

    const query = `
          INSERT INTO deuda_venta (
            idventa, idcliente, total_deuda, total_pagado, saldo,
            estado, fecha_deuda, costo_empresa, ganancia_credito,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

    const values = [
      data.idventa,
      data.idcliente,
      data.total_deuda,
      data.total_pagado || 0,
      saldo,
      data.estado,
      data.fecha_deuda,
      data.costo_empresa,
      ganancia_credito
    ];

    db.query(query, values, callback);
  },

  findByCliente: (idcliente, callback) => {
    const query = `SELECT * FROM deuda_venta WHERE idcliente = ? AND deleted_at IS NULL`;
    db.query(query, [idcliente], callback);
  },

  findByVenta: (idventa, callback) => {
    const query = `SELECT * FROM deuda_venta WHERE idventa = ? AND deleted_at IS NULL`;
    db.query(query, [idventa], callback);
  },

  registrarPago: (iddeuda, monto_pagado, callback) => {
    const obtenerQuery = 'SELECT total_pagado, total_deuda, costo_empresa, estado FROM deuda_venta WHERE iddeuda = ?';

    db.query(obtenerQuery, [iddeuda], (err, results) => {
      if (err) return callback(err);

      if (!results.length) {
        return callback(new Error('❌ Deuda no encontrada.'));
      }

      const deuda = results[0];
      const nuevoTotalPagado = parseFloat(deuda.total_pagado) + parseFloat(monto_pagado);
      const nuevoSaldo = parseFloat(deuda.total_deuda) - nuevoTotalPagado;
      const nuevaGanancia = nuevoTotalPagado - parseFloat(deuda.costo_empresa);

      // Solo cambiar estado si la deuda fue saldada completamente
      const nuevoEstado = nuevoSaldo <= 0 ? 'pagado' : deuda.estado;

      const updateQuery = `
            UPDATE deuda_venta
            SET 
              total_pagado = ?,
              saldo = ?,
              ganancia_credito = ?,
              estado = ?,
              ult_fecha_pago = NOW(),
              updated_at = NOW()
            WHERE iddeuda = ?
          `;

      db.query(updateQuery, [nuevoTotalPagado, nuevoSaldo, nuevaGanancia, nuevoEstado, iddeuda], callback);
    });
  },

  updatePagos: (iddeuda, total_pagado, callback) => {
    const query = `
      UPDATE deuda_venta
      SET total_pagado = ?, updated_at = NOW()
      WHERE iddeuda = ?
    `;
    db.query(query, [total_pagado, iddeuda], callback);
  },

  getAllByNumDocumentoAndEstado: (numDocumento, estado, callback) => {
    const conditions = ['dv.deleted_at IS NULL'];
    const params = [];

    if (numDocumento) {
      conditions.push('c.numDocumento = ?');
      params.push(numDocumento);
    }

    if (estado) {
      conditions.push('dv.estado = ?');
      params.push(estado);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
    SELECT dv.*, c.nombre AS nombre_cliente, c.numDocumento
    FROM deuda_venta dv
    LEFT JOIN clientes c ON c.idcliente = dv.idcliente
    ${whereClause}
    ORDER BY dv.fecha_deuda DESC
  `;

    db.query(query, params, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, estado, callback) => {
    const searchTerm = `%${search}%`;

    let estadoCondicion = '';
    const params = [searchTerm, searchTerm, searchTerm]; // nombre, estado, numDocumento

    if (estado) {
      estadoCondicion = ' AND dv.estado = ?';
      params.push(estado);
    }

    params.push(limit, offset);

    const query = `
    SELECT dv.*, c.nombre AS nombre_cliente, c.numDocumento
    FROM deuda_venta dv
    LEFT JOIN clientes c ON c.idcliente = dv.idcliente
    WHERE dv.deleted_at IS NULL
      AND (
        c.nombre LIKE ?
        OR dv.estado LIKE ?
        OR c.numDocumento LIKE ?
      )
      ${estadoCondicion}
    ORDER BY dv.fecha_deuda DESC
    LIMIT ? OFFSET ?
  `;

    db.query(query, params, callback);
  },

  countFiltered: (search, estado, callback) => {
    const searchTerm = `%${search}%`;

    let estadoCondicion = '';
    const params = [searchTerm, searchTerm, searchTerm];

    if (estado) {
      estadoCondicion = ' AND dv.estado = ?';
      params.push(estado);
    }

    const query = `
      SELECT COUNT(*) AS total
      FROM deuda_venta dv
      LEFT JOIN clientes c ON c.idcliente = dv.idcliente
      WHERE dv.deleted_at IS NULL
        AND (
          c.nombre LIKE ?
          OR dv.estado LIKE ?
          OR c.numDocumento LIKE ?
        )
        ${estadoCondicion}
    `;

    db.query(query, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  findAllPaginatedFilteredByCliente: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
        SELECT
            dv.idcliente,
            c.nombre AS nombre_cliente,
            c.numDocumento,
            SUM(CAST(dv.total_deuda AS DECIMAL(10,2))) AS total_deuda,
            SUM(CAST(dv.total_pagado AS DECIMAL(10,2))) AS total_pagado,
            SUM(CAST(dv.saldo AS DECIMAL(10,2))) AS saldo,
            SUM(CAST(dv.costo_empresa AS DECIMAL(10,2))) AS costo_empresa,
            SUM(CAST(dv.ganancia_credito AS DECIMAL(10,2))) AS ganancia_credito,
            MIN(dv.fecha_deuda) AS fecha_deuda,
            MIN(dv.created_at) AS created_at
        FROM deuda_venta dv
        LEFT JOIN clientes c ON c.idcliente = dv.idcliente
        WHERE dv.deleted_at IS NULL
          AND (c.nombre LIKE ? OR dv.estado LIKE ? OR c.numDocumento LIKE ?)
        GROUP BY dv.idcliente, c.nombre , c.numDocumento
        ORDER BY fecha_deuda DESC
        LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },

  findAllFilteredByCliente: (search = '', callback) => {
  const like = `%${search}%`;

  const sql = `
    SELECT
        dv.idcliente,
        c.nombre                            AS nombre_cliente,
        c.numDocumento,

        /* ▼ Cantidad de ítems por estado ▼ */
        COUNT(CASE WHEN dv.estado = 'pendiente' THEN 1 END) AS items_pendientes,
        COUNT(CASE WHEN dv.estado = 'pagado'    THEN 1 END) AS items_pagados,

        /* ▼ Totales monetarios – opcionales ▼ */
        SUM(CAST(dv.total_deuda  AS DECIMAL(10,2))) AS total_deuda,
        SUM(CAST(dv.total_pagado AS DECIMAL(10,2))) AS total_pagado,
        SUM(CAST(dv.saldo        AS DECIMAL(10,2))) AS saldo,

        MIN(dv.fecha_deuda)  AS fecha_deuda,
        MIN(dv.created_at)   AS created_at
    FROM  deuda_venta dv
    LEFT  JOIN clientes c ON c.idcliente = dv.idcliente
    WHERE dv.deleted_at IS NULL
      AND (
        c.nombre       LIKE ?
        OR dv.estado   LIKE ?
        OR c.numDocumento LIKE ?
      )
    GROUP BY dv.idcliente, c.nombre, c.numDocumento
    ORDER BY fecha_deuda DESC;
  `;

  db.query(sql, [like, like, like], callback);
},

  countFilteredByCliente: (search, callback) => {
    const searchTerm = `%${search}%`;

    const query = `
    SELECT COUNT(DISTINCT dv.idcliente) AS total
    FROM deuda_venta dv
    LEFT JOIN clientes c ON c.idcliente = dv.idcliente
    WHERE dv.deleted_at IS NULL
      AND (
        c.nombre LIKE ?
        OR dv.estado LIKE ?
        OR c.numDocumento LIKE ?
      )
  `;

    db.query(query, [searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  findById: (iddeuda, callback) => {
    const query = 'SELECT * FROM deuda_venta WHERE iddeuda = ? AND deleted_at IS NULL LIMIT 1';
    db.query(query, [iddeuda], (err, results) => {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      return callback(null, results[0]);
    });
  }

};

export default DeudaVenta;
