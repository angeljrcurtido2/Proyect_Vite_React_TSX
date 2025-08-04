import db from '../db.js';

const Configuracion = {
  getValor: (clave, callback) => {
    const sql = `SELECT valor FROM configuracion WHERE clave = ? LIMIT 1`;
    db.query(sql, [clave], (err, results) => {
      if (err) return callback(err);
      const valor = results[0]?.valor ?? null; // devolvemos string o null
      callback(null, valor);
    });
  },

  crearOActualizar: (clave, valor, callback) => {
    const sql = `
      INSERT INTO configuracion (clave, valor)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE valor = ?
    `;
    db.query(sql, [clave, valor, valor], callback);
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM configuracion`;
    db.query(sql, callback);
  },

  getValorConDefault: (clave, defaultValue = false, callback) => {
    const sql = `SELECT valor FROM configuracion WHERE clave = ? LIMIT 1`;
    db.query(sql, [clave], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, defaultValue);
      const valor = results[0].valor === 'true';
      callback(null, valor);
    });
  }

};

export default Configuracion;