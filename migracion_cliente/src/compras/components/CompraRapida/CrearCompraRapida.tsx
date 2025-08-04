'use client';

import { useState } from 'react';
import FormularioProducto from './FormularioProducto';
import ModalConfirmarProductos from './ModalsCompraRapida/ModalConfirmarProductos';
import TablaProductos from './TablaProductos';
import ModalComprobante from './ModalsCompraRapida/ModalComprobante'; 
import { createCompra } from '../../../services/compras';
import ModalError from '../../../components/ModalError';

interface CrearCompraRapidaProps {
    onSuccess?: () => void;
    onClose?: () => void;
  }

const CrearCompraRapida = ( { onSuccess, onClose } : CrearCompraRapidaProps ) => {
    const [productosNuevos, setProductosNuevos] = useState<any[]>([]);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [productosError, setProductosError] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [comprobanteProductos, setComprobanteProductos] = useState<any[]>([]);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [comprobanteData, setComprobanteData] = useState({
        nro_factura: '',
        fecha: '',
        cantidadProductos: 0
    });

    const agregarProducto = (producto: any) => {
        const idtemp = `temp-${Date.now()}`;

        setProductosNuevos(prev => [
            ...prev,
            { ...producto, idtemp, idproveedor: 1 } 
        ]);

   
    };

    const handleSubmit = async () => {
        const compra = {
            idproveedor: 1,
            nro_factura: '00001',
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'contado',
            estado: 'pagado',
            descuento: 0,
            observacion: 'Inventario inicial',
            fecha_vencimiento: ''
        };
    
        const detallesFinales = productosNuevos.map((p) => ({
            idproducto: p.idtemp,
            cantidad: p.cantidad,
            precio: p.precio_compra,
            fecha_vencimiento: p.fecha_vencimiento || '',
            nombre_producto: p.nombre_producto,
            unidad_medida: p.unidad_medida,
            iva: p.iva
        }));
    
        try {
            await createCompra({
                compra,
                detalles: detallesFinales,
                productosNuevos,
                isNewProducto: true 
            });
    
            onSuccess && onSuccess(); 
            onClose && onClose();
    
            setComprobanteData({
                nro_factura: compra.nro_factura,
                fecha: compra.fecha,
                cantidadProductos: productosNuevos.length
            });
            const copiaProductos = [...productosNuevos];
            setComprobanteProductos(copiaProductos);
            setSuccessModalOpen(true);
            setProductosNuevos([]);
        
        } catch (error:any) {
            console.error(error);
          
            setErrorMessage(error.response?.data.error || 'Error al registrar compra rápida');
            const productosDuplicados = error.response?.data.productosDuplicados;
            const productosConError = error.response?.data.productosConError;
          
            if (productosDuplicados) {
              setProductosError(productosDuplicados); 
            } else if (productosConError) {
              setProductosError(productosConError); 
            } else {
              setProductosError([]);
            }
          
            setErrorModalOpen(true);
          }
    };
    

    const handleEditProducto = (index: number, field: string, value: string) => {
        setProductosNuevos(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };
    const handleDeleteProducto = (index: number) => {
        setProductosNuevos(prev => prev.filter((_, i) => i !== index));
   
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">🚀 Cargar Productos</h1>

            <FormularioProducto onAgregar={agregarProducto} />

            <TablaProductos productos={productosNuevos} onEditProducto={handleEditProducto} onDeleteProducto={handleDeleteProducto} />

            {productosNuevos.length > 0 && (
                <div className="text-right mt-6">
                    <button
                        onClick={() => setConfirmModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
                    >
                        💾 Registrar Producto(s)
                    </button>
                </div>
            )}
            <ModalError
                showTable={true}
                productos={productosError}
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                message={errorMessage}
            />
            <ModalConfirmarProductos
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={() => {
                    setConfirmModalOpen(false);
                    handleSubmit();
                }}
                productos={productosNuevos}
            />
            <ModalComprobante
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                datos={comprobanteData}
                productos={comprobanteProductos}
            />
        </div>
    );
};

export default CrearCompraRapida;
