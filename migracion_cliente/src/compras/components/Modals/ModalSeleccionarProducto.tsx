'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import React from 'react';
import ListarProductos from '../../../productos/components/ListarProductos';

interface ModalSeleccionarProductoProps {
  isOpen: boolean;
  onClose: () => void;
  setCantidadMaximo?: (cantidad: number) => void;
  setCantidadProducto: (cantidad: number) => void;
  configVentaPorLote?: boolean;
  cantidadProducto?: number;
  detalles?: any[];
  onSelect: (producto: any) => void;
  stockVerify?:boolean
}

const ModalSeleccionarProducto: React.FC<ModalSeleccionarProductoProps> = ({
  isOpen,
  onClose,
  setCantidadMaximo,
  setCantidadProducto,
  configVentaPorLote = false,
  cantidadProducto,
  detalles,
  onSelect,
  stockVerify = false,
}) => {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-[1200px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <ListarProductos configVentaPorLote = {configVentaPorLote} onSelect={onSelect} detalles = {detalles} setCantidadProducto = {setCantidadProducto} cantidadProducto={cantidadProducto} stockVerify = {stockVerify} setCantidadMaximo = {setCantidadMaximo} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalSeleccionarProducto;
