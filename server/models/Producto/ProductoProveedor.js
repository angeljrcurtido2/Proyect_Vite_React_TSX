import db from '../../db.js';

const ProductoProveedor = {
    // Crear la relación producto <-> proveedor
    create: (idproducto, idproveedor, precio_compra, callback) => {
        const checkQuery = `
      SELECT id FROM producto_proveedor
      WHERE idproducto = ? AND idproveedor = ?
      LIMIT 1
    `;
        db.query(checkQuery, [idproducto, idproveedor], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                // Ya existe la relación, no hacemos nada
                return callback(null, { message: 'Vínculo producto-proveedor ya existe.' });
            }

            // Si no existe, procedemos a crear
            const insertQuery = `
        INSERT INTO producto_proveedor (idproducto, idproveedor, precio_compra, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
      `;
            db.query(insertQuery, [idproducto, idproveedor, precio_compra], callback);
        });
    },

    // Buscar proveedores de un producto específico
    findByProducto: (idproducto, callback) => {
        const query = `
      SELECT pp.*, p.nombre 
      FROM producto_proveedor pp
      INNER JOIN proveedor p ON pp.idproveedor = p.idproveedor
      WHERE pp.idproducto = ?
    `;
        db.query(query, [idproducto], callback);
    },

    // Buscar productos de un proveedor específico
    findByProveedor: (idproveedor, callback) => {
        const query = `
      SELECT pp.*, pr.nombre_producto 
      FROM producto_proveedor pp
      INNER JOIN productos pr ON pp.idproducto = pr.idproducto
      WHERE pp.idproveedor = ?
    `;
        db.query(query, [idproveedor], callback);
    },

    // Actualizar relación
    update: (idproducto, idproveedor, data, callback) => {
        const query = `
      UPDATE producto_proveedor SET 
        precio_compra_compra = ?, 
        precio_compra_venta = ?, 
        updated_at = NOW()
      WHERE idproducto = ? AND idproveedor = ?
    `;

        const values = [
            data.precio_compra_compra,
            data.precio_compra_venta,
            idproducto,
            idproveedor
        ];

        db.query(query, values, callback);
    },

    // Eliminar relación
    delete: (idproducto, idproveedor, callback) => {
        const query = `
      DELETE FROM producto_proveedor 
      WHERE idproducto = ? AND idproveedor = ?
    `;
        db.query(query, [idproducto, idproveedor], callback);
    }
};

export default ProductoProveedor;
