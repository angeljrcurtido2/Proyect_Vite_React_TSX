'use client';

import { useEffect, useState } from 'react';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import ModalsCrearActividadesEconomicas from './ModalsActivEcon/ModalsCrearActividadesEconomicas';
import ModalsEditarActividadesEconomicas from './ModalsActivEcon/ModalsEditarActividadesEconomicas';
import {fetchActividadesEconomicas,deleteActividadEconomica} from '../../services/facturador';

interface ListarActividadesEconomicasProps {
  onSelect?: (selectedActivities: any[]) => void;
}

const ListarActividadesEconomicas = ({ onSelect }: ListarActividadesEconomicasProps) => {
    const [actividades, setActividades] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [modalCrearActividadOpen, setModalCrearActividadOpen] = useState(false);
    const [modalEditarActividadOpen, setModalEditarActividadOpen] = useState(false);
    const [idActividadEditar, setIdActividadEditar] = useState<number | string>("");

    const [selectedActivities, setSelectedActivities] = useState<any[]>([]);

    const fetchActividades = async () => {
        try {
           const res = await fetchActividadesEconomicas(page, limit, search);
            setActividades(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error al obtener actividades económicas:', error);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar esta actividad económica?');
        if (!confirmDelete) return;

        try {
            await deleteActividadEconomica(id);
            fetchActividades();
        } catch (error) {
            console.error('Error al eliminar actividad:', error);
            alert('❌ No se pudo eliminar la actividad económica');
        }
    };

    const handleEdit = (id: number) => {
        setIdActividadEditar(id);
        setModalEditarActividadOpen(true);
    };

    useEffect(() => {
        fetchActividades();
    }, [page, limit, search]);

    useEffect(() => {
        if (onSelect) {
            onSelect(selectedActivities);
        }
    }, [selectedActivities, onSelect]);

    const toggleSelect = (actividad: any) => {
        if (selectedActivities.some(a => a.idactividad === actividad.idactividad)) {
            setSelectedActivities(prev => prev.filter(a => a.idactividad !== actividad.idactividad));
        } else {
            setSelectedActivities(prev => [...prev, actividad]);
        }
    };

    const styleTableTh = "px-3 text-left border-b";
    const styleTableTd = "px-3 border-b";
    const styleButton = "text-white px-2 py-1 rounded-full text-xs shadow mt-1 mb-1";

    return (
        <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full">
                {/* Encabezado */}
                <div className="flex items-center justify-between mb-6 border-b pb-6">
                    <div className="flex items-center gap-3">
                        <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Actividades Económicas</h1>
                    </div>
                    <select
                        className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-[380px]">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por descripción..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalCrearActividadOpen(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
                    >
                        Crear Actividad
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-xl shadow-sm">
                    <table className="min-w-full text-sm bg-white border border-gray-200">
                        <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
                            <tr>
                                {onSelect && <th className={styleTableTh}>Seleccionar</th>}
                                <th className={styleTableTh}>#</th>
                                <th className={styleTableTh}>Descripción</th>
                                <th className={`${styleTableTh} !text-center`}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {actividades.length === 0 ? (
                                <tr>
                                    <td className="text-center py-4" colSpan={onSelect ? 4 : 3}>
                                        No se encontraron actividades económicas.
                                    </td>
                                </tr>
                            ) : (
                                actividades.map((actividad: any, idx: number) => (
                                    <tr key={actividad.idactividad} className="hover:bg-gray-50 transition">
                                        {onSelect && (
                                            <td className={`${styleTableTd} text-center`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedActivities.some(a => a.idactividad === actividad.idactividad)}
                                                    onChange={() => toggleSelect(actividad)}
                                                />
                                            </td>
                                        )}
                                        <td className={styleTableTd}>{(page - 1) * limit + idx + 1}</td>
                                        <td className={`${styleTableTd} max-w-[400px] truncate`}>{actividad.descripcion}</td>
                                        <td className={`${styleTableTd} text-center`}>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(actividad.idactividad)}
                                                    className={`bg-yellow-400 hover:bg-yellow-500 ${styleButton}`}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(actividad.idactividad)}
                                                    className={`bg-red-500 hover:bg-red-600 ${styleButton}`}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow disabled:opacity-50"
                    >
                        ⬅ Anterior
                    </button>
                    <span className="text-sm text-gray-600">
                        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                    </span>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page >= totalPages}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow disabled:opacity-50"
                    >
                        Siguiente ➡
                    </button>
                </div>
            </div>

            {/* Modales */}
            <ModalsCrearActividadesEconomicas
                isOpen={modalCrearActividadOpen}
                onClose={() => setModalCrearActividadOpen(false)}
                onSuccess={fetchActividades}
            />
            <ModalsEditarActividadesEconomicas
                isOpen={modalEditarActividadOpen}
                onClose={() => setModalEditarActividadOpen(false)}
                id={idActividadEditar}
                onSuccess={fetchActividades}
            />
        </div>
    );
};

export default ListarActividadesEconomicas;
