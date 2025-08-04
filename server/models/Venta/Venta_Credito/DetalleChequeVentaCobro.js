import db from '../../../db.js';

const DetalleChequeVentaCobro = {
  // Crear nuevo registro de cheque asociado a un ingreso
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalle_cheque_venta_cobro (
        idingreso,
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
      data.idingreso,
      data.banco,
      data.nro_cheque,
      data.monto,
      data.fecha_emision,
      data.fecha_vencimiento,
      data.titular || '',
      data.estado || 'pendiente'
    ];
    db.query(sql, values, callback);
  },

  // Obtener cheques asociados a un ingreso
  findByIngresoId: (idingreso, callback) => {
    const sql = `
      SELECT *
      FROM detalle_cheque_venta_cobro
      WHERE idingreso = ? AND deleted_at IS NULL
    `;
    db.query(sql, [idingreso], callback);
  },

  // Soft delete por idingreso
  softDeleteByIngresoId: (idingreso, callback) => {
    const sql = `
      UPDATE detalle_cheque_venta_cobro
      SET deleted_at = NOW()
      WHERE idingreso = ? AND deleted_at IS NULL
    `;
    db.query(sql, [idingreso], callback);
  }
};

export default DetalleChequeVentaCobro;
