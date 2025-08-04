'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import React from 'react';
import CrearVenta from '../CrearVenta';

interface ModalCrearVentaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;  
}

const ModalCrearVenta: React.FC<ModalCrearVentaProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-[980px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            {/* Componente de productos en modo selección */}
            <CrearVenta onSuccess={onSuccess}/>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalCrearVenta;
