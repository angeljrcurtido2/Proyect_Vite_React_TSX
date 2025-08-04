'use client';

import { type FC, useEffect, useState } from 'react';
import { getFormasPago } from '../../../services/formasPago';
import ModalSeleccionarDatosBancarios from '../../../datosbancarios/components/ModalsDatosBancarios/ModalSeleccionarDatosBancarios';
import ModalFormCheque from '../Cheques/ModalFormCheque';
import ModalFormTarjeta from '../Tarjetas/ModalFormTarjeta';

interface Props {
  venta: any;
  setVenta: (data: any) => void;
  clienteSeleccionado: any;
  openClienteModal: () => void;
}

const FormVenta: FC<Props> = ({ venta, setVenta, clienteSeleccionado, openClienteModal }) => {
  const [formasPago, setFormasPago] = useState<any[]>([]);
  const [modalSeleccionarOpen, setModalSeleccionarOpen] = useState(false);

  const [modalChequeOpen, setModalChequeOpen] = useState(false);
  const [datosCheque, setDatosCheque] = useState({});

  const [modalTarjetaOpen, setModalTarjetaOpen] = useState(false);
  const [datosTarjeta, setDatosTarjeta] = useState({});

  useEffect(() => {
    const fetchFormasPago = async () => {
      try {
        const formasPago = await getFormasPago();
        setFormasPago(formasPago.data);
      } catch (error) {
        console.error('❌ Error al cargar formas de pago', error);
      }
    }
    fetchFormasPago();
  }, []);

  useEffect(() => {
    if (venta.tipo === 'credito') {
      setVenta((prev: any) => ({ ...prev, idformapago: null }));
    }
  }, [venta.tipo]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

      {/* Seleccionar Cliente */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Cliente</label>
        <button
          type="button"
          onClick={openClienteModal}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg text-left bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
        >
          {clienteSeleccionado?.nombre ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}` : '-- Seleccionar cliente --'}
        </button>
      </div>

      {/* Fecha de Venta */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Fecha de Venta</label>
        <input
          type="date"
          required
          value={venta.fecha}
          onChange={e => setVenta((prev: any) => ({ ...prev, fecha: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tipo de Venta */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Tipo de Venta</label>
        <select
          value={venta.tipo}
          onChange={e => setVenta((prev: any) => ({ ...prev, tipo: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="contado">Contado</option>
          <option value="credito">Crédito</option>
        </select>
      </div>

      {/* Tipo de Comprobante */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Tipo de Comprobante</label>
        <select
          value={venta.tipo_comprobante}
          onChange={e => setVenta((prev: any) => ({ ...prev, tipo_comprobante: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Seleccione --</option>
          <option value="F">Factura</option>
          <option value="T">Ticket</option>
        </select>
      </div>

      {/* Forma de Pago */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Forma de Pago</label>
        <select
          value={venta.idformapago || ''}
          onChange={e =>
            setVenta((prev: any) => ({
              ...prev,
              idformapago: Number(e.target.value),
            }))
          }
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={venta.tipo === 'credito'}
          required={venta.tipo === 'contado'}
        >
          <option value="">-- Seleccione una forma de pago (solo contado)--</option>
          {formasPago.map((forma) => (
            <option key={forma.idformapago} value={forma.idformapago}>
              {forma.descripcion}
            </option>
          ))}
        </select>
      </div>

      {venta.idformapago === 2 && (
        <div className="w-[250px]">
          <button
            type="button"
            onClick={() => setModalSeleccionarOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Seleccionar Datos Bancarios
          </button>
        </div>
      )}

      {venta.idformapago === 3 && (
        <div className="w-[250px]">
          <button
            type="button"
            onClick={() => setModalChequeOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Ingresar Datos del Cheque
          </button>
        </div>
      )}

         {venta.idformapago === 4 && (
        <div className="w-[250px]">
          <button
            type="button"
            onClick={() => setModalTarjetaOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Ingresar Datos Tarjeta C/D
          </button>
        </div>
      )}

      {/* Observación */}
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-600 mb-1">Observación</label>
        <input
          type="text"
          placeholder="Observación (opcional)"
          value={venta.observacion}
          onChange={e => setVenta((prev: any) => ({ ...prev, observacion: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ModalSeleccionarDatosBancarios
        isOpen={modalSeleccionarOpen}
        onClose={() => setModalSeleccionarOpen(false)}
        onSelect={(dato: any) => {
          console.log('Dato bancario seleccionado:', dato);
          setVenta((prev: any) => ({
            ...prev,
            datos_bancarios: dato, // podés ajustar el nombre de esta propiedad
          }));
          setModalSeleccionarOpen(false);
        }}
      />

      <ModalFormCheque
        isOpen={modalChequeOpen}
        onClose={() => {
          setVenta((prev: any) => ({ ...prev, detalle_cheque: datosCheque }));
          setModalChequeOpen(false);
        }}
        datosCheque={datosCheque}
        setDatosCheque={setDatosCheque}
      />

      <ModalFormTarjeta
        isOpen={modalTarjetaOpen}
        onClose={() => {
          setVenta((prev: any) => ({ ...prev, detalle_tarjeta: datosTarjeta }));
          setModalTarjetaOpen(false);
        }}
        datosTarjeta={datosTarjeta}
        setDatosTarjeta={setDatosTarjeta}
      />

    </div>

  );
};

export default FormVenta;
