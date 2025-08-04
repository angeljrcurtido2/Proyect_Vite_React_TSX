'use client';

import { useEffect, useState } from 'react';

import { useRef } from 'react';
import CrearArqueoCaja from '../Arqueo/CrearArqueoCaja';
import { cerrarCaja, registrarArqueo, getResumenMovimiento } from '../../../services/movimiento';
import { getArqueoFindByMovement } from '../../../services/arqueo';
import ModalError from '../../../components/ModalError';
import ModalSuccess from '../../../components/ModalSuccess';
import ModalAdvert from '../../../components/ModalAdvert';

interface ResumenCaja {
  ingresos: number;
  egresos: number;
  contado: number;
  cobrado: number;
  compras: number;
  gastos: number;
  credito: number;
  monto_cierre: number;
  monto_apertura: number;
  estado: string;
}

export interface ArqueoCaja {
    idarqueo: number,
    a50: number,
    a100: number,
    a500: number,
    a1000: number,
    a2000: number,
    a5000: number,
    a10000: number,
    a20000: number,
    a50000: number,
    a100000: number,
    total: string,
    detalle1: string,
    monto1: string,
    detalle2: string,
    monto2: string,
    detalle3: string,
    monto3: string,
    detalle4: string,
    monto4: string,
    detalle5: string,
    monto5: string,
    idmovimiento: number
}

const resumenInicial: ResumenCaja = {
  ingresos: 0,
  egresos: 0,
  contado: 0,
  cobrado: 0,
  compras: 0,
  gastos: 0,
  credito: 0,
  monto_cierre: 0,
  monto_apertura: 0,
  estado: '',
};

const arqueoInicial: ArqueoCaja = {
    idarqueo: 0,
    a50: 0,
    a100: 0,
    a500: 0,
    a1000: 0,
    a2000: 0,
    a5000: 0,
    a10000: 0,
    a20000: 0,
    a50000: 0,
    a100000: 0,
    total: "",
    detalle1: "",
    monto1: "",
    detalle2: "",
    monto2: "",
    detalle3: "",
    monto3: "",
    detalle4: "",
    monto4: "",
    detalle5: "",
    monto5: "",
    idmovimiento: 0
} 

interface CajaResumenProps {
  idmovimiento: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

const CajaResumen = ({ idmovimiento, onSuccess, onClose }: CajaResumenProps) => {
  type ArqueoRef = {
    getArqueoData: () => {
      total: number;
      payload: Record<string, any>;
    };
  };

  const arqueoRef = useRef<ArqueoRef>(null);
  const [resumen, setResumen] = useState<ResumenCaja>(resumenInicial);
  const [arqueo, setArqueo] = useState<ArqueoCaja>(arqueoInicial)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [advertOpen, setAdvertOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const fetchResumen = async () => {
    try {
      const res = await getResumenMovimiento(idmovimiento);
      const isStatusClose = res.data.estado === "cerrado"
      const resArqueo = isStatusClose && await getArqueoFindByMovement(idmovimiento);

      resArqueo && setArqueo(resArqueo.data) 
      setResumen(res.data);

    } catch (err: any) {
      console.error(err);
      setError('❌ Error al obtener resumen de caja');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumen();
  }, [idmovimiento]);

  const handleCerrarCaja = async () => {
    const arqueoData = arqueoRef.current?.getArqueoData();
    if (!arqueoData) return;

    const { total, payload } = arqueoData;

    const diferencia = Math.abs(total - resumen.monto_cierre);
    if (resumen && diferencia > 0.01) {
     console.log("Datos de cierre", resumen)
      const tipo = total > resumen.monto_cierre ? 'EXCESO' : 'FALTANTE';
      setModalMessage(
        `⚠️ El total del arqueo no coincide con el total en caja.\n` +
        `💵 Total en Caja: ${resumen.monto_cierre.toLocaleString()} Gs\n` +
        `🧾 Total Arqueado: ${total.toLocaleString()} Gs\n` +
        `🔍 Diferencia (${tipo}): ${diferencia.toLocaleString()} Gs`
      );
      setErrorOpen(true);
      setAdvertOpen(false);
      return;
    }

    try {
      // 1. Guardar Arqueo
      await registrarArqueo(payload);
      // 2. Cerrar caja
      const res = await cerrarCaja(idmovimiento);
      setModalMessage(res.data.message || '✅ Caja cerrada correctamente');
      setSuccessOpen(true);
      fetchResumen();
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setModalMessage('❌ No se pudo completar el cierre de caja');
      setErrorOpen(true);
    } finally {
      setAdvertOpen(false);
    }
  };

  if (loading) return <p className="text-gray-600">Cargando resumen...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!resumen) return null;



  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mx-auto mt-6 border border-gray-200">
      <div className="flex flex-row gap-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Resumen del Cierre de Caja</h2>
            {resumen.estado && (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full shadow ${resumen.estado === 'cerrado'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
                  }`}
              >
                {resumen.estado.toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>🟢 Ingresos:</strong> {resumen.ingresos.toLocaleString()} Gs</p>
            <p><strong>🟢 Monto Apertura:</strong> {resumen.monto_apertura.toLocaleString()} Gs</p>
            <p><strong>🔴 Egresos:</strong> {resumen.egresos.toLocaleString()} Gs</p>
            <p><strong>🛒 Compras:</strong> {resumen.compras.toLocaleString()} Gs</p>
            <p><strong>💸 Gastos/Ajustes:</strong> {resumen.gastos.toLocaleString()} Gs</p>
            <p><strong>💵 Ventas Contado:</strong> {resumen.contado.toLocaleString()} Gs</p>
            <p><strong>📥 Cobros Deuda:</strong> {resumen.cobrado.toLocaleString()} Gs</p>
            <p><strong>📄 Ventas Crédito:</strong> {resumen.credito.toLocaleString()} Gs</p>
          </div>

          <div className="mt-6 text-lg font-semibold text-gray-900 border-t pt-4">
            💰 <span className="text-green-700">Total en Caja:</span> {resumen.monto_cierre.toLocaleString()} Gs
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-6">
            {resumen.estado === 'abierto' && (
              <button
                onClick={() => setAdvertOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md shadow w-full sm:w-auto"
              >
                ❌ Cerrar Caja
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md w-full sm:w-auto"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
        <div>
          <CrearArqueoCaja ref={arqueoRef} idmovimiento={idmovimiento} estadoMovimiento={resumen.estado === "cerrado"} arqueoCerrado={arqueo}  />
        </div>
      </div>
      {/* Modales */}
      <ModalAdvert
        isOpen={advertOpen}
        onClose={() => setAdvertOpen(false)}
        onConfirm={handleCerrarCaja}
        message="¿Estás seguro de que deseas cerrar la caja?"
        confirmButtonText="Sí, cerrar"
     
      />

      <ModalSuccess
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        message={modalMessage}
      />

      <ModalError
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default CajaResumen;
