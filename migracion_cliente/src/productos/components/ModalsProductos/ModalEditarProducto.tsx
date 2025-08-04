'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import EditarProducto from '../EditarProductos';

interface ModalEditarProductoProps {
    id: number | string; 
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; 
}

const ModalEditarProducto = ({ isOpen, onClose, onSuccess, id }: ModalEditarProductoProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
            
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="w-full max-w-[700px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                        <EditarProducto onSuccess={onSuccess} onClose={onClose} id={id} />

                    </Dialog.Panel>
                </div>
           
            </Dialog>
        </Transition>
    );
};

export default ModalEditarProducto;
