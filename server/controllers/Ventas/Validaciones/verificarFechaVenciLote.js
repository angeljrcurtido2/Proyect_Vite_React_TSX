import DetalleCompra from '../../../models/Compra/DetalleCompra.js';

export const verificarFechaVenciLote= async (req, res) => {
  const { detalles = [] } = req.body;

  try {
    const productosVencidos = [];

    for (const item of detalles) {
      if (!item.iddetalle) continue;

      const lote = await new Promise((resolve, reject) => {
        DetalleCompra.findById(item.iddetalle, (err, result) => {
          if (err) return reject(err);
          resolve(result?.[0]);
        });
      });

      if (lote && new Date(lote.fecha_vencimiento) < new Date()) {
        productosVencidos.push({
          iddetalle: lote.iddetalle,
          nombre_producto: lote.nombre_producto,
          fecha_vencimiento: lote.fecha_vencimiento,
        });
      }
    }

    if (productosVencidos.length) {
      return res.status(200).json({
        error: 'Productos vencidos encontrados',
        productos_vencidos: productosVencidos,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ Error en verificación de fecha de vencimiento:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
};
