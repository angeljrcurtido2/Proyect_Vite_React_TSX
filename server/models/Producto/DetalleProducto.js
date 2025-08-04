import db from '../../db.js';

const DetalleProducto = {
  findAll: (callback) => {
    db.query('SELECT * FROM detalle_producto WHERE estado = "activo"', callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM detalle_producto WHERE iddetalle = ?', [id], callback);
  },

  findByProducto: (idproducto, callback) => {
    db.query('SELECT * FROM detalle_producto WHERE idproducto = ? AND estado = "activo"', [idproducto], callback);
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO detalle_producto (nombre_detalle, idproducto, estado)
      VALUES (?, ?, ?)
    `;
    db.query(query, [data.nombre_detalle, data.idproducto, data.estado || 'activo'], callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE detalle_producto SET nombre_detalle = ?, estado = ?
      WHERE iddetalle = ?
    `;
    db.query(query, [data.nombre_detalle, data.estado, id], callback);
  },

  delete: (id, callback) => {
    // Eliminación lógica (opcional)
    db.query('UPDATE detalle_producto SET estado = "inactivo" WHERE iddetalle = ?', [id], callback);
    // Si querés eliminar completamente: 
    // db.query('DELETE FROM detalle_producto WHERE iddetalle = ?', [id], callback);
  }
};

export default DetalleProducto;
