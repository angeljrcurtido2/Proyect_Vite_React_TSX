import DatosBancarios from '../../models/DatosBancarios/DatosBancarios.js';

export const getAllDatosBancariosPaginated = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  DatosBancarios.countFiltered(search, (err, total) => {
    if (err) return res.status(500).json({ error: err });

    DatosBancarios.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
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

export const editarDatosBancarios = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  DatosBancarios.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar dato bancario', detalle: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dato bancario no encontrado o ya eliminado' });
    }

    res.json({ mensaje: 'Dato bancario actualizado correctamente' });
  });
};

export const listarDatosBancarios = (req, res) => {
  DatosBancarios.findAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener datos bancarios', detalle: err });
    res.json(results);
  });
};

export const obtenerDatoBancario = (req, res) => {
  const { id } = req.params;
  DatosBancarios.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el dato bancario', detalle: err });
    if (results.length === 0) return res.status(404).json({ error: 'Dato bancario no encontrado' });
    res.json(results[0]);
  });
};

export const crearDatoBancario = (req, res) => {
  DatosBancarios.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear dato bancario', detalle: err });
    res.status(201).json({ mensaje: 'Dato bancario creado', id: result.insertId });
  });
};

export const eliminarDatoBancario = (req, res) => {
  const { id } = req.params;
  DatosBancarios.softDelete(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar', detalle: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Dato no encontrado o ya eliminado' });
    res.json({ mensaje: 'Dato bancario eliminado correctamente (soft delete)' });
  });
};
