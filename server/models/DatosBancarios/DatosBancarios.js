import db from '../../db.js';

const DatosBancarios = {
    findAll: (callback) => {
        const sql = `SELECT * FROM datos_bancarios WHERE deleted_at IS NULL`;
        db.query(sql, callback);
    },

    findAllPaginatedFiltered: (limit, offset, search, callback) => {
        const searchTerm = `%${search}%`;
        const query = `
      SELECT * FROM datos_bancarios 
      WHERE deleted_at IS NULL AND (
        banco_origen LIKE ?
        OR numero_cuenta LIKE ?
        OR tipo_cuenta LIKE ?
        OR titular_cuenta LIKE ?
        OR observacion LIKE ?
      )
      ORDER BY iddatos_bancarios DESC
      LIMIT ? OFFSET ?
    `;
        db.query(
            query,
            [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit, offset],
            callback
        );
    },

    // Contador total con filtro aplicado
    countFiltered: (search, callback) => {
        const searchTerm = `%${search}%`;
        const query = `
      SELECT COUNT(*) as total FROM datos_bancarios 
      WHERE deleted_at IS NULL AND (
        banco_origen LIKE ?
        OR numero_cuenta LIKE ?
        OR tipo_cuenta LIKE ?
        OR titular_cuenta LIKE ?
        OR observacion LIKE ?
      )
    `;
        db.query(
            query,
            [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
            (err, results) => {
                if (err) return callback(err);
                callback(null, results[0].total);
            }
        );
    },

    findById: (id, callback) => {
        const sql = `SELECT * FROM datos_bancarios WHERE iddatos_bancarios = ? AND deleted_at IS NULL`;
        db.query(sql, [id], callback);
    },

    create: (data, callback) => {
        const { banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion } = data;
        const sql = `
      INSERT INTO datos_bancarios (banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion)
      VALUES (?, ?, ?, ?, ?)
    `;
        db.query(sql, [banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion], callback);
    },

    softDelete: (id, callback) => {
        const sql = `UPDATE datos_bancarios SET deleted_at = NOW() WHERE iddatos_bancarios = ?`;
        db.query(sql, [id], callback);
    },

    update: (id, data, callback) => {
        const { banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion } = data;
        const sql = `
            UPDATE datos_bancarios
            SET banco_origen = ?, numero_cuenta = ?, tipo_cuenta = ?, titular_cuenta = ?, observacion = ?, updated_at = NOW()
            WHERE iddatos_bancarios = ? AND deleted_at IS NULL
        `;
        db.query(sql, [banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion, id], callback);
    },
};

export default DatosBancarios;
