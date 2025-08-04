'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; 

interface ModalAdvertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onConfirm?: () => void; 
  confirmButtonText?: string;
}

const ModalAdvert = ({
  isOpen,
  onClose,
  message,
  onConfirm,
  confirmButtonText = "Confirmar",
}: ModalAdvertProps) => {
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
            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex items-center gap-3 text-yellow-500">
                <ExclamationTriangleIcon className="h-6 w-6" />
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Advertencia
                </Dialog.Title>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-700">{message}</p>
              </div>

              <div className="mt-6 flex justify-end gap-4">
      
                {onConfirm && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={onConfirm}
                  >
                    {confirmButtonText}
                  </button>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAdvert;
