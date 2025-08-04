import db from '../db.js';

const MovimientoCaja = {
  findAll: (callback) => {
    db.query(`
      SELECT m.*, u.login 
      FROM movimiento_caja m
      JOIN usuarios u ON m.idusuarios = u.idusuarios
    `, callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM movimiento_caja WHERE idmovimiento = ?', [id], callback);
  },

  getById: (id, callback) => {
    db.query(
      'SELECT * FROM movimiento_caja WHERE idmovimiento = ? LIMIT 1',
      [id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0] || null);   // ← devuelve solo un objeto o null
      }
    );
  },

  create: (data, callback) => {
    const query = `
      INSERT INTO movimiento_caja (
        idusuarios, num_caja, fecha_apertura, monto_apertura, estado
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      data.idusuarios,
      data.num_caja,
      data.fecha_apertura,
      data.monto_apertura,
      data.estado || 'abierto'
    ];
    db.query(query, values, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, filtros, cb) => {
    const searchTerm = `%${search}%`;
    const conds = [];
    const params = [searchTerm, searchTerm, searchTerm, searchTerm];

    if (filtros.aperturaDesde) { conds.push('m.fecha_apertura >= ?'); params.push(filtros.aperturaDesde); }
    if (filtros.aperturaHasta) { conds.push('m.fecha_apertura <= ?'); params.push(filtros.aperturaHasta); }
    if (filtros.cierreDesde) { conds.push('m.fecha_cierre >= ?'); params.push(filtros.cierreDesde); }
    if (filtros.cierreHasta) { conds.push('m.fecha_cierre <= ?'); params.push(filtros.cierreHasta); }

    const whereFecha = conds.length ? 'AND ' + conds.join(' AND ') : '';

    const sql = `
    SELECT m.*, u.login
    FROM movimiento_caja m
    JOIN usuarios u ON m.idusuarios = u.idusuarios
    WHERE (
      m.num_caja LIKE ?
      OR m.fecha_apertura LIKE ?
      OR m.estado LIKE ?
      OR u.login LIKE ?
    )
    ${whereFecha}
    ORDER BY m.idmovimiento DESC
    LIMIT ? OFFSET ?
  `;

    params.push(limit, offset);
    db.query(sql, params, cb);
  },
  countFiltered: (search, filtros, cb) => {
    const searchTerm = `%${search}%`;

    const conds = [];
    const params = [searchTerm, searchTerm, searchTerm, searchTerm];

    if (filtros.aperturaDesde) {
      conds.push('m.fecha_apertura >= ?');
      params.push(filtros.aperturaDesde);
    }
    if (filtros.aperturaHasta) {
      conds.push('m.fecha_apertura <= ?');
      params.push(filtros.aperturaHasta);
    }
    if (filtros.cierreDesde) {
      conds.push('m.fecha_cierre >= ?');
      params.push(filtros.cierreDesde);
    }
    if (filtros.cierreHasta) {
      conds.push('m.fecha_cierre <= ?');
      params.push(filtros.cierreHasta);
    }

    const whereFecha = conds.length ? 'AND ' + conds.join(' AND ') : '';

    const sql = `
    SELECT COUNT(*) AS total
    FROM movimiento_caja m
    JOIN usuarios u ON m.idusuarios = u.idusuarios
    WHERE (
      m.num_caja LIKE ?
      OR m.fecha_apertura LIKE ?
      OR m.estado LIKE ?
      OR u.login LIKE ?
    )
    ${whereFecha}
  `;

    db.query(sql, params, (err, rows) =>
      err ? cb(err) : cb(null, rows[0].total)
    );
  },

  cerrarCaja: (id, data, callback) => {
    const query = `
      UPDATE movimiento_caja SET
        fecha_cierre = ?, monto_cierre = ?, credito = ?, gastos = ?, cobrado = ?,
        contado = ?, ingresos = ?, compras = ?, estado = ?
      WHERE idmovimiento = ?
    `;
    const values = [
      data.fecha_cierre, data.monto_cierre, data.credito, data.gastos,
      data.cobrado, data.contado, data.ingresos, data.compras,
      data.estado, id
    ];
    db.query(query, values, callback);
  },
  getEstadoById: (id, callback) => {
    db.query('SELECT estado FROM movimiento_caja WHERE idmovimiento = ?', [id], callback);
  },

  getMovimientoAbierto: (callback) => {
    const query = `SELECT * FROM movimiento_caja WHERE estado = 'abierto' LIMIT 1`;
    db.query(query, callback);
  }
};

export default MovimientoCaja;
