'use client';

import { useEffect, useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import ModalCrearUsuario from './Modals/ModalCrearUsuario';
import ModalEditarUsuario from './Modals/ModalEditarUsuario';
import { getUsuariosPaginated, deleteUsuario } from '../services/usuarios';
import ModalAdvert from '../components/ModalAdvert';
import ModalSuccess from '../components/ModalSuccess';
import ModalError from '../components/ModalError';

const ListarUsuarios = () => {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [modalAdvertOpen, setModalAdvertOpen] = useState(false);
    const [modalSuccessOpen, setModalSuccessOpen] = useState(false);
    const [modalErrorOpen, setModalErrorOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);

    const [idusuario, setIdUsuario] = useState<number>(0);

    const fetchUsuarios = async () => {
        try {
            
            const res = await getUsuariosPaginated({ page, limit, search });

            setUsuarios(res.data.data ?? []);
            setTotalPages(res.data.totalPages ?? 1);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [page, limit, search]);

    const handleAnularUsuario = async () => {
        if (!usuarioSeleccionado) return;

        try {

            await deleteUsuario(usuarioSeleccionado.idusuarios);

            setModalAdvertOpen(false);
            setModalMessage('✅ Usuario anulado correctamente');
            setModalSuccessOpen(true);
            fetchUsuarios();
        } catch (error) {
            setModalAdvertOpen(false);
            setModalMessage('❌ Error al anular usuario');
            setModalErrorOpen(true);
            console.error(error);
        }
    };

    const handleEditarUsuario = (idUsuario: number) => {
        setIdUsuario(idUsuario);
        setModalEditarOpen(true);
    }

    return (
        <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full">
                {/* Encabezado */}
                <div className="flex items-center justify-between mb-6 border-b pb-6">
                    <div className="flex items-center gap-3">
                        <UserGroupIcon className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
                    </div>
                    <select
                        className="text-sm px-4 py-2 border border-gray-300 rounded-md"
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

                {/* Buscador + Crear */}
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-[380px]">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por login o acceso..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                        </div>
                    </div>
                    <button onClick={() => setModalCrearOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow">
                        Crear Usuario
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
                    <table className="min-w-full text-sm bg-white">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Nombre</th>
                                <th className="px-4 py-3 text-left">Apellido</th>
                                <th className="px-4 py-3 text-left">Login</th>
                                <th className="px-4 py-3 text-left">Acceso</th>
                                <th className="px-4 py-3 text-left">Estado</th>
                                <th className="px-4 py-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {usuarios.map((user, idx) => (
                                <tr key={user.idusuarios} className="border-b hover:bg-gray-50 even:bg-gray-50">
                                    <td className="px-4 py-3">{(page - 1) * limit + idx + 1}</td>
                                    <td className="px-4 py-3 font-medium">{user.nombre}</td>
                                    <td className="px-4 py-3 font-medium">{user.apellido}</td>
                                    <td className="px-4 py-3 font-medium">{user.login}</td>
                                    <td className="px-4 py-3">{user.acceso}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block px-2 py-1 text-xs rounded-full ${user.estado === 'activo'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {user.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2 flex-wrap">
                                            {/* Botón Editar */}
                                            <button
                                                onClick={() => handleEditarUsuario(user.idusuarios)}
                                                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm shadow transition"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11.5A1.5 1.5 0 005.5 20H17a2 2 0 002-2v-5" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5L19.5 6.5M12 8L19 1" />
                                                </svg>
                                                Editar
                                            </button>

                                            {/* Botón Anular */}
                                            <button
                                                onClick={() => {
                                                    setUsuarioSeleccionado(user);
                                                    setModalAdvertOpen(true);
                                                }}
                                                className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm shadow transition"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Anular
                                            </button>
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

            {/* Modales */}
            <ModalCrearUsuario
                isOpen={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSuccess={fetchUsuarios}
            />
            <ModalEditarUsuario
                isOpen={modalEditarOpen}
                onClose={() => setModalEditarOpen(false)}
                id={idusuario}
                onSuccess={fetchUsuarios} />
            <ModalAdvert
                isOpen={modalAdvertOpen}
                message={`¿Deseás anular al usuario "${usuarioSeleccionado?.login}"?`}
                onConfirm={handleAnularUsuario}
                onClose={() => setModalAdvertOpen(false)}
            />
            <ModalSuccess
                isOpen={modalSuccessOpen}
                message={modalMessage}
                onClose={() => setModalSuccessOpen(false)}
            />
            <ModalError
                isOpen={modalErrorOpen}
                message={modalMessage}
                onClose={() => setModalErrorOpen(false)}
            />
        </div>
    );
};

export default ListarUsuarios;
