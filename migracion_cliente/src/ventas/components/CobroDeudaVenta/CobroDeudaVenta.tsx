'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { type CobroDeudaProps } from '../interface';
import { pagarDeudaVenta } from '../../../services/ventas';
import ModalFormTarjeta from '../Tarjetas/ModalFormTarjeta';
import ModalFormCheque from '../Cheques/ModalFormCheque';
import { getFormasPago } from '../../../services/formasPago';
import ModalError from '../../../components/ModalError';
import ModalSeleccionarDatosBancarios from '../../../datosbancarios/components/ModalsDatosBancarios/ModalSeleccionarDatosBancarios';

const CobroDeudaVenta: React.FC<CobroDeudaProps> = ({
  iddeuda,
  onClose,
  onSuccess,
  setComprobante,
  setShowComprobante,
  montoMaximo = 0
}) => {
  const [monto, setMonto] = useState('');
  const [observacion, setObservacion] = useState('---');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModalError, setShowModalError] = useState(false);

  const [idformapago, setIdformapago] = useState<number | null>(null);

  const [detalleTransferenciaCobro, setDetalleTransferenciaCobro] = useState<any>(null);
  const [modalSeleccionarOpen, setModalSeleccionarOpen] = useState(false);

  const [detalleTarjetaVentaCobro, setDetalleTarjetaVentaCobro] = useState<any>({
    tipo_tarjeta: '',
    entidad: '',
    monto: 0,
    observacion: ''
  });
  const [modalTarjetaOpen, setModalTarjetaOpen] = useState(false);

  const [detalleChequeVentaCobro, setDetalleChequeVentaCobro] = useState<any>({
    banco: '',
    nro_cheque: '',
    monto: 0,
    fecha_emision: '',
    fecha_vencimiento: '',
    titular: '',
    estado: 'pendiente'
  });
  const [modalChequeOpen, setModalChequeOpen] = useState(false);

  const [formasPago, setFormasPago] = useState<any[]>([]);

  useEffect(() => {
    const fetchFormasPago = async () => {
      try {
        const res = await getFormasPago();
        setFormasPago(res.data);
      } catch (err) {
        console.error("❌ Error al obtener formas de pago", err);
      }
    };

    fetchFormasPago();
  }, []);

  const handlePago = async () => {
    const valor = parseFloat(monto);
    if (!monto || isNaN(valor) || valor <= 0) {
      setError('❌ Ingrese un monto válido.');
      return;
    }

    if (valor > montoMaximo) {
      setShowModalError(true);
      return;
    }

    if (!idformapago) {
      setError('❌ Debe seleccionar una forma de pago.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await pagarDeudaVenta({
        iddeuda,
        observacion,
        idformapago,
        monto: valor,
        detalle_transferencia: idformapago === 2 ? detalleTransferenciaCobro : null,
        detalle_tarjeta_venta_credito: idformapago === 4 ? detalleTarjetaVentaCobro : null,
        detalle_cheque_venta_cobro: idformapago === 3 ? detalleChequeVentaCobro : null
      });

      setMensaje(response.data.message);

      if (response.data?.comprobanteBase64) {
        const base64 = response.data.comprobanteBase64;
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }

      setMonto('');
      setComprobante && setComprobante(response.data.comprobante);
      setShowComprobante && setShowComprobante(true);
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      setError(error.response?.data?.error || '❌ Error al registrar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[600px] mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Cobro de Deuda</h2>

        {/* Inputs de Monto y Observación */}
        <div className='flex flex-row gap-3'>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto a pagar</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder={`Máximo permitido: ${montoMaximo.toFixed(2)}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
            <input
              type="text"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="N° de referencia de transacción o cheque"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Forma de Pago */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Forma de Pago</label>
          <select
            value={idformapago || ''}
            onChange={e => {
              setIdformapago(Number(e.target.value));
              setDetalleTransferenciaCobro(null);
              setDetalleTarjetaVentaCobro({
                tipo_tarjeta: '',
                entidad: '',
                monto: 0,
                observacion: ''
              });
              setDetalleChequeVentaCobro({
                banco: '',
                nro_cheque: '',
                monto: 0,
                fecha_emision: '',
                fecha_vencimiento: '',
                titular: '',
                estado: 'pendiente'
              });
            }}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seleccione una forma de pago --</option>
            {formasPago.map((forma) => (
              <option key={forma.idformapago} value={forma.idformapago}>
                {forma.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Botones para Detalle */}
        {idformapago === 2 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setModalSeleccionarOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Seleccionar Datos Bancarios
            </button>
          </div>
        )}

        {idformapago === 4 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setModalTarjetaOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Agregar Detalle de Tarjeta
            </button>
          </div>
        )}

        {idformapago === 3 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setModalChequeOpen(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Agregar Detalle de Cheque
            </button>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-red-600 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handlePago}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Registrar Pago'}
          </button>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center text-red-600 text-sm">
            <XCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalError
        message={`El monto ingresado supera el permitido. Máximo: ${montoMaximo.toFixed(2)}.`}
        onClose={() => setShowModalError(false)}
        isOpen={showModalError}
      />

      <ModalSeleccionarDatosBancarios
        isOpen={modalSeleccionarOpen}
        onClose={() => setModalSeleccionarOpen(false)}
        onSelect={(dato: any) => {
          setDetalleTransferenciaCobro(dato);
          setModalSeleccionarOpen(false);
        }}
      />

      <ModalFormTarjeta
        isOpen={modalTarjetaOpen}
        onClose={() => setModalTarjetaOpen(false)}
        datosTarjeta={detalleTarjetaVentaCobro}
        setDatosTarjeta={setDetalleTarjetaVentaCobro}
      />

      <ModalFormCheque
        isOpen={modalChequeOpen}
        onClose={() => setModalChequeOpen(false)}
        datosCheque={detalleChequeVentaCobro}
        setDatosCheque={setDetalleChequeVentaCobro}
      />
    </>
  );
};

export default CobroDeudaVenta;
