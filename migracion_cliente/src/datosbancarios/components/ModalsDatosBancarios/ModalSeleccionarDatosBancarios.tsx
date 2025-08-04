'use client';
import ListarDatosBancarios from '../ListarDatosBancarios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import React from 'react';

interface ModalSeleccionarDatosBancariosProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoria: any) => void;
}

const ModalSeleccionarDatosBancarios: React.FC<ModalSeleccionarDatosBancariosProps> = ({
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
            <ListarDatosBancarios onSelect={onSelect} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalSeleccionarDatosBancarios;
