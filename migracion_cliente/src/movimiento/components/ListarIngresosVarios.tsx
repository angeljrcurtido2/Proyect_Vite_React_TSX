'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ModalCrearIngresosVarios from './ModalMovimiento/ModalCrearIngresosVarios';
import ModalAdvert   from '../../components/ModalAdvert';
import ModalError    from '../../components/ModalError';
import ModalSuccess  from '../../components/ModalSuccess';
import {
  getIngresosPaginated,
  deleteIngreso
} from '../../services/ingreso';
import { formatPY } from '../utils/utils';

interface Ingreso {
  idingreso: number;
  monto: number;
  concepto: string;
  fecha: string;
  tipo_ingreso: string;
}

const ListarIngresosVarios = () => {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [limit, setLimit]       = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [isOpenCrear, setIsOpenCrear] = useState(false);
  const [showAdvert, setShowAdvert]   = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [showErrorModal, setShowErrorModal]     = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ingresoAAnular, setIngresoAAnular] = useState<number | null>(null);

  const fetchIngresos = useCallback(async () => {
    try {
      const { data } = await getIngresosPaginated({
        page,
        limit,
        search,
        fechaDesde,
        fechaHasta
      });
      setIngresos(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error al obtener ingresos:', err);
    }
  }, [page, limit, search, fechaDesde, fechaHasta]);

  useEffect(() => {
    fetchIngresos();
  }, [fetchIngresos]);

  const handleAnularIngreso = (id: number) => {
    setIngresoAAnular(id);
    setShowAdvert(true);
  };

  const confirmarAnulacion = async () => {
    if (!ingresoAAnular) return;
    try {
      await deleteIngreso(ingresoAAnular);
      setSuccessModalOpen(true);
      fetchIngresos();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al anular ingreso';
      setErrorMessage(msg);
      setShowErrorModal(true);
    } finally {
      setShowAdvert(false);
      setIngresoAAnular(null);
    }
  };

  const dateFilters = [
    { lbl: 'Fecha desde', v: fechaDesde, set: setFechaDesde },
    { lbl: 'Fecha hasta', v: fechaHasta, set: setFechaHasta }
  ];

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto rounded-3xl bg-white p-8 shadow-lg border border-gray-200">

        <div className="mb-6 flex flex-col gap-6 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Listado de Ingresos
            </h1>
          </div>
           <input
              type="text"
              placeholder="Buscar por tipo de ingreso…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full sm:w-[260px] rounded-md border border-gray-300 px-4 py-2
                         shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50"
            />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-row gap-4">
              {dateFilters.map(({ lbl, v, set }) => (
                <div key={lbl} className="flex flex-col">
                  <span className="mb-1 text-xs font-medium text-gray-600">{lbl}</span>
                  <div className="relative">
                    <input
                      type="date"
                      value={v}
                      onChange={(e) => { set(e.target.value); setPage(1); }}
                      className="w-[165px] rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm
                                 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50"
                    />
                    <CalendarIcon className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    {v && (
                      <button
                        type="button"
                        title="Limpiar"
                        onClick={() => { set(''); setPage(1); }}
                        className="absolute -right-6 top-2 text-gray-400 hover:text-red-500 transition"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpenCrear(true)}
              className="rounded bg-yellow-500 px-5 py-2 text-white shadow
                         hover:bg-yellow-600"
            >
              Crear Ingreso Manual
            </button>

            <select
              value={limit}
              onChange={(e) => { setLimit(+e.target.value); setPage(1); }}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm
                         focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-yellow-100 text-yellow-800 text-xs font-semibold">
              <tr>
                <th className="border-b px-4 py-2 text-left">#</th>
                <th className="border-b px-4 py-2 text-left">Tipo de ingreso</th>
                <th className="border-b px-4 py-2 text-left">Descripción</th>
                <th className="border-b px-4 py-2 text-right">Monto</th>
                <th className="border-b px-4 py-2 text-left">Fecha</th>
                <th className="border-b px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {ingresos.map((ing, i) => (
                <tr key={ing.idingreso} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">{(page - 1) * limit + i + 1}</td>
                  <td className="border-b px-4 py-2">{ing.tipo_ingreso}</td>
                  <td className="border-b px-4 py-2">{ing.concepto}</td>
                  <td className="border-b px-4 py-2 text-right">{formatPY(ing.monto)}</td>
                  <td className="border-b px-4 py-2">
                    {new Date(ing.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="border-b px-4 py-2">
                    <button
                      onClick={() => handleAnularIngreso(ing.idingreso)}
                      className="flex items-center gap-1 rounded-full border border-red-500
                                 px-3 py-1 text-sm text-red-600 transition
                                 hover:bg-red-600 hover:text-white hover:border-red-600"
                    >
                      🗑 Anular
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="rounded bg-yellow-500 px-5 py-2 text-white shadow
                       hover:bg-yellow-600 disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="rounded bg-yellow-500 px-5 py-2 text-white shadow
                       hover:bg-yellow-600 disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      </div>

      <ModalAdvert
        isOpen={showAdvert}
        onClose={() => setShowAdvert(false)}
        onConfirm={confirmarAnulacion}
        message="¿Estás seguro de anular este ingreso? Esta acción no se puede deshacer."
        confirmButtonText="Sí, anular"
      />
      <ModalSuccess
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Anulación procesada con éxito"
      />
      <ModalError
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
      <ModalCrearIngresosVarios
        isOpen={isOpenCrear}
        onClose={() => setIsOpenCrear(false)}
        onSuccess={fetchIngresos}
      />
    </div>
  );
};

export default ListarIngresosVarios;
