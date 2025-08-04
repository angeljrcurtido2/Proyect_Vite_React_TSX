import db from '../../db.js';

const DetallePagoDeudaVenta = {
  create: (data, callback) => {
  const query = `
    INSERT INTO detalle_pago_deuda_venta (
      iddeuda,
      total_deuda,
      total_pagado,
      saldo,
      monto_pagado,
      fecha_pago,
      observacion,
      idformapago,
      creado_por,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const values = [
    data.iddeuda,
    data.total_deuda,
    data.total_pagado,
    data.saldo,
    data.monto_pagado,
    data.fecha_pago,
    data.observacion,
    data.idformapago,
    data.creado_por,
  ];
  db.query(query, values, callback);
},

  updateTransferenciaId: (idpago_deuda, iddetalle_transferencia_cobro, callback) => {
    const sql = `UPDATE detalle_pago_deuda_venta SET iddetalle_transferencia_cobro = ? WHERE idpago_deuda = ?`;
    db.query(sql, [iddetalle_transferencia_cobro, idpago_deuda], callback);
  },

  updateTarjetasId: (idpago_deuda, iddetalle_tarjeta_venta_cobro, callback) => {
    const sql = `UPDATE detalle_pago_deuda_venta SET iddetalle_tarjeta_venta_cobro = ? WHERE idpago_deuda = ?`;
    db.query(sql, [iddetalle_tarjeta_venta_cobro, idpago_deuda], callback);
  },

  updateChequeId: (idpago_deuda, iddetalle_cheque_venta_cobro, callback) => {
    const sql = `UPDATE detalle_pago_deuda_venta SET iddetalle_cheque_venta_cobro = ? WHERE idpago_deuda = ?`;
    db.query(sql, [iddetalle_cheque_venta_cobro, idpago_deuda], callback);
  },

  anularPago: (idpago_deuda, callback) => {
    const query = `
      UPDATE detalle_pago_deuda_venta
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE idpago_deuda = ?
    `;
    db.query(query, [idpago_deuda], callback);
  },

  findByDeudaId: (iddeuda, callback) => {
    const query = `
      SELECT * FROM detalle_pago_deuda_venta
      WHERE iddeuda = ? AND deleted_at IS NULL
      ORDER BY fecha_pago DESC
    `;
    db.query(query, [iddeuda], callback);
  },

  // Obtener pagos por deuda con paginación y búsqueda opcional
  findByDeudaPaginated: (iddeuda, limit, offset, search, fecha_inicio, fecha_fin, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT 
      dpd.*,

      -- Transferencia
      dtc.banco_origen AS transferencia_banco_origen,
      dtc.numero_cuenta AS transferencia_numero_cuenta,
      dtc.tipo_cuenta AS transferencia_tipo_cuenta,
      dtc.titular_cuenta AS transferencia_titular_cuenta,
      dtc.observacion AS transferencia_observacion,

      -- Tarjeta
      dtv.tipo_tarjeta AS tarjeta_tipo_tarjeta,
      dtv.entidad AS tarjeta_entidad,
      dtv.monto AS tarjeta_monto,
      dtv.observacion AS tarjeta_observacion,

      -- Cheque
      dcv.banco AS cheque_banco,
      dcv.nro_cheque AS cheque_nro_cheque,
      dcv.monto AS cheque_monto,
      dcv.fecha_emision AS cheque_fecha_emision,
      dcv.fecha_vencimiento AS cheque_fecha_vencimiento,
      dcv.titular AS cheque_titular,
      dcv.estado AS cheque_estado

    FROM detalle_pago_deuda_venta dpd
    LEFT JOIN detalle_transferencia_cobro dtc ON dpd.iddetalle_transferencia_cobro = dtc.idtransferencia_cobro
    LEFT JOIN detalle_tarjeta_venta_cobro dtv ON dpd.iddetalle_tarjeta_venta_cobro = dtv.idtarjeta_venta_cobro
    LEFT JOIN detalle_cheque_venta_cobro dcv ON dpd.iddetalle_cheque_venta_cobro = dcv.iddetalle_cheque_venta_cobro
    WHERE dpd.iddeuda = ?
      AND dpd.deleted_at IS NULL
      AND (
        dpd.observacion LIKE ?
        OR dpd.idformapago LIKE ?
        OR dpd.creado_por LIKE ?
      )
      AND dpd.created_at BETWEEN ? AND ?
    ORDER BY dpd.fecha_pago DESC
    LIMIT ? OFFSET ?
  `;

    db.query(query, [iddeuda, searchTerm, searchTerm, searchTerm, fecha_inicio, fecha_fin, limit, offset], callback);
  },

  countByDeudaFiltered: (iddeuda, search, fecha_inicio, fecha_fin, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT COUNT(*) as total
    FROM detalle_pago_deuda_venta
    WHERE iddeuda = ?
      AND deleted_at IS NULL
      AND (
        observacion LIKE ?
        OR idformapago LIKE ?
        OR creado_por LIKE ?
      )
      AND created_at BETWEEN ? AND ?
  `;

    const params = [iddeuda, searchTerm, searchTerm, searchTerm, fecha_inicio, fecha_fin];

    db.query(query, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  getClienteByDeuda: (iddeuda, callback) => {
    const sql = `
    SELECT 
      c.idcliente,
      c.nombre        AS cliente_nombre,
      c.apellido      AS cliente_apellido,
      c.numDocumento  AS cliente_ci_ruc,
      c.telefono      AS cliente_telefono,
      c.direccion     AS cliente_direccion
    FROM deuda_venta d
    INNER JOIN clientes c ON c.idcliente = d.idcliente
    WHERE d.iddeuda = ?
    LIMIT 1
  `;
    db.query(sql, [iddeuda], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  // 🔹 Pago + deuda + cliente por idpago_deuda
  getPagoById: (idpago_deuda, callback) => {
    const sql = `
      SELECT 
        dpd.idpago_deuda,
        dpd.iddeuda,
        dpd.monto_pagado,
        dpd.fecha_pago,
        dpd.observacion,
        dpd.idformapago,
        dpd.creado_por,

        dpd.total_deuda,
        dpd.total_pagado,
        dpd.saldo,
        d.idcliente,
        d.idventa,

        c.nombre,
        c.apellido,
        c.numDocumento,
        c.telefono,
        c.direccion
      FROM detalle_pago_deuda_venta dpd
      INNER JOIN deuda_venta d ON dpd.iddeuda = d.iddeuda
      INNER JOIN clientes c    ON d.idcliente = c.idcliente
      WHERE dpd.idpago_deuda = ? AND dpd.deleted_at IS NULL
      LIMIT 1
    `;
    db.query(sql, [idpago_deuda], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  // 🔹 Suma total pagado hasta el momento (incluye este pago)
  getTotalPagadoActual: (iddeuda, callback) => {
    const sql = `
      SELECT SUM(monto_pagado) AS total_pagado_actual
      FROM detalle_pago_deuda_venta
      WHERE iddeuda = ? AND deleted_at IS NULL
    `;
    db.query(sql, [iddeuda], (err, rows) => {
      if (err) return callback(err);
      const total = parseFloat(rows[0]?.total_pagado_actual || 0);
      callback(null, total);
    });
  },

  getAllByDeudaFiltered: (iddeuda, search, fecha_inicio, fecha_fin, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT 
        dpd.*,

        -- Transferencia
        dtc.banco_origen AS transferencia_banco_origen,
        dtc.numero_cuenta AS transferencia_numero_cuenta,
        dtc.tipo_cuenta AS transferencia_tipo_cuenta,
        dtc.titular_cuenta AS transferencia_titular_cuenta,
        dtc.observacion AS transferencia_observacion,

        -- Tarjeta
        dtv.tipo_tarjeta AS tarjeta_tipo_tarjeta,
        dtv.entidad AS tarjeta_entidad,
        dtv.monto AS tarjeta_monto,
        dtv.observacion AS tarjeta_observacion,

        -- Cheque
        dcv.banco AS cheque_banco,
        dcv.nro_cheque AS cheque_nro_cheque,
        dcv.monto AS cheque_monto,
        dcv.fecha_emision AS cheque_fecha_emision,
        dcv.fecha_vencimiento AS cheque_fecha_vencimiento,
        dcv.titular AS cheque_titular,
        dcv.estado AS cheque_estado

      FROM detalle_pago_deuda_venta dpd
      LEFT JOIN detalle_transferencia_cobro dtc ON dpd.iddetalle_transferencia_cobro = dtc.idtransferencia_cobro
      LEFT JOIN detalle_tarjeta_venta_cobro dtv ON dpd.iddetalle_tarjeta_venta_cobro = dtv.idtarjeta_venta_cobro
      LEFT JOIN detalle_cheque_venta_cobro dcv ON dpd.iddetalle_cheque_venta_cobro = dcv.iddetalle_cheque_venta_cobro
      WHERE dpd.iddeuda = ?
        AND dpd.deleted_at IS NULL
        AND (
          dpd.observacion LIKE ?
          OR dpd.idformapago LIKE ?
          OR dpd.creado_por LIKE ?
        )
        AND dpd.created_at BETWEEN ? AND ?
      ORDER BY dpd.created_at DESC
    `;

    db.query(query, [iddeuda, searchTerm, searchTerm, searchTerm, fecha_inicio, fecha_fin], callback);
  }

};



export default DetallePagoDeudaVenta;
