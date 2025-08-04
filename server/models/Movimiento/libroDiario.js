import db from '../../db.js';

const LibroDiario = {
  insert: (data, callback) => {
    const query = `
      INSERT INTO libro_diario (
        fecha, hora, concepto, cuenta_debe, cuenta_haber, monto,
        idingreso, idventa, idcliente, idformapago, idmovimiento,
        creado_por, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      data.fecha,
      data.hora || null,
      data.concepto,
      data.cuenta_debe,
      data.cuenta_haber,
      data.monto,
      data.idingreso || null,
      data.idventa || null,
      data.idcliente || null,
      data.idformapago || null,
      data.idmovimiento || null,
      data.creado_por || 'sistema'
    ];
    db.query(query, values, callback);
  },

  getByMovimiento: (idmovimiento, callback) => {
    const query = `
      SELECT *
      FROM libro_diario
      WHERE idmovimiento = ?
      ORDER BY fecha ASC, hora ASC
    `;
    db.query(query, [idmovimiento], callback);
  }
};

export default LibroDiario;
