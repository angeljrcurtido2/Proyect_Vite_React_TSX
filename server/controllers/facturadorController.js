import Facturador from '../models/facturadorModel.js';
import DetalleActivEcon from '../models/detalleActivEconModel.js';
import db from '../db.js';
export const createFacturador = (req, res) => {
    const { actividades_economicas, ...facturadorData } = req.body; // ✨ separás las actividades

    // Primero insertamos el facturador
    Facturador.create(facturadorData, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: '❌ Error al crear facturador' });
        }

        const idfacturador = result.insertId;

        // Ahora insertamos las actividades asociadas
        if (Array.isArray(actividades_economicas) && actividades_economicas.length > 0) {
            let processed = 0;

            actividades_economicas.forEach((idactividad) => {
                DetalleActivEcon.create({ idfacturador, idactividad }, (errDetalle) => {
                    if (errDetalle) console.error('❌ Error al insertar detalle actividad:', errDetalle);

                    processed++;
                    if (processed === actividades_economicas.length) {
                        res.status(201).json({ success: true, message: '✅ Facturador y actividades asociadas correctamente' });
                    }
                });
            });
        } else {
            // Si no hay actividades seleccionadas
            res.status(201).json({ success: true, message: '✅ Facturador creado sin actividades' });
        }
    });
};

export const getAllFacturadores = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    Facturador.countFiltered(search, (err, total) => {
        if (err) return res.status(500).json({ error: err });

        Facturador.findAllPaginatedFiltered(limit, offset, search, async (err, data) => {
            if (err) return res.status(500).json({ error: err });

            // 🔥 Ahora, por cada facturador traemos sus actividades
            const promises = data.map(facturador => {
                return new Promise((resolve, reject) => {
                    const actividadesQuery = `
              SELECT ae.idactividad, ae.descripcion
              FROM detalle_actividades_economicas dae
              INNER JOIN actividades_economicas ae ON dae.idactividad = ae.idactividad
              WHERE dae.idfacturador = ?
            `;
                    db.query(actividadesQuery, [facturador.idfacturador], (errActividades, actividades) => {
                        if (errActividades) {
                            reject(errActividades);
                        } else {
                            facturador.actividades_economicas = actividades || [];
                            resolve(facturador);
                        }
                    });
                });
            });

            try {
                const facturadoresConActividades = await Promise.all(promises);

                const totalPages = Math.ceil(total / limit);
                res.json({
                    data: facturadoresConActividades,
                    totalItems: total,
                    totalPages,
                    currentPage: page,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: '❌ Error al traer actividades económicas' });
            }
        });
    });
};

export const getFacturadorById = (req, res) => {
    const { id } = req.params;

    // Traer facturador principal
    const facturadorQuery = `
      SELECT * FROM facturadores WHERE idfacturador = ?
    `;

    // Traer las actividades económicas asociadas
    const actividadesQuery = `
      SELECT ae.idactividad, ae.descripcion
      FROM detalle_actividades_economicas dae
      INNER JOIN actividades_economicas ae ON dae.idactividad = ae.idactividad
      WHERE dae.idfacturador = ?
    `;

    db.query(facturadorQuery, [id], (errFacturador, resultFacturador) => {
        if (errFacturador) {
            console.error(errFacturador);
            return res.status(500).json({ success: false, error: '❌ Error al obtener facturador' });
        }

        if (!resultFacturador.length) {
            return res.status(404).json({ success: false, error: '⚠️ Facturador no encontrado' });
        }

        const facturador = resultFacturador[0];

        // Ahora traemos las actividades económicas asociadas
        db.query(actividadesQuery, [id], (errActividades, resultActividades) => {
            if (errActividades) {
                console.error(errActividades);
                return res.status(500).json({ success: false, error: '❌ Error al obtener actividades económicas' });
            }

            // ✅ Si no hay actividades, igual devolvemos []
            facturador.actividades_economicas = resultActividades || [];

            res.json({ success: true, data: facturador });
        });
    });
};

export const updateFacturador = (req, res) => {
    const { id } = req.params;
    const data = req.body;
  
    Facturador.update(id, data, (err) => {
      if (err) return res.status(500).json({ success: false, error: '❌ Error al actualizar facturador' });
  
      // 🔥 Eliminar todas las actividades actuales
      Facturador.deleteActividadesByFacturadorId(id, (errDelete) => {
        if (errDelete) {
          console.error('Error al eliminar actividades antiguas', errDelete);
          return res.status(500).json({ success: false, error: '❌ Error al actualizar actividades económicas' });
        }
  
        // 🔥 Insertar nuevas actividades
        if (data.actividades_economicas && data.actividades_economicas.length > 0) {
          Facturador.addActividades(id, data.actividades_economicas, (errAdd) => {
            if (errAdd) {
              console.error('Error al agregar nuevas actividades', errAdd);
              return res.status(500).json({ success: false, error: '❌ Error al actualizar actividades económicas' });
            }
  
            res.json({ success: true, message: '✅ Facturador actualizado correctamente' });
          });
        } else {
          res.json({ success: true, message: '✅ Facturador actualizado sin actividades económicas' });
        }
      });
    });
  };

export const deleteFacturador = (req, res) => {
    const { id } = req.params;

    Facturador.delete(id, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: '❌ Error al eliminar facturador' });
        res.json({ success: true, message: '✅ Facturador eliminado correctamente' });
    });
};


// ✅ Marcar facturador como culminado
export const culminarFacturador = (req, res) => {
    const { id } = req.params;
  
    Facturador.culminar(id, (err, result) => {
      if (err) {
        console.error('❌ Error al culminar facturador:', err);
        return res.status(500).json({ success: false, error: 'Error al culminar facturador' });
      }
  
      res.json({ success: true, message: '✅ Facturador culminado correctamente' });
    });
  };
  
