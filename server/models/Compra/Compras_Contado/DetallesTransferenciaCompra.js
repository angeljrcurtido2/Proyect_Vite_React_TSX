import db from '../../../db.js';

const DetallesTransferenciaCompra = {
  // Obtener transferencia por idcompra
  findByCompraId: (idcompra, callback) => {
    const sql = `
      SELECT *
      FROM detalles_transferencia_compra
      WHERE idcompra = ? AND deleted_at IS NULL
    `;
    db.query(sql, [idcompra], callback);
  },

  // Crear nuevo registro de transferencia para una compra
  create: (data, callback) => {
    const sql = `
      INSERT INTO detalles_transferencia_compra (
        idcompra,
        banco_origen,
        numero_cuenta,
        tipo_cuenta,
        titular_cuenta,
        observacion
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.idcompra,
      data.banco_origen,
      data.numero_cuenta,
      data.tipo_cuenta,
      data.titular_cuenta,
      data.observacion
    ];
    db.query(sql, values, callback);
  },

  // Soft delete por idcompra
  softDeleteByCompraId: (idcompra, callback) => {
    const sql = `
      UPDATE detalles_transferencia_compra
      SET deleted_at = NOW()
      WHERE idcompra = ?
    `;
    db.query(sql, [idcompra], callback);
  }
};

export default DetallesTransferenciaCompra;
