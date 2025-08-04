// src/controllers/ventaController.js
import Venta from '../../models/Venta/Ventas.js';
import DetalleVenta from '../../models/Venta/DetalleVenta.js';
import DetalleCompra from '../../models/Compra/DetalleCompra.js';
import Producto from '../../models/Producto/Producto.js';
import Ingreso from '../../models/Movimiento/Ingreso.js';
import { createVenta } from './CrearVenta.js';
import Cliente from '../../models/Cliente.js';
import { ToWords } from 'to-words';
import DatosTransferenciaVenta from '../../models/DatosBancarios/DatosTransferenciaVenta.js';
import DetalleChequeVenta from '../../models/Venta/DetalleChequeVenta.js';
import DetalleTarjetaVenta from '../../models/Venta/DetalleTarjetaVenta.js';
import Facturador from '../../models/facturadorModel.js';
import { generarFacturaEmbebida } from '../../report/reportFactura.js';
export { createVenta };

export const getVentas = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  Venta.countFiltered(search, (err, total) => {
    if (err) return res.status(500).json({ error: err });

    Venta.findAllPaginatedFiltered(limit, offset, search, (err, ventas) => {
      if (err) return res.status(500).json({ error: err });

      const ids = ventas.map((c) => c.idventa);
      if (ids.length === 0) {
        return res.json({ data: [], totalItems: 0, totalPages: 0, currentPage: page });
      }

      DetalleVenta.findByVentaMultiple(ids, (err, detalles) => {
        if (err) return res.status(500).json({ error: err });

        // Agrupar detalles por idventa
        const detallesMap = {};
        detalles.forEach((detalle) => {
          if (!detallesMap[detalle.idventa]) {
            detallesMap[detalle.idventa] = [];
          }
          detallesMap[detalle.idventa].push(detalle);
        });

        // Insertar en cada compra
        const ventasConDetalles = ventas.map((venta) => ({
          ...venta,
          detalles: detallesMap[venta.idventa] || []
        }));

        const totalPages = Math.ceil(total / limit);
        res.json({
          data: ventasConDetalles,
          totalItems: total,
          totalPages,
          currentPage: page
        });
      });
    });
  });
};

export const getVentaById = (req, res) => {
  const id = req.params.id;
  Venta.findById(id, (err, venta) => {
    if (err) return res.status(500).json({ error: err });
    res.json(venta[0]);
  });
};

export const deleteVenta = (req, res) => {
  const id = req.params.id;

  // Buscar los detalles de la venta
  DetalleVenta.findByVentaId(id, (err, detalles) => {
    if (err) return res.status(500).json({ error: err });
    if (!detalles.length) return res.status(404).json({ error: '❌ No se encontraron detalles para esta venta' });

    let actualizados = 0;

    detalles.forEach((detalle) => {
      // 1. Reintegrar al stock del producto
      Producto.aumentarStock(detalle.idproducto, detalle.cantidad, (errProd) => {
        if (errProd) return res.status(500).json({ error: errProd });

        // 2. Reintegrar al lote si tiene iddetalle_compra
        if (detalle.iddetalle_compra) {
          DetalleCompra.aumentarStockLote(detalle.iddetalle_compra, detalle.cantidad, (errLote) => {
            if (errLote) return res.status(500).json({ error: errLote });

            actualizados++;
            if (actualizados === detalles.length) finalizarAnulacion();
          });
        } else {
          actualizados++;
          if (actualizados === detalles.length) finalizarAnulacion();
        }
      });
    });

    function finalizarAnulacion() {
      Venta.ejecutarAnulacionCompleta(id, (errDelete) => {
        if (errDelete) return res.status(500).json({ error: errDelete });

        Ingreso.softDeleteByVentaId(id, (errIngreso) => {
          if (errIngreso) {
            console.error('⚠️ Error al anular ingreso relacionado:', errIngreso);
          }

          // Ejecutar ambos soft deletes en paralelo y esperar que ambos terminen
          let errores = [];

          DatosTransferenciaVenta.softDeleteByVenta(id, (errTransferencia) => {
            if (errTransferencia) {
              console.error('⚠️ Error al anular datos de transferencia:', errTransferencia);
              errores.push('transferencia');
            }

            DetalleChequeVenta.softDeleteByVenta(id, (errCheque) => {
              if (errCheque) {
                console.error("⚠️ Error al anular el cheque:", errCheque);
                errores.push('cheque');
              }

              DetalleTarjetaVenta.softDeleteByVenta(id, (errTarjeta) => {
                if (errTarjeta) {
                  console.error("⚠️ Error al anular datos de tarjeta:", errTarjeta);
                  errores.push('tarjeta');
                }

                if (errores.length > 0) {
                  return res.status(200).json({
                    message: '✅ Venta anulada y stock restaurado, pero hubo errores al anular registros asociados',
                    errores
                  });
                }

                res.json({ message: '✅ Venta anulada, stock restaurado y registros asociados anulados' });
              });
            });
          });
        });
      });
    }
  });
};

export const comprobanteVenta = (req, res) => {
  const idventa = req.params.id;

  Venta.findById(idventa, (errVenta, ventaResult) => {
    if (errVenta || !ventaResult.length) {
      return res.status(404).json({ error: '❌ Venta no encontrada' });
    }

    const venta = ventaResult[0];

    Cliente.findById(venta.idcliente, (errCliente, clienteResult) => {
      if (errCliente || !clienteResult?.length) {
        return res.status(404).json({ error: '❌ Cliente no encontrado' });
      }

      const cliente = clienteResult[0];

      Facturador.findById(venta.idfacturador, (errFact, factResult) => {
        if (errFact || !factResult?.length) {
          return res.status(404).json({ error: '❌ Facturador no encontrado' });
        }

        const facturador = factResult[0];

        DetalleVenta.findByVentaId(idventa, (errDetalles, detallesVenta) => {
          if (errDetalles) {
            return res.status(500).json({ error: '❌ Error al obtener detalles de venta' });
          }

          Venta.getTotalesIVA(idventa, async (errIVA, totalesIVA) => {
            if (errIVA) {
              return res.status(500).json({ error: '❌ Error al obtener totales de IVA' });
            }

            const toWords = new ToWords({
              localeCode: 'es-ES',
              converterOptions: {
                currency: true,
                ignoreDecimal: false,
                ignoreZeroCurrency: false,
                doNotAddOnly: false,
                currencyOptions: {
                  name: 'guaraní',
                  plural: 'guaraníes',
                  symbol: '₲',
                  fractionalUnit: {
                    name: 'céntimo',
                    plural: 'céntimos',
                    symbol: '',
                  },
                },
              },
            });

            const formatDate = (date) => {
              const d = new Date(date);
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              return `${day}-${month}-${year}`;
            };

            const datosFactura = {
              nombre_fantasia: facturador.nombre_fantasia,
              ruc: facturador.ruc,
              timbrado_nro: facturador.timbrado_nro,
              fecha_inicio_vigente: formatDate(facturador.fecha_inicio_vigente),
              fecha_fin_vigente: formatDate(facturador.fecha_fin_vigente),
              nro_factura: venta.nro_factura,
              nro_ticket: venta.nro_ticket,
              fecha: formatDate(venta.fecha),
              cliente: `${cliente.nombre} ${cliente.apellido}`,
              nro_documento: cliente.numDocumento,
              total: venta.total,
              totalletras: toWords.convert(venta.total || 0),
              subtotal_exento: venta.subtotal_exento || 0,
              subtotal_iva5: totalesIVA.iva5 || 0,
              subtotal_iva10: totalesIVA.iva10 || 0,
              total_iva: totalesIVA.totaliva || 0,
              logo_base64: venta.logo_base64 || '',
              detalles: detallesVenta.map((item) => ({
                nombre_producto: item.nombre_producto,
                cantidad: item.cantidad,
                precio_venta: item.precio_venta,
                sub_total: item.sub_total,
                iva5: item.iva5 || 0,
                iva10: item.iva10 || 0,
              })),
            };

            const facturaPDFBase64 = await generarFacturaEmbebida(datosFactura);

            res.json({
              message: '✅ Comprobante generado correctamente',
              facturaPDFBase64,
            });
          });
        });
      });
    });
  });
};

export const getVentasPorMes = (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  Venta.getVentasPorMes(year, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener ventas por mes:", err);
      return res.status(500).json({ error: "Error al obtener ventas por mes" });
    }

    // Inicializar todos los meses con 0
    const ventasMensuales = Array(12).fill(0);

    results.forEach((row) => {
      ventasMensuales[row.mes - 1] = parseFloat(row.total);
    });

    res.json({
      year,
      data: ventasMensuales, // [Ene, Feb, ..., Dic]
    });
  });
};

export const getProgresoMetaMensual = (req, res) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  Venta.getProgresoMetaMensual(year, month, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    const { hoy = 0, acumulado = 0 } = result[0];
    const porcentaje = (acumulado / metaMensual) * 100;

    res.json({
      hoy,
      acumulado,
      meta: metaMensual,
      porcentaje: parseFloat(porcentaje.toFixed(2)),
    });
  });
};

export const getProductosMasVendidos = (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  DetalleVenta.getProductosMasVendidos(limit, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos más vendidos:", err);
      return res.status(500).json({ error: "Error al obtener productos más vendidos" });
    }

    res.json(results);
  });
};

export const getEstadisticasVentas = (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  Venta.getEstadisticasAnuales(year, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener estadísticas:", err);
      return res.status(500).json({ error: "Error al obtener estadísticas de ventas" });
    }

    const ventas = Array(12).fill(0);
    const ganancias = Array(12).fill(0);

    results.forEach((row) => {
      ventas[row.mes - 1] = parseFloat(row.total_ventas);
      ganancias[row.mes - 1] = parseFloat(row.total_ganancias);
    });

    res.json({ ventas, ganancias });
  });
};

export const getResumenVentasDia = (req, res) => {
  Venta.getResumenVentasDelDia((err, result) => {
    if (err) {
      console.error("❌ Error en resumen de ventas:", err);
      return res.status(500).json({ error: "Error al obtener resumen de ventas" });
    }

    const { totalHoy = 0, totalAyer = 0 } = result[0];
    const variacion = totalAyer === 0 ? 100 : ((totalHoy - totalAyer) / totalAyer) * 100;

    res.json({
      label: "Ventas del día",
      totalHoy: parseFloat(totalHoy),
      totalAyer: parseFloat(totalAyer),
      variacion: parseFloat(variacion.toFixed(2))
    });
  });
};
