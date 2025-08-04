'use client';

import { useEffect, useState } from 'react';
import ModalCobroDeuda from '../ModalsVenta/ModalCobroDeuda';
import { CurrencyDollarIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import ModalComprobantePago from '../ModalsVenta/ModalComprobantePago';
import ModalListarDetallesPagosDeuda from '../ModalsVenta/ModalListarDetallesPagosDeuda';
import { type ComprobantePago } from '../interface';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ModalListarClienteDVenta from '../ModalsVenta/ModalListarClienteDVentas';
import { listarDeudasVentaAgrupadasPorCliente, listarDeudasVentaCompletoPorCliente, listarDeudasVentaAgrupadasPorClienteSinPaginar } from '../../../services/ventas';
import { getCobrosMensuales, getCobrosDelDia, getCobrosMensualesPorAnio } from '../../../services/ingreso';
import { formatPY } from '../../../movimiento/utils/utils';

const ListarDeudasVentaCliente = () => {
  const [comprobante, setComprobante] = useState<ComprobantePago>();
  const [showComprobante, setShowComprobante] = useState(false);
  const [deudas, setDeudas] = useState<any[]>([]);
  const [montoMaximo, setMontoMaximo] = useState(0);
  const [nombreCliente, setNombreCliente] = useState<string | null>(null);
  const [documentoCliente, setDocumentoCliente] = useState<string | null>(null);
  const [estadoCliente, setEstadoCliente] = useState<string | null>(null);
  const [disableSearch, setDisableSearch] = useState(false);
  const [showModalDetailPay, setShowModalDetailPay] = useState(false);
  const [showModalCobroDeuda, setShowModalCobroDeuda] = useState(false);
  const [iddeudaSeleccionada, setIddeudaSeleccionada] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {

    console.log()
  }, [])

  const fetchDeudasComplete = async () => {
    try {
      const response = await listarDeudasVentaCompletoPorCliente({
        numDocumento: documentoCliente ?? "",
        estado: estadoCliente ?? ""
      });

      if (response.data.reportePDFBase64) {
        const base64PDF = response.data.reportePDFBase64;
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64PDF}`;
        link.download = `DeudaCliente.pdf`;
        link.click();
      } else {
        console.warn("⚠️ No se encontró el PDF en la respuesta.");
      }
    } catch (error) {
      console.error("Error al obtener la deuda del cliente:", error);
    }
  };

  const fetchDeudas = async () => {
    try {
      const res = await listarDeudasVentaAgrupadasPorCliente({ page, limit, search });
      setDeudas(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error al obtener deudas:', error);
    }
  };

  const fetchDeudasTest = async () => {
    try {
      const res = await listarDeudasVentaAgrupadasPorClienteSinPaginar();
      console.log(res)
    } catch (error) {
      console.error('Error al obtener deudas:', error);
    }
  };

  const fetchCobrosMensuales = async () => {
    try {
      const res = await getCobrosMensuales();
      console.log(res)
    } catch (error) {
      console.error('Error al obtener deudas:', error);
    }
  };

  const fetchCobrosDelDia = async () => {
    try {
      // sin params ⇒ día actual; o { fecha: '2025-06-29' }
      const res = await getCobrosDelDia();
      console.log(res)
    } catch (err) {

      console.error('Error al obtener cobros del día:', err);
    }
  };

  const fetchEstadisticaAnual = async () => {
    const { data } = await getCobrosMensualesPorAnio(2025);
    console.log("Datos", data)  
  };

  useEffect(() => {
    fetchDeudas();
    fetchDeudasTest();
    fetchCobrosMensuales();
    fetchCobrosDelDia();
    fetchEstadisticaAnual();
    console.log("Entra por aqui")
  }, [page, limit, search]);

  const handleCobrar = (deuda: any) => {
    setIddeudaSeleccionada(deuda.iddeuda);
    setMontoMaximo(deuda.total_deuda - deuda.total_pagado);
    setShowModalCobroDeuda(true);
  };

  const handleDataforModal = (deuda: any) => {
    setNombreCliente(deuda.nombre_cliente);
    handleCobrar(deuda);
    setDocumentoCliente(deuda.numDocumento);
    setEstadoCliente(deuda.estado);
    setDisableSearch(true);
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 mt-10 border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Deudas por Ventas</h1>
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
          placeholder="Buscar por cliente o estado..."
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
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Documento N°</th>
              <th className="px-4 py-3 text-left">Total Deuda</th>
              <th className="px-4 py-3 text-left">Total Pagado</th>
              <th className="px-4 py-3 text-left">Saldo</th>
              <th className="px-4 py-3 text-left">Fecha</th>

              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deudas.map((deuda, idx) => (
              <tr key={deuda.iddeuda} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{(page - 1) * limit + idx + 1}</td>
                <td className="px-4 py-2 font-medium">{deuda.nombre_cliente}</td>
                <td className="px-4 py-2">{deuda.numDocumento}</td>
                <td className="px-4 py-2">{formatPY(deuda.total_deuda)}</td>
                <td className="px-4 py-2 text-green-700">{formatPY(deuda.total_pagado)}</td>
                <td className="px-4 py-2 font-semibold text-red-600">{formatPY(deuda.saldo)}</td>
                <td className="px-4 py-2">{new Date(deuda.fecha_deuda).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => { handleDataforModal(deuda) }}
                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                    <BanknotesIcon className="h-4 w-4" />
                    Ver detalles
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

      {/* Modales */}
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
        />
      )}
      <ModalListarDetallesPagosDeuda
        iddeuda={0}
        isOpen={showModalDetailPay}
        onClose={() => setShowModalDetailPay(false)}
        onSuccess={() => {
          fetchDeudas();
        }}
      />
  <ModalListarClienteDVenta
  /* 🔑 cambia con cada apertura */
  key={nombreCliente ?? 'empty'}

  disableSearch={disableSearch}
  isOpen={!!nombreCliente}
  generateReport={fetchDeudasComplete}
  setEstadoCliente={setEstadoCliente}
  onClose={() => {
    setNombreCliente(null);
    setDisableSearch(false);   // 🔄  reset si lo necesitas
  }}
  nombreCliente={nombreCliente || ''}
/>
    </div>
  );
};

export default ListarDeudasVentaCliente;
