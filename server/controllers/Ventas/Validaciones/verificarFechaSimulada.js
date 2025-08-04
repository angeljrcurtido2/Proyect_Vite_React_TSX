// controllers/Ventas/verificarFechaSimulada.js
import DetalleCompra from '../../../models/Compra/DetalleCompra.js';

export const verificarFechaSimulada = async (req, res) => {
  const { productos = [] } = req.body;

  try {
    const vencidosTotales = [];

    for (const item of productos) {
      const { idproducto, cantidad } = item;
      const lotes = await new Promise((resolve, reject) => {
        DetalleCompra.findByProducto(idproducto, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      let cantidadRestante = parseFloat(cantidad);
      const vencidos = [];

      for (const lote of lotes) {
        const disponible = parseFloat(lote.stock_restante);
        const vencido = new Date(lote.fecha_vencimiento) < new Date();

        if (disponible <= 0) continue;

        if (vencido) {
          vencidos.push({
            iddetalle: lote.iddetalle,
            nombre_producto: lote.nombre_producto,
            fecha_vencimiento: lote.fecha_vencimiento,
            stock_restante: lote.stock_restante,
          });
          continue;
        }

        if (cantidadRestante <= 0) break;
        const aUsar = Math.min(cantidadRestante, disponible);
        cantidadRestante -= aUsar;
      }

      if (cantidadRestante > 0) {
        vencidosTotales.push({
          idproducto,
          nombre_producto: lotes[0]?.nombre_producto,
          cantidadSolicitada: cantidad,
          cantidadDisponible: cantidad - cantidadRestante,
          vencidos,
        });
      }
    }

    if (vencidosTotales.length > 0) {
      return res.status(200).json({
        error: 'Algunos productos no pueden ser vendidos porque sus lotes están vencidos',
        productos_vencidos: vencidosTotales,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ Error en validación de vencimientos simulados:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
};