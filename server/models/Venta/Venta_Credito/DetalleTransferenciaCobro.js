import db from '../../../db.js';

const DetalleTransferenciaCobro = {
  // Crear nuevo registro de transferencia asociada a un ingreso
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalle_transferencia_cobro (
        idingreso,
        banco_origen,
        numero_cuenta,
        tipo_cuenta,
        titular_cuenta,
        observacion
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.idingreso,
      data.banco_origen,
      data.numero_cuenta,
      data.tipo_cuenta,
      data.titular_cuenta,
      data.observacion || ''
    ];
    db.query(sql, values, callback);
  },

  // Obtener transferencia asociada a un ingreso
  findByIngresoId: (idingreso, callback) => {
    const sql = `SELECT * FROM detalle_transferencia_cobro WHERE idingreso = ? AND deleted_at IS NULL`;
    db.query(sql, [idingreso], callback);
  },

  // Soft delete por idingreso
    softDeleteByIngresoId: (idingreso, callback) => {
    const sql = `UPDATE detalle_transferencia_cobro SET deleted_at = NOW() WHERE idingreso = ?`;
    db.query(sql, [idingreso], callback);
    }
};

export default DetalleTransferenciaCobro;
