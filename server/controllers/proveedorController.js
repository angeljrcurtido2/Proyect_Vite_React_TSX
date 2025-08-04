import Proveedor from '../models/Proveedor.js';

export const getAllProveedores = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  Proveedor.countFiltered(search, (err, total) => {
    if (err) return res.status(500).json({ error: err });

    Proveedor.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
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


export const getProveedorById = (req, res) => {
  const id = req.params.id;
  Proveedor.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

export const createProveedor = (req, res) => {
  const { nombre, telefono, direccion, ruc, razon, estado } = req.body;

  // Validación básica
  if (!nombre || !telefono || !direccion || !ruc || !razon) {
    return res.status(400).json({
      error: 'Todos los campos son obligatorios. Verifique e intente nuevamente.',
    });
  }

  // Luego si todo está bien, crear el proveedor
  Proveedor.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Proveedor creado con éxito ✅', id: result.insertId });
  });
};


export const updateProveedor = (req, res) => {
  const id = req.params.id;
  Proveedor.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Proveedor actualizado' });
  });
};

export const deleteProveedor = (req, res) => {
  const id = req.params.id;
  Proveedor.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Proveedor eliminado (soft delete)' });
  });
};
