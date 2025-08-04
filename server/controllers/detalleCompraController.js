import DetalleCompra from '../models/Compra/DetalleCompra.js';

// GET /api/detalle-compra/producto/:id
export const getLotesPorProducto = (req, res) => {
  const idproducto = req.params.id;

  DetalleCompra.findByProducto(idproducto, (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener detalle_compra por producto:', err);
      return res.status(500).json({ error: 'Error al obtener lotes del producto' });
    }

    res.json(resultados);
  });
};
