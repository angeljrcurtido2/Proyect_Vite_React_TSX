import db from '../db.js';

const DetalleActivEcon = {
  create: (data, callback) => {
    const query = 'INSERT INTO detalle_actividades_economicas (idfacturador, idactividad) VALUES (?, ?)';
    db.query(query, [data.idfacturador, data.idactividad], callback);
  },

  findByFacturador: (idfacturador, callback) => {
    const query = `
      SELECT dae.iddetalle, ae.descripcion 
      FROM detalle_actividades_economicas dae
      INNER JOIN actividades_economicas ae ON dae.idactividad = ae.idactividad
      WHERE dae.idfacturador = ?
    `;
    db.query(query, [idfacturador], callback);
  },

  deleteById: (iddetalle, callback) => {
    const query = 'DELETE FROM detalle_actividades_economicas WHERE iddetalle = ?';
    db.query(query, [iddetalle], callback);
  }
};

export default DetalleActivEcon;
