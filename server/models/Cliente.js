import db from '../db.js';

const Cliente = {
  // Buscar todos los clientes (sin paginado, si necesitas)
  findAll: (callback) => {
    db.query('SELECT * FROM clientes WHERE deleted_at IS NULL', callback);
  },

  // Buscar clientes con paginado y búsqueda
  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM clientes
      WHERE deleted_at IS NULL AND (
        nombre LIKE ?
        OR apellido LIKE ?
        OR numDocumento LIKE ?
        OR telefono LIKE ?
      )
      ORDER BY idcliente DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },

  // Contar total de registros filtrados
  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) AS total FROM clientes
      WHERE deleted_at IS NULL AND (
        nombre LIKE ?
        OR apellido LIKE ?
        OR numDocumento LIKE ?
        OR telefono LIKE ?
      )
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  // Buscar cliente por ID
  findById: (id, callback) => {
    db.query('SELECT * FROM clientes WHERE idcliente = ? AND deleted_at IS NULL', [id], callback);
  },

  // Crear cliente
  create: (data, callback) => {
    const query = `
      INSERT INTO clientes (
        nombre, apellido, tipo, numDocumento, telefono, direccion, genero, estado, descripcion, tipo_cliente, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [
      data.nombre,
      data.apellido,
      data.tipo,
      data.numDocumento,
      data.telefono,
      data.direccion,
      data.genero,
      data.estado || 'activo',
      data.descripcion,
      data.tipo_cliente || 'minorista' // 🔥 si no mandás nada, guarda minorista
    ];
    db.query(query, values, callback);
  },

  // Actualizar cliente
  update: (id, data, callback) => {
    const query = `
      UPDATE clientes SET
        nombre = ?, apellido = ?, tipo = ?, numDocumento = ?, telefono = ?, direccion = ?, genero = ?, estado = ?, descripcion = ?, tipo_cliente = ?, updated_at = NOW()
      WHERE idcliente = ?
    `;
    const values = [
      data.nombre,
      data.apellido,
      data.tipo,
      data.numDocumento,
      data.telefono,
      data.direccion,
      data.genero,
      data.estado,
      data.descripcion,
      data.tipo_cliente,
      id
    ];
    db.query(query, values, callback);
  },

  // Eliminar cliente (soft delete)
  delete: (id, callback) => {
    const query = `UPDATE clientes SET deleted_at = NOW() WHERE idcliente = ?`;
    db.query(query, [id], callback);
  }
};

export default Cliente;
