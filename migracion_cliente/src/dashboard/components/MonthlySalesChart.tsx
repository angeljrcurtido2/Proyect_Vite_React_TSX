"use client";
import { useEffect, useState } from "react";
import { getCobrosMensuales } from "../../services/ingreso";
import { BanknotesIcon } from "@heroicons/react/24/solid";

interface CobroMesActual {
  anio:         number;
  mes:          number; 
  totalMensual: number;
}

export default function ResumenCobroMensual() {
  const [data, setData]   = useState<CobroMesActual | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);

  useEffect(() => {
    const fetchCobro = async () => {
      try {
        const res = await getCobrosMensuales();
        setData(res.data as CobroMesActual);
      } catch (e) {
        console.error(e);
        setErr("No se pudo obtener el cobro del mes");
      } finally {
        setLoading(false);
      }
    };
    fetchCobro();
  }, []);

  if (loading) return <SkeletonCard />;
  if (err)     return <ErrorCard message={err} />;
  if (!data)   return null;
  const { anio, mes, totalMensual } = data;
  const monthStr = new Intl.DateTimeFormat("es", { month: "long" })
                     .format(new Date(anio, mes - 1));
  const totalFmt = totalMensual.toLocaleString("es-PY");

  return (
    <div className="relative rounded-md inline-block bg-white shadow-lg ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-gray-800">
      <div className="absolute rounded-md inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />

      <div className="p-6 sm:p-7 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <BanknotesIcon className="h-6 w-6" />
          </span>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Cobros de {monthStr.charAt(0).toUpperCase() + monthStr.slice(1)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Año&nbsp;{anio}
            </p>
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white text-center">
          {totalFmt}&nbsp;<span className="text-lg font-semibold">Gs</span>
        </h2>
      </div>
    </div>
  );
}
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl bg-white shadow-lg ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-gray-800 h-32" />
  );
}
function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-3xl bg-white shadow-lg ring-1 ring-red-500 p-6 text-red-600 dark:bg-slate-900 dark:text-red-400">
      {message}
    </div>
  );
}
