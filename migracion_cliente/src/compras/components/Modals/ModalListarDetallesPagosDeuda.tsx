'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import React from 'react';
import ListarDetallesPagosDeuda from '../CobroDeudaCompra/ListarDetallesPagosDeuda';

interface ModalListarDetallesPagosDeudaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: ()=> void;
  iddeuda: number;
}

const ModalListarDetallesPagosDeuda: React.FC<ModalListarDetallesPagosDeudaProps> = ({
  isOpen,
  onClose,
  onSuccess,
  iddeuda
}) => {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-[1200px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <ListarDetallesPagosDeuda iddeuda={iddeuda} onSuccess={onSuccess} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalListarDetallesPagosDeuda;
