import db from "../../../db.js";

export const obtenerPrecioVenta = async (idproducto) => {
  const [rows] = await db.promise().query(`SELECT precio_venta FROM productos WHERE idproducto = ?`, [idproducto]);
  return rows[0]?.precio_venta || 0;
};

export const obtenerPrecioCompra = async (idproducto) => {
  const [rows] = await db.promise().query(`SELECT precio_compra FROM productos WHERE idproducto = ?`, [idproducto]);
  return rows[0]?.precio_compra || 0;
};

export const obtenerNombreProducto = async (idproducto) => {
  const [rows] = await db.promise().query(`SELECT nombre_producto FROM productos WHERE idproducto = ?`, [idproducto]);
  return rows[0]?.nombre_producto || '';
};

export const obtenerUnidadMedida = async (idproducto) => {
  const [rows] = await db.promise().query(`SELECT unidad_medida FROM productos WHERE idproducto = ?`, [idproducto]);
  return rows[0]?.unidad_medida || '';
};

export const obtenerIVA = async (idproducto) => {
  const [rows] = await db.promise().query(`SELECT iva FROM productos WHERE idproducto = ?`, [idproducto]);
  return rows[0]?.iva || 0;
};
