// models/Compra/DetallePagoDeudaCompra.js
import db from '../../db.js';

const DetallePagoDeudaCompra = {
  create: (data, callback) => {
    const query = `
      INSERT INTO detalle_pago_deuda_compra (
        iddeuda_compra,
        monto_pagado,
        fecha_pago,
        observacion,
        metodo_pago,
        creado_por,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      data.iddeuda_compra,
      data.monto_pagado,
      data.fecha_pago || new Date(),
      data.observacion || '',
      data.metodo_pago || 'Desconocido',
      data.creado_por || 'sistema',
    ];

    db.query(query, values, callback);
  },

  findByDeudaId: (iddeuda, callback) => {
    const query = `
      SELECT * FROM detalle_pago_deuda_compra
      WHERE iddeuda = ? AND deleted_at IS NULL
      ORDER BY fecha_pago DESC
    `;
    db.query(query, [iddeuda], callback);
  },

  anularPago: (idpago, callback) => {
    const query = `
      UPDATE detalle_pago_deuda_compra
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE idpago_deuda_compra = ?
    `;
    db.query(query, [idpago], callback);
  },

  findByDeudaPaginated: (iddeuda_compra, limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM detalle_pago_deuda_compra
      WHERE iddeuda_compra = ?
        AND deleted_at IS NULL
        AND (
          observacion LIKE ?
          OR metodo_pago LIKE ?
          OR creado_por LIKE ?
        )
      ORDER BY fecha_pago DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [iddeuda_compra, searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },
  
  countByDeudaFiltered: (iddeuda_compra, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) as total
      FROM detalle_pago_deuda_compra
      WHERE iddeuda_compra = ?
        AND deleted_at IS NULL
        AND (
          observacion LIKE ?
          OR metodo_pago LIKE ?
          OR creado_por LIKE ?
        )
    `;
    db.query(query, [iddeuda_compra, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },
};

export default DetallePagoDeudaCompra;
