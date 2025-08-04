'use client';

import { useEffect, useState } from 'react';
import ModalAdvert from '../../../components/ModalAdvert';
import ModalSuccess from '../../../components/ModalSuccess';
import { TrashIcon, MagnifyingGlassIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { fetchDetallesPago, anularPagoDeudaCompra } from '../../../services/compras';
import { formatPY } from '../../../movimiento/utils/utils';

interface Props {
  iddeuda: number;
  onSuccess?: () => void;
}

const ListarDetallesPagosDeuda: React.FC<Props> = ({ iddeuda, onSuccess }) => {
  const [detalles, setDetalles] = useState<any[]>([]);
  const [showAdvert, setShowAdvert] = useState(false);
  const [successModalOpen,setSuccessModalOpen] = useState(false)
  const [idPagoAAnular, setIdPagoAAnular] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDetalles = async () => {
    setLoading(true);
    try {
      const response = await fetchDetallesPago(iddeuda, page, search);
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
      await anularPagoDeudaCompra(idPagoAAnular);
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

  useEffect(() => {
    fetchDetalles();
  }, [page, search]);

  return (
    <div className="mt-6 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <CreditCardIcon className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Historial de Pagos</h2>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar por observación, método o autor..."
          className="w-full px-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                <th className="px-4 py-2 text-left border">Método</th>
                <th className="px-4 py-2 text-left border">Observación</th>
                <th className="px-4 py-2 text-center border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((item, idx) => (
                <tr
                  key={item.idpago_deuda_compra}
                  className="hover:bg-gray-50 transition-all text-gray-700"
                >
                  <td className="px-4 py-2 border">{(page - 1) * 5 + idx + 1}</td>
                  <td className="px-4 py-2 border">{formatPY(item.monto_pagado)}</td>
                  <td className="px-4 py-2 border">{new Date(item.fecha_pago).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{item.metodo_pago}</td>
                  <td className="px-4 py-2 border">{item.observacion}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleAnular(item.idpago_deuda_compra)}
                      className="text-red-600 hover:text-red-800 flex items-center justify-center gap-1 text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Anular
                    </button>
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
    </div>
  );
};

export default ListarDetallesPagosDeuda;
