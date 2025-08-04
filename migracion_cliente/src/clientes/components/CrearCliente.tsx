'use client';

import { useState } from 'react';
import ModalSuccess from '../../components/ModalSuccess';
import ModalError from '../../components/ModalSuccess';
import { initialFormCliente, selectFieldsConfig } from '../utils/utils';
import axios from 'axios';
import SelectInput from './SelectInput';

interface CrearClienteProps {
    onSuccess?: () => void;
    onClose?: () => void;
}

const CrearCliente = ({ onSuccess, onClose }: CrearClienteProps) => {
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState(initialFormCliente);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/clientes', formData);
            onSuccess && onSuccess();
            onClose && onClose();
            setSuccessModalOpen(true);
            setFormData(initialFormCliente);
        } catch (error: any) {
            console.error(error);
            setErrorMessage('❌ ' + (error.response?.data?.error || 'Error desconocido'));
            setErrorModalOpen(true);
        }
    };

    const renderInput = (name: string, placeholder: string) => (
        <input
            type="text"
            required
            name={name}
            placeholder={placeholder}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
    );

    const styleButton = "w-[50%] bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition";

    return (
        <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    🧾 Crear Cliente
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
        
                    <div className="flex flex-wrap gap-4">
                  
                        <div className="w-full md:w-[48%]">
                            {renderInput('nombre', 'Nombre')}
                        </div>
                        <div className="w-full md:w-[48%]">
                            {renderInput('apellido', 'Apellido')}
                        </div>
                        <div className="w-full md:w-[48%]">
                            {renderInput('numDocumento', 'Nro. Documento')}
                        </div>
                        <div className="w-full md:w-[48%]">
                            {renderInput('telefono', 'Teléfono')}
                        </div>
                        <div className="w-full md:w-[48%]">
                            {renderInput('direccion', 'Dirección')}
                        </div>
                        <div className="w-full md:w-[48%]">
                            {renderInput('descripcion', 'Descripción')}
                        </div>

                        {selectFieldsConfig.map((field, idx) => (
                            <div key={idx} className="w-full md:w-[48%]">
                                <SelectInput
                                    name={field.name}
                                    value={formData[field.name as keyof typeof formData]} 
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    options={field.options}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-center'>
                        <button
                            type="submit"
                            className={styleButton}
                        >
                            Guardar Cliente
                        </button>
                    </div>
                </form>
            </div>

            <ModalSuccess
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                message="Cliente creado con éxito"
            />
            <ModalError
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                message={errorMessage}
            />
        </div>
    );
};

export default CrearCliente;
