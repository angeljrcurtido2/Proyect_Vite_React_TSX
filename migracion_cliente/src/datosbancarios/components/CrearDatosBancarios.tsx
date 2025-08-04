'use client';

import { useState } from 'react';
import ModalSuccess from '../../components/ModalSuccess';
import ModalError from '../../components/ModalError';
import { styleButton } from '../../proveedor/utils/utils';
import { createDatosBancarios } from '../../services/datosBancarios';

interface CrearDatosBancariosProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const initialForm = {
  banco_origen: '',
  numero_cuenta: '',
  tipo_cuenta: '',
  titular_cuenta: '',
  observacion: ''
};

const CrearDatosBancarios = ({ onSuccess, onClose }: CrearDatosBancariosProps) => {
  const [formData, setFormData] = useState(initialForm);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createDatosBancarios(formData);
      onSuccess && onSuccess();
      onClose && onClose();
      setFormData(initialForm);
      setSuccessModalOpen(true);
    } catch (error: any) {
      console.error(error);
      setErrorMessage('❌ ' + (error.response?.data?.error || 'Error al crear dato bancario'));
      setErrorModalOpen(true);
    }
  };

  const renderInput = (name: string, placeholder: string, type = 'text') => (
    <input
      type={type}
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
          🏦 Crear Datos Bancarios
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInput('banco_origen', 'Banco Origen')}
          {renderInput('numero_cuenta', 'Número de Cuenta')}
          {renderInput('tipo_cuenta', 'Tipo de Cuenta')}
          {renderInput('titular_cuenta', 'Titular de la Cuenta')}
          <textarea
            name="observacion"
            placeholder="Observación (opcional)"
            value={formData.observacion}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className={styleButton}>
            Guardar Datos Bancarios
          </button>
        </form>
      </div>

      <ModalSuccess
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="✅ Datos bancarios guardados con éxito"
      />

      <ModalError
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default CrearDatosBancarios;
