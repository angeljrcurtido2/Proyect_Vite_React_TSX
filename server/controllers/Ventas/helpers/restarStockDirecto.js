// controllers/Ventas/helpers/restarStockDirecto.js
import DetalleCompra from '../../../models/Compra/DetalleCompra.js';
import Producto from '../../../models/Producto/Producto.js';

export const restarStockDirecto = async (idproducto, cantidadSolicitada) => {
  return new Promise((resolve, reject) => {
    DetalleCompra.findByProducto(idproducto, async (err, lotes) => {
      if (err) return reject(`❌ Error al obtener lotes: ${err}`);

      let cantidadRestante = parseFloat(cantidadSolicitada);
      const resultados = [];

      for (const lote of lotes) {
        if (cantidadRestante <= 0) break;

        const stockDisponible = parseFloat(lote.stock_restante);
        const aDescontar = Math.min(cantidadRestante, stockDisponible);

        try {
          await new Promise((res) =>
            DetalleCompra.restarStockLote(lote.iddetalle, aDescontar, (e) => res())
          );

          await new Promise((res) =>
            Producto.restarStock(idproducto, aDescontar, (e) => res())
          );

          resultados.push({
            iddetalle: lote.iddetalle,
            descontado: aDescontar,
          });

          cantidadRestante -= aDescontar;
        } catch (error) {
          console.error(`❌ Error en lote ${lote.iddetalle}`, error);
        }
      }

      if (cantidadRestante > 0) {
        console.warn(`⚠️ Stock insuficiente para producto ${idproducto}`);
      }

      resolve(resultados);
    });
  });
};
