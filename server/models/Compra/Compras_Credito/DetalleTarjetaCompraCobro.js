// models/Compra/Compras_Credito/DetalleTarjetaCompraPago.js

import db from '../../../db.js';

const DetalleTarjetaCompraPago = {
  // Crear nuevo registro de pago con tarjeta asociada a un egreso
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalles_tarjetas_compra_pago (
        idegreso,
        tipo_tarjeta,
        entidad,
        monto,
        observacion
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      data.idegreso,
      data.tipo_tarjeta,
      data.entidad,
      data.monto,
      data.observacion || ''
    ];
    db.query(sql, values, callback);
  },

  // Obtener pagos con tarjeta asociados a un egreso
  findByEgresoId: (idegreso, callback) => {
    const sql = `SELECT * FROM detalles_tarjetas_compra_pago WHERE idegreso = ? AND deleted_at IS NULL`;
    db.query(sql, [idegreso], callback);
  },

  // Soft delete por idegreso
  softDeleteByEgresoId: (idegreso, callback) => {
    const sql = `UPDATE detalles_tarjetas_compra_pago SET deleted_at = NOW() WHERE idegreso = ?`;
    db.query(sql, [idegreso], callback);
  }
};

export default DetalleTarjetaCompraPago;
