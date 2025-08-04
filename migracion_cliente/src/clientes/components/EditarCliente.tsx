'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalSuccess from '../../components/ModalSuccess';
import { FiSave } from 'react-icons/fi';
import { selectFieldsConfig } from '../utils/utils';
import SelectInput from './SelectInput';

interface EditarClienteProps {
  id: number | string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const initialFormCliente = {
  nombre: '',
  apellido: '',
  tipo: 'FISICA',
  numDocumento: '',
  telefono: '',
  direccion: '',
  genero: 'M',
  estado: 'activo',
  descripcion: '',
  tipo_cliente: 'MINORISTA',
};

const EditarCliente = ({ id, onSuccess, onClose }: EditarClienteProps) => {
  const [formData, setFormData] = useState(initialFormCliente);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/clientes/${id}`).then((res) => {
        setFormData(res.data.data); 
      }).catch((error) => {
        console.error('Error al obtener cliente:', error);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/clientes/${id}`, formData);
      setSuccessModalOpen(true);

      setTimeout(() => {
        setSuccessModalOpen(false);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar cliente', error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">✏️ Editar Cliente</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Nombre', name: 'nombre' },
            { label: 'Apellido', name: 'apellido' },
            { label: 'Documento', name: 'numDocumento' },
            { label: 'Teléfono', name: 'telefono' },
            { label: 'Dirección', name: 'direccion' },
            { label: 'Descripción', name: 'descripcion' },
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
          {selectFieldsConfig.map((field, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">{field.placeholder}</label>
              <SelectInput
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field.placeholder}
                options={field.options}
              />
            </div>
          ))}

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
        message="Cliente actualizado con éxito ✅"
      />
    </div>
  );
};

export default EditarCliente;
