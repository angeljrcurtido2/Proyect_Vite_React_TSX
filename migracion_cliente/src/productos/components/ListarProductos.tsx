'use client';

import { useEffect, useState } from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';
import ModalEditarProducto from './ModalsProductos/ModalEditarProducto';
import ModalAdvert from '../../components/ModalAdvert';
import ModalsCrearCompraRapida from '../../compras/components/Modals/ModalsCrearCompraRapida';
import { getProductosPaginated, deleteProducto } from '../../services/productos';

const style = {
  th: 'px-3 text-left border-b',
  td: 'px-3 border-b',
  btn: 'text-white px-1 py-1 rounded-full text-xs shadow mt-1 mb-1',
};

interface ListarProductosProps {
  onSelect?: (producto: any) => void;
  setCantidadProducto?: (cantidad: number) => void;
  cantidadProducto?: number;
  setCantidadMaximo?: (cantidad: number) => void;
  configVentaPorLote?: boolean;
  detalles?: any[];
  stockVerify?: boolean;
}

const ListarProductos = ({
  onSelect,
  setCantidadProducto,
  cantidadProducto,
  setCantidadMaximo,
  configVentaPorLote = false,
  detalles = [],
  stockVerify = false,
}: ListarProductosProps) => {
  const [productos, setProductos] = useState<any[]>([]);
  const [modalAdvertOpen, setModalAdvertOpen] = useState(false);
  const [isInputTouched, setIsInputTouched] = useState(false);
  const [modalEditarProductoOpen, setModalEditarProductoOpen] = useState(false);
  const [idProducto, setIdProducto] = useState<number | string>('');
  const [modalCrearCompraRapidaOpen, setModalCrearCompraRapidaOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProductos = async () => {
    try {
      const res = await getProductosPaginated({ page, limit, search });
      setProductos(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await deleteProducto(id);
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('❌ No se pudo eliminar el producto');
    }
  };

  const handleEdit = (id: number) => {
    setIdProducto(id);
    setModalEditarProductoOpen(true);
  };

  const renderCantidadInput = (prod: any) => {
    const isDecimal = prod.unidad_medida === 'KG' || prod.unidad_medida === 'L';
    const min = isDecimal ? 0.1 : 1;
    const step = isDecimal ? 0.1 : 1;

    return (
      <input
        type="number"
        disabled={configVentaPorLote}
        min={min}
        step={step}
        defaultValue={min}
        onBlur={(e) => {
          let valor = isDecimal ? parseFloat(e.target.value) : parseInt(e.target.value);
          if (isNaN(valor) || valor < min) valor = min;
          if (valor > parseFloat(prod.stock)) {
            alert(`La cantidad no puede superar el stock disponible (${prod.stock})`);
            valor = parseFloat(prod.stock);
          }
          e.target.value = valor.toString();
          setCantidadProducto?.(valor);
          setCantidadMaximo?.(parseFloat(prod.stock));
          setIsInputTouched(true);
        }}
        className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    );
  };

  const handleSeleccionar = (prod: any) => {
  const stock = parseFloat(prod.stock);
  const enDetalle = detalles.find((d) => d.idproducto === prod.idproducto)?.cantidad || 0;

  if (parseFloat(enDetalle) >= stock) {
    alert(`Ya alcanzaste el stock máximo disponible (${stock}) para este producto.`);
    return;
  }

  if (stockVerify && prod.stock <= 0) {
    setModalAdvertOpen(true);
    return;
  }

  const isDecimal = prod.unidad_medida === 'KG' || prod.unidad_medida === 'L';
  const defaultCantidad = isDecimal ? 0.1 : 1;
  const cantidadFinal = isInputTouched ? cantidadProducto ?? defaultCantidad : defaultCantidad;

  setCantidadMaximo?.(stock);
  onSelect?.({ ...prod, cantidad: cantidadFinal, cantidadMaximo: stock });
};

  useEffect(() => {
    fetchProductos();
  }, [page, limit, search]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-6">
          <div className="flex items-center gap-3">
            <CubeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
          </div>
          <select
            className="text-sm px-4 py-2 border border-gray-300 rounded-md"
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num} por página
              </option>
            ))}
          </select>
        </div>

        {/* Buscador + Crear */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o ubicación..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-[380px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <button
            onClick={() => setModalCrearCompraRapidaOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
          >
            Crear Producto
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl shadow-sm">
          <table className="min-w-full text-sm bg-white border border-gray-200">
            <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold">
              <tr>
                {['#', 'Nombre', 'Cod_Barra', 'Stock', 'Precio Compra', 'Precio Venta', 'Ubicación', 'IVA', 'Unidad', 'Estado'].map((h) => (
                  <th key={h} className={style.th}>
                    {h}
                  </th>
                ))}
                {setCantidadProducto && <th className={style.th}>Cantidad</th>}
                <th className={`${style.th} text-center`}>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {productos.map((prod, idx) => (
                <tr key={prod.idproducto} className="hover:bg-gray-50">
                  <td className={style.td}>{(page - 1) * limit + idx + 1}</td>
                  <td className={style.td}>{prod.nombre_producto}</td>
                  <td className={`${style.td} max-w-[100px] truncate`}>{prod.cod_barra}</td>
                  <td className={style.td}>{prod.stock}</td>
                  <td className={style.td}>{prod.precio_compra}</td>
                  <td className={style.td}>{prod.precio_venta}</td>
                  <td className={style.td}>{prod.ubicacion}</td>
                  <td className={style.td}>{prod.iva}</td>
                  <td className={style.td}>{prod.unidad_medida}</td>
                  {setCantidadProducto && <td className={style.td}>{renderCantidadInput(prod)}</td>}
                  <td className={style.td}>{prod.estado}</td>
                  <td className={`${style.td} text-center`}>
                    <div className="flex justify-center gap-2">
                      {onSelect ? (
                        <button
                          onClick={() => handleSeleccionar(prod)}
                          className={`bg-blue-600 hover:bg-blue-700 ${style.btn}`}
                        >
                          Seleccionar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(prod.idproducto)}
                            className={`bg-yellow-400 hover:bg-yellow-500 ${style.btn}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(prod.idproducto)}
                            className={`bg-red-500 hover:bg-red-600 ${style.btn}`}
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

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      </div>

      {/* Modales */}
      <ModalsCrearCompraRapida isOpen={modalCrearCompraRapidaOpen} onClose={() => setModalCrearCompraRapidaOpen(false)} onSuccess={fetchProductos} />
      <ModalEditarProducto isOpen={modalEditarProductoOpen} onClose={() => setModalEditarProductoOpen(false)} onSuccess={fetchProductos} id={idProducto} />
      <ModalAdvert isOpen={modalAdvertOpen} onClose={() => setModalAdvertOpen(false)} message="Este producto no tiene stock disponible." />
    </div>
  );
};

export default ListarProductos;
