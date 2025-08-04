'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import CrearDatosFacturador from '../CrearFacturador';

interface ModalsCrearFacturadorProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;   
}

const ModalsCrearFacturador = ({ isOpen, onClose, onSuccess }: ModalsCrearFacturadorProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
            
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="w-full max-w-[1000px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
       
                        <CrearDatosFacturador onSuccess={onSuccess} onClose={onClose} />
                    </Dialog.Panel>
                </div>
           
            </Dialog>
        </Transition>
    );
};

export default ModalsCrearFacturador;
