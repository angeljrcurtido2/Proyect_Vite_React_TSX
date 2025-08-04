'use client';

import React from 'react';

interface Detalle {
  iddetalle: number;
  nombre_producto: string;
  cantidad: string;
  precio: string;
  sub_total: string;
  unidad_medida: string;
}

interface Compra {
  idcompra: number;
  nombre: string;
  nro_factura: string;
  tipo: string;
  total: string;
  fecha: string;
  detalles: Detalle[];
}

interface ModalDetalleCompraProps {
  compra: Compra | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalDetalleCompra: React.FC<ModalDetalleCompraProps> = ({ compra, isOpen, onClose }) => {
  if (!isOpen || !compra) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">🧾 Detalles de la compra #{compra.idcompra}</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
        </div>

        <div className="mb-4">
          <p><strong>Proveedor:</strong> {compra.nombre}</p>
          <p><strong>Factura:</strong> {compra.nro_factura}</p>
          <p><strong>Tipo:</strong> {compra.tipo}</p>
          <p><strong>Fecha:</strong> {new Date(compra.fecha).toLocaleDateString()}</p>
          <p><strong>Total:</strong> {compra.total} Gs</p>
        </div>

        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="border px-2 py-1 text-left">Producto</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Unidad</th>
              <th className="border px-2 py-1">Precio</th>
              <th className="border px-2 py-1">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {compra.detalles.map((d) => (
              <tr key={d.iddetalle}>
                <td className="border px-2 py-1">{d.nombre_producto}</td>
                <td className="border px-2 py-1 text-center">{d.cantidad}</td>
                <td className="border px-2 py-1 text-center">{d.unidad_medida}</td>
                <td className="border px-2 py-1 text-right">{d.precio} Gs</td>
                <td className="border px-2 py-1 text-right">{d.sub_total} Gs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModalDetalleCompra;
