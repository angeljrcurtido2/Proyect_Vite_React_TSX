'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getConfiguracionValor, guardarConfiguracion, getConfiguracionValorString, descargarBackup } from '../services/configuracion';
import SidebarLayout from '../components/SidebarLayout';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Configuracion() {
  const [valorLoteActual, setValorLoteActual] = useState<boolean | null>(null);
  const [nuevoValorLote, setNuevoValorLote] = useState<boolean>(false);

  const [valorVencimientoActual, setValorVencimientoActual] = useState<boolean | null>(null);
  const [nuevoValorVencimiento, setNuevoValorVencimiento] = useState<boolean>(false);

  const [valorVentasProgramadasActual, setValorVentasProgramadasActual] = useState<boolean | null>(null);
  const [nuevoValorVentasProgramadas, setNuevoValorVentasProgramadas] = useState<boolean>(false);

  const [mensaje, setMensaje] = useState('');

  const [templateActual, setTemplateActual] = useState<string | null>(null);
  const [nuevoTemplate, setNuevoTemplate] = useState<string>('t1');

  useEffect(() => {
    getConfiguracionValor('sistema_venta_por_lote')
      .then((res: any) => {
        setValorLoteActual(res.data.valor);
        setNuevoValorLote(res.data.valor);

      })
      .catch(() => {
        setValorLoteActual(false);
        setNuevoValorLote(false);
      });

    getConfiguracionValor('venta_fecha_vencimiento')
      .then((res: any) => {
        setValorVencimientoActual(res.data.valor);
        setNuevoValorVencimiento(res.data.valor);
      })
      .catch(() => {
        setValorVencimientoActual(false);
        setNuevoValorVencimiento(false);
      });

    getConfiguracionValor('ventas_programadas')
      .then((res: any) => {
        setValorVentasProgramadasActual(res.data.valor);
        setNuevoValorVentasProgramadas(res.data.valor);
      })
      .catch(() => {
        setValorVentasProgramadasActual(false);
        setNuevoValorVentasProgramadas(false);
      });

    getConfiguracionValorString('selectedTemplate')
      .then((res: any) => {
        setTemplateActual(res.data.valor);
        setNuevoTemplate(res.data.valor);
      })
      .catch(() => {
        setTemplateActual('t1');
        setNuevoTemplate('t1');
      });

  }, []);

  const handleBackup = async () => {
    try {
      const blob = await descargarBackup();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'respaldo.sql';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al bajar backup:', err);
    }
  };

  const handleGuardar = async () => {
    try {
      await guardarConfiguracion('sistema_venta_por_lote', nuevoValorLote);
      await guardarConfiguracion('venta_fecha_vencimiento', nuevoValorVencimiento);
      await guardarConfiguracion('ventas_programadas', nuevoValorVentasProgramadas);
      await guardarConfiguracion('selectedTemplate', nuevoTemplate);

      setTemplateActual(nuevoTemplate);
      setValorLoteActual(nuevoValorLote);
      setValorVencimientoActual(nuevoValorVencimiento);
      setMensaje('✅ Configuraciones guardadas correctamente');

      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al guardar configuraciones');
    }
  };

  const ConfigCard = ({
    title,
    description,
    value,
    onChange,
    current,
  }: {
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
    current: boolean | null;
  }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {current !== null ? (
          current ? (
            <span className="flex items-center text-green-600 text-sm font-medium">
              <CheckCircle size={18} className="mr-1" /> Activado
            </span>
          ) : (
            <span className="flex items-center text-red-600 text-sm font-medium">
              <AlertCircle size={18} className="mr-1" /> Desactivado
            </span>
          )
        ) : (
          <span className="text-gray-400 text-sm">Cargando...</span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <select
        value={value ? 'true' : 'false'}
        onChange={(e) => onChange(e.target.value === 'true')}
        className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="true">Sí (Activado)</option>
        <option value="false">No (Desactivado)</option>
      </select>
    </div>
  );

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto mt-16 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Configuración del Sistema</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfigCard
            title="Selección Manual por Lote"
            description="Permite que el usuario elija manualmente de qué lote vender. Si se desactiva, el sistema aplicará FIFO automáticamente."
            value={nuevoValorLote}
            onChange={setNuevoValorLote}
            current={valorLoteActual}
          />
          <ConfigCard
            title="Validar Fecha de Vencimiento"
            description="Impide vender productos con fecha de vencimiento pasada. Si se desactiva, el sistema no controlará esto."
            value={nuevoValorVencimiento}
            onChange={setNuevoValorVencimiento}
            current={valorVencimientoActual}
          />

          <ConfigCard
            title="Ventas Programadas"
            description="Habilita o deshabilita la automatización de ventas programadas."
            value={nuevoValorVentasProgramadas}
            onChange={setNuevoValorVentasProgramadas}
            current={valorVentasProgramadasActual}
          />

          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Diseño de Comprobante</h3>
              {templateActual ? (
                <span className="text-blue-600 text-sm font-medium">Actual: {templateActual.toUpperCase()}</span>
              ) : (
                <span className="text-gray-400 text-sm">Cargando...</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">Seleccioná el diseño que querés usar al imprimir comprobantes de venta.</p>
            <select
              value={nuevoTemplate}
              onChange={(e) => setNuevoTemplate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="t1">Plantilla Estándar</option>
              <option value="t2">Plantilla Formal A4</option>
              <option value="t3">Plantilla Compacta</option>
              <option value="t4">Plantilla Moderna</option>
            </select>
          </div>

        </div>

        <button
          onClick={handleBackup}
          className="group relative mt-8 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  px-6 py-3 font-medium text-white shadow-lg transition-transform duration-300  hover:scale-105 focus:outline-none">
          <ArrowDownTrayIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
          Descargar respaldo
          <span className="absolute inset-0 -z-10 h-full w-full origin-left scale-x-0 bg-white/20 transition-transform duration-300 group-hover:scale-x-100" />
        </button>

        <button
          onClick={handleGuardar}
          className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-lg transition duration-200"
        >
          Guardar configuraciones
        </button>

        {mensaje && (
          <div className="mt-6 text-center text-sm text-blue-700 bg-blue-100 border border-blue-300 rounded-md py-2 px-4">
            {mensaje}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
