'use client';

import { useState } from 'react';
import ModalSuccess from '../../components/ModalSuccess';
import ModalError from '../../components/ModalSuccess';
import axios from 'axios';
import { styleButton } from '../../proveedor/utils/utils';

interface CrearCategoriaProps {
    onSuccess: () => void;
    onClose: () => void;
  }

const CrearCategoria = ({ onClose, onSuccess }: CrearCategoriaProps) => {
    const initialForm = {
        categoria: '',
    };
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
            await axios.post('http://localhost:3000/api/categorias', formData);
            onSuccess(); 
            onClose();   
            setSuccessModalOpen(true);
            setFormData(initialForm);
        } catch (error: any) {
            console.error(error);
            setErrorMessage('❌'+ error.response.data.error);
            setErrorModalOpen(true);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    🧾 Crear Categorias
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="categoria"
                        placeholder="Nombre"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  
                    <button
                        type="submit"
                        className={styleButton}
                    >
                        Guardar Categoria
                    </button>

                </form>
            </div>
            <ModalSuccess
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                message="Categoria creado con éxito"
            />
            <ModalError
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                message={errorMessage}
            />
        </div>

    );
};

export default CrearCategoria;
