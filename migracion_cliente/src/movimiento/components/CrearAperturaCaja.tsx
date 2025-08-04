'use client';

import { useState } from 'react';
import ModalAdvert from '../../components/ModalAdvert';
import ModalError from '../../components/ModalError';
import ModalSuccess from '../../components/ModalSuccess';
import { abrirMovimientoCaja } from '../../services/ingreso';

interface AbrirCajaProps {
  idusuarios: number;
  onSuccess?: () => void;
  onClose: () => void;
}

const AbrirCaja = ({ idusuarios, onSuccess, onClose }: AbrirCajaProps) => {
  const [numCaja, setNumCaja] = useState('');
  const [monto, setMonto] = useState('');
  const [advertOpen, setAdvertOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleAbrir = async () => {
    if (!numCaja.trim() || !monto.trim()) {
      setModalMessage('⚠️ Número de caja y monto son obligatorios.');
      setAdvertOpen(true);
      return;
    }

    const parsedMonto = parseFloat(monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      setModalMessage('⚠️ El monto debe ser mayor que cero.');
      setAdvertOpen(true);
      return;
    }

    try {
      await abrirMovimientoCaja({
        idusuarios,
        num_caja: numCaja.trim(),
        fecha_apertura: new Date().toISOString(),
        monto_apertura: parsedMonto,
        estado: 'abierto',
      });
      
      setSuccessOpen(true);
      setNumCaja('');
      setMonto('');
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error(err);
      setModalMessage(err.response?.data?.error || '❌ Error al abrir caja.');
      setErrorOpen(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔓 Apertura de Caja</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Caja *</label>
        <input
          type="text"
          value={numCaja}
          onChange={(e) => setNumCaja(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          placeholder="Ej: 001"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Monto de Apertura *</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          placeholder="Ej: 500000"
        />
      </div>

      <button
        onClick={handleAbrir}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 rounded-lg transition-all duration-150"
      >
        Abrir Caja
      </button>

      <ModalAdvert isOpen={advertOpen} onClose={() => setAdvertOpen(false)} message={modalMessage} />
      <ModalError isOpen={errorOpen} onClose={() => setErrorOpen(false)} message={modalMessage} />
      <ModalSuccess
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="✅ Caja abierta correctamente."
      />
    </div>
  );
};

export default AbrirCaja;
