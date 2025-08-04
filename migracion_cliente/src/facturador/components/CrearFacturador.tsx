'use client';

import { useState } from 'react';

import ModalsListarActividadesEconomicas from './ModalsActivEcon/ModalsListarActividadesEconomicas';
import { createFacturador } from '../../services/facturador';
import ModalSuccess from '../../components/ModalSuccess';
import ModalError from '../../components/ModalError';

interface CrearDatosFacturadorProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const initialFormFacturador = {
  nombre_fantasia: '',
  titular: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  ruc: '',
  timbrado_nro: '',
  fecha_inicio_vigente: '',
  fecha_fin_vigente: '',
  nro_factura_inicial_habilitada: '',
  nro_factura_final_habilitada: '',
};

const styleButton = "mt-8 mb-8 bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-700 transition";

const CrearDatosFacturador = ({ onSuccess, onClose }: CrearDatosFacturadorProps) => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(initialFormFacturador);

  const [modalListarActividadesOpen, setModalListarActividadesOpen] = useState(false);
  const [selectedActividades, setSelectedActividades] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        actividades_economicas: selectedActividades.map((a) => a.idactividad) 
      };

      await createFacturador(payload);
      onSuccess && onSuccess();
      onClose && onClose();
      setSuccessModalOpen(true);
      setFormData(initialFormFacturador);
      setSelectedActividades([]);
    } catch (error: any) {
      console.error(error);
      setErrorMessage('❌ ' + (error.response?.data?.error || 'Error desconocido'));
      setErrorModalOpen(true);
    }
  };

  const renderInput = (name: string, placeholder: string, type = 'text', label?: string) => (
    <div className="flex flex-col">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );

  return (
    <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🧾 Crear Datos Facturador
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderInput('nombre_fantasia', 'Nombre Fantasía')}
          {renderInput('titular', 'Titular')}
          {renderInput('telefono', 'Teléfono')}
          {renderInput('direccion', 'Dirección')}
          {renderInput('ciudad', 'Ciudad')}
          {renderInput('ruc', 'RUC')}
          {renderInput('timbrado_nro', 'N° Timbrado')}
          {renderInput('fecha_inicio_vigente', 'Fecha Inicio Vigente', 'date', 'Fecha Inicio Vigente')}
          {renderInput('fecha_fin_vigente', 'Fecha Fin Vigente', 'date', 'Fecha Fin Vigente')}
          {renderInput('nro_factura_inicial_habilitada', 'Nro Factura Inicial')}
          {renderInput('nro_factura_final_habilitada', 'Nro Factura Final')}
          <div className="md:col-span-2 flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-gray-700">Actividades Económicas</label>
            <button
              type="button"
              onClick={() => setModalListarActividadesOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow text-sm"
            >
              ➕ Seleccionar Actividades
            </button>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedActividades.map((act) => (
                <span key={act.idactividad} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                  {act.descripcion}
                </span>
              ))}
            </div>
          </div>


          <button
            type="submit"
            className={styleButton}
          >
            Guardar Facturador
          </button>

        </form>
      </div>

      {/* Modales */}
      <ModalSuccess
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="✅ Facturador creado con éxito"
      />
      <ModalError
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
      <ModalsListarActividadesEconomicas
        isOpen={modalListarActividadesOpen}
        onClose={() => setModalListarActividadesOpen(false)}
        onSelect={(activities) => setSelectedActividades(activities)}
      />
    </div>
  );
};

export default CrearDatosFacturador;
