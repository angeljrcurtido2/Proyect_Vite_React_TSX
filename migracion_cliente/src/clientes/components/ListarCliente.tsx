'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserIcon } from '@heroicons/react/24/outline'; 
import ModalCrearCliente from './ModalsCliente/ModalCrearCliente';
import ModalEditarCliente from './ModalsCliente/ModalEditarCliente';


interface ListarClienteProps {
    onSelect?: (cliente: any) => void;
    isReportGenerated?: boolean;
    onReportGenerated?: (idcliente:number) => void; 
}

const ListarCliente = ({ onSelect, isReportGenerated, onReportGenerated }: ListarClienteProps) => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [modalCrearClienteOpen, setModalCrearClienteOpen] = useState(false);
    const [modalEditarClienteOpen, setModalEditarClienteOpen] = useState(false);
    const [idCliente, setIdCliente] = useState<number | string>('');

    const fetchClientes = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/clientes`, {
                params: { page, limit, search },
            });
            setClientes(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este cliente?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3000/api/clientes/${id}`);
            fetchClientes();
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('❌ No se pudo eliminar el cliente');
        }
    };

    useEffect(() => {
        fetchClientes();
    }, [page, limit, search]);

    const handleEdit = (id: number) => {
        setIdCliente(id);
        setModalEditarClienteOpen(true);
    };

    const handleGenerateReport = (idcliente:number) => {
        onReportGenerated && onReportGenerated(idcliente);
        console.log(`Generando reporte para cliente con ID: ${idcliente}`);
    }

    const styleTableTh = "px-3 text-left border-b";
    const styleTableTd = "px-3 border-b";
    const styleButton = "text-white px-1 py-1 rounded-full text-xs shadow mt-1 mb-1";

    return (
        <div className="flex items-center justify-center bg-gradient-to-br to-white px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full">
     
                <div className="flex items-center justify-between mb-6 border-b pb-6">
                    <div className="flex items-center gap-3">
                        <UserIcon className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
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
                            placeholder="🔍 Buscar por nombre, apellido, documento o teléfono..."
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
                        onClick={() => setModalCrearClienteOpen(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
                    >
                        Crear Cliente
                    </button>
                </div>
                <div className="overflow-x-auto rounded-xl shadow-sm">
                    <table className="min-w-full text-sm bg-white border border-gray-200">
                        <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
                            <tr>
                                <th className={styleTableTh}>#</th>
                                <th className={styleTableTh}>Nombre</th>
                                <th className={styleTableTh}>Apellido</th>
                                <th className={styleTableTh}>Documento</th>
                                <th className={styleTableTh}>Teléfono</th>
                                <th className={`${styleTableTh} !text-center`}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {clientes.map((cliente: any, idx: number) => (
                                <tr key={cliente.idcliente} className="hover:bg-gray-50 transition">
                                    <td className={styleTableTd}>{(page - 1) * limit + idx + 1}</td>
                                    <td className={`${styleTableTd} max-w-[150px] truncate`}>{cliente.nombre}</td>
                                    <td className={styleTableTd}>{cliente.apellido}</td>
                                    <td className={styleTableTd}>{cliente.numDocumento}</td>
                                    <td className={styleTableTd}>{cliente.telefono}</td>
                                    <td className={`${styleTableTd} text-center`}>
                                        <div className="flex justify-center gap-2">
                                            {isReportGenerated ? (
                                                <button
                                                    onClick={() =>handleGenerateReport(cliente.idcliente)}
                                                    className={`bg-green-500 hover:bg-green-600 ${styleButton}`}
                                                >
                                                    Generar Reporte
                                                </button>
                                            ) : (
                                                <>
                                                    {onSelect && (
                                                        <button
                                                            onClick={() => onSelect(cliente)}
                                                            className={`bg-blue-600 hover:bg-blue-700 ${styleButton}`}
                                                        >
                                                            Seleccionar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(cliente.idcliente)}
                                                        className={`bg-yellow-400 hover:bg-yellow-500 ${styleButton}`}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cliente.idcliente)}
                                                        className={`bg-red-500 hover:bg-red-600 ${styleButton}`}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </>
                                            )}
                                        </div>
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
            <ModalCrearCliente
                isOpen={modalCrearClienteOpen}
                onClose={() => setModalCrearClienteOpen(false)}
                onSuccess={fetchClientes}
            />
            <ModalEditarCliente
                isOpen={modalEditarClienteOpen}
                onClose={() => setModalEditarClienteOpen(false)}
                id={idCliente}
                onSuccess={fetchClientes}
            />
        </div>
    );
};

export default ListarCliente;
