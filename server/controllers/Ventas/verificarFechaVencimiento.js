import DetalleCompra from '../../models/Compra/DetalleCompra.js';

export const verificarFechaVencimiento = (req, res) => {
  const { detalles, sistema_venta_por_lote } = req.body;

  if (!Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: 'No se enviaron detalles para validar' });
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // ignorar hora

  const vencidos = [];

  const checkVencimiento = async () => {
    for (const item of detalles) {
      if (sistema_venta_por_lote && item.iddetalle) {
        const result = await new Promise((resolve) => {
          DetalleCompra.findById(item.iddetalle, (err, data) => {
            if (err || !data || !data.length) return resolve(null);
            resolve(data[0]);
          });
        });

        if (result && new Date(result.fecha_vencimiento) < hoy) {
          vencidos.push({
            iddetalle: item.iddetalle,
            nombre_producto: item.nombre_producto,
            fecha_vencimiento: result.fecha_vencimiento,
          });
        }
      } else {
        const vencimiento = new Date(item.fecha_vencimiento);
        if (vencimiento < hoy) {
          vencidos.push({
            idproducto: item.idproducto,
            nombre_producto: item.nombre_producto,
            fecha_vencimiento: item.fecha_vencimiento,
          });
        }
      }
    }

    if (vencidos.length) {
      return res.status(400).json({
        error: '⚠️ Se detectaron productos con fecha vencida.',
        productos_vencidos: vencidos,
      });
    }

    return res.status(200).json({ ok: true });
  };

  checkVencimiento().catch((err) => {
    console.error('❌ Error en verificación de fecha de vencimiento:', err);
    return res.status(500).json({ error: 'Error interno al verificar vencimientos' });
  });
};
