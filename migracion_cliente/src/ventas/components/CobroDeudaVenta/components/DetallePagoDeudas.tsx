'use client';

import { type FC } from 'react';

interface DetallePago {
  idpago_deuda: number;
  monto_pagado: string;
  fecha_pago: string;
  observacion: string;
  idformapago: number;
  transferencia_banco_origen?: string | null;
  transferencia_numero_cuenta?: string | null;
  transferencia_tipo_cuenta?: string | null;
  transferencia_titular_cuenta?: string | null;
  transferencia_observacion?: string | null;
  tarjeta_tipo_tarjeta?: string | null;
  tarjeta_entidad?: string | null;
  tarjeta_monto?: string | null;
  tarjeta_observacion?: string | null;
  cheque_banco?: string | null;
  cheque_nro_cheque?: string | null;
  cheque_monto?: string | null;
  cheque_fecha_emision?: string | null;
  cheque_fecha_vencimiento?: string | null;
  cheque_titular?: string | null;
  cheque_estado?: string | null;
}

interface Props {
  pago: DetallePago;
}

const formaPagoTexto = (id: number) => {
  switch (id) {
    case 1: return "Efectivo 💵";
    case 2: return "Transferencia 🏦";
    case 3: return "Tarjeta 💳";
    case 4: return "Cheque 🧾";
    default: return "Desconocido ❓";
  }
};

const DetallePagoDeudas: FC<Props> = ({ pago }) => {
  const { idformapago } = pago;

  const renderDetalleMetodoPago = () => {
    switch (idformapago) {
      case 1:
        return (
          <div className="text-green-700 font-medium text-center">Pago realizado en efectivo.</div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div><strong>Banco origen:</strong> {pago.transferencia_banco_origen}</div>
            <div><strong>Nro. cuenta:</strong> {pago.transferencia_numero_cuenta}</div>
            <div><strong>Tipo cuenta:</strong> {pago.transferencia_tipo_cuenta}</div>
            <div><strong>Titular:</strong> {pago.transferencia_titular_cuenta}</div>
            <div className="col-span-2"><strong>Observación:</strong> {pago.transferencia_observacion}</div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div><strong>Tipo tarjeta:</strong> {pago.tarjeta_tipo_tarjeta}</div>
            <div><strong>Entidad:</strong> {pago.tarjeta_entidad}</div>
            <div><strong>Monto:</strong> {pago.tarjeta_monto}</div>
            <div className="col-span-2"><strong>Observación:</strong> {pago.tarjeta_observacion}</div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div><strong>Banco:</strong> {pago.cheque_banco}</div>
            <div><strong>Nro. Cheque:</strong> {pago.cheque_nro_cheque}</div>
            <div><strong>Monto:</strong> {pago.cheque_monto}</div>
            <div><strong>Emisión:</strong> {pago.cheque_fecha_emision}</div>
            <div><strong>Vencimiento:</strong> {pago.cheque_fecha_vencimiento}</div>
            <div><strong>Titular:</strong> {pago.cheque_titular}</div>
            <div><strong>Estado:</strong> {pago.cheque_estado}</div>
          </div>
        );
      default:
        return <p className="text-gray-500 italic text-center">Sin detalle específico de la forma de pago.</p>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto border border-gray-200">
      <div className="mb-4 border-b pb-2">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          🧾 Detalle del Pago #{pago.idpago_deuda}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 mb-6">
        <div><strong>Monto pagado:</strong> {pago.monto_pagado} Gs</div>
        <div><strong>Fecha de pago:</strong> {new Date(pago.fecha_pago).toLocaleString()}</div>
        <div><strong>Observación:</strong> {pago.observacion}</div>
        <div>
          <strong>Forma de pago:</strong>
          <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
            {formaPagoTexto(pago.idformapago)}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border text-sm">
        <h3 className="text-gray-600 font-medium mb-2">Detalles específicos</h3>
        {renderDetalleMetodoPago()}
      </div>
    </div>
  );
};

export default DetallePagoDeudas;
