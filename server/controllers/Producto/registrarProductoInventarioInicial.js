import Producto from "../../models/Producto/Producto.js";
import DetalleCompra from "../../models/Compra/DetalleCompra.js";

export const registrarProductoInventarioInicial = (req, res) => {
  const {
    nombre_producto, precio_compra, stock,
    idcategoria, idproveedor, precio_venta,
    ubicacion, iva, estado, unidad_medida,
    fecha_vencimiento
  } = req.body;

  if (!nombre_producto || !precio_compra || !stock || !precio_venta || !idcategoria || !idproveedor) {
    return res.status(400).json({ error: "Todos los campos requeridos deben completarse." });
  }

  const productoData = {
    nombre_producto,
    precio_compra,
    stock,
    idcategoria,
    idproveedor,
    precio_venta,
    ubicacion,
    iva,
    estado,
    unidad_medida
  };

  Producto.create(productoData, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    const idproducto = result.insertId;

    // ✅ Control: convertir "" a null
    const fechaFinal = (!fecha_vencimiento || fecha_vencimiento.trim() === '') ? null : fecha_vencimiento;

    const detalleData = {
      idproducto,
      idproveedor,
      cantidad: stock,
      precio: precio_compra,
      fecha_vencimiento: fechaFinal,
    };

    DetalleCompra.createInventarioInicial(detalleData, (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.status(201).json({
        message: "Producto con inventario inicial creado con éxito ✅",
        idproducto
      });
    });
  });
};

