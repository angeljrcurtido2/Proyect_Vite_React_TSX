// models/DatosTransferenciaVenta.js

import db from '../../db.js';

const DatosTransferenciaVenta = {
  findByVentaId: (idventa, callback) => {
    const sql = `SELECT * FROM datos_transferencia_venta WHERE idventa = ? AND deleted_at IS NULL`;
    db.query(sql, [idventa], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO datos_transferencia_venta (
        idventa,
        banco_origen,
        numero_cuenta,
        tipo_cuenta,
        titular_cuenta,
        observacion
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.idventa,
      data.banco_origen,
      data.numero_cuenta,
      data.tipo_cuenta,
      data.titular_cuenta,
      data.observacion
    ];
    db.query(sql, values, callback);
  },

  softDeleteByVenta: (idventa, callback) => {
    const sql = `UPDATE datos_transferencia_venta SET deleted_at = NOW() WHERE idventa = ?`;
    db.query(sql, [idventa], callback);
  }
};

export default DatosTransferenciaVenta;
