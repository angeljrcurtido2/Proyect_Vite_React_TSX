import db from '../../db.js';

const DetalleChequeVenta = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalle_cheque_venta (
        idventa,
        banco,
        nro_cheque,
        monto,
        fecha_emision,
        fecha_vencimiento,
        titular,
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.idventa,
      data.banco,
      data.nro_cheque,
      data.monto,
      data.fecha_emision,
      data.fecha_vencimiento,
      data.titular,
      data.estado || 'pendiente',
    ];

    db.query(sql, values, callback);
  },

  findByVentaId: (idventa, callback) => {
    const sql = `SELECT * FROM detalle_cheque_venta WHERE idventa = ? AND estado != 'anulado'`;
    db.query(sql, [idventa], callback);
  },

  softDeleteByVenta: (idventa, callback) => {
    const sql = `
      UPDATE detalle_cheque_venta 
      SET estado = 'anulado', deleted_at = NOW(), updated_at = NOW() 
      WHERE idventa = ?
    `;
    db.query(sql, [idventa], callback);
  }
};

export default DetalleChequeVenta;
