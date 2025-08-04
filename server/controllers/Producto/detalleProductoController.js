import DetalleProducto from '../../models/Producto/DetalleProducto.js';

export const getAllDetalles = (req, res) => {
  DetalleProducto.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getDetalleById = (req, res) => {
  const id = req.params.id;
  DetalleProducto.findById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

export const getDetallesByProducto = (req, res) => {
  const idproducto = req.params.idproducto;
  DetalleProducto.findByProducto(idproducto, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const createDetalle = (req, res) => {
  DetalleProducto.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Detalle de producto creado', id: result.insertId });
  });
};

export const updateDetalle = (req, res) => {
  const id = req.params.id;
  DetalleProducto.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Detalle actualizado' });
  });
};

export const deleteDetalle = (req, res) => {
  const id = req.params.id;
  DetalleProducto.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Detalle eliminado' });
  });
};
