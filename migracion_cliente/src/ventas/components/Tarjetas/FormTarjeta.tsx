'use client';

import { type FC } from 'react';

interface Props {
  onClose: () => void;
  datosTarjeta: any;
  setDatosTarjeta: (data: any) => void;
}

const FormTarjeta: FC<Props> = ({ onClose, datosTarjeta, setDatosTarjeta }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosTarjeta((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">💳 Datos de Tarjeta</h2>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Tipo de Tarjeta</label>
        <select
          name="tipo_tarjeta"
          value={datosTarjeta.tipo_tarjeta || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        >
          <option value="">-- Seleccionar tipo --</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Entidad / Banco</label>
        <input
          type="text"
          name="entidad"
          value={datosTarjeta.entidad || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
          placeholder="Ej: Visión Banco, Itau..."
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Monto</label>
        <input
          type="number"
          name="monto"
          value={datosTarjeta.monto || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
      </div>

      <button
        onClick={onClose}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
      >
        Confirmar
      </button>
    </div>
  );
};

export default FormTarjeta;
