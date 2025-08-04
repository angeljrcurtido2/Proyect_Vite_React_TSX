import db from '../../db.js';

const Arqueo = {
  create: (data, callback) => {
    const query = `
     INSERT INTO arqueo (
        a50, a100, a500, a1000, a2000, a5000, a10000, a20000, a50000, a100000,
        total,
        detalle1, monto1,
        detalle2, monto2,
        detalle3, monto3,
        detalle4, monto4,
        detalle5, monto5,
        idmovimiento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.a50 || 0, data.a100 || 0, data.a500 || 0, data.a1000 || 0, data.a2000 || 0,
      data.a5000 || 0, data.a10000 || 0, data.a20000 || 0, data.a50000 || 0, data.a100000 || 0,
      data.total,
      data.detalle1 || '', data.monto1 || 0,
      data.detalle2 || '', data.monto2 || 0,
      data.detalle3 || '', data.monto3 || 0,
      data.detalle4 || '', data.monto4 || 0,
      data.detalle5 || '', data.monto5 || 0,
      data.idmovimiento
    ];
    db.query(query, values, callback);
  },

  findByMovimiento: (idmovimiento, callback) => {
    db.query(`SELECT * FROM arqueo WHERE idmovimiento = ?`, [idmovimiento], callback);
  },  

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT 
      a.*, 
      m.num_caja, 
      m.fecha_apertura, 
      m.estado, 
      u.login
    FROM arqueo a
    JOIN movimiento_caja m ON a.idmovimiento = m.idmovimiento
    JOIN usuarios u ON m.idusuarios = u.idusuarios
    WHERE 
      m.num_caja LIKE ? OR 
      m.fecha_apertura LIKE ? OR 
      m.estado LIKE ? OR
      u.login LIKE ?
    ORDER BY a.idarqueo DESC
    LIMIT ? OFFSET ?
  `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT COUNT(*) AS total
    FROM arqueo a
    JOIN movimiento_caja m ON a.idmovimiento = m.idmovimiento
    JOIN usuarios u ON m.idusuarios = u.idusuarios
    WHERE 
      m.num_caja LIKE ? OR 
      m.fecha_apertura LIKE ? OR 
      m.estado LIKE ? OR
      u.login LIKE ?
  `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  findAll: (callback) => {
    db.query(`SELECT * FROM arqueo ORDER BY idarqueo DESC`, callback);
  }
};

export default Arqueo;
