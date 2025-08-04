'use client';

import { useEffect, useState } from 'react';
import ModalSuccess from '../../components/ModalSuccess';
import ModalSeleccionarCategoria from '../components/ModalsProductos/ModalSeleccionarCategoria';
import ModalConfirmUpdate from './ModalsProductos/ModalConfirmUpdate';
import { FiSave } from 'react-icons/fi';
import { getProductoById, updateProducto } from '../../services/productos';

const initialForm = {
  nombre_producto: '',
  precio_venta: '',
  idcategoria: '',
  ubicacion: '',
  cod_barra: '',
  iva: '',
  estado: 'activo',
  unidad_medida: ''
};

interface EditarProductoProps {
  id: number | string; 
  onSuccess?: () => void; 
  onClose?: () => void; 
}

const EditarProducto = ({id, onSuccess, onClose}: EditarProductoProps) => {

  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
  const [categoriaNombre, setCategoriaNombre] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getProductoById(id).then((res) => {
        const data = res.data;
        setFormData({
          nombre_producto: data.nombre_producto || '',
          precio_venta: data.precio_venta ?? '',
          idcategoria: data.idcategoria ?? '',
          ubicacion: data.ubicacion || '',
          cod_barra: data.cod_barra || '',
          iva: data.iva || '',
          estado: data.estado || 'activo',
          unidad_medida: data.unidad_medida || '',
        });
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      await updateProducto(id, formData);
      onSuccess && onSuccess(); 
      onClose && onClose();  
      setConfirmModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error al actualizar producto', error);
    }
  };

  return (
    <div className="flex items-center justify-center  px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">✏️ Editar Producto</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
            <input
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Nombre del producto"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Cod_Barra</label>
            <input
              type="text"
              name="cod_barra"
              value={formData.cod_barra}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Codigo de barra"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Precio de venta</label>
            <input
              type="number"
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Precio de venta"
            />
          </div>

          <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setModalCategoriaOpen(true)}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 mt-6 rounded-md"
              >
                Seleccionar Categoría
              </button>
              {categoriaNombre && (
                <p className="text-sm text-green-700">
                  📦 Categoría seleccionada: <strong>{categoriaNombre}</strong>
                </p>
              )}
            </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Ubicación"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">IVA</label>
            <select
              name="iva"
              value={formData.iva}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar IVA</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Unidad de medida</label>
            <input
              type="text"
              name="unidad_medida"
              value={formData.unidad_medida}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Unidad de medida"
            />
          </div>


          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              <FiSave className="text-xl" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <ModalSuccess
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Producto actualizado con éxito ✅"
      />
      <ModalConfirmUpdate
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        data={formData}
      />
        <ModalSeleccionarCategoria
        isOpen={modalCategoriaOpen}
        onClose={() => setModalCategoriaOpen(false)}
        onSelect={(categoria) => {
          setFormData({ ...formData, idcategoria: categoria.idcategorias });
          setCategoriaNombre(categoria.categoria);
          setModalCategoriaOpen(false);
        }}
      />
    </div>
  );
};

export default EditarProducto;
