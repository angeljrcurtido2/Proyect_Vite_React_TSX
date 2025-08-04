import db from '../../db.js';

const Producto = {
  findAll: (callback) => {
    db.query('SELECT * FROM productos WHERE deleted_at IS NULL', callback);
  },

  findById: (idproducto, callback) => {
    const query = `
      SELECT 
        p.*,
        MAX(dc.fecha_vencimiento) AS ultima_fecha_vencimiento
      FROM productos p
      LEFT JOIN detalle_compra dc ON dc.idproducto = p.idproducto
      WHERE p.idproducto = ?
      GROUP BY p.idproducto
    `;

    db.query(query, [idproducto], callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
     SELECT 
      p.*,
      MAX(dc.fecha_vencimiento) AS ultima_fecha_vencimiento
      FROM productos p
      LEFT JOIN detalle_compra dc ON dc.idproducto = p.idproducto
      WHERE p.deleted_at IS NULL 
        AND (p.nombre_producto LIKE ? OR p.ubicacion LIKE ? OR p.cod_barra LIKE ?)
      GROUP BY p.idproducto
      ORDER BY p.idproducto DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) AS total FROM productos 
      WHERE deleted_at IS NULL 
        AND (nombre_producto LIKE ? OR ubicacion LIKE ? OR cod_barra LIKE ?)
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  create: (data, callback) => {
    const insertQuery = `
       INSERT INTO productos (
    nombre_producto, cod_barra, precio_compra, idcategoria,
    precio_venta, ubicacion, iva, unidad_medida,stock,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      data.nombre_producto,
      data.cod_barra || null,
      data.precio_compra,
      data.idcategoria,
      data.precio_venta,
      data.ubicacion || null,
      data.iva,
      data.unidad_medida,
      data.stock || 0
    ];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(err.code + ' - ' + err.sqlMessage);
  
          // Detectar si es por cod_barra o nombre_producto
          let errorMsg = '⚠️ Ya existe un producto con estos datos.';
          if (err.sqlMessage.includes('cod_barra')) {
            errorMsg = '⚠️ Ya existe un producto con este Código de Barras.';
          } else if (err.sqlMessage.includes('nombre_producto')) {
            errorMsg = '⚠️ Ya existe un producto con este Nombre.';
          }
  
          const error = new Error(errorMsg);
          error.code = 'PRODUCT_EXISTS';
          return callback(error);
        }
        return callback(err);
      }
      callback(null, results);
    });
  },
  
  findByBarcode: (barcode, callback) => {
    const query = `
      SELECT 
        p.*, 
        MAX(dc.fecha_vencimiento) AS ultima_fecha_vencimiento
      FROM productos p
      LEFT JOIN detalle_compra dc ON dc.idproducto = p.idproducto
      WHERE p.cod_barra = ? AND p.deleted_at IS NULL
      GROUP BY p.idproducto
    `;
    db.query(query, [barcode], callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE productos SET 
        nombre_producto = ?, 
        cod_barra = ?, 
        precio_venta = ?, 
        idcategoria = ?, 
        ubicacion = ?, 
        iva = ?, 
        estado = ?, 
        unidad_medida = ?, 
        updated_at = NOW()
      WHERE idproducto = ?
    `;

    const values = [
      data.nombre_producto,
      data.cod_barra,
      data.precio_venta,
      data.idcategoria,
      data.ubicacion,
      data.iva,
      data.estado,
      data.unidad_medida,
      id
    ];

    db.query(query, values, callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM productos WHERE idproducto = ?', [id], callback);
  },

  aumentarStock: (idproducto, cantidad, callback) => {
    const query = `UPDATE productos SET stock = stock + ? WHERE idproducto = ?`;
    db.query(query, [cantidad, idproducto], callback);
  },

  softDelete: (id, callback) => {
    const query = `UPDATE productos SET deleted_at = NOW() WHERE idproducto = ?`;
    db.query(query, [id], callback);
  },

  restarStock: (idproducto, cantidad, callback) => {
    const query = `UPDATE productos SET stock = stock - ? WHERE idproducto = ?`;
    db.query(query, [cantidad, idproducto], callback);
  },
  
};

export default Producto;
