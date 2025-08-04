'use client';

import { useEffect, useState } from 'react';
import { BanknotesIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ModalResumenCaja from '../ModalMovimiento/CierreCaja/ModalResumenCaja';
import ModalCrearAperturaCaja from '../ModalMovimiento/AperturaCaja/ModalAperturaCaja';
import { getMovimientosCajaPaginated, getCajaAbierta } from '../../../services/movimiento';
import { formatPY } from '../../utils/utils';
import ModalButtonFetch from './ButtonFetchReport';
import ModalError from '../../../components/ModalError';

interface MovimientoCaja {
    idmovimiento: number;
    idusuarios: number;
    num_caja: string;
    fecha_apertura: string;
    fecha_cierre: string | null;
    monto_apertura: number;
    monto_cierre: number | null;
    credito: number | null;
    gastos: number | null;
    cobrado: number | null;
    contado: number | null;
    ingresos: number | null;
    compras: number | null;
    estado: string;
    login: string;
}


const ListarMovimientoCaja = () => {
    const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isOpenApertura, setIsOpenApertura] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIdMovimiento, setSelectedIdMovimiento] = useState<number>(0);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [aperturaDesde, setAperturaDesde] = useState<string>('');
    const [aperturaHasta, setAperturaHasta] = useState<string>('');
    const [cierreDesde, setCierreDesde] = useState<string>('');
    const [cierreHasta, setCierreHasta] = useState<string>('');
    const [idMovimiento, setIdMovimiento] = useState(0)
    const [errorMessage, setErrorMessage] = useState('');

    const fetchMovimientos = async () => {
        try {
            const res = await getMovimientosCajaPaginated({
                page,
                limit,
                search,
                aperturaDesde,
                aperturaHasta,
                cierreDesde,
                cierreHasta,
            });
            setMovimientos(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error al obtener movimientos:', err);
            setErrorMessage('❌ Error al obtener movimientos de caja.');
            setErrorModalOpen(true);
        }
    };

    useEffect(() => {
        fetchMovimientos();
    }, [
        page,
        limit,
        search,
        aperturaDesde,
        aperturaHasta,
        cierreDesde,
        cierreHasta,
    ]);

    const handleOpenModal = (idmovimiento: number) => {
        setSelectedIdMovimiento(idmovimiento);
        setIsOpen(true);
    }

    const handleOpenApertura = async () => {
        const res = await getCajaAbierta();
       if (res.data.abierta === false) {setIsOpenApertura(true)} else {setIsOpenApertura(false)}
    };

    const styleButton = "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow text-xs"

    return (
        <div className="bg-gradient-to-br from-yellow-50 to-white py-10 px-6">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
                {/* Header */}
                <div className="flex flex-col  sm:items-center sm:justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <BanknotesIcon className="h-8 w-8 text-yellow-600" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Movimientos de Caja</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="🔍 Buscar por número de caja, estado, usuario..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full sm:w-[300px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 items-center">

                        <div className="flex flex-wrap gap-4 mb-6">

                            {[
                                { label: 'Apertura desde', value: aperturaDesde, setter: setAperturaDesde },
                                { label: 'Apertura hasta', value: aperturaHasta, setter: setAperturaHasta },
                                { label: 'Cierre desde', value: cierreDesde, setter: setCierreDesde },
                                { label: 'Cierre hasta', value: cierreHasta, setter: setCierreHasta },
                            ].map(({ label, value, setter }) => (
                                <div key={label} className="flex flex-col">
                                    <span className="mb-1 text-xs font-medium text-gray-600">{label}</span>
                                    <div className="relative">
                  
                                        <input
                                            type="date"
                                            value={value}
                                            onChange={(e) => {
                                                setter(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-[165px] rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm
                                                        shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50"
                                        />

                 
                                        <CalendarIcon className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />

                     
                                        {value && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setter('');
                                                    setPage(1);
                                                }}
                                                className="absolute -right-6 top-2 text-gray-400 hover:text-red-500 transition"
                                                title="Limpiar"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleOpenApertura}
                            className={styleButton}
                        >
                            Abrir Caja
                        </button>

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
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className=" text-sm">
                        <thead className="bg-yellow-100 text-yellow-800 font-semibold text-xs uppercase">
                            <tr>
                                <th className="px-4 py-2 text-left border-b">#</th>
                                <th className="px-4 py-2 text-left border-b">Nro Caja</th>
                                <th className="px-4 py-2 text-left border-b">Usuario</th>
                                <th className="px-4 py-2 text-left border-b">Apertura</th>
                                <th className="px-4 py-2 text-left border-b">Cierre</th>
                                <th className="px-4 py-2 text-right border-b">Monto Apertura</th>
                                <th className="px-4 py-2 text-right border-b">Monto Cierre</th>
                                <th className="px-4 py-2 text-right border-b">Crédito</th>
                                <th className="px-4 py-2 text-right border-b">Gastos</th>
                                <th className="px-4 py-2 text-right border-b">Cobrado</th>
                                <th className="px-4 py-2 text-right border-b">Contado</th>
                                <th className="px-4 py-2 text-right border-b">Ingresos</th>
                                <th className="px-4 py-2 text-right border-b">Compras</th>
                                <th className="px-4 py-2 text-center border-b">Estado</th>
                                <th className="px-4 py-2 text-center border-b">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {movimientos.map((mov, idx) => (
                                <tr key={mov.idmovimiento} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">{(page - 1) * limit + idx + 1}</td>
                                    <td className="px-4 py-2 border-b">{mov.num_caja}</td>
                                    <td className="px-4 py-2 border-b">{mov.login}</td>
                                    <td className="px-4 py-2 border-b">
                                        {new Date(mov.fecha_apertura).toLocaleString('es-ES')}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {mov.fecha_cierre ? new Date(mov.fecha_cierre).toLocaleString('es-ES') : '--'}
                                    </td>
                                    <td className="px-4 py-2 border-b text-right">
                                        {formatPY(mov.monto_apertura) ?? '--'}
                                    </td>
                                    <td className="px-4 py-2 border-b text-right">
                                        {mov.monto_cierre !== null ? formatPY(mov.monto_cierre) : '--'}
                                    </td>
                                    <td className="px-4 py-2 border-b text-right">{formatPY(mov.credito) ?? '--'}</td>
                                    <td className="px-4 py-2 border-b text-right">{formatPY(mov.gastos) ?? '--'}</td>
                                    <td className="px-4 py-2 border-b text-right">{formatPY(mov.cobrado) ?? '--'}</td>
                                    <td className="px-4 py-2 border-b text-right">{formatPY(mov.contado) ?? '--'}</td>
                                    <td className="px-4 py-2 border-b text-right">{formatPY(mov.ingresos) ?? '--'}</td>
                                    <td className="px-4 py-2 border-b text-right">{formatPY(mov.compras) ?? '--'}</td>
                                    <td className="px-4 py-2 border-b text-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${mov.estado === 'cerrado'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {mov.estado.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 border-b text-center flex flex-row gap-3">
                                        <button onClick={() => handleOpenModal(mov.idmovimiento)} className={styleButton}>Resumen</button>
                                        <button className={styleButton} onClick={() => { setIdMovimiento(mov.idmovimiento) }}>Reportes</button>
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded shadow disabled:opacity-50"
                    >
                        ⬅ Anterior
                    </button>
                    <span className="text-sm text-gray-600">
                        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                    </span>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page >= totalPages}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded shadow disabled:opacity-50"
                    >
                        Siguiente ➡
                    </button>
                </div>
                <ModalButtonFetch isOpen={idMovimiento === 0 ? false : true} onClose={() => setIdMovimiento(0)} idMovimiento={idMovimiento} />
                <ModalError
                    isOpen={errorModalOpen}
                    onClose={() => setErrorModalOpen(false)}
                    message={errorMessage}
                />
                <ModalResumenCaja isOpen={isOpen} idmovimiento={selectedIdMovimiento} onClose={() => { setIsOpen(false) }} onSuccess={fetchMovimientos} />
                <ModalCrearAperturaCaja isOpen={isOpenApertura} onClose={() => setIsOpenApertura(false)} onSuccess={fetchMovimientos} />
            </div>
        </div>
    );
};

export default ListarMovimientoCaja;
