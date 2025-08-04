import db from '../db.js';

const Usuario = {
  findAll: (callback) => {
    db.query(
      'SELECT idusuarios, acceso, login, estado FROM usuarios WHERE deleted_at IS NULL',
      callback
    );
  },

  findById: (id, callback) => {
    db.query(
      `
      SELECT
        idusuarios,
        acceso,
        login,
        estado,
        nombre,
        apellido,
        telefono
      FROM usuarios
      WHERE idusuarios = ?
    `,
      [id],
      callback
    );
  },

  findByLogin: (login, callback) => {
    const query = 'SELECT * FROM usuarios WHERE login = ? AND estado = "activo"';
    db.query(query, [login], callback);
  },

  create: (data, callback) => {
    const query = `
    INSERT INTO usuarios (
      acceso,
      login,
      password,
      estado,
      nombre,
      apellido,
      telefono
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
      data.acceso,
      data.login,
      data.password,
      data.estado || 'activo',
      data.nombre,
      data.apellido,
      data.telefono || null
    ];
    db.query(query, values, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT 
      idusuarios,
      acceso,
      login,
      estado,
      nombre,
      apellido,
      telefono
    FROM usuarios
    WHERE deleted_at IS NULL
      AND (
        login    LIKE ? OR
        acceso   LIKE ? OR
        estado   LIKE ? OR
        nombre   LIKE ? OR
        apellido LIKE ? OR
        telefono LIKE ?
      )
    ORDER BY idusuarios DESC
    LIMIT ? OFFSET ?
  `;
    db.query(
      query,
      [
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        limit,
        offset
      ],
      callback
    );
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT COUNT(*) AS total
    FROM usuarios
    WHERE deleted_at IS NULL
      AND (
        login    LIKE ? OR
        acceso   LIKE ? OR
        estado   LIKE ? OR
        nombre   LIKE ? OR
        apellido LIKE ? OR
        telefono LIKE ?
      )
  `;
    db.query(
      query,
      [
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm
      ],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].total);
      }
    );
  },

  update: (id, data, callback) => {
    const fields = [
      'acceso = ?',
      'login = ?',
      'estado = ?',
      'nombre = ?',
      'apellido = ?',
      'telefono = ?'
    ];
    const values = [
      data.acceso,
      data.login,
      data.estado,
      data.nombre,
      data.apellido,
      data.telefono || null
    ];

    // Solo incluir password si fue enviada
    if (data.password) {
      fields.push('password = ?');
      values.push(data.password);
    }

    const query = `
    UPDATE usuarios
    SET ${fields.join(', ')}
    WHERE idusuarios = ?
  `;
    values.push(id); // agregamos el id al final

    db.query(query, values, callback);
  },

  delete: (id, callback) => {
    const query = `
    UPDATE usuarios
    SET deleted_at = NOW()
    WHERE idusuarios = ?
  `;
    db.query(query, [id], callback);
  },
};

export default Usuario;
