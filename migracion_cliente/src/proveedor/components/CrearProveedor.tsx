'use client';

import { useState } from 'react';
import { initialForm, styleButton } from '../utils/utils';
import { createProveedor } from '../../services/proveedor';
import ModalSuccess from '../../components/ModalSuccess';
import ModalError from '../../components/ModalError';

interface CrearProveedorProps {
    onSuccess?: () => void;
    onClose?: () => void;
}

const CrearProveedor = ({ onSuccess, onClose }: CrearProveedorProps) => {
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState(initialForm);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createProveedor(formData);
            onSuccess?.(); 
            onClose?.();  
            setSuccessModalOpen(true);
            setFormData(initialForm);
        } catch (error: any) {
            console.error(error);
            setErrorMessage('❌' + error.response?.data?.error || 'Error al crear proveedor');
            setErrorModalOpen(true);
        }
    };


    const renderInput = (name: string, placeholder: string) => (
        <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
    );

    return (
        <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    🧾 Crear Proveedor
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderInput('nombre', 'Nombre')}
                    {renderInput('telefono', 'Teléfono')}
                    {renderInput('direccion', 'Dirección')}
                    {renderInput('ruc', 'RUC')}
                    {renderInput('razon', 'Razón Social')}

                    <button
                        type="submit"
                        className={styleButton}
                    >
                        Guardar Proveedor
                    </button>
                </form>
            </div>
            <ModalSuccess
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                message="Proveedor creado con éxito"
            />
            <ModalError
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                message={errorMessage}
            />
        </div>

    );
};

export default CrearProveedor;
