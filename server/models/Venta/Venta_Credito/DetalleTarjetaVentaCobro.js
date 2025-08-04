import db from '../../../db.js';

const DetalleTarjetaVentaCobro = {
  // Crear nuevo registro de pago con tarjeta asociada a un ingreso
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalle_tarjeta_venta_cobro (
        idingreso,
        tipo_tarjeta,
        entidad,
        monto,
        observacion
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      data.idingreso,
      data.tipo_tarjeta,
      data.entidad,
      data.monto,
      data.observacion || ''
    ];
    db.query(sql, values, callback);
  },

  // Obtener pagos con tarjeta asociados a un ingreso
  findByIngresoId: (idingreso, callback) => {
    const sql = `SELECT * FROM detalle_tarjeta_venta_cobro WHERE idingreso = ? AND deleted_at IS NULL`;
    db.query(sql, [idingreso], callback);
  },

  // Soft delete por idingreso
  softDeleteByIngresoId: (idingreso, callback) => {
    const sql = `UPDATE detalle_tarjeta_venta_cobro SET deleted_at = NOW() WHERE idingreso = ?`;
    db.query(sql, [idingreso], callback);
  }
};

export default DetalleTarjetaVentaCobro;
