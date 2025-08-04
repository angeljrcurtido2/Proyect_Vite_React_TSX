"use client";

import { useEffect, useState } from "react";
import { CubeIcon } from "@heroicons/react/24/outline";
import { getCargoUsuario } from "../../../services/usuarios";
import { listarVentasProgramadas, anularVentaProgramada } from "../../../services/ventas";
import ModalCrearVenta from "../Modal/ModalCrearVentaPr";
import { getVentasProgramadasPorCliente } from "../../../services/ventas";
import ModalListClient from "../Modal/ModalListClient";
import ModalAdvert from "../../../components/ModalAdvert";
import ModalError from "../../../components/ModalError";
import ModalSuccess from "../../../components/ModalSuccess";

const ListarVentasProgramadas = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [showModalVenta, setShowModalVenta] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAdvertModal, setShowAdvertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [idVentaAAnular, setIdVentaAAnular] = useState<number | null>(null);

  const [cargo, setCargo] = useState("");
  const fetchCargo = async () => {
    const { data } = await getCargoUsuario();
    setCargo(data.acceso)
  };
  useEffect(() => {
    fetchCargo()
  }, [])
  const isAdmin = cargo === "Administrador"

  const fetchVentas = async () => {
    try {
      const res = await listarVentasProgramadas({ page, limit, search });
      setVentas(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("❌ Error al obtener ventas programadas:", error);
    }
  };

  const handleGenerateReporteCliente = async (idcliente: number) => {
    try {
      const res = await getVentasProgramadasPorCliente(idcliente); 
      const base64PDF = res.data.reportePDFBase64;
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${base64PDF}`;
      link.download = `Reporte.pdf`;
      link.click();

    } catch (error) {
      console.error("❌ Error al generar reporte del cliente:", error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, [page, limit, search]);

  const handleDelete = (id: number) => {
    setIdVentaAAnular(id);
    setModalMessage("¿Estás seguro de que deseas anular esta venta programada?");
    setShowAdvertModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!idVentaAAnular) return;

    try {
      await anularVentaProgramada(idVentaAAnular);
      setModalMessage("✅ Venta programada anulada correctamente.");
      setShowSuccessModal(true);
      setShowAdvertModal(false)
      fetchVentas();
    } catch (error) {
      console.error("❌ Error al anular venta programada:", error);
      setModalMessage("❌ Ocurrió un error al anular la venta programada.");
      setShowErrorModal(true);
    } finally {
      setIdVentaAAnular(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6 border-b pb-6">
          <div className="flex items-center gap-3">
            <CubeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Ventas Programadas</h1>
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
          <input
            type="text"
            placeholder="🔍 Buscar por cliente, producto u observación..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-[380px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex justify-end mb-4 gap-3 text-sm mt-3">
            <button
              onClick={() => setShowModalVenta(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition"
            >
              + Crear Venta Programada
            </button>
            <button
              onClick={() => setShowModalCliente(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition"
            >
              Reporte de Ventas por Cliente
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className="min-w-full text-sm bg-white border border-gray-200">
            <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left border-b">#</th>
                <th className="px-6 py-3 text-left border-b">Cliente</th>
                <th className="px-6 py-3 text-left border-b">Producto</th>
                <th className="px-6 py-3 text-left border-b">Inicio</th>
                <th className="px-6 py-3 text-left border-b">Día</th>
                <th className="px-6 py-3 text-left border-b">Última Venta</th>
                <th className="px-6 py-3 text-left border-b">Estado</th>
                {isAdmin && <th className="px-6 py-3 text-center border-b">Acciones</th>}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {ventas.map((venta, idx) => (
                <tr key={venta.idprogramacion} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-b">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-6 py-4 border-b">
                    {venta.cliente_nombre} {venta.cliente_apellido}
                  </td>
                  <td className="px-6 py-4 border-b">{venta.nombre_producto}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(venta.fecha_inicio).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b text-center">{venta.dia_programado}</td>
                  <td className="px-6 py-4 border-b">
                    {venta.ultima_fecha_venta ? new Date(venta.ultima_fecha_venta).toLocaleDateString() : "--"}
                  </td>
                  <td className="px-6 py-4 border-b">{venta.estado.toUpperCase()}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(venta.idprogramacion)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs shadow"
                        >
                          🗑 Eliminar
                        </button>
                      </div>
                    </td>
                  )}
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

      <ModalCrearVenta
        isOpen={showModalVenta}
        onClose={() => setShowModalVenta(false)}
        onSuccess={fetchVentas}
      />

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
      />

      <ModalError
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={modalMessage}
      />

      <ModalAdvert
        isOpen={showAdvertModal}
        onClose={() => setShowAdvertModal(false)}
        onConfirm={handleDeleteConfirmed}
        message={modalMessage}
        confirmButtonText="Sí, Anular"
      />
      <ModalListClient
        isOpen={showModalCliente}
        isReportGenerated={showModalCliente}
        onReportGenerated={handleGenerateReporteCliente}
        onClose={() => setShowModalCliente(false)} />
    </div>
  );
};

export default ListarVentasProgramadas;
