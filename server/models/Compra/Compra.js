// ✅ MODELO ACTUALIZADO - models/Compra.js
import db from '../../db.js';

const Compra = {
  create: (data, callback) => {
    const query = `
      INSERT INTO compras (
        idusuarios, idproveedor, idmovimiento, total,
        fecha, nro_factura, tipo, estado, descuento, observacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.idusuarios,
      data.idproveedor,
      data.idmovimiento,
      data.total,
      data.fecha,
      data.nro_factura,
      data.tipo,
      data.estado,
      data.descuento,
      data.observacion || null
    ];
    db.query(query, values, callback);
  },

  updateDetalleTransferenciaCompra: (idcompra, iddetalle_transferencia_compra, callback) => {
    const sql = `UPDATE compras SET iddetalle_transferencia_compra = ? WHERE idcompra = ?`;
    db.query(sql, [iddetalle_transferencia_compra, idcompra], callback);
  },

  updateDetalleTarjetaCompra: (idcompra, iddetalle_tarjeta_compra, callback) => {
    const sql = `UPDATE compras SET iddetalle_tarjeta_compra = ? WHERE idcompra = ?`;
    db.query(sql, [iddetalle_tarjeta_compra, idcompra], callback);
  },

  findAll: (callback) => {
    db.query(`
      SELECT * FROM compras 
      WHERE deleted_at IS NULL
      ORDER BY idcompra DESC
    `, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT 
      compras.*, 
      proveedor.nombre
    FROM compras 
    INNER JOIN proveedor ON compras.idproveedor = proveedor.idproveedor 
    WHERE compras.deleted_at IS NULL 
      AND (proveedor.nombre LIKE ? OR compras.nro_factura LIKE ?)
    ORDER BY compras.fecha DESC 
    LIMIT ? OFFSET ?
  `;
    db.query(query, [searchTerm, searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT COUNT(*) AS total 
    FROM compras 
    INNER JOIN proveedor ON compras.idproveedor = proveedor.idproveedor 
    WHERE compras.deleted_at IS NULL 
      AND (proveedor.nombre LIKE ? OR compras.nro_factura LIKE ?)
  `;
    db.query(query, [searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  getResumenComprasDelDia: (callback) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const format = (d) => d.toISOString().slice(0, 10);

    const hoy = format(today);
    const ayer = format(yesterday);

    const query = `
    SELECT
      SUM(CASE WHEN DATE(fecha) = ? THEN total ELSE 0 END) AS totalHoy,
      SUM(CASE WHEN DATE(fecha) = ? THEN total ELSE 0 END) AS totalAyer
    FROM compras
    WHERE deleted_at IS NULL
  `;

    db.query(query, [hoy, ayer], callback);
  },

  findById: (id, callback) => {
    db.query(`SELECT * FROM compras WHERE idcompra = ? AND deleted_at IS NULL`, [id], callback);
  },

  ejecutarAnulacionCompleta: (idcompra, callback) => {
    const query = `CALL anular_compra_credito(?)`;
    db.query(query, [idcompra], callback);
  },

  softDelete: (id, callback) => {
    const query = `
      UPDATE compras 
      SET deleted_at = NOW(), estado = 'anulado', updated_at = NOW() 
      WHERE idcompra = ?
    `;
    db.query(query, [id], callback);
  },

};

export default Compra;
