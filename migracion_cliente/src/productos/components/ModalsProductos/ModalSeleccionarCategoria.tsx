'use client';
import ListarCategorias from '../../../categoria/components/ListarCategorias';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import React from 'react';

interface ModalSeleccionarCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoria: any) => void;
}

const ModalSeleccionarCategoria: React.FC<ModalSeleccionarCategoriaProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center">
          <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <ListarCategorias onSelect={onSelect} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalSeleccionarCategoria;
