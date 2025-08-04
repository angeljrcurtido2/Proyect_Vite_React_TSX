'use client';

import { useEffect, useState } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import {
    getDatosBancariosPaginated,
    deleteDatosBancarios
} from '../../services/datosBancarios';
import ModalSuccess from '../../components/ModalSuccess';
import ModalError from '../../components/ModalError';
import ModalAdvert from '../../components/ModalAdvert';
import ModalEditarDatosBancarios from './ModalsDatosBancarios/ModalEditarDatosBancarios';
import ModalCrearDatosBancarios from './ModalsDatosBancarios/ModalCrearDatosBancarios';

interface ListarDatosBancariosProps {
    onSelect?: (dato: any) => void;
}

const ListarDatosBancarios = ({ onSelect }: ListarDatosBancariosProps) => {
    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [datos, setDatos] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [idToEdit, setIdToEdit] = useState<number | string>(0);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [advertModalOpen, setAdvertModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    const fetchDatos = async () => {
        try {
            const res = await getDatosBancariosPaginated({ page, limit, search });
            setDatos(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error al obtener datos bancarios:', error);
        }
    };

    const handleDelete = (id: number) => {
        setIdToDelete(id);
        setAdvertModalOpen(true);
    };

    const handleEdit = (id: number) => {
        setIdToEdit(id);
        setModalEditarOpen(true);
    };

    const confirmDelete = async () => {
        if (idToDelete === null) return;
        try {
            await deleteDatosBancarios(idToDelete);
            setSuccessModalOpen(true);
            fetchDatos();
        } catch (err) {
            console.error(err);
            setErrorMessage('❌ Error al eliminar dato bancario');
            setErrorModalOpen(true);
        } finally {
            setAdvertModalOpen(false);
            setIdToDelete(null);
        }
    };

    useEffect(() => {
        fetchDatos();
    }, [page, limit, search]);

    const styleTh = "px-3 text-left border-b";
    const styleTd = "px-3 border-b";
    const styleBtn = "text-white px-1 py-1 rounded-full text-xs shadow";

    return (
        <div className="flex justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full">
                <div className="flex items-center justify-between mb-6 border-b pb-6">
                    <div className="flex items-center gap-3">
                        <BanknotesIcon className="h-8 w-8 text-green-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Datos Bancarios</h1>
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

                {/* Búsqueda + Crear */}
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Buscar banco, titular, número..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full sm:w-[380px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                    />
                    <button
                        onClick={() => setModalCrearOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
                    >
                        Crear Dato Bancario
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-xl shadow-sm">
                    <table className="min-w-full text-sm bg-white border border-gray-200">
                        <thead className="bg-green-100 text-green-800 uppercase text-xs font-semibold">
                            <tr>
                                <th className={styleTh}>#</th>
                                <th className={styleTh}>Banco</th>
                                <th className={styleTh}>N° Cuenta</th>
                                <th className={styleTh}>Tipo</th>
                                <th className={styleTh}>Titular</th>
                                <th className={styleTh}>Obs.</th>
                                <th className={`${styleTh} text-center`}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {datos.map((dato, idx) => (
                                <tr key={dato.iddatos_bancarios} className="hover:bg-gray-50">
                                    <td className={styleTd}>{(page - 1) * limit + idx + 1}</td>
                                    <td className={`${styleTd} max-w-[200px] truncate`}>{dato.banco_origen}</td>
                                    <td className={styleTd}>{dato.numero_cuenta}</td>
                                    <td className={styleTd}>{dato.tipo_cuenta}</td>
                                    <td className={styleTd}>{dato.titular_cuenta}</td>
                                    <td className={styleTd}>{dato.observacion || '-'}</td>
                                    <td className={`${styleTd} text-center`}>
                                        <div className="flex justify-center gap-2">
                                            {onSelect && (
                                                <button
                                                    onClick={() => onSelect(dato)}
                                                    className={`bg-blue-600 hover:bg-blue-700 ${styleBtn}`}
                                                >
                                                    Seleccionar
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEdit(dato.iddatos_bancarios)}
                                                className={`bg-yellow-400 hover:bg-yellow-500 ${styleBtn}`}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dato.iddatos_bancarios)}
                                                className={`bg-red-500 hover:bg-red-600 ${styleBtn}`}
                                            >
                                                Eliminar
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
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow disabled:opacity-50"
                    >
                        ⬅ Anterior
                    </button>
                    <span className="text-sm text-gray-600">
                        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                    </span>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page >= totalPages}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow disabled:opacity-50"
                    >
                        Siguiente ➡
                    </button>
                </div>

                {/* Modal Crear */}
                <ModalCrearDatosBancarios
                    isOpen={modalCrearOpen}
                    onClose={() => setModalCrearOpen(false)}
                    onSuccess={fetchDatos}
                />

                <ModalSuccess
                    isOpen={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                    message="✅ Dato bancario eliminado correctamente"
                />

                <ModalError
                    isOpen={errorModalOpen}
                    onClose={() => setErrorModalOpen(false)}
                    message={errorMessage}
                />

                <ModalAdvert
                    isOpen={advertModalOpen}
                    onClose={() => setAdvertModalOpen(false)}
                    message="¿Estás seguro de que deseas eliminar este dato bancario?"
                    onConfirm={confirmDelete}
                />

                <ModalEditarDatosBancarios
                    isOpen={modalEditarOpen}
                    onClose={() => setModalEditarOpen(false)}
                    id={idToEdit}
                    onSuccess={fetchDatos}
                />
                
            </div>
        </div>
    );
};

export default ListarDatosBancarios;
