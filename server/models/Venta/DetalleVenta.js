// src/models/Venta/DetalleVenta.js
import db from '../../db.js';

const DetalleVenta = {
  create: (data, callback) => {
    const query = `
      INSERT INTO detalle_venta (
        idventa, idproducto, nombre_producto, cantidad,
        precio_venta, precio_compra, ganancia, sub_total,
        iddetalle_compra, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [
      data.idventa,
      data.idproducto,
      data.nombre_producto,
      data.cantidad,
      data.precio_venta,
      data.precio_compra,
      data.ganancia,
      data.sub_total,
      data.iddetalle_compra || null, 
    ];
    db.query(query, values, callback);
  },

  findByVentaMultiple: (ids, callback) => {
    const query = `
      SELECT 
        iddetalle, idproducto, idventa,
        cantidad, precio_compra, precio_venta, sub_total,
        nombre_producto, iva5, iva10, iddetalle_compra
      FROM detalle_venta
      WHERE idventa IN (?)
    `;
    db.query(query, [ids], callback);
  },

  getProductosMasVendidos: (limit = 10, callback) => {
    const query = `
    SELECT 
      dv.idproducto,
      dv.nombre_producto,
      SUM(dv.cantidad) AS total_vendido,
      p.precio_venta,
      cat.categoria AS categoria,
      p.ubicacion AS imagen
    FROM detalle_venta dv
    JOIN productos p ON dv.idproducto = p.idproducto
    LEFT JOIN categorias cat ON p.idcategoria = cat.idcategorias
    WHERE dv.deleted_at IS NULL
    GROUP BY dv.idproducto, dv.nombre_producto, p.precio_venta, cat.categoria, p.ubicacion
    ORDER BY total_vendido DESC
    LIMIT ?
  `;
    db.query(query, [limit], callback);
  },

  findByVentaId: (idventa, callback) => {
    const query = `
      SELECT 
        dv.iddetalle,
        dv.idventa,
        dv.idproducto,
        dv.cantidad,
        dv.precio_venta,
        dv.precio_compra,
        dv.ganancia,
        dv.iva5,
        dv.iva10,
        dv.iddetalle_compra,
        dv.sub_total,
        p.nombre_producto AS nombre_producto
      FROM detalle_venta dv
      LEFT JOIN productos p 
        ON dv.idproducto = p.idproducto
      WHERE dv.idventa = ?
        AND dv.deleted_at IS NULL
    `;
    db.query(query, [idventa], callback);
  },

  findByVenta: (idventa, callback) => {
    const query = `SELECT idproducto, cantidad FROM detalle_venta WHERE idventa = ?`;
    db.query(query, [idventa], callback);
  },

};

export default DetalleVenta;
