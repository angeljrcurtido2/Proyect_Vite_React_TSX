import TipoEgreso from '../../models/Movimiento/TipoEgreso.js';

// Crear nuevo tipo de egreso
export const crearTipoEgreso = (req, res) => {
  const { descripcion } = req.body;
  if (!descripcion) {
    return res.status(400).json({ error: '⚠️ Descripción requerida' });
  }

  TipoEgreso.create({ descripcion }, (err, result) => {
    if (err) return res.status(500).json({ error: '❌ Error al crear tipo de egreso' });
    res.status(201).json({ message: '✅ Tipo de egreso creado correctamente' });
  });
};

// Listar tipos de egreso con paginación y búsqueda
export const listarTiposEgresoPag = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  TipoEgreso.countFiltered(search, (errCount, total) => {
    if (errCount) return res.status(500).json({ error: errCount });

    TipoEgreso.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
      if (err) return res.status(500).json({ error: err });

      const totalPages = Math.ceil(total / limit);
      res.json({
        data,
        totalItems: total,
        totalPages,
        currentPage: page
      });
    });
  });
};

// Anular tipo de egreso (soft delete)
export const anularTipoEgreso = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: '⚠️ ID requerido' });

  TipoEgreso.softDelete(id, (err) => {
    if (err) return res.status(500).json({ error: '❌ Error al anular tipo de egreso' });
    res.json({ message: '✅ Tipo de egreso anulado correctamente' });
  });
};
