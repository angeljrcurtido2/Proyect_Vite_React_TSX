'use client';

import { useEffect, useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import ModalCrearProveedor from './ModalsProveedor/ModalCrearProveedor';
import ModalEditarProveedor from './ModalsProveedor/ModalEditarProveedor';
import { deleteProveedor, getProveedoresPaginated } from '../../services/proveedor';

interface ListarProveedoresProps {
    onSelect?: (proveedor: any) => void;
}

const ListarProveedores = ({ onSelect }: ListarProveedoresProps) => {
    const [modalEditarProveedorOpen, setModalEditarProveedorOpen] = useState(false);
    const [idProvider, setIdProvider] = useState<number | string>("");
    const [modalCrearProveedorOpen, setModalCrearProveedorOpen] = useState(false);
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProveedores = async () => {
        try {
            const res = await getProveedoresPaginated({ page, limit, search });
            setProveedores(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este proveedor?');
        if (!confirmDelete) return;

        try {
            await deleteProveedor(id);
            fetchProveedores();
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
            alert('❌ No se pudo eliminar el proveedor');
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, [page, limit, search]);

    const handleEdit = (id: number) => {
        setIdProvider(id);
        setModalEditarProveedorOpen(true);
    }

    const styleTableTh = "px-3 text-left border-b"
    const styleTableTd = "px-3 border-b"
    const styleButton = "text-white px-1 py-1 rounded-full text-xs shadow mt-1 mb-1"

    return (
        <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full">
                {/* Encabezado */}
                <div className="flex items-center justify-between mb-6 border-b pb-6">
                    <div className="flex items-center gap-3">
                        <UserGroupIcon className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Proveedores</h1>
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

                {/* Buscador + Botón crear proveedor */}
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-[380px]">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nombre, teléfono, RUC o razón social..."
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
                        onClick={() => setModalCrearProveedorOpen(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
                    >
                        Crear Proveedor
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-xl shadow-sm">
                    <table className="min-w-full text-sm bg-white border border-gray-200">
                        <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
                            <tr>
                                <th className={styleTableTh}>#</th>
                                <th className={styleTableTh}>Nombre</th>
                                <th className={styleTableTh}>Teléfono</th>
                                <th className={styleTableTh}>RUC</th>
                                <th className={styleTableTh}>Razón Social</th>
                                <th className={`${styleTableTh} !text-center`}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {proveedores.map((prov: any, idx: number) => (
                                <tr key={prov.idproveedor} className="hover:bg-gray-50 transition">
                                    <td className={styleTableTd}>{(page - 1) * limit + idx + 1}</td>
                                    <td className={`${styleTableTd} max-w-[200px] truncate`}>{prov.nombre}</td>
                                    <td className={styleTableTd}>{prov.telefono}</td>
                                    <td className={styleTableTd}>{prov.ruc}</td>
                                    <td className={styleTableTd}>{prov.razon}</td>
                                    <td className={`${styleTableTd} text-center`}>
                                        <div className="flex justify-center gap-2">
                                            {onSelect && (
                                                <button
                                                    onClick={() => onSelect(prov)}
                                                    className={`bg-blue-600 hover:bg-blue-700 ${styleButton}`}
                                                >
                                                    Seleccionar
                                                </button>
                                            )}
                                            <>
                                                <button
                                                    onClick={() => handleEdit(prov.idproveedor)}
                                                    className={`bg-yellow-400 hover:bg-yellow-500 ${styleButton}`}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prov.idproveedor)}
                                                    className={`bg-red-500 hover:bg-red-600 ${styleButton}`}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        </div>
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
            <ModalCrearProveedor
                isOpen={modalCrearProveedorOpen}
                onClose={() => setModalCrearProveedorOpen(false)}
                onSuccess={fetchProveedores}
            />
            <ModalEditarProveedor
                isOpen={modalEditarProveedorOpen}
                onClose={() => setModalEditarProveedorOpen(false)}
                id={idProvider}
                onSuccess={fetchProveedores}
            />
        </div>
    );
};

export default ListarProveedores;
