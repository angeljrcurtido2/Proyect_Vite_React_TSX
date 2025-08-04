import db from '../db.js';

const Facturador = {
  create: (data, callback) => {
    const query = `
      INSERT INTO facturadores 
      (nombre_fantasia, titular, telefono, direccion, ciudad, ruc, timbrado_nro, fecha_inicio_vigente, fecha_fin_vigente, nro_factura_inicial_habilitada, nro_factura_final_habilitada) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.nombre_fantasia,
      data.titular,
      data.telefono,
      data.direccion,
      data.ciudad,
      data.ruc,
      data.timbrado_nro,
      data.fecha_inicio_vigente,
      data.fecha_fin_vigente,
      data.nro_factura_inicial_habilitada,
      data.nro_factura_final_habilitada
    ];
    db.query(query, values, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM facturadores 
      WHERE 
        nombre_fantasia LIKE ? 
        OR titular LIKE ? 
        OR telefono LIKE ? 
        OR ruc LIKE ?
      ORDER BY idfacturador DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },

  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT COUNT(*) as total FROM facturadores 
      WHERE 
        nombre_fantasia LIKE ? 
        OR titular LIKE ? 
        OR telefono LIKE ? 
        OR ruc LIKE ?
    `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM facturadores WHERE idfacturador = ?';
    db.query(query, [id], callback);
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE facturadores SET 
        nombre_fantasia = ?, titular = ?, telefono = ?, direccion = ?, ciudad = ?, 
        ruc = ?, timbrado_nro = ?, fecha_inicio_vigente = ?, fecha_fin_vigente = ?, 
        nro_factura_inicial_habilitada = ?, nro_factura_final_habilitada = ?, updated_at = NOW()
      WHERE idfacturador = ?
    `;
    const values = [
      data.nombre_fantasia,
      data.titular,
      data.telefono,
      data.direccion,
      data.ciudad,
      data.ruc,
      data.timbrado_nro,
      data.fecha_inicio_vigente,
      data.fecha_fin_vigente,
      data.nro_factura_inicial_habilitada,
      data.nro_factura_final_habilitada,
      id
    ];
    db.query(query, values, callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM facturadores WHERE idfacturador = ?';
    db.query(query, [id], callback);
  },

  deleteActividadesByFacturadorId: (idfacturador, callback) => {
    const query = 'DELETE FROM detalle_actividades_economicas WHERE idfacturador = ?';
    db.query(query, [idfacturador], callback);
  },
  
  addActividades: (idfacturador, actividades, callback) => {
    if (actividades.length === 0) return callback(null); // Si no hay actividades, no hacer nada.
  
    const values = actividades.map(idactividad => [idfacturador, idactividad]);
    const query = 'INSERT INTO detalle_actividades_economicas (idfacturador, idactividad) VALUES ?';
    db.query(query, [values], callback);
  },
  
  findActivo: (callback) => {
    const query = `
      SELECT * FROM facturadores
      WHERE culminado = FALSE
      ORDER BY idfacturador DESC
      LIMIT 1
    `;
    db.query(query, callback);
  },

  culminar: (id, callback) => {
    const query = 'UPDATE facturadores SET culminado = TRUE WHERE idfacturador = ?';
    db.query(query, [id], callback);
  },

  actualizarFacturaDisponible(idfacturador, nuevoNro, nuevasUtilizadas, callback) {
    const sql = `
      UPDATE facturadores
      SET nro_factura_disponible = ?, facturas_utilizadas = ?
      WHERE idfacturador = ?
    `;
    db.query(sql, [nuevoNro, nuevasUtilizadas, idfacturador], callback);
  },
  
  actualizarNumeroFactura(idfacturador, nuevoNro, nuevasUtilizadas, callback) {
    const sql = `
      UPDATE facturadores
      SET nro_factura_disponible = ?, facturas_utilizadas = ?
      WHERE idfacturador = ?
    `;
    db.query(sql, [nuevoNro, nuevasUtilizadas, idfacturador], callback);
  }
};


export default Facturador;
