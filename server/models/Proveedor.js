import db from '../db.js';

const Proveedor = {
  findAll: (callback) => {
    db.query('SELECT * FROM proveedor WHERE deleted_at IS NULL', callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM proveedor 
     WHERE deleted_at IS NULL AND (
      nombre LIKE ? 
      OR telefono LIKE ? 
      OR ruc LIKE ? 
      OR razon LIKE ?
      )
      ORDER BY idproveedor DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) as total FROM proveedor 
      WHERE deleted_at IS NULL AND (
      nombre LIKE ? 
      OR telefono LIKE ? 
      OR ruc LIKE ? 
      OR razon LIKE ?
      )
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM proveedor WHERE idproveedor = ? AND deleted_at IS NULL', [id], callback);
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO proveedor (
        nombre, telefono, direccion, ruc, razon, estado, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [
      data.nombre,
      data.telefono,
      data.direccion,
      data.ruc,
      data.razon,
      data.estado || 'activo'
    ];
    db.query(query, values, callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE proveedor SET
        nombre = ?, telefono = ?, direccion = ?, ruc = ?, razon = ?, estado = ?, updated_at = NOW()
      WHERE idproveedor = ?
    `;
    const values = [
      data.nombre,
      data.telefono,
      data.direccion,
      data.ruc,
      data.razon,
      data.estado,
      id
    ];
    db.query(query, values, callback);
  },

  delete: (id, callback) => {
    const query = `UPDATE proveedor SET deleted_at = NOW() WHERE idproveedor = ?`;
    db.query(query, [id], callback);
  }
};

export default Proveedor;
