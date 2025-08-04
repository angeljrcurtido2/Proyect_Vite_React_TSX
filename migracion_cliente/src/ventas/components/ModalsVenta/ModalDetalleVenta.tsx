'use client';

import React from 'react';
import { comprobanteVenta } from '../../../services/ventas';
import { formatPY } from '../../../movimiento/utils/utils';

interface DetalleVenta {
  iddetalle: number;
  nombre_producto: string;
  cantidad: string;
  precio_venta: string;
  sub_total: string;
  unidad_medida: string;
}

interface Venta {
  idventa: number;
  nombre_cliente: string;
  documento_cliente: string;
  tipo: string;
  total: string;
  fecha: string;
  detalles: DetalleVenta[];
}

interface ModalDetalleVentaProps {
  venta: Venta | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalDetalleVenta: React.FC<ModalDetalleVentaProps> = ({ venta, isOpen, onClose }) => {
  if (!isOpen || !venta) return null;

  const handleReimprimir = async (idventa: number) => {
    try {
      const res = await comprobanteVenta(idventa);

      if (res.data?.facturaPDFBase64) {
        console.log("Factura generada:", res.data.facturaPDFBase64);
        const base64 = res.data.facturaPDFBase64;
        const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank'); // o window.location.href = url para forzar descarga
      }
    } catch (error) {
      console.error('❌ Error al generar comprobante:', error);
      alert('Error al generar el comprobante');
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700 flex-1">🧾 Detalles de la venta #{venta.idventa}</h2>

          <div className="flex gap-2">
            <button
              onClick={() => handleReimprimir(venta.idventa)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-5a2 2 0 00-2-2h-2M7 7H5a2 2 0 00-2 2v5a2 2 0 002 2h2m2 0h6m-6 0V5h6v9m-6 4h6" />
              </svg>
              Re-imprimir
            </button>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white bg-gray-200 hover:bg-red-500 px-3 py-1 rounded-lg font-bold text-lg shadow transition-all duration-150"
              title="Cerrar"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p><strong>Cliente:</strong> {venta.nombre_cliente}</p>
          <p><strong>Documento:</strong> {venta.documento_cliente}</p>
          <p><strong>Tipo:</strong> {venta.tipo}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
          <p><strong>Total:</strong> {formatPY(venta.total)} Gs</p>
        </div>

        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="border px-2 py-1 text-left">Producto</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Precio</th>
              <th className="border px-2 py-1">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.detalles.map((d) => (
              <tr key={d.iddetalle}>
                <td className="border px-2 py-1">{d.nombre_producto}</td>
                <td className="border px-2 py-1 text-center">{d.cantidad}</td>
                <td className="border px-2 py-1 text-right">{formatPY(d.precio_venta)}</td>
                <td className="border px-2 py-1 text-right">{formatPY(d.sub_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModalDetalleVenta;
