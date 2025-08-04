import db from '../db.js';

const ActividadesEconomicas = {
  create: (data, callback) => {
    const query = 'INSERT INTO actividades_economicas (descripcion) VALUES (?)';
    db.query(query, [data.descripcion], callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM actividades_economicas
      WHERE descripcion LIKE ?
      ORDER BY idactividad DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) AS total FROM actividades_economicas
      WHERE descripcion LIKE ?
    `;
    db.query(query, [searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM actividades_economicas WHERE idactividad = ?';
    db.query(query, [id], callback);
  },

  update: (id, data, callback) => {
    const query = 'UPDATE actividades_economicas SET descripcion = ? WHERE idactividad = ?';
    db.query(query, [data.descripcion, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM actividades_economicas WHERE idactividad = ?';
    db.query(query, [id], callback);
  }
};

export default ActividadesEconomicas;
