'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ModalErrorProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  showTable?: boolean;
  productos?: any[]; 
}

const ModalError = ({ isOpen, onClose, message, showTable = false, productos = [] }: ModalErrorProps) => {
  useEffect(() => {
    console.log("asdfasdfdasf",productos);
  }, [productos])
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex items-center gap-3 text-red-600">
                <ExclamationCircleIcon className="h-6 w-6" />
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Error
                </Dialog.Title>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-700">{message}</p>
              </div>
              {showTable && (
                <div className="mt-4 overflow-x-auto max-h-64 rounded-lg border border-gray-200">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-700">Producto</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productos.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                            No hay productos duplicados
                          </td>
                        </tr>
                      ) : (
                        productos.map((producto: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4">
                              {typeof producto === 'string' ? producto : producto.nombre_producto}
                            </td>
                            <td className="px-6 py-4 text-red-600 font-medium">
                              {typeof producto === 'string' ? 'Producto duplicado' : producto.error}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalError;
