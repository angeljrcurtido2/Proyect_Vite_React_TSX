'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // Icono de éxito

interface ModalComprobanteProps {
  isOpen: boolean;
  onClose: () => void;
  datos: {
    nro_factura: string;
    fecha: string;
    cantidadProductos: number;
  };
  productos: any[];
  isVenta?: boolean;
}

const ModalComprobante = ({ isOpen, onClose, datos, productos, isVenta = false}: ModalComprobanteProps) => {

  const totalCompra = productos.reduce((acc, p) => {

    const precio = parseFloat(isVenta ? p.precio_venta : p.precio_compra) || 0;
    const cantidad = parseFloat(p.cantidad) || 0;
    return acc + (precio * cantidad);
  }, 0);
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircleIcon className="h-8 w-8" />
              <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                {`${isVenta ? "Venta realizada exitosamente" : "Compra registrada exitosamente"}`}
              </Dialog.Title>
            </div>

            <div className="mt-6 text-gray-700 text-sm space-y-2">
              <p><strong>Nro Factura:</strong> {datos.nro_factura}</p>
              <p><strong>Fecha:</strong> {datos.fecha}</p>
              <p><strong>Cantidad de Productos:</strong> {datos.cantidadProductos}</p>
            </div>

            {/* 🛒 Tabla de Productos Agregados */}
            <div className="mt-6 overflow-x-auto max-h-64 rounded-lg border border-gray-200">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-700">Producto</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Cantidad</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">{`${!isVenta ? "Precio Compra" : "Precio Venta"}`}</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        No hay productos cargados
                      </td>
                    </tr>
                  ) : (
                    productos.map((p, index) => {
                      const priceFinally = isVenta ? p.precio_venta : p.precio_compra
                      const precioCompra = parseFloat(priceFinally) || 0;
                      const cantidad = parseFloat(p.cantidad) || 0;
                      const totalProducto = precioCompra * cantidad;

                      return (
                        <tr key={index}>
                          <td className="px-6 py-4">{p.nombre_producto}</td>
                          <td className="px-6 py-4">{cantidad}</td>
                          <td className="px-6 py-4">{precioCompra.toLocaleString()} Gs</td>
                          <td className="px-6 py-4">{totalProducto.toLocaleString()} Gs</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* 🔥 Total General de la Compra */}
            <div className="mt-4 text-right pr-4 text-lg font-semibold text-gray-800">
              Total {`${isVenta ? "Venta" : "Compra"}`}: {totalCompra.toLocaleString()} Gs
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalComprobante;
