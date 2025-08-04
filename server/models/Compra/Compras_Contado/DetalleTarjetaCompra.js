import db from '../../../db.js';

const DetalleTarjetaCompra = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalles_tarjeta_compra (
        idcompra,
        tipo_tarjeta,
        entidad,
        monto
      ) VALUES (?, ?, ?, ?)
    `;
    const values = [
      data.idcompra,
      data.tipo_tarjeta,
      data.entidad,
      data.monto
    ];
    db.query(sql, values, callback);
  },

  softDeleteByCompraId: (idcompra, callback) => {
    const sql = `
      UPDATE detalles_tarjeta_compra
      SET deleted_at = NOW()
      WHERE idcompra = ?
    `;
    db.query(sql, [idcompra], callback);
  },

  findByCompraId: (idcompra, callback) => {
    const sql = `
      SELECT *
      FROM detalles_tarjeta_compra
      WHERE idcompra = ? AND deleted_at IS NULL
    `;
    db.query(sql, [idcompra], callback);
  }
};

export default DetalleTarjetaCompra;
