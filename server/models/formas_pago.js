import db from '../db.js'; 

const FormaPago = {
  findAll: (callback) => {
    const sql = `SELECT * FROM formas_pago WHERE deleted_at IS NULL OR deleted_at IS NULL`;
    db.query(sql, callback);
  },

  findById: (id, callback) => {
    const sql = `SELECT * FROM formas_pago WHERE idformapago = ?`;
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `INSERT INTO formas_pago (descripcion) VALUES (?)`;
    db.query(sql, [data.descripcion], callback);
  },

  softDelete: (id, callback) => {
    const sql = `UPDATE formas_pago SET deleted_at = NOW() WHERE idformapago = ?`;
    db.query(sql, [id], callback);
  }
};

export default FormaPago;
