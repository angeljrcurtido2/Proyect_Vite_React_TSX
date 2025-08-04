'use client';

import { useEffect, useState } from 'react';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import ModalAdvert from '../../../components/ModalAdvert';
import ModalError from '../../../components/ModalError';
import ModalSuccess from '../../../components/ModalSuccess';
import ModalCrearTiposEgreso from '../ModalMovimiento/Egreso/ModalCrearTiposEgreso';
import {getTiposEgresoPaginated,anularTipoEgreso} from '../../../services/egreso';

interface TipoEgreso {
  idtipo_egreso: number;
  descripcion: string;
  created_at: string;
}

interface ListarTiposEgresoProps {
  onSelect?: (tipo: TipoEgreso) => void;
}

const ListarTiposEgresoList = ({ onSelect }: ListarTiposEgresoProps) => {
  const [egresos, setEgresos] = useState<TipoEgreso[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [showAdvert, setShowAdvert] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idEgresoAAnular, setIdEgresoAAnular] = useState<number | null>(null);

  const fetchEgresos = async () => {
    try {
      const res = await getTiposEgresoPaginated({ page, limit, search });
      setEgresos(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error al obtener tipos de egresos:', error);
      setErrorMessage('Error al obtener los tipos de egresos.');
      setErrorModalOpen(true);
    }
  };

  const handleAnular = (id: number) => {
    setIdEgresoAAnular(id);
    setShowAdvert(true);
  };

  const confirmarAnulacion = async () => {
    if (idEgresoAAnular === null) return;

    try {
      await anularTipoEgreso(idEgresoAAnular);
      setSuccessModalOpen(true);
      fetchEgresos();
    } catch (error) {
      console.error('Error al anular tipo de egreso:', error);
      setErrorMessage('❌ No se pudo anular el tipo de egreso.');
      setErrorModalOpen(true);
    } finally {
      setShowAdvert(false);
      setIdEgresoAAnular(null);
    }
  };

  useEffect(() => {
    fetchEgresos();
  }, [page, limit, search]);

  return (
    <div className="bg-gradient-to-br from-red-50 to-white py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <MinusCircleIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tipos de Egresos</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="🔍 Buscar descripción..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[280px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow"
            >
              Crear
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-red-100 text-red-800 font-semibold text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left border-b">#</th>
                <th className="px-4 py-2 text-left border-b">Descripción</th>
                <th className="px-4 py-2 text-left border-b">Fecha Creación</th>
                <th className="px-4 py-2 text-center border-b">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {egresos.map((egreso, idx) => (
                <tr key={egreso.idtipo_egreso} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2 border-b">{egreso.descripcion}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(egreso.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {onSelect && (
                      <button
                        onClick={() => onSelect(egreso)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow"
                      >
                        Seleccionar
                      </button>
                    )}
                    <button
                      onClick={() => handleAnular(egreso.idtipo_egreso)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow ml-2"
                    >
                      Anular
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded shadow disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded shadow disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>

        {/* Modales */}
        <ModalCrearTiposEgreso
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={fetchEgresos}
        />

        <ModalAdvert
          isOpen={showAdvert}
          onClose={() => setShowAdvert(false)}
          onConfirm={confirmarAnulacion}
          message="¿Estás seguro de que deseas anular este tipo de egreso?"
          confirmButtonText="Sí, Anular"
      
        />

        <ModalSuccess
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          message="Anulación procesada con éxito"
        />

        <ModalError
          isOpen={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          message={errorMessage}
        />
      </div>
    </div>
  );
};

export default ListarTiposEgresoList;
