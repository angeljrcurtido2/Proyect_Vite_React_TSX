import db from '../../db.js';

const Categoria = {
  findAll: (callback) => {
    db.query('SELECT * FROM categorias WHERE deleted_at IS NULL', callback);
  },
  
  // ✅ Nuevo: paginación + búsqueda
  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM categorias 
      WHERE deleted_at IS NULL AND (
        categoria LIKE ?
      )
      ORDER BY idcategorias DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, limit, offset], callback);
  },

  // ✅ Nuevo: contar resultados filtrados
  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) as total FROM categorias 
      WHERE deleted_at IS NULL AND (
        categoria LIKE ?
      )
    `;
    db.query(query, [searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM categorias WHERE idcategorias = ? AND deleted_at IS NULL', [id], callback);
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO categorias (categoria, estado, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `;
    db.query(query, [data.categoria, data.estado || 'activo'], callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE categorias SET 
        categoria = ?, estado = ?, updated_at = NOW()
      WHERE idcategorias = ?
    `;
    db.query(query, [data.categoria, data.estado, id], callback);
  },

  delete: (id, callback) => {
    // Eliminado lógico (soft delete)
    const query = `
      UPDATE categorias SET deleted_at = NOW() WHERE idcategorias = ?
    `;
    db.query(query, [id], callback);
  }
};

export default Categoria;
