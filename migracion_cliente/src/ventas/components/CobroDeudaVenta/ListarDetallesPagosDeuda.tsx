'use client';

import { useEffect, useState } from 'react';
import { TrashIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { listarDetallePagosDeudaCompleto } from '../../../services/ventas';
import { listarDetallePagosDeudaVenta, anularPagoDeudaVenta, comprobantePagoDeudaDetalleId } from '../../../services/ventas';
import ModalDetallePagoDeuda from './components/ModalDetallePagoDeudas';
import ModalAdvert from '../../../components/ModalAdvert';
import ModalSuccess from '../../../components/ModalSuccess';
import { formatPY } from '../../../movimiento/utils/utils';

interface DetallePago {
  idpago_deuda: number;
  monto_pagado: string;
  fecha_pago: string;
  observacion: string;
  metodo_pago: string;
  creado_por: string;
}

interface Props {
  iddeuda: number;
  onSuccess?: () => void;
}

const ListarDetallesPagosDeuda: React.FC<Props> = ({ iddeuda, onSuccess }) => {
  const [detalles, setDetalles] = useState<DetallePago[]>([]);
  const [showAdvert, setShowAdvert] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [idPagoAAnular, setIdPagoAAnular] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const loadingPdfId = null
  
  const fetchDetalles = async () => {
    setLoading(true);
    try {
      const response = await listarDetallePagosDeudaVenta(iddeuda, {
        page,
        limit,
        search: "",
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      });

      setDetalles(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al cargar detalles de pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnular = (idpago: number) => {
    setIdPagoAAnular(idpago);
    setShowAdvert(true);
  };

  const confirmarAnulacion = async () => {
    if (idPagoAAnular === null) return;

    try {
      await anularPagoDeudaVenta(idPagoAAnular);
      setSuccessModalOpen(true)
      fetchDetalles();
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error al anular el pago:', error);
      alert('❌ Error al anular el pago.');
    } finally {
      setShowAdvert(false);
      setIdPagoAAnular(null);
    }
  };

  const handleOpenDetalle = (pago: any) => {
    setPagoSeleccionado(pago);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchDetalles();
  }, [page, limit, fechaInicio, fechaFin]);

  const handleReImprimir = async (idpago_deuda: number) => {

    const comprobante = await comprobantePagoDeudaDetalleId(idpago_deuda);

    if (comprobante.data?.comprobanteBase64) {
      const base64 = comprobante.data.comprobanteBase64;
      const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }

  };
  return (
    <div className="mt-6 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6 border-b pb-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCardIcon className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Historial de Pagos</h2>
        </div>

        <select
          className="text-sm px-3 py-1 border border-gray-300 rounded-md mb-4"
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
      </div>
      <div className="flex flex-wrap items-end gap-4 mb-6">

        {/* Fecha inicio */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm text-gray-600 mb-1">Fecha inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => {
              setFechaInicio(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Fecha fin */}
        <div className="w-full sm:w-auto">
          <label className="block text-sm text-gray-600 mb-1">Fecha fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => {
              setFechaFin(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {/* Generar Reporte */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow transition"
          onClick={async () => {
            try {
              const response = await listarDetallePagosDeudaCompleto(iddeuda);

              const base64 = response.data.comprobanteBase64 || response.data.reporteBase64 || response.data.reportePDFBase64;

              if (!base64) {
                alert("⚠️ No se encontró el archivo PDF en la respuesta.");
                return;
              }

              const link = document.createElement("a");
              link.href = `data:application/pdf;base64,${base64}`;
              link.download = `Reporte_Pagos_Cliente_${iddeuda}.pdf`;
              link.click();
            } catch (error) {
              console.error("❌ Error al generar el reporte completo:", error);
              alert("❌ Error al generar el reporte.");
            }
          }}
        >
          Generar reporte de pagos
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : detalles.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No hay registros encontrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md">
            <thead className="bg-green-100 text-green-800 text-xs font-semibold">
              <tr>
                <th className="px-4 py-2 text-left border">#</th>
                <th className="px-4 py-2 text-left border">Monto</th>
                <th className="px-4 py-2 text-left border">Fecha</th>

                <th className="px-4 py-2 text-center border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((item, idx) => (
                <tr
                  key={item.idpago_deuda}
                  className="hover:bg-gray-50 transition-all text-gray-700"
                >
                  <td className="px-4 py-2 border">{(page - 1) * 5 + idx + 1}</td>
                  <td className="px-4 py-2 border">{formatPY(item.monto_pagado)}</td>
                  <td className="px-4 py-2 border">{new Date(item.fecha_pago).toLocaleString()}</td>

                  <td className="px-4 py-2 border text-center">
                    <div className="flex flex-row gap-3 justify-center">
                      {/* Botón Anular */}
                      <button
                        onClick={() => handleAnular(item.idpago_deuda)}
                        className="flex items-center gap-2 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md shadow-sm transition-colors duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Anular
                      </button>

                      {/* Botón Detalles */}
                      <button
                        onClick={() => handleOpenDetalle(item)}
                        className="flex items-center gap-2 text-sm text-white bg-yellow-400 hover:bg-yellow-500 px-3 py-1.5 rounded-md shadow-sm transition-colors duration-200"
                      >
                        Detalles
                      </button>
                      <button
                        onClick={() => handleReImprimir(item.idpago_deuda)}
                        disabled={loadingPdfId === item.idpago_deuda}
                        className="flex items-center gap-2 text-sm text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-3 py-1.5 rounded-md shadow-sm transition-colors duration-200"
                      >
                        {loadingPdfId === item.idpago_deuda ? 'Abriendo...' : 'Re-Imprimir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-6 text-sm">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅ Anterior
        </button>
        <span className="text-gray-700">Página <b>{page}</b> de <b>{totalPages}</b></span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente ➡
        </button>
      </div>
      <ModalAdvert
        isOpen={showAdvert}
        onClose={() => setShowAdvert(false)}
        onConfirm={confirmarAnulacion}
        message="¿Estás seguro de que deseas anular este pago? Esta acción actualizará la deuda."
        confirmButtonText="Sí, Anular"

      />
      <ModalSuccess
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Anulación procesada con éxito"
      />
      <ModalDetallePagoDeuda
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pago={pagoSeleccionado}
      />
    </div>
  );
};

export default ListarDetallesPagosDeuda;
