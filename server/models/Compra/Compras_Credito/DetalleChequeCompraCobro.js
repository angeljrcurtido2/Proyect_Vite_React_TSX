import db from '../../../db.js';

const DetalleChequeCompraPago = {
  // Crear nuevo registro de cheque asociado a un egreso
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalles_cheques_compra_pago (
        idegreso,
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
      data.idegreso,
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

  // Obtener cheques asociados a un egreso
  findByEgresoId: (idegreso, callback) => {
    const sql = `
      SELECT *
      FROM detalles_cheques_compra_pago
      WHERE idegreso = ? AND deleted_at IS NULL
    `;
    db.query(sql, [idegreso], callback);
  },

  // Soft delete por idegreso
  softDeleteByEgresoId: (idegreso, callback) => {
    const sql = `
      UPDATE detalles_cheques_compra_pago
      SET deleted_at = NOW()
      WHERE idegreso = ? AND deleted_at IS NULL
    `;
    db.query(sql, [idegreso], callback);
  }
};

export default DetalleChequeCompraPago;
