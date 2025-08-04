import db from '../../db.js';
const DetalleCompra = {
  create: (data, callback) => {
    const query = `
      INSERT INTO detalle_compra (
        idproducto, idcompra, idproveedor,
        cantidad, precio, sub_total, fecha_vencimiento,
        nombre_producto, unidad_medida, iva, stock_restante,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      data.idproducto,
      data.idcompra,
      data.idproveedor,
      data.cantidad,
      data.precio,
      data.sub_total,
      data.fecha_vencimiento || null,
      data.nombre_producto,
      data.unidad_medida,
      data.iva,
      data.stock_restante || data.cantidad  // por defecto igual a cantidad
    ];
    db.query(query, values, callback);
  },


  createInventarioInicial: (data, callback) => {
    const query = `
      INSERT INTO detalle_compra (
        idproducto, idcompra, idproveedor,
        cantidad, precio, fecha_vencimiento,
        nombre_producto, unidad_medida, iva, stock_restante,
        created_at
      ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      data.idproducto,
      data.idproveedor,
      data.cantidad,
      data.precio,
      data.fecha_vencimiento || null,
      data.nombre_producto,
      data.unidad_medida,
      data.iva,
      data.stock_restante || data.cantidad
    ];
    db.query(query, values, callback);
  },


  findByCompra: (idcompra, callback) => {
    const query = `
      SELECT 
        iddetalle, idproducto, idcompra, idproveedor,
        cantidad, precio, sub_total, fecha_vencimiento,
        nombre_producto, unidad_medida, iva, stock_restante
      FROM detalle_compra
      WHERE idcompra = ?
    `;
    db.query(query, [idcompra], callback);
  },

  findByCompraMultiple: (ids, callback) => {
    const query = `
      SELECT 
        iddetalle, idproducto, idcompra, idproveedor,
        cantidad, precio, sub_total, fecha_vencimiento,
        nombre_producto, unidad_medida, iva, stock_restante
      FROM detalle_compra
      WHERE idcompra IN (?)
    `;
    db.query(query, [ids], callback);
  },

  findById: (iddetalle, callback) => {
    const query = `
    SELECT 
      iddetalle, idproducto, cantidad, precio, sub_total,
      fecha_vencimiento, nombre_producto, unidad_medida,
      iva, stock_restante
    FROM detalle_compra
    WHERE iddetalle = ?
  `;
    db.query(query, [iddetalle], callback);
  },

  verificarStockSuficiente: (iddetalle, cantidad, callback) => {
    const query = `SELECT stock_restante FROM detalle_compra WHERE iddetalle = ?`;
    db.query(query, [iddetalle], (err, results) => {
      if (err) return callback(err);
      if (!results.length || results[0].stock_restante < cantidad) {
        return callback(null, false); // No hay suficiente stock
      }
      callback(null, true);
    });
  },

  restarStockLote: (iddetalle, cantidad, callback) => {
    const cantidadFloat = parseFloat(cantidad);
    const query = `
    UPDATE detalle_compra
    SET stock_restante = stock_restante - ?
    WHERE iddetalle = ? AND stock_restante >= ?
  `;
    db.query(query, [cantidadFloat, iddetalle, cantidadFloat], callback);
  },

  aumentarStockLote: (iddetalle, cantidad, callback) => {
    const cantidadFloat = parseFloat(cantidad);
    const query = `
    UPDATE detalle_compra
    SET 
      stock_restante = stock_restante + ?, 
      cantidad = cantidad + ?
    WHERE iddetalle = ?
  `;
    db.query(query, [cantidadFloat, cantidadFloat, iddetalle], callback);
  },

  findByCompraId: (idcompra, callback) => {
    const query = `
      SELECT 
        dc.iddetalle,
        dc.idcompra,
        dc.idproducto,
        dc.idproveedor,
        dc.cantidad,
        dc.precio,
        dc.sub_total,
        dc.fecha_vencimiento,
        dc.nombre_producto,
        dc.unidad_medida,
        dc.iva,
        dc.stock_restante,
        p.nombre_producto AS producto
      FROM detalle_compra dc
      LEFT JOIN productos p 
        ON dc.idproducto = p.idproducto
      WHERE dc.idcompra = ?
        AND dc.deleted_at IS NULL
    `;
    db.query(query, [idcompra], callback);
  },

  findByProducto: (idproducto, callback) => {
    const query = `
      SELECT 
        dc.iddetalle,
        dc.idproducto,
        dc.cantidad,
        dc.stock_restante,
        dc.precio AS precio_compra,
        dc.sub_total,
        dc.fecha_vencimiento,
        dc.nombre_producto,
        dc.unidad_medida,
        dc.iva,
        p.precio_venta
      FROM detalle_compra dc
      JOIN productos p ON dc.idproducto = p.idproducto
      WHERE dc.idproducto = ? AND dc.stock_restante > 0
      ORDER BY dc.fecha_vencimiento ASC
    `;
    db.query(query, [idproducto], callback);
  }


};

export default DetalleCompra;
