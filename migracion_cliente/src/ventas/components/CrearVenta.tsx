'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import FormVenta from './CrearVenta/FormVenta';
import DetallesProductos from './CrearVenta/DetallesProductos';
import TotalVenta from './CrearVenta/TotalVenta';
import BotonesAcciones from './CrearVenta/BotonesAcciones';
import ModalSeleccionarLote from './ModalsVenta/ModalSeleccionarLote';
import ModalAdvert from '../../components/ModalAdvert';
import ModalSeleccionarProducto from '../../compras/components/Modals/ModalSeleccionarProducto';
import ModalSeleccionarCliente from './ModalsVenta/ModalSeleccionarCliente';
import ModalConfirmarProductos from '../../compras/components/CompraRapida/ModalsCompraRapida/ModalConfirmarProductos';
import ModalComprobante from '../../compras/components/CompraRapida/ModalsCompraRapida/ModalComprobante';
import ModalError from '../../components/ModalError';
import { crearVenta, obtenerConfiguracionVenta, validarVencimientoPorLote, validarVencimientoSimulado } from '../../services/ventas';

interface CrearVentaProps {
    onSuccess?: () => void;
}

const fechaActual = new Date();
const fechaParaguay = new Date(fechaActual.getTime() - fechaActual.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];


const initialVenta = {
    idcliente: '',
    fecha: fechaParaguay,
    tipo: 'contado',
    tipo_comprobante: 'T',  
    nro_factura: '',       
    estado: 'pagado',
    descuento: 0,
    observacion: '',
    idformapago: 1, 
    datos_bancarios: null, 
    fecha_vencimiento: ''
};

const CrearVenta = ({ onSuccess }: CrearVentaProps) => {
    const [showProductoModal, setShowProductoModal] = useState(false);

    const [advertModalOpen, setAdvertModalOpen] = useState(false);
    const [advertMessage, setAdvertMessage] = useState('');

    const [showClienteModal, setShowClienteModal] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [showLoteModal, setShowLoteModal] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorProductos, setErrorProductos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [cantidadProducto, setCantidadProducto] = useState(1);
    const [cantidadMaximo, setCantidadMaximo] = useState(0);
    const [configVentaPorLote, setConfigVentaPorLote] = useState<boolean>(false);
    const [configventaFechaVencimiento, setConfigVentaFechaVencimiento] = useState<boolean>(false);
    const [lotesProducto, setLotesProducto] = useState<any[]>([]);
    const [venta, setVenta] = useState(initialVenta);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any | null>(null);
    const [detalles, setDetalles] = useState<any[]>([]);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchConfiguraciones = async () => {
            try {
                const config = await obtenerConfiguracionVenta();
                setConfigVentaPorLote(config.sistema_venta_por_lote);
                setConfigVentaFechaVencimiento(config.venta_fecha_vencimiento);
            } catch (error) {
                console.error('❌ Error al cargar configuraciones', error);
            }
        };

        fetchConfiguraciones();
    }, []);


    useEffect(() => { console.log("Cantidad Maxima ", cantidadMaximo) }, [cantidadMaximo])
    useEffect(() => { console.log("Cantidad Producto ", cantidadProducto) }, [cantidadProducto])
    const [comprobanteData, setComprobanteData] = useState({
        nro_factura: '',
        fecha: '',
        cantidadProductos: 0,
    });
    const [comprobanteProductos, setComprobanteProductos] = useState<any[]>([]);

    useEffect(() => {
        const nuevoTotal = detalles.reduce(
            (acc, d) => acc + parseFloat(d.precio_venta || 0) * parseFloat(d.cantidad || 0), 0
        );
        setTotal(nuevoTotal);
    }, [detalles]);

    const handleSubmit = async () => {

        if (venta.idformapago === 2 && !venta.datos_bancarios) {
            setAdvertMessage('⚠️ Debes seleccionar los datos bancarios para realizar la venta con transferencia.');
            setAdvertModalOpen(true);
            return;
        }

        if (!venta.idcliente) {
            setErrorMessage('Debes seleccionar un cliente.');
            setErrorProductos([]);
            setErrorModalOpen(true);
            return;
        }

        if (!venta.fecha) {
            setErrorMessage('La fecha de la venta es obligatoria.');
            setErrorProductos([]);
            setErrorModalOpen(true);
            return;
        }

        if (!venta.tipo) {
            setErrorMessage('Debes seleccionar el tipo de pago.');
            setErrorProductos([]);
            setErrorModalOpen(true);
            return;
        }

        if (!venta.tipo_comprobante) {
            setErrorMessage('Debes seleccionar el tipo de comprobante.');
            setErrorProductos([]);
            setErrorModalOpen(true);
            return;
        }

        const detallesFinales = detalles.map((d) => ({
            idproducto: d.idproducto,
            iddetalle: d.iddetalle_lote,
            cantidad: d.cantidad,
            precio_venta: d.precio_venta,
            precio_compra: d.precio_compra,
            fecha_vencimiento: d.fecha_vencimiento || '',
            nombre_producto: d.nombre_producto,
            unidad_medida: d.unidad_medida,
            iva: d.iva,
        }));

        const payload = {
            venta: { ...venta, total },
            detalles: detallesFinales,
            sistema_venta_por_lote: configVentaPorLote,
        };

        try {
            if (configVentaPorLote && configventaFechaVencimiento) {
                const res = await validarVencimientoPorLote(detallesFinales);
                if (res.data?.error) {
                    const productosConError = res.data.productos_vencidos.map((prod: any) => ({
                        nombre_producto: prod.nombre_producto,
                        error: `Producto vencido - Fecha: ${new Date(prod.fecha_vencimiento).toLocaleDateString()}`,
                    }));

                    setErrorMessage("Hay productos vencidos en los lotes seleccionados.");
                    setErrorProductos(productosConError);
                    setErrorModalOpen(true);
                    return;
                }
            } else if (!configVentaPorLote && configventaFechaVencimiento) {

                // Si NO es venta por lote, validar por idproducto (simulación de lotes a usar)
                const res = await validarVencimientoSimulado(
                    detalles.map((d) => ({
                        idproducto: d.idproducto,
                        cantidad: d.cantidad,
                    }))
                );

                console.log("Respuesta de validación de vencimiento");
                if (res.data?.error) {
                    const productosConError = res.data.productos_vencidos.map((prod: any) => ({
                        nombre_producto: prod.nombre_producto,
                        error: `Producto vencido - Solo se pueden vender ${prod.cantidadDisponible} (vencen: ${new Date(prod.vencidos[0].fecha_vencimiento).toLocaleDateString()})`,
                    }));

                    setErrorMessage("Algunos productos tienen lotes vencidos y no se puede procesar la venta completa.");
                    setErrorProductos(productosConError);
                    console.log("Productos con error", productosConError)
                    setErrorModalOpen(true);
                    return;
                }
            }

            // ✅ Si no hay errores, crear la venta
            const response = await crearVenta(payload);
            onSuccess && onSuccess();

            // 📄 Si hay factura en base64, abrirla
            if (response.data?.facturaPDFBase64) {
                const base64 = response.data.facturaPDFBase64;
                const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            }

            setComprobanteData({
                nro_factura: response.data?.nro_factura || '',
                fecha: venta.fecha,
                cantidadProductos: detalles.length,
            });

            setComprobanteProductos(detalles.map((d) => ({
                ...d,
                precio_venta: d.precio_venta,
            })));

            setSuccessModalOpen(true);
            setVenta(initialVenta);
            setClienteSeleccionado(null);
            setDetalles([]);

        } catch (error: any) {
            console.error("❌ Error al registrar venta:", error);
            setErrorMessage('❌ Error al registrar la venta');
            setErrorProductos([]);
            setErrorModalOpen(true);
        }
    };



    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">🛒 Nueva Venta</h1>

            <form onSubmit={(e) => {
                e.preventDefault();
                setConfirmModalOpen(true);
            }} className="space-y-6">

                <FormVenta
                    venta={venta}
                    setVenta={setVenta}
                    clienteSeleccionado={clienteSeleccionado}
                    openClienteModal={() => setShowClienteModal(true)}
                />

                <BotonesAcciones
                    onCrearProducto={() => setShowProductoModal(true)}
                    onSeleccionarProducto={() => setShowProductoModal(true)}
                />

                <DetallesProductos
                    setCantidadProducto={setCantidadProducto}
                    detalles={detalles}
                    setDetalles={setDetalles}
                />

                <TotalVenta total={total} />

                <div className="text-right">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow">
                        💾 Registrar venta
                    </button>
                </div>
            </form>

            {/* Modales */}
            <ModalSeleccionarProducto
                isOpen={showProductoModal}
                detalles={detalles}
                configVentaPorLote={configVentaPorLote}
                cantidadProducto={cantidadProducto}
                stockVerify={true}
                setCantidadMaximo={setCantidadMaximo}
                setCantidadProducto={setCantidadProducto}
                onClose={() => setShowProductoModal(false)}
                onSelect={async (producto) => {
                    if (configVentaPorLote) {
                        try {
                            const res = await axios.get(`http://localhost:3000/api/detalle-compra/producto/${producto.idproducto}`);
                            const lotes = res.data;
                            setLotesProducto(lotes);
                            setShowLoteModal(true);
                            setShowProductoModal(false);

                        } catch (error) {
                            console.error('❌ Error al obtener lotes del producto:', error);
                        }
                    } else {
                        const fechaVencimientoFormateada = producto.ultima_fecha_vencimiento
                            ? new Date(producto.ultima_fecha_vencimiento).toISOString().split('T')[0]
                            : '';

                        setDetalles(prev => {
                            const idxExistente = prev.findIndex(d => d.idproducto === producto.idproducto);

                            if (idxExistente !== -1) {
                                const updated = [...prev];
                                updated[idxExistente] = {
                                    ...updated[idxExistente],
                                    cantidad: (
                                        parseFloat(updated[idxExistente].cantidad || '0') +
                                        parseFloat(producto.cantidad || '0')
                                    ).toString(),
                                };
                                return updated;
                            } else {
                                return [
                                    ...prev,
                                    {
                                        idproducto: producto.idproducto,
                                        nombre_producto: producto.nombre_producto,
                                        cantidad: producto.cantidad || 1,
                                        cantidadMaximo: producto.cantidadMaximo || cantidadMaximo,
                                        precio_venta: producto.precio_venta || '',
                                        precio_compra: producto.precio_compra || '',
                                        fecha_vencimiento: fechaVencimientoFormateada,
                                        unidad_medida: producto.unidad_medida || '',
                                        iva: producto.iva || '',
                                    }
                                ];
                            }
                        });

                        setShowProductoModal(false);
                    }
                }}

            />

            <ModalSeleccionarCliente
                isOpen={showClienteModal}
                onClose={() => setShowClienteModal(false)}
                onSelect={(cliente: any) => {
                    setClienteSeleccionado(cliente);
                    setVenta(prev => ({ ...prev, idcliente: cliente.idcliente }));
                    setShowClienteModal(false);
                }}
            />

            <ModalConfirmarProductos
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={() => {
                    setConfirmModalOpen(false);
                    handleSubmit();
                }}
                productos={detalles}
            />

            <ModalAdvert
                isOpen={advertModalOpen}
                onClose={() => setAdvertModalOpen(false)}
                message={advertMessage}
            />

            <ModalComprobante
                isVenta={true}
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                datos={comprobanteData}
                productos={comprobanteProductos}
            />

            <ModalError
                isOpen={errorModalOpen}
                onClose={() => {
                    setErrorModalOpen(false);
                    setErrorProductos([]);
                }}
                message={errorMessage}
                showTable={errorProductos.length > 0}
                productos={errorProductos}
            />

            <ModalSeleccionarLote
                setCantidadMaximo={setCantidadMaximo}
                isOpen={showLoteModal}
                onClose={() => setShowLoteModal(false)}
                lotes={lotesProducto}
                onSelect={(loteSeleccionado) => {
        
                    const yaExiste = detalles.some(
                        (detalle) => detalle.iddetalle_lote === loteSeleccionado.iddetalle
                    );


                    if (yaExiste) {

                        // Editar el array sumando 1 a la cantidad del lote existente
                        const detallesActualizados = detalles.map((detalle) => {
                            if (detalle.iddetalle_lote === loteSeleccionado.iddetalle) {
                                return {
                                    ...detalle,
                                    cantidad: detalle.cantidad + 1, 
                                };
                            }
                            return detalle;
                        });

                        setDetalles(detallesActualizados);
                    } else {
                        console.log("Lote Seleccionado", loteSeleccionado);
                        console.log("Entra por aqui")
                        setDetalles((prev) => [
                            ...prev,
                            {
                                idproducto: loteSeleccionado.idproducto,
                                nombre_producto: loteSeleccionado.nombre_producto,
                                cantidad: loteSeleccionado.unidad_medida === "KG" ? 0.1 : loteSeleccionado.unidad_medida === "L" ? 0.1 : 1,
                                precio_venta: loteSeleccionado.precio_venta,
                                cantidadMaximo: loteSeleccionado.stock_restante,
                                precio_compra: loteSeleccionado.precio_compra,
                                fecha_vencimiento: loteSeleccionado.fecha_vencimiento,
                                unidad_medida: loteSeleccionado.unidad_medida,
                                iva: loteSeleccionado.iva,
                                iddetalle_lote: loteSeleccionado.iddetalle,
                            },
                        ]);
                    }

                    setShowLoteModal(false);
                }}
            />
        </div>
    );
};

export default CrearVenta;
