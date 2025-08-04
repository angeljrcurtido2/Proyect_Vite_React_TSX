"use client";

import { useEffect, useState } from "react";
import { CubeIcon } from "@heroicons/react/24/outline";
import ModalCrearVenta from "../ModalsVenta/ModalCrearVenta";
import ModalDetalleVenta from "../ModalsVenta/ModalDetalleVenta";
import { deleteVenta, getVentasPaginated } from '../../../services/ventas';
import { getCargoUsuario } from "../../../services/usuarios";

const ListarVentas = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [modalCrearVentaOpen, setModalCrearVentaOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

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

      const res = await getVentasPaginated({ page, limit, search });
      setVentas(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, [page, limit, search]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmDelete) return;

    try {
      await deleteVenta(id);
      fetchVentas();
    } catch (error) {
      alert('❌ No se pudo eliminar el compras');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6 border-b pb-6">
          <div className="flex items-center gap-3">
            <CubeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
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
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Buscar por cliente o documento..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[380px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={() => setModalCrearVentaOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Crear Venta
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className="min-w-full text-sm bg-white border border-gray-200">
            <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left border-b">#</th>
                <th className="px-6 py-3 text-left border-b">Cliente</th>
                <th className="px-6 py-3 text-left border-b">Documento</th>
                <th className="px-6 py-3 text-left border-b">Fecha</th>
                <th className="px-6 py-3 text-left border-b">Total</th>
                <th className="px-6 py-3 text-left border-b">Tipo</th>
                <th className="px-6 py-3 text-left border-b">Estado</th>
                <th className="px-6 py-3 text-center border-b">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {ventas.map((venta: any, idx: number) => (
                <tr key={venta.idventa} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-b">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-6 py-4 border-b">{venta.nombre_cliente}</td>
                  <td className="px-6 py-4 border-b">{venta.documento_cliente}</td>
                  <td className="px-6 py-4 border-b">{new Date(venta.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-4 border-b">₲ {parseInt(venta.total).toLocaleString()}</td>
                  <td className="px-6 py-4 border-b">{venta.tipo.toUpperCase()}</td>
                  <td className="px-6 py-4 border-b">{venta.estado.toUpperCase()}</td>
                  <td className="px-6 py-4 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedVenta(venta);
                          setShowModal(true)
                          console.log(venta)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs shadow"
                      >
                        🔍 Ver
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(venta.idventa)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs shadow"
                        >
                          🗑 Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ModalDetalleVenta
          isOpen={showModal}
          venta={selectedVenta}
          onClose={() => {
            setShowModal(false);
            setSelectedVenta(null);
          }}
        />

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
        isOpen={modalCrearVentaOpen}
        onClose={() => setModalCrearVentaOpen(false)}
        onSuccess={() => {
          fetchVentas();
        }}
      />
    </div>
  );
};

export default ListarVentas;
