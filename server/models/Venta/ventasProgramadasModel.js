// models/ventasProgramadasModel.js
import db from '../../db.js';

const VentasProgramadas = {
  // 1️⃣ Crear una venta programada
  create: (data, callback) => {
    const query = `
     INSERT INTO ventas_programadas (
        idcliente, idproducto, cantidad, fecha_inicio, dia_programado,
        estado, idusuario, observacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.idcliente,
      data.idproducto,
      data.cantidad,
      data.fecha_inicio,
      data.dia_programado,
      data.estado || 'activa',
      data.idusuario || 1,
      data.observacion || ''
    ];
    db.query(query, values, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT 
      vp.idprogramacion,
      vp.idcliente,
      vp.idproducto,
      vp.cantidad,
      vp.fecha_inicio,
      vp.dia_programado,
      vp.estado,
      vp.observacion,
      vp.ultima_fecha_venta,
      c.nombre AS cliente_nombre,
      c.apellido AS cliente_apellido,
      p.nombre_producto
    FROM ventas_programadas vp
    JOIN clientes c ON vp.idcliente = c.idcliente
    JOIN productos p ON vp.idproducto = p.idproducto
    WHERE vp.estado != 'cancelada'
      AND vp.deleted_at IS NULL
      AND (
        c.nombre LIKE ?
        OR c.apellido LIKE ?
        OR p.nombre_producto LIKE ?
        OR vp.observacion LIKE ?
      )
    ORDER BY c.idcliente, vp.idprogramacion DESC
    LIMIT ? OFFSET ?
  `;
    db.query(
      query,
      [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  // Contar total de registros filtrados
  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT COUNT(*) AS total
    FROM ventas_programadas vp
    JOIN clientes c ON vp.idcliente = c.idcliente
    JOIN productos p ON vp.idproducto = p.idproducto
    WHERE vp.estado != 'cancelada'
      AND vp.deleted_at IS NULL
      AND (
        c.nombre LIKE ?
        OR c.apellido LIKE ?
        OR p.nombre_producto LIKE ?
        OR vp.observacion LIKE ?
      )
  `;
    db.query(
      query,
      [searchTerm, searchTerm, searchTerm, searchTerm],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].total);
      }
    );
  },
  // 2️⃣ Obtener ventas programadas por cliente
  getByCliente: (idcliente, callback) => {
    const query = `
   SELECT 
      vp.*,
      c.nombre AS cliente_nombre,
      c.apellido AS cliente_apellido,
      c.numDocumento,
      p.nombre_producto,
      p.iva,
      ROUND(p.precio_venta, 2) AS precio_venta,
      ROUND((CAST(vp.cantidad AS DECIMAL(10,2)) * p.precio_venta), 2) AS subtotal,
      CASE 
        WHEN p.iva = 10 THEN ROUND((CAST(vp.cantidad AS DECIMAL(10,2)) * p.precio_venta) / 11, 2)
        ELSE 0
      END AS subtotal_iva10,
      CASE 
        WHEN p.iva = 5 THEN ROUND((CAST(vp.cantidad AS DECIMAL(10,2)) * p.precio_venta) / 21, 2)
        ELSE 0
      END AS subtotal_iva5
    FROM ventas_programadas vp
    JOIN clientes c ON vp.idcliente = c.idcliente
    JOIN productos p ON vp.idproducto = p.idproducto
    WHERE vp.idcliente = ?
      AND vp.deleted_at IS NULL
    ORDER BY vp.created_at DESC
    `;
    db.query(query, [idcliente], callback);
  },
  // 2️⃣ Obtener todas las ventas programadas
  getAll: (callback) => {
    const query = `
      SELECT vp.*, c.nombre, c.apellido, p.nombre_producto
      FROM ventas_programadas vp
      JOIN clientes c ON vp.idcliente = c.idcliente
      JOIN productos p ON vp.idproducto = p.idproducto
      WHERE vp.estado = 'activa'
    `;
    db.query(query, callback);
  },

  softDelete: (id, callback) => {
    const query = `
    UPDATE ventas_programadas
    SET deleted_at = NOW(), estado = 'anulado', updated_at = NOW()
    WHERE idprogramacion = ?
  `;
    db.query(query, [id], callback);
  },

  // 3️⃣ Actualizar última fecha de venta
  updateUltimaFechaVenta: (idprogramacion, fechaVenta, callback) => {
    const query = `
      UPDATE ventas_programadas
      SET ultima_fecha_venta = ?
      WHERE idprogramacion = ?
    `;
    db.query(query, [fechaVenta, idprogramacion], callback);
  },
};

export default VentasProgramadas;
