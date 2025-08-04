'use client';

import { useState } from 'react';
import ModalListarTiposEgreso from '../ModalMovimiento/Egreso/ModalListarTiposEgreso';
import ModalAdvert from '../../../components/ModalAdvert';
import ModalError from '../../../components/ModalError';
import ModalSuccess from '../../../components/ModalSuccess';
import { registrarEgreso } from '../../../services/egreso';

interface TipoEgreso {
  idtipo_egreso: number;
  descripcion: string;
}

interface CrearEgresosVariosProps {
  onSuccess?: () => void;
  onClose: () => void;
}

const CrearEgresosVarios = ({ onSuccess, onClose }: CrearEgresosVariosProps) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoEgreso | null>(null);
  const [modalSeleccionarOpen, setModalSeleccionarOpen] = useState(false);
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [observacion, setObservacion] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);

  const [advertOpen, setAdvertOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCrear = async () => {
    if (!tipoSeleccionado || !monto.trim() || !concepto.trim()) {
      setModalMessage('⚠️ Tipo, monto y concepto son obligatorios.');
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
      await registrarEgreso({
        idtipo_egreso: tipoSeleccionado.idtipo_egreso,
        monto: parsedMonto,
        concepto: concepto.trim(),
        observacion: observacion.trim(),
        fecha,
      });

      setSuccessOpen(true);
      setMonto('');
      setConcepto('');
      setObservacion('');
      setFecha(new Date().toISOString().split('T')[0]);
      setTipoSeleccionado(null);
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err: any) {
      console.error(err);
      setModalMessage(err.response?.data?.error || '❌ Error al registrar egreso.');
      setErrorOpen(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">➖ Registrar Egreso Manual</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Egreso *</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tipoSeleccionado?.descripcion || ''}
            readOnly
            placeholder="Seleccione tipo de egreso..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:outline-none"
            onClick={() => setModalSeleccionarOpen(true)}
          />
          <button
            onClick={() => setModalSeleccionarOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            Seleccionar
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          placeholder="Ej: 150000"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Concepto *</label>
        <input
          type="text"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          placeholder="Ej: Pago de compra ID 50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Observación (opcional)</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          placeholder="Ej: Compra registrada con ID 50"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Egreso *</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>

      <button
        onClick={handleCrear}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-all duration-150"
      >
        Registrar Egreso
      </button>

      <ModalListarTiposEgreso
        onSelect={(tipo) => {
          setTipoSeleccionado(tipo);
          setModalSeleccionarOpen(false);
        }}
        isOpen={modalSeleccionarOpen}
        onClose={() => setModalSeleccionarOpen(false)}
      />

      <ModalAdvert isOpen={advertOpen} onClose={() => setAdvertOpen(false)} message={modalMessage} />
      <ModalError isOpen={errorOpen} onClose={() => setErrorOpen(false)} message={modalMessage} />
      <ModalSuccess
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="✅ Egreso registrado correctamente."
      />
    </div>
  );
};

export default CrearEgresosVarios;
