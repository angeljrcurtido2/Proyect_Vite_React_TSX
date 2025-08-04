'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ModalConfirmarProductosProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productos: any[];
}
const styleTableTh = "px-4 py-2 text-left font-medium text-gray-700";
const styleTableTd = "px-4 py-2"
const ModalConfirmarProductos = ({ isOpen, onClose, onConfirm, productos }: ModalConfirmarProductosProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-opacity-25" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar carga de productos
            </Dialog.Title>

            <div className="overflow-y-auto max-h-60 mb-4">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className={styleTableTh}>Producto</th>
                    <th className={styleTableTh}>Unidad</th>
                    <th className={styleTableTh}>Cod_Barra</th>
                    <th className={styleTableTh}>Cantidad</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                        No hay productos
                      </td>
                    </tr>
                  ) : (
                    productos.map((p, index) => (
                      <tr key={index}>
                        <td className={styleTableTd}>{p.nombre_producto}</td>
                        <td className={styleTableTd}>{p.unidad_medida}</td>
                        <td className={`${styleTableTd} max-w-[100px] truncate`}>{p.cod_barra}</td>
                        <td className={styleTableTd}>{p.cantidad}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                onClick={onConfirm}
              >
                Confirmar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalConfirmarProductos;
