'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import EditarFacturador from '../EditarFacturador';

interface ModalEditarFacturadorProps {
    id: number | string; 
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; 
}

const ModalEditarFacturador = ({ isOpen, onClose, onSuccess, id }: ModalEditarFacturadorProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
            
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="w-full max-w-[900px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <EditarFacturador onSuccess={onSuccess} onClose={onClose} id={id} />
                    </Dialog.Panel>
                </div>
           
            </Dialog>
        </Transition>
    );
};

export default ModalEditarFacturador;
