'use client';

import { useEffect, useState } from 'react';
import { CurrencyDollarIcon, EyeIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { type ComprobantePago } from '../../../ventas/components/interface';
import ModalCobroDeuda from '../Modals/ModalCobroDeudaCompra';
import ModalComprobantePago from '../../../ventas/components/ModalsVenta/ModalComprobantePago';
import ModalListarDetallesPagosDeuda from '../Modals/ModalListarDetallesPagosDeuda';
import { fetchDeudasCompra } from '../../../services/compras';


const ListarDeudasCompra = () => {
    const [comprobante, setComprobante] = useState<ComprobantePago>();
    const [showComprobante, setShowComprobante] = useState(false);
    const [deudas, setDeudas] = useState<any[]>([]);
    const [montoMaximo, setMontoMaximo] = useState(0);
    const [idDeudaDetalle, setIdDeudaDetalle] = useState(0);
    const [showModalDetailPay, setShowModalDetailPay] = useState(false);
    const [showModalCobroDeuda, setShowModalCobroDeuda] = useState(false);
    const [iddeudaSeleccionada, setIddeudaSeleccionada] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDeudas = async () => {
        try {
            const res = await fetchDeudasCompra( page, limit, search);
            setDeudas(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error al obtener deudas:', error);
        }
    };

    useEffect(() => {
        fetchDeudas();
    }, [page, limit, search]);

    const handleCobrar = (deuda: any) => {
        console.log("Entra por aqui")
        setIddeudaSeleccionada(deuda.iddeuda_compra);
        setMontoMaximo(deuda.total_deuda - deuda.total_pagado);
        setShowModalCobroDeuda(true);
    };

    const showPayDetails = (idDeudaDetalle: number) => {
        setIdDeudaDetalle(idDeudaDetalle);
        setShowModalDetailPay(true);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 mt-10 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Deudas por Compra</h1>
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

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Buscar por proveedor o estado..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="w-full sm:w-[400px] px-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-green-100 text-green-800 text-xs font-semibold">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Proveedor</th>
                            <th className="px-4 py-3 text-left">Total Deuda</th>
                            <th className="px-4 py-3 text-left">Total Pagado</th>
                            <th className="px-4 py-3 text-left">Saldo</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Fecha</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deudas.map((deuda, idx) => (
                            <tr key={deuda.iddeuda_compra} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-2">{(page - 1) * limit + idx + 1}</td>
                                <td className="px-4 py-2 font-medium">{deuda.nombre}</td>
                                <td className="px-4 py-2">{deuda.total_deuda}</td>
                                <td className="px-4 py-2 text-green-700">{deuda.total_pagado}</td>
                                <td className="px-4 py-2 font-semibold text-red-600">{deuda.saldo}</td>
                                <td className="px-4 py-2">{deuda.estado}</td>
                                <td className="px-4 py-2">{new Date(deuda.fecha_deuda).toLocaleDateString()}</td>
                                <td className="px-4 py-2 text-center space-x-2">
                                    <button
                                        onClick={() => handleCobrar(deuda)}
                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                    >
                                        <BanknotesIcon className="h-4 w-4" />
                                        Cobrar
                                    </button>
                                    <button
                                        onClick={() => showPayDetails(deuda.iddeuda_compra)}
                                        className="inline-flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        Ver Pagos
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModalCobroDeuda && iddeudaSeleccionada && (
                <ModalCobroDeuda
                    montoMaximo={montoMaximo}
                    isOpen={showModalCobroDeuda}
                    setComprobante={setComprobante}
                    setShowComprobante={setShowComprobante}
                    onClose={() => setShowModalCobroDeuda(false)}
                    idDeuda={iddeudaSeleccionada}
                    onSuccess={() => {
                        fetchDeudas();
                        setShowModalCobroDeuda(false);
                    }}
                />
            )}
            {showComprobante && comprobante && (
                <ModalComprobantePago
                    onClose={() => setShowComprobante(false)}
                    comprobante={comprobante}
                    isProviderPay={true}
                />
            )}
            <ModalListarDetallesPagosDeuda
                iddeuda={idDeudaDetalle}
                isOpen={showModalDetailPay}
                onClose={() => setShowModalDetailPay(false)}
                onSuccess={() => {
                    fetchDeudas();
                }}
            />
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
                >
                    ⬅ Anterior
                </button>
                <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page >= totalPages}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
                >
                    Siguiente ➡
                </button>
            </div>
        </div>
    );
};

export default ListarDeudasCompra;
