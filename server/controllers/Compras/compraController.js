import Compra from '../../models/Compra/Compra.js';
import DetalleCompra from '../../models/Compra/DetalleCompra.js';
import MovimientoCaja from '../../models/MovimientoCaja.js';
import DeudaCompra from '../../models/Compra/deudaCompraModel.js';
import ProductoProveedor from '../../models/Producto/ProductoProveedor.js';
import Egreso from '../../models/Movimiento/Egreso.js';
import DetallesTransferenciaCompra from '../../models/Compra/Compras_Contado/DetallesTransferenciaCompra.js';
import DetalleTarjetaCompra from '../../models/Compra/Compras_Contado/DetalleTarjetaCompra.js';
import DetalleChequeCompra from '../../models/Compra/Compras_Contado/DetallesChequeCompra.js';
import { verificarProductosDuplicadosInterno } from '../Producto/productoController.js';
import Producto from '../../models/Producto/Producto.js';

export const createCompra = (req, res) => {

  // 1️⃣ Verificamos que el usuario esté autenticado
  const idusuario = req.user?.idusuario;
  if (!idusuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const { compra, detalles, productosNuevos, isNewProducto = false } = req.body;

  MovimientoCaja.getMovimientoAbierto((err, result) => {
    if (err) return res.status(500).json({ error: '❌ Error al buscar movimiento' });
    if (!result.length) return res.status(400).json({ error: '⚠️ No hay movimiento abierto' });

    const idmovimiento = result[0].idmovimiento;
    const totalCompra = detalles.reduce((acc, item) => {
      const precio = parseFloat(item.precio || 0);
      const cantidad = parseFloat(item.cantidad || 0);
      return acc + (precio * cantidad);
    }, 0);

    const compraConMovimiento = { ...compra, idmovimiento, total: totalCompra, idusuarios: idusuario };

    const productosProcesados = [];
    const erroresProductos = [];

    const procesarProductos = async () => {
      if (isNewProducto) {
        const nombresProductos = productosNuevos.map(p => p.nombre_producto);
        const resultadoDuplicados = await verificarProductosDuplicadosInterno(nombresProductos);

        if (resultadoDuplicados.duplicado) {
          return res.status(400).json({
            error: '❌ Existen productos duplicados.',
            productosDuplicados: resultadoDuplicados.productosDuplicados
          });
        }
      }

      for (const item of detalles) {
        if (String(item.idproducto).startsWith('temp-')) {
          const productoNuevo = productosNuevos.find(p => p.idtemp === item.idproducto);
          if (!productoNuevo) {
            erroresProductos.push({ nombre_producto: 'Producto no encontrado', error: 'No se encontró en productosNuevos' });
            continue;
          }
          console.log('Producto nuevo:', productoNuevo);
          const productoData = {
            nombre_producto: productoNuevo.nombre_producto,
            precio_compra: productoNuevo.precio_compra,
            cod_barra: productoNuevo.cod_barra || null,
            precio_venta: productoNuevo.precio_venta,
            unidad_medida: productoNuevo.unidad_medida,
            iva: productoNuevo.iva,
            //stock: parseFloat(productoNuevo.cantidad) || 0,
            idproveedor: productoNuevo.idproveedor,
            idcategoria: productoNuevo.idcategoria,
            ubicacion: productoNuevo.ubicacion || null
          };

          try {
            const result = await new Promise((resolve, reject) => {
              Producto.create(productoData, (err, result) => {
                if (err) return reject(err);
                resolve(result);
              });
            });

            productosProcesados.push({
              idtemp: item.idproducto,
              idproducto: result.insertId,
              nombre_producto: productoData.nombre_producto,
              unidad_medida: productoData.unidad_medida,
              iva: productoData.iva
            });

          } catch (error) {
            erroresProductos.push({ nombre_producto: productoData.nombre_producto, error: error.message || 'Error desconocido al crear producto' });
          }
        } else {
          productosProcesados.push({
            idtemp: item.idproducto,
            idproducto: item.idproducto,
            nombre_producto: item.nombre_producto,  // Aquí deberías pasar también estos datos desde el cliente
            unidad_medida: item.unidad_medida,
            iva: item.iva
          });
        }
      }

      if (erroresProductos.length > 0) {
        return res.status(400).json({
          error: '❌ Error al crear productos.',
          productosConError: erroresProductos
        });
      }

      crearCompraYDetalles(productosProcesados);
    };


    const crearCompraYDetalles = (productosProcesados) => {
      Compra.create(compraConMovimiento, (err, resultCompra) => {
        if (err) return res.status(500).json({ error: '❌ Error al registrar compra', detalle: err });

        const idcompra = resultCompra.insertId;

        // 💳 Insertar detalle de transferencia si corresponde
        if (compra.idformapago === 2 && compra.detalle_transferencia_compra) {
          const { banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion } = compra.detalle_transferencia_compra;
          const datosTransferencia = {
            idcompra,
            banco_origen,
            numero_cuenta,
            tipo_cuenta,
            titular_cuenta,
            observacion: observacion || ''
          };

          DetallesTransferenciaCompra.create(datosTransferencia, (errInsert, insertResult) => {
            if (errInsert) {
              console.error('❌ Error al insertar detalle transferencia compra:', errInsert);
            } else {
              const iddetalle_transferencia_compra = insertResult.insertId;
              Compra.updateDetalleTransferenciaCompra(idcompra, iddetalle_transferencia_compra, (errUpdate) => {
                if (errUpdate) {
                  console.error('❌ Error al actualizar compra con iddetalle_transferencia_compra:', errUpdate);
                }
              });
            }
          });
        }

        // 💳 Insertar detalle de tarjeta si corresponde
        if (compra.idformapago === 4 && compra.detalle_tarjeta) {
          const { tipo_tarjeta, entidad, monto } = compra.detalle_tarjeta;
          const datosTarjeta = {
            idcompra,
            tipo_tarjeta,
            entidad,
            monto
          };

          DetalleTarjetaCompra.create(datosTarjeta, (errInsert, insertResult) => {
            if (errInsert) {
              console.error('❌ Error al insertar detalle tarjeta compra:', errInsert);
            } else {
              const iddetalle_tarjeta_compra = insertResult.insertId;
              Compra.updateDetalleTarjetaCompra(idcompra, iddetalle_tarjeta_compra, (errUpdate) => {
                if (errUpdate) {
                  console.error('❌ Error al actualizar compra con iddetalle_tarjeta_compra:', errUpdate);
                }
              });
            }
          });
        }

        // 💵 Insertar detalle de cheque si corresponde
        if (compra.idformapago === 3 && compra.detalle_cheque) {
          const { banco, nro_cheque, monto, fecha_emision, fecha_vencimiento, titular, estado } = compra.detalle_cheque;

          const datosCheque = {
            idcompra,
            banco,
            nro_cheque,
            monto,
            fecha_emision,
            fecha_vencimiento,
            titular,
            estado: "activo"
          };

          DetalleChequeCompra.create(datosCheque, (errInsert, insertResult) => {
            if (errInsert) {
              console.error('❌ Error al insertar detalle cheque compra:', errInsert);
            } else {
              const iddetalle_cheque_compra = insertResult.insertId;
              Compra.updateDetalleChequeCompra(idcompra, iddetalle_cheque_compra, (errUpdate) => {
                if (errUpdate) {
                  console.error('❌ Error al actualizar compra con iddetalle_cheque_compra:', errUpdate);
                }
              });
            }
          });
        }
        const resumenProductos = detalles
          .map((item) => {
            const prod = productosProcesados.find(p => p.idtemp === item.idproducto);
            const nombre = prod ? prod.nombre_producto : 'Producto';
            return `${nombre}x ${item.cantidad}`;
          })
          .join(', ');

        // ⚠️ Si tu columna observacion es VARCHAR(255), recorta para no exceder:
        const OBS_MAX = 255;
        const observacionFinal = `Compra ID ${idcompra}: ${resumenProductos}`
          .slice(0, OBS_MAX);
        // 👉 Registrar egreso asociado a esta compra (si es contado)
        if (compra.tipo === 'contado') {
          const egresoCompraContado = {
            idcompra,
            fecha: compra.fecha,
            hora: compra.hora || null,
            monto: compraConMovimiento.total,
            concepto: `Egreso por compra ID ${idcompra}`,
            idtipo_egreso: 1, // Ajustar según tu tabla tipo_egreso si aplica
            idformapago:1,
            observacion: `${observacionFinal}`,
            idmovimiento: idmovimiento,
            creado_por: idusuario || 'sistema',
          };

          Egreso.create(egresoCompraContado, (errEgreso) => {
            if (errEgreso) console.error('❌ Error al registrar egreso por compra:', errEgreso);
            else console.log('✅ Egreso por compra registrado correctamente');
          });
        }

        // 👉 Crear deuda si la compra es a crédito
        if (compra.tipo === 'credito') {
          const deudaData = {
            idcompra,
            idproveedor: compra.idproveedor,
            total: compra.total
          };

          DeudaCompra.create(deudaData, (errDeuda) => {
            if (errDeuda) console.error('❌ Error al registrar deuda de compra:', errDeuda);
            else console.log('✅ Deuda de compra registrada');
          });
        }

        let detallesProcesados = 0;

        detalles.forEach((item) => {
          const productoEncontrado = productosProcesados.find(p => p.idtemp === item.idproducto);
          if (!productoEncontrado) {
            console.error('❌ Producto no encontrado al crear detalle.');
            return;
          }

          const idproductoFinal = productoEncontrado.idproducto;
          const fechaFinal = (!item.fecha_vencimiento || item.fecha_vencimiento.trim() === '') ? null : item.fecha_vencimiento;
          const sub_total = parseFloat(item.precio) * parseFloat(item.cantidad);

          ProductoProveedor.create(idproductoFinal, compra.idproveedor, item.precio, (errVinculo) => {
            if (errVinculo) console.error('❌ Error al vincular producto-proveedor:', errVinculo);

            const detalle = {
              idproducto: idproductoFinal,
              idcompra,
              idproveedor: compra.idproveedor,
              cantidad: item.cantidad,
              precio: item.precio,
              sub_total,
              fecha_vencimiento: fechaFinal,
              nombre_producto: productoEncontrado.nombre_producto,
              unidad_medida: productoEncontrado.unidad_medida,
              stock_restante: item.cantidad,
              iva: productoEncontrado.iva
            };

            if (item.iddetalle) {
              DetalleCompra.aumentarStockLote(item.iddetalle, item.cantidad, (errLote) => {
                if (errLote) console.error('❌ Error al actualizar stock del lote existente:', errLote);

                Producto.aumentarStock(idproductoFinal, item.cantidad, (errStock) => {
                  if (errStock) console.error('❌ Error al actualizar stock del producto:', errStock);
                });

                detallesProcesados++;
                if (detallesProcesados === detalles.length) {
                  res.status(201).json({ message: '✅ Compra registrada correctamente', idcompra });
                }
              });
            } else {
              DetalleCompra.create(detalle, (errDetalle) => {
                if (errDetalle) console.error('❌ Error al insertar detalle:', errDetalle);

                Producto.aumentarStock(idproductoFinal, item.cantidad, (errStock) => {
                  if (errStock) console.error('❌ Error al actualizar stock del producto:', errStock);
                });

                detallesProcesados++;
                if (detallesProcesados === detalles.length) {
                  res.status(201).json({ message: '✅ Compra registrada correctamente', idcompra });
                }
              });
            }
          });
        });
      });
    };

    procesarProductos();
  });
};

export const getResumenComprasDia = (req, res) => {
  Compra.getResumenComprasDelDia((err, result) => {
    if (err) {
      console.error("❌ Error en resumen de compras:", err);
      return res.status(500).json({ error: "Error al obtener resumen de compras" });
    }

    const { totalHoy = 0, totalAyer = 0 } = result[0];
    const variacion = totalAyer === 0 ? 100 : ((totalHoy - totalAyer) / totalAyer) * 100;

    res.json({
      label: "Compras del día",
      totalHoy: parseFloat(totalHoy),
      totalAyer: parseFloat(totalAyer),
      variacion: parseFloat(variacion.toFixed(2))
    });
  });
};

export const getCompras = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  Compra.countFiltered(search, (err, total) => {
    if (err) return res.status(500).json({ error: err });

    Compra.findAllPaginatedFiltered(limit, offset, search, (err, compras) => {
      if (err) return res.status(500).json({ error: err });

      const ids = compras.map((c) => c.idcompra);
      if (ids.length === 0) {
        return res.json({ data: [], totalItems: 0, totalPages: 0, currentPage: page });
      }

      DetalleCompra.findByCompraMultiple(ids, (err, detalles) => {
        if (err) return res.status(500).json({ error: err });

        // Agrupar detalles por idcompra
        const detallesMap = {};
        detalles.forEach((detalle) => {
          if (!detallesMap[detalle.idcompra]) {
            detallesMap[detalle.idcompra] = [];
          }
          detallesMap[detalle.idcompra].push(detalle);
        });

        // Insertar en cada compra
        const comprasConDetalles = compras.map((compra) => ({
          ...compra,
          detalles: detallesMap[compra.idcompra] || []
        }));

        const totalPages = Math.ceil(total / limit);
        res.json({
          data: comprasConDetalles,
          totalItems: total,
          totalPages,
          currentPage: page
        });
      });
    });
  });
};

export const getCompraById = (req, res) => {
  const id = req.params.id;

  Compra.findById(id, (err, compra) => {
    if (err) return res.status(500).json({ error: err });

    DetalleCompra.findByCompra(id, (err, detalles) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        compra: compra[0],
        detalles
      });
    });
  });
};

export const deleteCompra = (req, res) => {
  const idcompra = parseInt(req.params.id, 10);

  // 1️⃣ Obtenemos la compra para saber su tipo
  Compra.findById(idcompra, (errFind, resultsCompra) => {
    if (errFind) return res.status(500).json({ error: '❌ Error al obtener la compra' });
    if (!resultsCompra.length) return res.status(404).json({ error: '❌ No se encontró la compra' });

    const compra = resultsCompra[0];
    // Asumo que el campo se llama 'tipo' y contiene "credito" o "contado"
    if (compra.tipo === 'credito') {
      // 2️⃣ Si es crédito, llamamos al SP y terminamos
      Compra.ejecutarAnulacionCompleta(idcompra, (errSP) => {
        if (errSP) return res.status(500).json({ error: errSP });
        return res.json({ message: '✅ Compra a crédito anulada correctamente' });
      });

    } else {
      // 3️⃣ Si es contado, hacemos la lógica manual de reintegrar stock + soft delete
      DetalleCompra.findByCompraId(idcompra, (err, detalles) => {
        if (err) return res.status(500).json({ error: '❌ Error al obtener detalles de la compra' });
        if (!detalles.length) return res.status(404).json({ error: '❌ No se encontraron detalles para esta compra' });

        let actualizados = 0;
        detalles.forEach((detalle) => {
          // 1. Reintegrar el stock del producto
          Producto.aumentarStock(detalle.idproducto, detalle.cantidad, (errProd) => {
            if (errProd) return res.status(500).json({ error: errProd });

            // 2. Reintegrar el stock del lote si tiene iddetalle
            if (detalle.iddetalle) {
              DetalleCompra.aumentarStockLote(detalle.iddetalle, detalle.cantidad, (errLote) => {
                if (errLote) return res.status(500).json({ error: errLote });
                actualizados++;
                if (actualizados === detalles.length) finalizarAnulacionContado();
              });
            } else {
              actualizados++;
              if (actualizados === detalles.length) finalizarAnulacionContado();
            }
          });
        });

        function finalizarAnulacionContado() {
          // 3. Soft-delete en la tabla compras
          Compra.softDelete(idcompra, (errDelete) => {
            if (errDelete) return res.status(500).json({ error: '❌ Error al anular la compra' });

            // 4. Soft-delete en egresos asociados
            Egreso.softDeleteByCompraId(idcompra, (errEgreso) => {
              if (errEgreso) {
                console.warn('⚠️ Error al anular egreso relacionado:', errEgreso);
              }

              let errores = [];

              // 5. Detalle transferencia compra
              DetallesTransferenciaCompra.softDeleteByCompraId(idcompra, (errTransf) => {
                if (errTransf) {
                  console.error('⚠️ Error al anular detalle de transferencia compra:', errTransf);
                  errores.push('transferencia');
                }

                // 6. Detalle tarjeta compra
                DetalleTarjetaCompra.softDeleteByCompraId(idcompra, (errTarj) => {
                  if (errTarj) {
                    console.error('⚠️ Error al anular detalle de tarjeta compra:', errTarj);
                    errores.push('tarjeta');
                  }

                  // 7. Detalle cheque compra
                  DetalleChequeCompra.softDeleteByCompraId(idcompra, (errCheq) => {
                    if (errCheq) {
                      console.error('⚠️ Error al anular detalle de cheque compra:', errCheq);
                      errores.push('cheque');
                    }

                    // 8. Respondemos
                    if (errores.length > 0) {
                      return res.status(200).json({
                        message: '✅ Compra contado anulada y stock restaurado, pero hubo errores en asociados',
                        errores
                      });
                    }

                    return res.json({
                      message: '✅ Compra contado anulada, stock restaurado y asociados anulados'
                    });
                  });
                });
              });
            });
          });
        }
      });
    }
  });
};