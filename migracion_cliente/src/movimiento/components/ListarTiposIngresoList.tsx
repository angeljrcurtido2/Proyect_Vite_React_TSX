'use client';

import { useEffect, useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import ModaCrearTipoIngreso from './ModalMovimiento/ModalCrearTipoIngreso';
import { getTiposIngresoPaginated, anularTipoIngreso } from '../../services/ingreso';
import ModalAdvert from '../../components/ModalAdvert';
import ModalSuccess from '../../components/ModalSuccess';
import ModalError from '../../components/ModalError';

interface TipoIngreso {
  idtipo_ingreso: number;
  descripcion: string;
  created_at: string;
}

interface ListarTiposIngresosProps {
  onSelect?: (tipo: TipoIngreso) => void;
}

const ListarTiposIngresos = ({ onSelect }: ListarTiposIngresosProps) => {
  const [ingresos, setIngresos] = useState<TipoIngreso[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [showAdvert, setShowAdvert] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idIngresoAAnular, setIdIngresoAAnular] = useState<number | null>(null);

  const fetchIngresos = async () => {
    try {
      const res = await getTiposIngresoPaginated({ page, limit, search });
      setIngresos(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error al obtener tipos de ingresos:', error);
      setErrorMessage('Error al obtener los tipos de ingresos.');
      setErrorModalOpen(true);
    }
  };

  const handleAnular = (id: number) => {
    setIdIngresoAAnular(id);
    setShowAdvert(true);
  };

  const confirmarAnulacion = async () => {
    if (idIngresoAAnular === null) return;

    try {
      await anularTipoIngreso(idIngresoAAnular);
      setSuccessModalOpen(true);
      fetchIngresos();
    } catch (error) {
      console.error('Error al anular tipo de ingreso:', error);
      setErrorMessage('❌ No se pudo anular el tipo de ingreso.');
      setErrorModalOpen(true);
    } finally {
      setShowAdvert(false);
      setIdIngresoAAnular(null);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, [page, limit, search]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-white py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
    
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tipos de Ingresos</h1>
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
              className="w-full sm:w-[280px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
            >
              Crear
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-green-100 text-green-800 font-semibold text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left border-b">#</th>
                <th className="px-4 py-2 text-left border-b">Descripción</th>
                <th className="px-4 py-2 text-left border-b">Fecha Creación</th>
                <th className="px-4 py-2 text-center border-b">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {ingresos.map((ingreso, idx) => (
                <tr key={ingreso.idtipo_ingreso} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2 border-b">{ingreso.descripcion}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(ingreso.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {onSelect && (
                      <button
                        onClick={() => onSelect(ingreso)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow"
                      >
                        Seleccionar
                      </button>
                    )}
                      <button
                        onClick={() => handleAnular(ingreso.idtipo_ingreso)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow"
                      >
                        Anular
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>

          <ModaCrearTipoIngreso
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSuccess={fetchIngresos}
          />
      

        <ModalAdvert
          isOpen={showAdvert}
          onClose={() => setShowAdvert(false)}
          onConfirm={confirmarAnulacion}
          message="¿Estás seguro de que deseas anular este tipo de ingreso?"
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

export default ListarTiposIngresos;
