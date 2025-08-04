// controllers/Ventas/deudaVentaController.js
import DeudaVenta from '../../models/Venta/DeudaVenta.js';
import DetallePagoDeudaVenta from '../../models/Venta/DetallePagoDeudaVenta.js';
import Ingreso from '../../models/Movimiento/Ingreso.js';
import Facturador from '../../models/facturadorModel.js';
import Cliente from '../../models/Cliente.js';
import DetalleTransferenciaCobro from '../../models/Venta/Venta_Credito/DetalleTransferenciaCobro.js';
import { generarComprobantePagoDeuda } from '../../report/reportComprobantePagoDeuda.js';
import DetalleTarjetaVentaCobro from '../../models/Venta/Venta_Credito/DetalleTarjetaVentaCobro.js';
import { generarReporteDeudasporCliente } from '../../report/reportVentasporCliente.js';
import DetalleChequeVentaCobro from '../../models/Venta/Venta_Credito/DetalleChequeVentaCobro.js';
import { generarReportePagosCliente } from '../../report/reportPagosCliente.js';
import MovimientoCaja from '../../models/MovimientoCaja.js';
import db from '../../db.js';

export const pagarDeuda = (req, res) => {
    const { iddeuda, monto, observacion, idformapago, creado_por } = req.body;

    const idusuario = req.user?.idusuario;
    if (!idusuario) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!iddeuda || !monto || isNaN(monto)) {
        return res.status(400).json({ error: '❌ Datos inválidos para el pago.' });
    }

    const saldoQuery = `SELECT saldo, total_pagado, total_deuda FROM deuda_venta WHERE iddeuda = ?`;
    db.query(saldoQuery, [iddeuda], (errSaldo, rows) => {
        if (errSaldo) {
            console.error('❌ Error al consultar el saldo de la deuda:', errSaldo);
            return res.status(500).json({ error: '❌ Error al consultar el saldo de la deuda.' });
        }

        if (!rows.length) return res.status(404).json({ error: '❌ Deuda no encontrada.' });

        const saldoActual = parseFloat(rows[0].saldo);
        const montoRecibido = parseFloat(monto);
        const totalDeuda = parseFloat(rows[0].total_deuda);
        const totalPagadoAnterior = parseFloat(rows[0].total_pagado);
        const montoAplicado = montoRecibido > saldoActual ? saldoActual : montoRecibido;
        const totalPagadoNuevo = totalPagadoAnterior + montoAplicado;
        const vuelto = montoRecibido > saldoActual ? montoRecibido - saldoActual : 0;
        const saldoRestante = saldoActual - montoAplicado;

        const nuevoPago = {
            iddeuda,
            total_deuda: totalDeuda,
            total_pagado: totalPagadoNuevo,
            saldo: saldoRestante,
            monto_pagado: montoAplicado,
            fecha_pago: new Date(),
            observacion: observacion || '',
            idformapago: idformapago || 'Desconocido',
            creado_por: idusuario || 'sistema'
        };

        DetallePagoDeudaVenta.create(nuevoPago, (errPago, resultPago) => {
            if (errPago) {
                console.error('❌ Error al registrar el detalle del pago:', errPago);
                return res.status(500).json({ error: '❌ Error al registrar el detalle del pago.' });
            }

            const idpago_deuda = resultPago.insertId;
            DeudaVenta.registrarPago(iddeuda, montoAplicado, (errUpdate) => {
                if (errUpdate) {
                    console.error('❌ Error al actualizar la deuda:', errUpdate);
                    return res.status(500).json({ error: '❌ Error al actualizar la deuda.' });
                }

                MovimientoCaja.getMovimientoAbierto((errMov, movResult) => {
                    if (errMov || !movResult.length) {
                        console.error('❌ Error al obtener movimiento de caja para ingreso:', errMov);
                        return res.status(500).json({ error: '❌ Error al registrar ingreso en caja.' });
                    }

                    const idmovimiento = movResult[0].idmovimiento;
                    const nuevoIngreso = {
                        fecha: new Date(),
                        hora: null,
                        monto: montoAplicado,
                        concepto: `Cobro de deuda de venta ID ${iddeuda}`,
                        idtipo_ingreso: 2,
                        idformapago,
                        observacion: observacion || '',
                        idmovimiento,
                        creado_por: idusuario || 'sistema',
                        idpago_deuda
                    };

                    Ingreso.create(nuevoIngreso, (errIngreso, resultIngreso) => {
                        if (errIngreso) {
                            console.error('❌ Error al registrar ingreso:', errIngreso);
                            return res.status(500).json({ error: '❌ Error al registrar ingreso.' });
                        }

                        const idingreso = resultIngreso.insertId;

                        // Detalle de transferencia
                        if (idformapago === 2 && req.body.detalle_transferencia) {
                            const { banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion } = req.body.detalle_transferencia;
                            const datosTransferencia = { idingreso, banco_origen, numero_cuenta, tipo_cuenta, titular_cuenta, observacion };
                            DetalleTransferenciaCobro.create(datosTransferencia, (errInsert, insertResult) => {
                                if (errInsert) console.error('❌ Error al insertar detalle transferencia cobro:', errInsert);
                                else {
                                    const iddetalle_transferencia_cobro = insertResult.insertId;
                                    DetallePagoDeudaVenta.updateTransferenciaId(idpago_deuda, iddetalle_transferencia_cobro, (errUpdate) => {
                                        if (errUpdate) console.error('❌ Error al actualizar detalle_pago_deuda_venta con iddetalle_transferencia_cobro:', errUpdate);
                                    });

                                    Ingreso.updateTransferenciaId(idingreso, iddetalle_transferencia_cobro, (errUpdate) => {
                                        if (errUpdate) console.error('❌ Error al actualizar ingreso con iddetalle_transferencia_cobro:', errUpdate);
                                    });
                                }
                            });
                        }

                        // Detalle de tarjeta
                        if (idformapago === 4 && req.body.detalle_tarjeta_venta_credito) {
                            const { tipo_tarjeta, entidad, monto, observacion } = req.body.detalle_tarjeta_venta_credito;
                            const datosTarjeta = { idingreso, tipo_tarjeta, entidad, monto, observacion };
                            DetalleTarjetaVentaCobro.create(datosTarjeta, (errInsert, insertResult) => {
                                if (errInsert) console.error('❌ Error al insertar detalle tarjeta venta cobro:', errInsert);
                                else {
                                    const iddetalle_tarjeta_venta_cobro = insertResult.insertId;

                                    DetallePagoDeudaVenta.updateTarjetasId(idpago_deuda, iddetalle_tarjeta_venta_cobro, (errUpdate) => {
                                        if (errUpdate) console.error('❌ Error al actualizar detalle_pago_deuda_venta con iddetalle_tarjeta_venta_cobro:', errUpdate);
                                    });
                                    Ingreso.updateTarjetasId(idingreso, iddetalle_tarjeta_venta_cobro, (errUpdate) => {
                                        if (errUpdate) console.error('❌ Error al actualizar ingreso con iddetalle_tarjeta_venta_cobro:', errUpdate);
                                    });
                                }
                            });
                        }

                        // Detalle de cheque
                        if (idformapago === 3 && req.body.detalle_cheque_venta_cobro) {
                            const { banco, nro_cheque, monto, fecha_emision, fecha_vencimiento, titular, estado } = req.body.detalle_cheque_venta_cobro;
                            const datosCheque = {
                                idingreso,
                                banco,
                                nro_cheque,
                                monto,
                                fecha_emision,
                                fecha_vencimiento,
                                titular,
                                estado: estado || 'pendiente'
                            };
                            DetalleChequeVentaCobro.create(datosCheque, (errInsert, insertResult) => {
                                if (errInsert) {
                                    console.error('❌ Error al insertar detalle cheque venta cobro:', errInsert);
                                } else {
                                    const iddetalle_cheque_venta_cobro = insertResult.insertId;

                                    DetallePagoDeudaVenta.updateChequeId(idpago_deuda, iddetalle_cheque_venta_cobro, (errUpdate) => {
                                        if (errUpdate) console.error('❌ Error al actualizar detalle_pago_deuda_venta con iddetalle_cheque_venta_cobro:', errUpdate);
                                    });
                                    Ingreso.updateChequeId(idingreso, iddetalle_cheque_venta_cobro, (errUpdate) => {
                                        if (errUpdate) {
                                            console.error('❌ Error al actualizar ingreso con iddetalle_cheque_venta_cobro:', errUpdate);
                                        }
                                    });
                                }
                            });
                        }
                        Facturador.findActivo((errFact, factResult) => {
                            if (errFact || !factResult.length) {
                                console.warn('⚠️ No se encontró facturador activo');
                                return res.status(200).json({
                                    message: '✅ Pago de deuda registrado correctamente.',
                                    idingreso,
                                    montoAplicado,
                                    vuelto,
                                    empresa: null,
                                    cliente: null,
                                    productos: [],
                                    saldo_restante: null,
                                    total_pagado_actual: null
                                });
                            }

                            const facturador = factResult[0];

                            const formatDate = (date) => {
                                if (!date) return '';
                                const d = new Date(date);
                                const day = String(d.getDate()).padStart(2, '0');
                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                const year = d.getFullYear();
                                return `${day}/${month}/${year}`;
                            };

                            const empresa = {
                                nombre_fantasia: facturador.nombre_fantasia,
                                ruc: facturador.ruc,
                                timbrado_nro: facturador.timbrado_nro,
                                fecha_inicio_vigente: formatDate(facturador.fecha_inicio_vigente),
                                fecha_fin_vigente: formatDate(facturador.fecha_fin_vigente),
                                fecha_emision: formatDate(new Date())
                            };

                            // 🔎 Traer datos del cliente y la venta asociada
                            const clienteQuery = `
                                SELECT c.nombre, c.apellido, c.numDocumento, c.telefono, d.idventa
                                FROM deuda_venta d
                                JOIN clientes c ON d.idcliente = c.idcliente
                                WHERE d.iddeuda = ?
                            `;

                            db.query(clienteQuery, [iddeuda], (errCliente, clienteRows) => {
                                if (errCliente) {
                                    console.error('❌ Error al obtener datos del cliente:', errCliente);
                                    return res.status(500).json({ error: '❌ Error al obtener datos del cliente.' });
                                }

                                const cliente = clienteRows[0] || null;
                                if (!cliente?.idventa) {
                                    return res.status(404).json({ error: '❌ No se encontró venta asociada a la deuda.' });
                                }

                                const idventa = cliente.idventa;

                                // 🔎 Traer productos relacionados a la venta
                                const productosQuery = `
                                    SELECT 
                                        dv.nombre_producto,
                                        dv.cantidad,
                                        dv.precio_venta,
                                        dv.sub_total,
                                        p.unidad_medida,
                                        p.cod_barra
                                    FROM detalle_venta dv
                                    JOIN productos p ON dv.idproducto = p.idproducto
                                    WHERE dv.idventa = ?
                                `;

                                db.query(productosQuery, [idventa], (errProductos, productosRows) => {
                                    if (errProductos) {
                                        console.error('❌ Error al obtener productos de la venta:', errProductos);
                                        return res.status(500).json({ error: '❌ Error al obtener productos de la venta.' });
                                    }

                                    // 🔄 Traer deuda actualizada
                                    const deudaQuery = `SELECT saldo, total_pagado, total_deuda  FROM deuda_venta WHERE iddeuda = ?`;
                                    db.query(deudaQuery, [iddeuda], (errDeuda, deudaRows) => {
                                        if (errDeuda) {
                                            console.error('❌ Error al obtener datos actualizados de la deuda:', errDeuda);
                                            return res.status(500).json({ error: '❌ Error al obtener el estado actual de la deuda.' });
                                        }

                                        const deudaActualizada = deudaRows[0] || { saldo: 0, total_pagado: 0, total_deuda: 0 };

                                        const datosComprobante = {
                                            empresa,
                                            cliente: {
                                                nombre: cliente.nombre,
                                                apellido: cliente.apellido,
                                                numDocumento: cliente.numDocumento,
                                                telefono: cliente.telefono
                                            },
                                            productos: productosRows,
                                            montoAplicado,
                                            vuelto,
                                            saldo_restante: parseFloat(deudaActualizada.saldo),
                                            total_pagado_actual: parseFloat(deudaActualizada.total_pagado),
                                            total_deuda: parseFloat(deudaActualizada.total_deuda),
                                            fecha_pago: new Date(),
                                            idingreso,
                                            iddeuda
                                        };

                                        generarComprobantePagoDeuda(datosComprobante)
                                            .then((comprobanteBase64) => {
                                                return res.status(200).json({
                                                    message: '✅ Pago de deuda registrado correctamente.',
                                                    comprobanteBase64,
                                                    ...datosComprobante
                                                });
                                            })
                                            .catch((error) => {
                                                console.error('❌ Error al generar el comprobante de pago:', error);
                                                return res.status(500).json({
                                                    error: '❌ Pago realizado, pero ocurrió un error al generar el comprobante.'
                                                });
                                            });

                                        /* return res.json({
                                             //Respuesta si no queremos enviar el comprobante en la respuesta
                                             message: '✅ Pago de deuda registrado correctamente.',
                                             idingreso,
                                             montoAplicado,
                                             vuelto,
                                             saldo_restante: parseFloat(deudaActualizada.saldo),
                                             total_pagado_actual: parseFloat(deudaActualizada.total_pagado),
                                             total_deuda: parseFloat(deudaActualizada.total_deuda),
                                             empresa,
                                             cliente: {
                                                 nombre: cliente.nombre,
                                                 apellido: cliente.apellido,
                                                 numDocumento: cliente.numDocumento,
                                                 telefono: cliente.telefono
                                             },
                                             productos: productosRows
                                         });
                                         */

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

export const getComprobantePagoDeuda = (req, res) => {
    const { idpago_deuda } = req.params;
    if (!idpago_deuda) return res.status(400).json({ error: 'Falta idpago_deuda' });



    DetallePagoDeudaVenta.getPagoById(idpago_deuda, (errPago, pago) => {
        if (errPago) return res.status(500).json({ error: errPago });
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
        if (!pago.idventa) return res.status(400).json({ error: 'No existe venta asociada a la deuda.' });

        const formatDDMMYYYY = (value) => {
            if (!value) return "";
            const d = value instanceof Date ? value : new Date(value);
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        const fechaPagoFormat = formatDDMMYYYY(pago.fecha_pago)
        Facturador.findActivo((errFact, factResult) => {
            if (errFact) return res.status(500).json({ error: 'Error obteniendo datos de empresa' });

            const fact = factResult?.[0] || {};
            const empresa = {
                nombre_fantasia: fact.nombre_fantasia,
                ruc: fact.ruc,
                timbrado_nro: fact.timbrado_nro,
                fecha_inicio_vigente: formatDDMMYYYY(fact.fecha_inicio_vigente),
                fecha_fin_vigente: formatDDMMYYYY(fact.fecha_fin_vigente),
                fecha_emision: fechaPagoFormat, // setéala si querés
            };

            const cliente = {
                nombre: pago.nombre,
                apellido: pago.apellido,
                numDocumento: pago.numDocumento,
                telefono: pago.telefono,
            };

            DetallePagoDeudaVenta.getTotalPagadoActual(pago.iddeuda, (errTot, total_pagado_actual) => {
                if (errTot) return res.status(500).json({ error: errTot });

                const total_deuda = parseFloat(pago.total_deuda);
                const montoAplicado = parseFloat(pago.monto_pagado);
                const saldo_restante = parseFloat(pago.saldo);
                const vuelto = 0;

                const productosQuery = `
          SELECT 
            dv.nombre_producto,
            dv.cantidad,
            dv.precio_venta,
            dv.sub_total,
            p.unidad_medida,
            p.cod_barra
          FROM detalle_venta dv
          LEFT JOIN productos p ON dv.idproducto = p.idproducto
          WHERE dv.idventa = ?
        `;

                db.query(productosQuery, [pago.idventa], (errProd, productosRows) => {
                    if (errProd) return res.status(500).json({ error: 'Error al obtener productos de la venta.' });
                    if (!productosRows.length) return res.status(404).json({ error: 'No se encontraron productos para la venta.' });

                    const datosComprobante = {
                        empresa,
                        cliente,
                        productos: productosRows,
                        montoAplicado,
                        vuelto,
                        saldo_restante,
                        total_pagado_actual: parseFloat(total_pagado_actual || 0),
                        total_deuda,
                        fecha_pago: fechaPagoFormat,
                        iddeuda: pago.iddeuda,
                        idpago_deuda
                    };

                    generarComprobantePagoDeuda(datosComprobante)
                        .then((comprobanteBase64) => {
                            res.status(200).json({
                                message: '✅ Pago de deuda registrado correctamente.',
                                comprobanteBase64,
                                ...datosComprobante
                            });
                        })
                        .catch((error) => {
                            console.error('❌ Error al generar el comprobante de pago:', error);
                            res.status(500).json({
                                error: '❌ Pago realizado, pero ocurrió un error al generar el comprobante.'
                            });
                        });
                });
            });
        });
    });
};

export const getPagosDeudaDetalle = (req, res) => {
    const iddeuda = req.params.iddeuda;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const search = req.query.search || '';
    let fecha_inicio = req.query.fecha_inicio || '1900-01-01';
    let fecha_fin = req.query.fecha_fin || '2100-01-01';

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
        [fecha_inicio, fecha_fin] = [fecha_fin, fecha_inicio];
    }
    const fechaFinCompleta = `${fecha_fin} 23:59:59`;

    // 1) Traer cliente
    DetallePagoDeudaVenta.getClienteByDeuda(iddeuda, (errCli, cliente) => {
        if (errCli) return res.status(500).json({ error: errCli });

        // 2) Traer facturador activo (empresa)
        Facturador.findActivo((errFact, factRows) => {
            if (errFact || !factRows?.length) {
                return res.status(400).json({ error: '⚠️ No hay facturador activo disponible' });
            }
            const f = factRows[0];
            const empresa = {
                nombre_fantasia: f.nombre_fantasia,
                ruc: f.ruc,
                timbrado_nro: f.timbrado_nro,
                fecha_inicio_vigente: f.fecha_inicio_vigente,
                fecha_fin_vigente: f.fecha_fin_vigente,
            };

            // 3) Conteo
            DetallePagoDeudaVenta.countByDeudaFiltered(
                iddeuda,
                search,
                fecha_inicio,
                fechaFinCompleta,
                (errCount, total) => {
                    if (errCount) return res.status(500).json({ error: errCount });

                    // 4) Datos paginados
                    DetallePagoDeudaVenta.findByDeudaPaginated(
                        iddeuda,
                        limit,
                        offset,
                        search,
                        fecha_inicio,
                        fechaFinCompleta,
                        (err, data) => {
                            if (err) return res.status(500).json({ error: err });

                            const totalPages = Math.ceil(total / limit);

                            res.json({
                                empresa,   // 👈 objeto plano de empresa/facturador
                                cliente,   // 👈 objeto plano de cliente
                                data,      // pagos
                                totalItems: total,
                                totalPages,
                                currentPage: page,
                            });
                        }
                    );
                }
            );
        });
    });
};



export const getAllPagosDeudaDetalle = (req, res) => {
    const iddeuda = req.params.iddeuda;
    const search = req.query.search || '';
    let fecha_inicio = req.query.fecha_inicio || '1900-01-01';
    let fecha_fin = req.query.fecha_fin || '2100-01-01';

    // Validar fechas
    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
        const temp = fecha_inicio;
        fecha_inicio = fecha_fin;
        fecha_fin = temp;
    }

    const fechaFinCompleta = `${fecha_fin} 23:59:59`;

    // Paso 1: buscar los pagos por deuda
    DetallePagoDeudaVenta.getAllByDeudaFiltered(
        iddeuda,
        search,
        fecha_inicio,
        fechaFinCompleta,
        (err, pagos) => {
            if (err) return res.status(500).json({ error: err });

            // Paso 2: buscar deuda_venta para obtener idcliente
            DeudaVenta.findById(iddeuda, (errDeuda, deudaData) => {
                if (errDeuda || !deudaData) {
                    return res.status(404).json({ error: '⚠️ No se encontró la deuda asociada.' });
                }

                const idcliente = deudaData.idcliente;

                // Paso 3: buscar datos del cliente
                Cliente.findById(idcliente, (errCliente, clienteData) => {
                    if (errCliente || !clienteData) {
                        return res.status(404).json({ error: '⚠️ No se encontró el cliente asociado.' });
                    }

                    const data = Array.isArray(clienteData) ? clienteData[0] : clienteData;
                    const cliente = {
                        nombre: data.nombre,
                        apellido: data.apellido,
                        numDocumento: data.numDocumento,
                        telefono: data.telefono
                    };

                    // Paso 4: buscar facturador
                    Facturador.findActivo((errFact, factResult) => {
                        if (errFact || !factResult.length) {
                            return res.status(400).json({ error: '⚠️ No se encontró facturador activo' });
                        }

                        const facturador = factResult[0];

                        const formatDate = (date) => {
                            if (!date) return '';
                            const d = new Date(date);
                            const day = String(d.getDate()).padStart(2, '0');
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const year = d.getFullYear();
                            return `${day}/${month}/${year}`;
                        };

                        const empresas = {
                            nombre_fantasia: facturador.nombre_fantasia,
                            ruc: facturador.ruc,
                            timbrado_nro: facturador.timbrado_nro,
                            fecha_inicio_vigente: formatDate(facturador.fecha_inicio_vigente),
                            fecha_fin_vigente: formatDate(facturador.fecha_fin_vigente),
                            fecha_emision: formatDate(new Date())
                        };

                        // 👉 Formatear los pagos para el reporte
                        const detalle_pagos = pagos.map(p => {
                            const detalles = [];

                            if (p.idformapago === 1) {
                                detalles.push({ label: 'Forma de Pago', value: 'Efectivo' });
                            } else if (p.idformapago === 2) {
                                detalles.push({ label: 'Forma de Pago', value: 'Transferencia Bancaria' });
                                detalles.push({ label: 'Banco Origen', value: p.transferencia_banco_origen || '-' });
                                detalles.push({ label: 'Número de Cuenta', value: p.transferencia_numero_cuenta || '-' });
                                detalles.push({ label: 'Tipo de Cuenta', value: p.transferencia_tipo_cuenta || '-' });
                                detalles.push({ label: 'Titular de la Cuenta', value: p.transferencia_titular_cuenta || '-' });
                                detalles.push({ label: 'Observación', value: p.transferencia_observacion || '-' });
                            } else if (p.idformapago === 3) {
                                detalles.push({ label: 'Forma de Pago', value: 'Cheque' });
                                detalles.push({ label: 'Banco', value: p.cheque_banco || '-' });
                                detalles.push({ label: 'N° Cheque', value: p.cheque_nro_cheque || '-' });
                                detalles.push({ label: 'Fecha Emisión', value: p.cheque_fecha_emision || '-' });
                                detalles.push({ label: 'Fecha Vencimiento', value: p.cheque_fecha_vencimiento || '-' });
                                detalles.push({ label: 'Titular', value: p.cheque_titular || '-' });
                                detalles.push({ label: 'Estado', value: p.cheque_estado || '-' });
                            } else if (p.idformapago === 4) {
                                detalles.push({ label: 'Forma de Pago', value: 'Tarjeta C/D' });
                                detalles.push({ label: 'Tipo de Tarjeta', value: p.tarjeta_tipo_tarjeta || '-' });
                                detalles.push({ label: 'Entidad', value: p.tarjeta_entidad || '-' });
                                detalles.push({ label: 'Monto', value: p.tarjeta_monto || '-' });
                                detalles.push({ label: 'Observación', value: p.tarjeta_observacion || '-' });
                            } else {
                                detalles.push({ label: 'Forma de Pago', value: 'No especificado' });
                            }

                            return {
                                fecha_pago: formatDate(p.fecha_pago),
                                monto_pagado: p.monto_pagado,
                                observacion: p.observacion,
                                detalles
                            };
                        });
                        // 🚀 Generar reporte con helper
                        const datosReporte = {
                            detalle_pagos,
                            cliente,
                            empresas,
                        };


                        generarReportePagosCliente(datosReporte)
                            .then((comprobanteBase64) => {
                                return res.status(200).json({
                                    message: '✅ Pago de deuda registrado correctamente.',
                                    comprobanteBase64,
                                    ...datosReporte
                                });
                            })
                            .catch((error) => {
                                console.error('❌ Error al generar el comprobante de pago:', error);
                                return res.status(500).json({
                                    error: '❌ Pago realizado, pero ocurrió un error al generar el comprobante.'
                                });
                            });

                    });
                });
            });
        }
    );
};


export const listarDeudas = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const estado = req.query.estado || ''; // nuevo filtro

    DeudaVenta.countFiltered(search, estado, (err, total) => {
        if (err) return res.status(500).json({ error: err });

        DeudaVenta.findAllPaginatedFiltered(limit, offset, search, estado, (err, data) => {
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

export const listarDeudasCompleto = (req, res) => {
    const numDocumento = req.query.numDocumento || '';
    const estado = req.query.estado || '';

    if (!numDocumento) {
        return res.status(400).json({ error: 'El campo numDocumento es requerido.' });
    }

    DeudaVenta.getAllByNumDocumentoAndEstado(numDocumento, estado, (err, data) => {
        if (err) return res.status(500).json({ error: err });

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No se encontraron deudas para el cliente.' });
        }

        Facturador.findActivo((errFact, factResult) => {
            if (errFact || !factResult.length) {
                return res.status(400).json({ error: '⚠️ No se encontró facturador activo' });
            }

            const facturador = factResult[0];

            const formatDate = (date) => {
                if (!date) return '';
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            };

            const fecha_emision = formatDate(new Date());
            const fecha_generada = new Date().toLocaleDateString("es-PY", { day: "2-digit", month: "2-digit", year: "numeric" });

            const cliente = {
                nombre_cliente: data[0].nombre_cliente,
                numDocumento: data[0].numDocumento
            };

            const deudas = data.map((d) => {
                const { nombre_cliente, numDocumento, ...rest } = d;
                return {
                    ...rest,
                    fecha_deuda: formatDate(d.fecha_deuda),
                    ult_fecha_pago: d.ult_fecha_pago ? formatDate(d.ult_fecha_pago) : "--",
                    created_at: formatDate(d.created_at)
                };
            });

            const empresa = {
                nombre_fantasia: facturador.nombre_fantasia,
                ruc: facturador.ruc,
                timbrado_nro: facturador.timbrado_nro,
                fecha_inicio_vigente: formatDate(facturador.fecha_inicio_vigente),
                fecha_fin_vigente: formatDate(facturador.fecha_fin_vigente),
                fecha_emision
            };

            const datosReporte = {
                fecha_generada,
                empresa,
                cliente,
                deudas,
                debe_total: deudas.reduce((sum, d) => sum + parseFloat(d.total_deuda), 0).toFixed(2),
                saldo_total: deudas.reduce((sum, d) => sum + parseFloat(d.saldo), 0).toFixed(2),
                pagado_total: deudas.reduce((sum, d) => sum + parseFloat(d.total_pagado), 0).toFixed(2)
            };

            console.log('📄 Datos del reporte de deudas:', datosReporte);

            generarReporteDeudasporCliente(datosReporte)
                .then((reportePDFBase64) => {
                    res.status(200).json({
                        message: '✅ Reporte generado correctamente',
                        reportePDFBase64,
                        datosReporte
                    });
                })
                .catch((error) => {
                    console.error('❌ Error al generar el reporte PDF:', error);
                    res.status(500).json({ error: '❌ Error al generar el reporte PDF' });
                });
        });
    });
};

export const listarDeudasAgrupadasPorCliente = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    DeudaVenta.countFilteredByCliente(search, (err, total) => {
        if (err) return res.status(500).json({ error: err });

        DeudaVenta.findAllPaginatedFilteredByCliente(limit, offset, search, (err, data) => {
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

export const listarDeudasAgrupadasPorClienteSinPaginar = (req, res) => {
    const search = req.query.search || '';

    DeudaVenta.findAllFilteredByCliente(search, (err, data) => {
        if (err) return res.status(500).json({ error: err });

        // ▸ Agregados globales
        const totals = data.reduce(
            (acc, row) => {
                acc.itemsPendientes += row.items_pendientes;
                acc.totalDeuda += Number(row.total_deuda);
                acc.saldo += Number(row.saldo);
                return acc;
            },
            { itemsPendientes: 0, totalDeuda: 0, saldo: 0 }
        );

        res.json({
            data,
            totalItems: data.length,
            totals                 // ← nuevo bloque
        });
    });
};

export const anularPagoDeuda = (req, res) => {
    const { idpago_deuda } = req.params;

    if (!idpago_deuda) {
        return res.status(400).json({ error: '❌ ID de pago no proporcionado.' });
    }

    // 1. Obtener datos del pago que se va a anular
    const pagoQuery = `SELECT * FROM detalle_pago_deuda_venta WHERE idpago_deuda = ? AND deleted_at IS NULL`;
    db.query(pagoQuery, [idpago_deuda], (err, results) => {
        if (err) return res.status(500).json({ error: '❌ Error al buscar el pago.' });
        if (results.length === 0) return res.status(404).json({ error: '❌ Pago no encontrado o ya anulado.' });

        const pago = results[0];
        const montoAnulado = parseFloat(pago.monto_pagado);
        const iddeuda = pago.iddeuda;

        // 2. Anular el pago (soft delete)
        DetallePagoDeudaVenta.anularPago(idpago_deuda, (errAnular) => {
            if (errAnular) return res.status(500).json({ error: '❌ Error al anular el pago.' });

            // 3. Actualizar deuda
            const updateDeudaQuery = `
        UPDATE deuda_venta
        SET
          total_pagado = total_pagado - ?,
          saldo = saldo + ?,
          ganancia_credito = total_pagado - costo_empresa,
          estado = 'pendiente',
          updated_at = NOW()
        WHERE iddeuda = ?
      `;
            db.query(updateDeudaQuery, [montoAnulado, montoAnulado, iddeuda], (errUpdate) => {
                if (errUpdate) return res.status(500).json({ error: '❌ Error al actualizar la deuda.' });

                // 4. Buscar el ingreso relacionado
                const ingresoQuery = `SELECT idingreso FROM ingresos WHERE idpago_deuda = ? AND deleted_at IS NULL`;
                db.query(ingresoQuery, [idpago_deuda], (errIngresoSelect, ingresoResult) => {
                    if (errIngresoSelect) {
                        console.warn('⚠️ Error al buscar ingreso relacionado:', errIngresoSelect);
                        return res.status(200).json({ message: '✅ Pago anulado, pero no se pudo encontrar ingreso para eliminar transferencias, tarjetas o cheques.' });
                    }

                    const idingreso = ingresoResult[0]?.idingreso;

                    // 5. Soft delete del ingreso
                    Ingreso.softDeleteByPagoDeudaId(idpago_deuda, (errIngreso) => {
                        if (errIngreso) {
                            console.warn('⚠️ Error al anular ingreso relacionado:', errIngreso);
                        }

                        if (idingreso) {
                            // 6. Soft delete del detalle de transferencia
                            DetalleTransferenciaCobro.softDeleteByIngresoId(idingreso, (errDeleteTransfer) => {
                                if (errDeleteTransfer) {
                                    console.warn('⚠️ Error al anular detalle de transferencia:', errDeleteTransfer);
                                }

                                // 7. Soft delete del detalle de tarjeta
                                DetalleTarjetaVentaCobro.softDeleteByIngresoId(idingreso, (errDeleteTarjeta) => {
                                    if (errDeleteTarjeta) {
                                        console.warn('⚠️ Error al anular detalle de tarjeta:', errDeleteTarjeta);
                                    }

                                    // 8. Soft delete del detalle de cheque
                                    DetalleChequeVentaCobro.softDeleteByIngresoId(idingreso, (errDeleteCheque) => {
                                        if (errDeleteCheque) {
                                            console.warn('⚠️ Error al anular detalle de cheque:', errDeleteCheque);
                                        }

                                        return res.status(200).json({
                                            message: '✅ Pago anulado y registros actualizados correctamente.'
                                        });
                                    });
                                });
                            });
                        } else {
                            return res.status(200).json({
                                message: '✅ Pago anulado y registros actualizados correctamente (sin detalle de transferencia, tarjeta ni cheque).'
                            });
                        }
                    });
                });
            });
        });
    });
};