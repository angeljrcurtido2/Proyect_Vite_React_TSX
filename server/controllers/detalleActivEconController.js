import DetalleActivEcon from '../models/detalleActivEconModel.js';

export const createDetalleActivEcon = (req, res) => {
  const data = req.body;

  DetalleActivEcon.create(data, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: '❌ Error al asociar actividad' });
    res.status(201).json({ success: true, message: '✅ Actividad asociada correctamente' });
  });
};

export const getActividadesByFacturador = (req, res) => {
  const { idfacturador } = req.params;

  DetalleActivEcon.findByFacturador(idfacturador, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: '❌ Error al obtener actividades' });
    res.json({ success: true, data: result });
  });
};

export const deleteDetalleActivEcon = (req, res) => {
  const { iddetalle } = req.params;

  DetalleActivEcon.deleteById(iddetalle, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: '❌ Error al eliminar actividad' });
    res.json({ success: true, message: '✅ Actividad eliminada correctamente' });
  });
};
