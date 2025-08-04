'use client';
import type { FC } from "react";
import { useEffect, useState } from 'react';
import { getFormasPago } from "../../../services/formasPago";
import ModalSeleccionarDatosBancarios from "../../../datosbancarios/components/ModalsDatosBancarios/ModalSeleccionarDatosBancarios";
import ModalFormCheque from "../../../ventas/components/Cheques/ModalFormCheque";
import ModalFormTarjeta from "../../../ventas/components/Tarjetas/ModalFormTarjeta";

interface Props {
  compra: any;
  setCompra: (data: any) => void;
  proveedorSeleccionado: any;
  openProveedorModal: () => void;
}

const FormCompra: FC<Props> = ({ compra, setCompra, proveedorSeleccionado, openProveedorModal }) => {
  const [formasPago, setFormasPago] = useState<any[]>([]);
  const [modalSeleccionarOpen, setModalSeleccionarOpen] = useState(false);

  const [modalChequeOpen, setModalChequeOpen] = useState(false);
  const [datosCheque, setDatosCheque] = useState<any>({});

  const [modalTarjetaOpen, setModalTarjetaOpen] = useState(false);
  const [datosTarjeta, setDatosTarjeta] = useState<any>({});

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

  useEffect(() => {
    if (compra.tipo === 'credito') {
      setCompra((prev: any) => ({ ...prev, idformapago: null }));
    }
  }, [compra.tipo]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Proveedor</label>
        <button
          type="button"
          onClick={openProveedorModal}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg text-left bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
        >
          {proveedorSeleccionado?.nombre || '-- Seleccionar proveedor --'}
        </button>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Nro. Factura</label>
        <input
          type="text"
          required
          value={compra.nro_factura}
          onChange={e => setCompra((prev: any) => ({ ...prev, nro_factura: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Fecha</label>
        <input
          type="date"
          required
          value={compra.fecha}
          onChange={e => setCompra((prev: any) => ({ ...prev, fecha: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Tipo de Compra</label>
        <select
          value={compra.tipo}
          onChange={e => setCompra((prev: any) => ({ ...prev, tipo: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="contado">Contado</option>
          <option value="credito">Crédito</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Forma de Pago</label>
        <select
          value={compra.idformapago || ''}
          onChange={e =>
            setCompra((prev: any) => ({
              ...prev,
              idformapago: Number(e.target.value),
            }))
          }
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={compra.tipo === 'credito'}
          required={compra.tipo === 'contado'}
        >
          <option value="">-- Seleccione una forma de pago (solo contado)--</option>
          {formasPago.map((forma) => (
            <option key={forma.idformapago} value={forma.idformapago}>
              {forma.descripcion}
            </option>
          ))}
        </select>
      </div>
      {compra.idformapago === 2 && (
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

      {compra.idformapago === 3 && (
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

      {compra.idformapago === 4 && (
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
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-600 mb-1">Observación</label>
        <input
          type="text"
          placeholder="Observación (opcional)"
          value={compra.observacion}
          onChange={e => setCompra((prev: any) => ({ ...prev, observacion: e.target.value }))}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ModalSeleccionarDatosBancarios
        isOpen={modalSeleccionarOpen}
        onClose={() => setModalSeleccionarOpen(false)}
        onSelect={(dato: any) => {
          setCompra((prev: any) => ({
            ...prev,
            detalle_transferencia_compra: dato
          }));
          setModalSeleccionarOpen(false);
        }}
      />

      <ModalFormCheque
        isOpen={modalChequeOpen}
        onClose={() => {
          setCompra((prev: any) => ({ ...prev, detalle_cheque: datosCheque }));
          setModalChequeOpen(false);
        }}
        datosCheque={datosCheque}
        setDatosCheque={setDatosCheque}
      />

      <ModalFormTarjeta
        isOpen={modalTarjetaOpen}
        onClose={() => {
          setCompra((prev: any) => ({ ...prev, detalle_tarjeta: datosTarjeta }));
          setModalTarjetaOpen(false);
        }}
        datosTarjeta={datosTarjeta}
        setDatosTarjeta={setDatosTarjeta}
      />
    </div>
  );
};

export default FormCompra;
