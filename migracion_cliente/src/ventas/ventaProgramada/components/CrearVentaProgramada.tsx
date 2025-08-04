'use client';

import { useState } from 'react';
import { createVentaProgramada } from '../../../services/ventas';
import ModalSeleccionarCliente from '../../components/ModalsVenta/ModalSeleccionarCliente';
import ModalSeleccionarProducto from '../../../compras/components/Modals/ModalSeleccionarProducto';
import ModalError from '../../../components/ModalError';
import ModalSuccess from '../../../components/ModalSuccess';

interface CrearVentaProgramadaProps {
  onSuccess?: () => void;
  onClose: () => void;
}
const fecha = new Date().toISOString().split('T')[0];
const initialForm = {
  idcliente: '',
  idproducto: '',
  nombre_producto: '',
  cantidad: 1,
  fecha_inicio: fecha,
  dia_programado: '',
  observacion: '',
};

const CrearVentaProgramada = ({ onSuccess, onClose }: CrearVentaProgramadaProps) => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(initialForm);

  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { idcliente, idproducto, fecha_inicio, dia_programado } = formData;

    if (!idcliente || !idproducto || !fecha_inicio || !dia_programado) {
      setErrorMessage('❌ Completa todos los campos obligatorios.');
      setErrorModalOpen(true);
      return;
    }

    try {
      await createVentaProgramada({
        idcliente: Number(idcliente),
        idproducto: Number(idproducto),
        cantidad: formData.cantidad,
        fecha_inicio,
        dia_programado: Number(dia_programado),
        estado: 'activa',
        observacion: formData.observacion,
      });

      onSuccess && onSuccess();
      onClose();
      setSuccessModalOpen(true);
      setFormData(initialForm);
      setClienteSeleccionado(null);
    } catch (error: any) {
      setErrorMessage('❌ ' + (error.response?.data?.error || 'Error al crear venta programada'));
      setErrorModalOpen(true);
    }
  };

  return (
    <div className="flex justify-center items-center py-8 px-4 bg-gray-50">
      <div className="bg-white max-w-5xl rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-blue-700 text-center">
          📅 Crear Venta Programada
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cliente */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Cliente</label>
            <div className="grid grid-cols-12 gap-2">
              <input
                type="number"
                name="idcliente"
                value={formData.idcliente}
                onChange={handleChange}
                placeholder="ID Cliente"
                className="col-span-6 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowClienteModal(true)}
                className="col-span-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Seleccionar
              </button>
            </div>
            {clienteSeleccionado && (
              <p className="text-green-600 font-bold text-sm mt-1 text-left">
                Cliente: {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Producto</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="idproducto"
                value={formData.idproducto}
                onChange={handleChange}
                placeholder="ID Producto"
                className=" border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowProductoModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Seleccionar
              </button>
            </div>
            {formData.nombre_producto && (
              <p className="text-sm text-green-600 font-bold">Producto: {formData.nombre_producto}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fecha de inicio */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Fecha de inicio</label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>

            {/* Día programado */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Día programado</label>
              <input
                type="number"
                name="dia_programado"
                value={formData.dia_programado}
                onChange={handleChange}
                placeholder="Ej: 15"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>

            {/* Observación */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Observación</label>
              <input
                type="text"
                name="observacion"
                value={formData.observacion}
                onChange={handleChange}
                placeholder="Observaciones..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Guardar Venta Programada
          </button>
        </form>
      </div>

      {/* Modales */}
      <ModalSuccess
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="✅ Venta programada creada con éxito"
      />
      <ModalError
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
      <ModalSeleccionarProducto
        isOpen={showProductoModal}
        detalles={[]}
        configVentaPorLote={false}
        cantidadProducto={0}
        stockVerify={false}
        setCantidadMaximo={() => { }}
        setCantidadProducto={() => { }}
        onClose={() => setShowProductoModal(false)}
        onSelect={(producto) => {
          setFormData((prev) => ({
            ...prev,
            idproducto: producto.idproducto.toString(),
            nombre_producto: producto.nombre_producto,
          }));
          setShowProductoModal(false);
        }}
      />
      <ModalSeleccionarCliente
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onSelect={(cliente) => {
          setClienteSeleccionado(cliente);
          setFormData((prev) => ({
            ...prev,
            idcliente: cliente.idcliente.toString(),
          }));
          setShowClienteModal(false);
        }}
      />
    </div>
  );
};

export default CrearVentaProgramada;
