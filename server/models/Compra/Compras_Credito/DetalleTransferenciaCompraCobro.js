import db from '../../../db.js';

const DetalleTransferenciaCompraPago = {
  // Crear nuevo registro de transferencia asociada a un egreso
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalle_transferencia_compra_pago (
        idegreso,
        banco_origen,
        numero_cuenta,
        tipo_cuenta,
        titular_cuenta,
        observacion
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.idegreso,
      data.banco_origen,
      data.numero_cuenta,
      data.tipo_cuenta,
      data.titular_cuenta,
      data.observacion || ''
    ];
    db.query(sql, values, callback);
  },

  // Obtener transferencia asociada a un egreso
  findByEgresoId: (idegreso, callback) => {
    const sql = `
      SELECT *
      FROM detalle_transferencia_compra_pago
      WHERE idegreso = ? AND deleted_at IS NULL
    `;
    db.query(sql, [idegreso], callback);
  },

  // Soft delete por idegreso
  softDeleteByEgresoId: (idegreso, callback) => {
    const sql = `
    UPDATE detalle_transferencia_compra_pago
    SET deleted_at = NOW()
    WHERE idegreso = ?
  `;
    db.query(sql, [idegreso], callback);
  }

};

export default DetalleTransferenciaCompraPago;
