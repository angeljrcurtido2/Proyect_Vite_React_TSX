'use client';

import { useEffect, useState } from 'react';
import ModalSuccess from '../../components/ModalSuccess';
import { FiSave } from 'react-icons/fi';
import { getDatosBancariosById, updateDatosBancarios } from '../../services/datosBancarios';

interface EditarDatosBancariosProps {
  id: number | string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const initialForm = {
  banco_origen: '',
  numero_cuenta: '',
  tipo_cuenta: '',
  titular_cuenta: '',
  observacion: '',
};

const EditarDatosBancarios = ({ id, onSuccess, onClose }: EditarDatosBancariosProps) => {
  const [formData, setFormData] = useState(initialForm);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getDatosBancariosById(id).then((res) => {
        setFormData(res.data);
      }).catch(err => {
        console.error('Error al obtener dato bancario', err);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateDatosBancarios(id, formData);
      setSuccessModalOpen(true);
      setTimeout(() => {
        setSuccessModalOpen(false);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar dato bancario', error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">🏦 Editar Dato Bancario</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Banco de Origen', name: 'banco_origen' },
            { label: 'Número de Cuenta', name: 'numero_cuenta' },
            { label: 'Tipo de Cuenta', name: 'tipo_cuenta' },
            { label: 'Titular de la Cuenta', name: 'titular_cuenta' },
          ].map(({ label, name }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={label}
              />
            </div>
          ))}

          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Observación</label>
            <textarea
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observación (opcional)"
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              <FiSave className="text-xl" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <ModalSuccess
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Dato bancario actualizado con éxito ✅"
      />
    </div>
  );
};

export default EditarDatosBancarios;
