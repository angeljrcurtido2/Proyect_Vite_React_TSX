'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import CrearCompraRapida from '../CompraRapida/CrearCompraRapida';

interface ModalCrearCrearCompraRapidaProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;   
}

const ModalCrearCompraRapida = ({ isOpen, onClose, onSuccess }: ModalCrearCrearCompraRapidaProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="w-full max-w-[980px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <CrearCompraRapida onSuccess={onSuccess} onClose={onClose} />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ModalCrearCompraRapida;
