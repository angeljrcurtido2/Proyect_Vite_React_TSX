'use client';

import React from 'react';
import { XCircle, PackageCheck } from 'lucide-react';

interface Lote {
  iddetalle: number;
  idproducto: number;
  cantidad: string;
  stock_restante: number;
  precio_compra: string;
  sub_total: string;
  fecha_vencimiento: string;
  nombre_producto: string;
  unidad_medida: string;
  iva: string;
  precio_venta?: string;
}

interface ModalSeleccionarLoteProps {
  isOpen: boolean;
  setCantidadMaximo?: (cantidad: number) => void;
  onClose: () => void;
  lotes: Lote[];
  onSelect: (lote: Lote) => void;
}

const ModalSeleccionarLote: React.FC<ModalSeleccionarLoteProps> = ({
  isOpen,
  setCantidadMaximo,
  onClose,
  lotes,
  onSelect,
}) => {
  if (!isOpen) return null;
  console.log('Lotes disponible en tabla', lotes);
  return (
    <div className="fixed inset-0 bg-opacity-50 z-[80] flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-xl animate-fade-in border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <PackageCheck className="text-blue-600" size={24} />
            Seleccionar lote del producto
          </h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-600">
            <XCircle size={28} />
          </button>
        </div>

        {lotes.length === 0 ? (
          <p className="text-gray-600 text-center py-10">No hay lotes disponibles con stock.</p>
        ) : (
          <div className="overflow-auto max-h-[340px] border rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Vencimiento</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Precio Compra</th>
                  <th className="px-4 py-3">Precio Venta</th>
                  <th className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((lote) => (
                  <tr key={lote.iddetalle} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-2">{lote.iddetalle}</td>
                    <td className="px-4 py-2">
                      {new Date(lote.fecha_vencimiento).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{lote.stock_restante}</td>
                    <td className="px-4 py-2 text-blue-700 font-semibold">
                      ₲ {parseInt(lote.precio_compra).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-green-700 font-semibold">
                      ₲ {parseInt(lote.precio_venta || '0').toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => {
                          onSelect(lote);
                          setCantidadMaximo && setCantidadMaximo(lote.stock_restante);
                          onClose();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded-md transition"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionarLote;
