// models/DetalleTarjetaVenta.js

import db from '../../db.js';

const DetalleTarjetaVenta = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalle_tarjeta_venta (
        idventa,
        tipo_tarjeta,
        entidad,
        monto
      ) VALUES (?, ?, ?, ?)
    `;
    const values = [
      data.idventa,
      data.tipo_tarjeta,
      data.entidad,
      data.monto
    ];
    db.query(sql, values, callback);
  },

  softDeleteByVenta: (idventa, callback) => {
    const sql = `
      UPDATE detalle_tarjeta_venta
      SET deleted_at = NOW()
      WHERE idventa = ?
    `;
    db.query(sql, [idventa], callback);
  },

  findByVentaId: (idventa, callback) => {
    const sql = `SELECT * FROM detalle_tarjeta_venta WHERE idventa = ? AND deleted_at IS NULL`;
    db.query(sql, [idventa], callback);
  }
};

export default DetalleTarjetaVenta;
