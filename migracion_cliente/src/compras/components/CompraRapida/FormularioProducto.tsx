'use client';

import { useState } from 'react';
import ModalSeleccionarCategoria from '../../../productos/components/ModalsProductos/ModalSeleccionarCategoria';
import ModalAdvert from '../../../components/ModalAdvert';
interface Props {
    onAgregar: (producto: any) => void;
}

const FormularioProducto = ({ onAgregar }: Props) => {
    const [form, setForm] = useState({
        nombre_producto: '',
        precio_compra: '',
        cod_barra: '',
        precio_venta: '',
        unidad_medida: '',
        iva: '',
        idcategoria: '',
        cantidad: '',
        fecha_vencimiento: '',
        ubicacion: ''
    });
    const [modalAdvertOpen, setModalAdvertOpen] = useState(false);
    const [modalConfirm, setModalConfirm] = useState("");
    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<any>(null);

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleAgregar = () => {
        if (!form.nombre_producto || !form.precio_compra || !form.precio_venta || !form.unidad_medida || !form.iva || !form.idcategoria || !form.cantidad) {
            setModalConfirm('Completá todos los campos obligatorios.');
            setModalAdvertOpen(true);
            return;
        }

        onAgregar(form);
        setForm({
            nombre_producto: '',
            precio_compra: '',
            cod_barra: '',
            precio_venta: '',
            unidad_medida: '',
            iva: '',
            idcategoria: '',
            cantidad: '',
            fecha_vencimiento: '',
            ubicacion: ''
        });
        setCategoriaSeleccionada(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <input type="text" name="nombre_producto" value={form.nombre_producto} onChange={handleChange} placeholder="Nombre Producto" className="border rounded-lg px-4 py-2" />
            <input type="number" name="precio_compra" value={form.precio_compra} onChange={handleChange} placeholder="Precio Compra" className="border rounded-lg px-4 py-2" />
            <input type="text" name="cod_barra" value={form.cod_barra} onChange={handleChange} placeholder="Codigo Barra" className="border rounded-lg px-4 py-2" />
            <input type="number" name="precio_venta" value={form.precio_venta} onChange={handleChange} placeholder="Precio Venta" className="border rounded-lg px-4 py-2" />
            <input type="text" name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicacion" className="border rounded-lg px-4 py-2" />
            <select
                name="unidad_medida"
                value={form.unidad_medida}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 bg-white"
            >
                <option value="">Seleccionar unidad</option>
                <option value="KG">Kilogramo (KG)</option>
                <option value="UNIDAD">Unidad</option>
                <option value="PAQUETE">Paquete</option>
                <option value="LITRO">Litro (L)</option>
            </select>
            <select
                name="iva"
                value={form.iva}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 bg-white"
            >
                <option value="">Seleccionar Iva</option>
                <option value="0">Exenta</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
            </select>

            {/* Botón de seleccionar categoría */}
            <div className="flex flex-col">
                <button
                    type="button"
                    onClick={() => setShowCategoriaModal(true)}
                    className="border rounded-lg px-4 py-2 bg-gray-100 hover:bg-gray-200 text-left"
                >
                    {categoriaSeleccionada ? categoriaSeleccionada.categoria : 'Seleccionar Categoría'}
                </button>
            </div>

            <div className="flex flex-col">

                <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={form.cantidad}
                    onChange={handleChange}
                    placeholder="Cantidad"
                    className=" border rounded-lg px-4 py-2"
                />
            </div>

            <div className="flex flex-col">
            
                <input
                    type="date"
                    id="fecha_vencimiento"
                    name="fecha_vencimiento"
                    value={form.fecha_vencimiento}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-2"
                />
            </div>


            <div className="flex items-end">
                <button type="button" onClick={handleAgregar} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow w-full">
                    ➕ Agregar Producto
                </button>
            </div>

            {/* MODAL DE CATEGORÍAS */}
            <ModalSeleccionarCategoria
                isOpen={showCategoriaModal}
                onClose={() => setShowCategoriaModal(false)}
                onSelect={(categoria: any) => {
                    setCategoriaSeleccionada(categoria);
                    setForm(prev => ({ ...prev, idcategoria: categoria.idcategorias }));
                    setShowCategoriaModal(false);
                }}
            />
            <ModalAdvert
                isOpen={modalAdvertOpen}
                onClose={() => setModalAdvertOpen(false)}
                message={modalConfirm}
                onConfirm={() => {
                    setModalAdvertOpen(false);
                }}
            />
        </div>
    );
};

export default FormularioProducto;
