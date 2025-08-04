import db from '../../db.js';

const TipoEgreso = {
  create: (data, callback) => {
    const query = `INSERT INTO tipo_egreso (descripcion, created_at, updated_at) VALUES (?, NOW(), NOW())`;
    db.query(query, [data.descripcion], callback);
  },

  getAll: (callback) => {
    const query = `SELECT * FROM tipo_egreso WHERE deleted_at IS NULL ORDER BY idtipo_egreso DESC`;
    db.query(query, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM tipo_egreso
      WHERE deleted_at IS NULL 
        AND descripcion LIKE ?
      ORDER BY idtipo_egreso DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) AS total FROM tipo_egreso 
      WHERE deleted_at IS NULL 
        AND descripcion LIKE ?
    `;
    db.query(query, [searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  softDelete: (id, callback) => {
    const query = `
      UPDATE tipo_egreso 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE idtipo_egreso = ?
    `;
    db.query(query, [id], callback);
  }
};

export default TipoEgreso;
