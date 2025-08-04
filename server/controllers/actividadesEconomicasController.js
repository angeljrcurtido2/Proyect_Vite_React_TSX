import ActividadesEconomicas from '../models/actividadesEconomicasModel.js';

export const getAllActividades = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  ActividadesEconomicas.countFiltered(search, (err, total) => {
    if (err) return res.status(500).json({ error: err });

    ActividadesEconomicas.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
      if (err) return res.status(500).json({ error: err });

      const totalPages = Math.ceil(total / limit);
      res.json({
        data,
        totalItems: total,
        totalPages,
        currentPage: page,
      });
    });
  });
};

export const getActividadById = (req, res) => {
  const id = req.params.id;
  ActividadesEconomicas.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: '⚠️ Actividad no encontrada' });
    res.json({ success: true, data: results[0] });
  });
};

export const createActividad = (req, res) => {
  const { descripcion } = req.body;

  if (!descripcion || descripcion.trim() === '') {
    return res.status(400).json({
      error: 'El campo "descripción" es obligatorio.',
    });
  }

  ActividadesEconomicas.create({ descripcion }, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({
      message: '✅ Actividad creada correctamente',
      id: result.insertId,
    });
  });
};

export const updateActividad = (req, res) => {
  const id = req.params.id;
  ActividadesEconomicas.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Actividad actualizada correctamente' });
  });
};

export const deleteActividad = (req, res) => {
  const id = req.params.id;
  ActividadesEconomicas.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Actividad eliminada correctamente' });
  });
};
