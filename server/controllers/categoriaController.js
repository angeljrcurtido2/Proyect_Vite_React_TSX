import Categoria from '../models/Producto/Categoria.js';

export const getAllCategorias = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  Categoria.countFiltered(search, (err, total) => {
    if (err) return res.status(500).json({ error: err });

    Categoria.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
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

export const getCategoriaById = (req, res) => {
  const id = req.params.id;
  Categoria.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

export const createCategoria = (req, res) => {
  const { categoria, estado } = req.body;

  // Validación básica
  if (!categoria || categoria.trim() === '') {
    return res.status(400).json({
      error: 'El campo "categoría" es obligatorio. Verifique e intente nuevamente.',
    });
  }

  // Crear la categoría
  Categoria.create({ categoria, estado }, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({
      message: '✅ Categoría creada con éxito',
      id: result.insertId,
    });
  });
};

export const updateCategoria = (req, res) => {
  const id = req.params.id;
  Categoria.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Categoría actualizada' });
  });
};

export const deleteCategoria = (req, res) => {
  const id = req.params.id;
  Categoria.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Categoría eliminada (soft delete)' });
  });
};
