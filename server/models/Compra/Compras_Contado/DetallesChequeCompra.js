import db from '../../../db.js';

const DetalleChequeCompra = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalles_cheque_compra (
        idcompra,
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
      data.idcompra,
      data.banco,
      data.nro_cheque,
      data.monto,
      data.fecha_emision,
      data.fecha_vencimiento,
      data.titular,
      data.estado || 'pendiente'
    ];

    db.query(sql, values, callback);
  },

  findByCompraId: (idcompra, callback) => {
    const sql = `SELECT * FROM detalles_cheque_compra WHERE idcompra = ? AND estado != 'anulado' AND deleted_at IS NULL`;
    db.query(sql, [idcompra], callback);
  },

  softDeleteByCompraId: (idcompra, callback) => {
    const sql = `
      UPDATE detalles_cheque_compra
      SET estado = 'anulado', deleted_at = NOW(), updated_at = NOW()
      WHERE idcompra = ?
    `;
    db.query(sql, [idcompra], callback);
  }
};

export default DetalleChequeCompra;
