// controllers/Ventas/CrearVenta.js
import Venta from '../../models/Venta/Ventas.js';
import DetalleVenta from '../../models/Venta/DetalleVenta.js';
import DetalleCompra from '../../models/Compra/DetalleCompra.js';
import MovimientoCaja from '../../models/MovimientoCaja.js';
import Producto from '../../models/Producto/Producto.js';
import Facturador from '../../models/facturadorModel.js';
import DeudaVenta from '../../models/Venta/DeudaVenta.js';
import Ingreso from '../../models/Movimiento/Ingreso.js';
import Cliente from '../../models/Cliente.js';
import DatosTransferenciaVenta from '../../models/DatosBancarios/DatosTransferenciaVenta.js';
import DetalleChequeVenta from '../../models/Venta/DetalleChequeVenta.js';
import DetalleTarjetaVenta from '../../models/Venta/DetalleTarjetaVenta.js';
import { generarFacturaEmbebida } from '../../report/reportFactura.js';
import { restarStockDirecto } from './helpers/restarStockDirecto.js';
import { ToWords } from 'to-words';

const incrementarNroFactura = (nroActual) => {
  const partes = nroActual.split('-');
  const numero = parseInt(partes[2], 10) + 1;
  return `${partes[0]}-${partes[1]}-${numero.toString().padStart(7, '0')}`;
};

const talonarioAgotado = (actual, final) => {
  const numActual = parseInt(actual.split('-')[2]);
  const numFinal = parseInt(final.split('-')[2]);
  return numActual > numFinal;
};

export const createVenta = (req, res) => {
  const { venta, detalles, sistema_venta_por_lote } = req.body;

  MovimientoCaja.getMovimientoAbierto((errMov, movimientoResult) => {
    if (errMov) return res.status(500).json({ error: '❌ Error al buscar movimiento de caja' });
    if (!movimientoResult.length) return res.status(400).json({ error: '⚠️ No hay movimiento abierto' });

    const idmovimiento = movimientoResult[0].idmovimiento;

    Venta.getLastTicket((errTicket, ultimoTicketResult) => {
      if (errTicket) return res.status(500).json({ error: '❌ Error al obtener último ticket' });

      const nuevoTicket = (ultimoTicketResult || 0) + 1;

      Facturador.findActivo((errFactAlt, factAltResult) => {
        if (errFactAlt || !factAltResult.length) {
          return res.status(400).json({ error: '⚠️ No hay facturador activo disponible' });
        }

        const facturador = factAltResult[0];
        const nroDisponible = facturador.nro_factura_disponible || facturador.nro_factura_inicial_habilitada;

        Cliente.findById(venta.idcliente, (errCliente, results) => {
          if (errCliente || !results || !results.length) {
            return res.status(400).json({ error: '⚠️ No se encontró el cliente' });
          }

          const clienteData = results[0];
          venta.nombre_cliente = `${clienteData.nombre} ${clienteData.apellido}`;
          venta.documento_cliente = clienteData.numDocumento;

          console.log("Cliente encontrado:", clienteData);
          if (venta.tipo_comprobante === 'F') {
            if (talonarioAgotado(nroDisponible, facturador.nro_factura_final_habilitada)) {
              return res.status(400).json({ error: '⚠️ Se ha alcanzado el límite del talonario.' });
            }

            const nroFacturaGenerado = nroDisponible;
            const siguienteNro = incrementarNroFactura(nroFacturaGenerado);
            const nuevasUtilizadas = (facturador.facturas_utilizadas || 0) + 1;

            Facturador.actualizarNumeroFactura(facturador.idfacturador, siguienteNro, nuevasUtilizadas, (errUpdate) => {
              if (errUpdate) return res.status(500).json({ error: '❌ Error al actualizar número de factura' });
              continuarProceso(facturador, nroFacturaGenerado, nuevoTicket);
            });
          } else {
            continuarProceso(facturador, null, nuevoTicket);
          }

          async function continuarProceso(facturador, nroFactura, nroTicket) {
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

            const idusuario = req.user?.idusuario;
            if (!idusuario) return res.status(401).json({ error: 'Usuario no autenticado' });

            const ventaConDatos = {
              ...venta,
              idmovimiento,
              idusuarios: idusuario,
              nro_factura: venta.tipo_comprobante === 'F' ? nroFactura : '',
              nro_ticket: nroTicket,
              tipo_comprobante: venta.tipo_comprobante === 'F' ? 'Factura' : 'Ticket',
              idfacturador: facturador.idfacturador,
              idformapago: venta.idformapago || null,
              nombre_fantasia_facturador: facturador.nombre_fantasia,
              ruc_facturador: facturador.ruc,
              timbrado_nro_facturador: facturador.timbrado_nro,
              fecha_inicio_vigente_facturador: facturador.fecha_inicio_vigente,
              fecha_fin_vigente_facturador: facturador.fecha_fin_vigente,
              totalletras: toWords.convert(venta.total || 0),
              estado: 'activo',
            };

            try {
              if (sistema_venta_por_lote) {
                for (const item of detalles) {
                  const isOk = await new Promise((resolve, reject) => {
                    DetalleCompra.verificarStockSuficiente(item.iddetalle, item.cantidad, (err, result) => {
                      if (err) return reject(err);
                      resolve(result);
                    });
                  });

                  if (!isOk) {
                    return res.status(400).json({ error: `❌ Stock insuficiente para el lote ${item.iddetalle}` });
                  }
                }
              }

              Venta.create(ventaConDatos, async (errVenta, ventaResult) => {
                if (errVenta) return res.status(500).json({ error: '❌ Error al crear venta' });

                const idventa = ventaResult.insertId;

                if (venta.idformapago === 2 && venta.datos_bancarios) {
                  const datosTransferencia = {
                    idventa,
                    banco_origen: venta.datos_bancarios.banco_origen,
                    numero_cuenta: venta.datos_bancarios.numero_cuenta,
                    tipo_cuenta: venta.datos_bancarios.tipo_cuenta,
                    titular_cuenta: venta.datos_bancarios.titular_cuenta,
                    observacion: venta.datos_bancarios.observacion || '',
                  };

                  const iddato_transferencia_venta = await new Promise((resolve, reject) => {
                    DatosTransferenciaVenta.create(datosTransferencia, (err, result) => {
                      if (err) return reject(err);
                      resolve(result.insertId);
                    });
                  });

                  // Paso 3: Actualizar la venta con ese ID
                  await new Promise((resolve, reject) => {
                    Venta.updateDatoTransferencia(idventa, iddato_transferencia_venta, (err) => {
                      if (err) return reject(err);
                      resolve();
                    });
                  });
                }

                if (venta.idformapago === 3 && venta.detalle_cheque) {
                  console.log('📌 detalle_cheque recibido:', venta.detalle_cheque);
                  const detalle_cheque_venta = {
                    idventa,
                    banco: venta.detalle_cheque.banco,
                    nro_cheque: venta.detalle_cheque.nro_cheque,
                    monto: venta.detalle_cheque.monto,
                    fecha_emision: venta.detalle_cheque.fecha_emision,
                    fecha_vencimiento: venta.detalle_cheque.fecha_vencimiento || '',
                    titular: venta.detalle_cheque.titular
                  };

                  const iddetalle_cheque_venta = await new Promise((resolve, reject) => {
                    DetalleChequeVenta.create(detalle_cheque_venta, (err, result) => {
                      if (err) return reject(err);
                      resolve(result.insertId);
                    });
                  });

                  // Paso 3: Actualizar la venta con ese ID
                  await new Promise((resolve, reject) => {
                    Venta.updateDetalleCheque(idventa, iddetalle_cheque_venta, (err) => {
                      if (err) return reject(err);
                      resolve();
                    });
                  });
                }

                if (venta.idformapago === 4 && venta.detalle_tarjeta) {
                  const datosTarjeta = {
                    idventa,
                    tipo_tarjeta: venta.detalle_tarjeta.tipo_tarjeta, // 'credito' o 'debito'
                    entidad: venta.detalle_tarjeta.entidad || '',
                    monto: venta.detalle_tarjeta.monto,
                  };

                  const iddetalle_tarjeta_venta = await new Promise((resolve, reject) => {
                    DetalleTarjetaVenta.create(datosTarjeta, (err, result) => {
                      if (err) return reject(err);
                      resolve(result.insertId);
                    });
                  });

                  // Paso 3: Actualizar la venta con ese ID
                  await new Promise((resolve, reject) => {
                    Venta.updateDetalleCheque(idventa, iddetalle_tarjeta_venta, (err) => {
                      if (err) return reject(err);
                      resolve();
                    });
                  });
                }

                try {
                  for (const item of detalles) {
                    const cantidad = parseFloat(item.cantidad);

                    if (sistema_venta_por_lote && item.iddetalle) {
                      const detalle = {
                        idventa,
                        idproducto: item.idproducto,
                        nombre_producto: item.nombre_producto,
                        cantidad,
                        precio_venta: item.precio_venta,
                        precio_compra: item.precio_compra || 0,
                        ganancia: venta.tipo.toLowerCase() === 'credito'
                          ? 0
                          : (parseFloat(item.precio_venta || 0) - parseFloat(item.precio_compra || 0)) * cantidad,
                        sub_total: parseFloat(item.precio_venta || 0) * cantidad,
                        iddetalle_compra: item.iddetalle,
                      };

                      await new Promise((resolve) => {
                        DetalleVenta.create(detalle, () => resolve());
                      });

                      await new Promise((resolve) => {
                        DetalleCompra.restarStockLote(item.iddetalle, item.cantidad, () => resolve());
                      });

                      await new Promise((resolve) => {
                        Producto.restarStock(item.idproducto, item.cantidad, () => resolve());
                      });

                    } else if (!sistema_venta_por_lote) {
                      const resultado = await restarStockDirecto(item.idproducto, cantidad);
                      const totalDescontado = resultado.reduce((acc, r) => acc + r.descontado, 0);

                      if (totalDescontado < cantidad) {
                        return res.status(400).json({ error: `Stock insuficiente para ${item.nombre_producto}` });
                      }

                      for (const afectado of resultado) {
                        const detalle = {
                          idventa,
                          idproducto: item.idproducto,
                          nombre_producto: item.nombre_producto,
                          cantidad: afectado.descontado,
                          precio_venta: item.precio_venta,
                          precio_compra: item.precio_compra || 0,
                          ganancia: venta.tipo.toLowerCase() === 'credito'
                            ? 0
                            : (parseFloat(item.precio_venta || 0) - parseFloat(item.precio_compra || 0)) * afectado.descontado,
                          sub_total: parseFloat(item.precio_venta || 0) * afectado.descontado,
                          iddetalle_compra: afectado.iddetalle,
                        };

                        await new Promise((resolve, reject) => {
                          DetalleVenta.create(detalle, (err) => {
                            if (err) return reject(err);
                            resolve();
                          });
                        });
                      }
                    }
                  }

                  // Luego de procesar todos los detalles:
                  if (venta.tipo.toLowerCase() === 'credito') {
                    DetalleVenta.findByVentaId(idventa, (errDetalles, detallesVenta) => {
                      if (errDetalles) return console.error('❌ Error al obtener detalles para deuda:', errDetalles);

                      const costoEmpresa = detallesVenta.reduce((acc, det) => {
                        return acc + parseFloat(det.precio_compra || 0) * parseFloat(det.cantidad || 0);
                      }, 0);

                      const nuevaDeuda = {
                        idventa,
                        idcliente: venta.idcliente,
                        total_deuda: venta.total,
                        total_pagado: 0,
                        saldo: venta.total,
                        estado: 'pendiente',
                        fecha_deuda: venta.fecha,
                        fecha_pago: null,
                        costo_empresa: costoEmpresa,
                        ganancia_credito: 0,
                      };

                      DeudaVenta.create(nuevaDeuda, (errDeuda) => {
                        if (errDeuda) return console.error('❌ Error al crear deuda_venta:', errDeuda);
                        console.log('✅ Deuda de venta registrada correctamente');
                      });
                    });
                  }

                  // ⚙️ Máximo permitido por tu columna observacion (ajústalo si no es 255)
                  const OBS_MAX = 255;

                  // ✅ Arma un resumen “2x Pan, 1x Leche…”
                  const resumenProductos = detalles
                    .map(item => `${parseFloat(item.cantidad)}x ${item.nombre_producto}`)
                    .join(', ');

                  // ✅ Observación final recortada
                  const observacionFinal = `Venta contado ID ${idventa}: ${resumenProductos}`
                    .slice(0, OBS_MAX);

                  if (venta.tipo.toLowerCase() === 'contado') {
                    const ingresoVentaContado = {
                      idventa: idventa,
                      fecha: venta.fecha,
                      hora: venta.hora || null,
                      monto: venta.total,
                      concepto: `Ingreso por venta contado ID ${idventa}`,
                      idtipo_ingreso: 1,
                      idformapago: venta.idformapago,
                      observacion: observacionFinal,
                      idmovimiento: idmovimiento,
                      creado_por: idusuario || 'sistema',
                    };

                    Ingreso.create(ingresoVentaContado, (errIngreso) => {
                      console.log(ingresoVentaContado)
                      if (errIngreso) console.error('❌ Error al registrar ingreso de contado:', errIngreso);
                      else console.log('✅ Ingreso por venta contado registrado.');
                    });
                  }

                  // Obtener totales IVA y generar factura PDF
                  DetalleVenta.findByVentaId(idventa, (errDetallesVenta, detallesDesdeDB) => {
                    if (errDetallesVenta) {
                      console.error('❌ Error al obtener detalles con IVA:', errDetallesVenta);
                      return res.status(500).json({ error: '❌ Error al obtener detalles de venta' });
                    }

                    Venta.getTotalesIVA(idventa, async (errTotales, totalesIVA) => {
                      if (errTotales) {
                        console.error('❌ Error al obtener IVA:', errTotales);
                        return res.status(500).json({ error: '❌ Error al obtener totales de IVA' });
                      }

                      const formatDate = (date) => {
                        if (!date) return '';
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
                        nro_factura: ventaConDatos.nro_factura,
                        nro_ticket: ventaConDatos.nro_ticket,
                        fecha: venta.fecha,
                        cliente: venta.nombre_cliente,
                        nro_documento: venta.documento_cliente,
                        total: venta.total,
                        totalletras: ventaConDatos.totalletras,
                        subtotal_exento: venta.subtotal_exento || 0,
                        subtotal_iva5: totalesIVA.iva5 || 0,
                        subtotal_iva10: totalesIVA.iva10 || 0,
                        total_iva: totalesIVA.totaliva || 0,
                        logo_base64: venta.logo_base64 || '',
                        detalles: detallesDesdeDB.map((item) => ({
                          nombre_producto: item.nombre_producto,
                          cantidad: item.cantidad,
                          precio_venta: item.precio_venta,
                          sub_total: item.sub_total,
                          iva5: item.iva5 || 0,
                          iva10: item.iva10 || 0,
                        })),
                      };

                      const facturaPDFBase64 = await generarFacturaEmbebida(datosFactura);

                      return res.status(201).json({
                        message: '✅ Venta registrada correctamente',
                        idventa,
                        nro_factura: ventaConDatos.nro_factura,
                        nro_ticket: ventaConDatos.nro_ticket,
                        facturaPDFBase64,
                      });
                    });
                  });
                } catch (error) {
                  console.error('❌ Error procesando detalles:', error);
                  return res.status(500).json({ error: '❌ Error procesando detalles de venta' });
                }
              });

            } catch (error) {
              console.error('❌ Error al validar stock:', error);
              return res.status(500).json({ error: '❌ Error al validar stock por lote' });
            }
          }
        });
      });
    });
  });
};