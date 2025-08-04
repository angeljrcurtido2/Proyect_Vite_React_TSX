// models/Compra/DeudaCompra.js
import db from '../../db.js';

const DeudaCompra = {
  create: (data, callback) => {
    const query = `
      INSERT INTO deuda_compra (
        idcompra,
        idproveedor,
        total_deuda,
        total_pagado,
        saldo,
        estado,
        fecha_deuda,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, 0, ?, 'pendiente', NOW(), NOW(), NOW())
    `;
    const values = [
      data.idcompra,
      data.idproveedor,
      data.total,
      data.total, // saldo inicial igual al total
    ];
    db.query(query, values, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT dc.*, p.nombre
      FROM deuda_compra dc
      LEFT JOIN proveedor p ON p.idproveedor = dc.idproveedor
      WHERE dc.deleted_at IS NULL
        AND (p.nombre LIKE ? OR dc.estado LIKE ?)
      ORDER BY dc.fecha_deuda DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) AS total
      FROM deuda_compra dc
      LEFT JOIN proveedor p ON p.idproveedor = dc.idproveedor
      WHERE dc.deleted_at IS NULL
        AND (p.nombre LIKE ? OR dc.estado LIKE ?)
    `;
    db.query(query, [searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  }
};

export default DeudaCompra;
