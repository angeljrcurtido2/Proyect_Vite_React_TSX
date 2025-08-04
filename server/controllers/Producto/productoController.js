import Producto from "../../models/Producto/Producto.js";
import db from '../../db.js';

export const getAllProductos = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  // 🚀 Si la búsqueda tiene 6 caracteres o más, intentamos buscar primero por código de barras exacto
  if (search.length >= 6) {
    Producto.findByBarcode(search, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        // Si encuentra por código de barras, devolvemos ese producto
        return res.json({
          data: result,
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
        });
      }

      // Si no encuentra, seguimos con la búsqueda normal
      continuarBusquedaGeneral();
    });
  } else {
    continuarBusquedaGeneral();
  }

  function continuarBusquedaGeneral() {
    Producto.countFiltered(search, (err, total) => {
      if (err) return res.status(500).json({ error: err });

      Producto.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
        if (err) return res.status(500).json({ error: err });

        const totalPages = Math.ceil(total / limit);
        res.json({
          data,
          totalItems: total,
          totalPages,
          currentPage: page,
        });
      });
    });
  }
};


export const getProductoById = (req, res) => {
  const id = req.params.id;
  Producto.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

export const createProducto = (req, res) => {
  Producto.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Producto creado", id: result.insertId });
  });
};

export const updateProducto = (req, res) => {
  const id = req.params.id;

  // Solo tomamos los campos válidos
  const updatedFields = {
    nombre_producto: req.body.nombre_producto,
    precio_venta: req.body.precio_venta,
    cod_barra: req.body.cod_barra,
    idcategoria: req.body.idcategoria,
    ubicacion: req.body.ubicacion,
    iva: req.body.iva,
    estado: req.body.estado,
    unidad_medida: req.body.unidad_medida
  };

  Producto.update(id, updatedFields, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Producto actualizado correctamente ✅" });
  });
};


export const deleteProducto = (req, res) => {
  const id = req.params.id;

  Producto.softDelete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Producto eliminado correctamente (soft delete)" });
  });
};

export const verificarProductosDuplicadosInterno = async (nombresProductos) => {
  if (!nombresProductos || !Array.isArray(nombresProductos) || nombresProductos.length === 0) {
    throw new Error('No se proporcionaron nombres de productos.');
  }

  const placeholders = nombresProductos.map(() => '?').join(', ');

  const sql = `
    SELECT nombre_producto
    FROM productos
    WHERE nombre_producto IN (${placeholders})
  `;

  const [rows] = await db.promise().query(sql, nombresProductos);

  const productosDuplicados = rows.map(r => r.nombre_producto);

  return {
    duplicado: productosDuplicados.length > 0,
    productosDuplicados
  };
};
