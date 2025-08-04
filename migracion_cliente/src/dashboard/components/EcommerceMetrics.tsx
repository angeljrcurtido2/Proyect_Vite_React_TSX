"use client";
import { useEffect, useState } from "react";
import { listarDeudasVentaAgrupadasPorClienteSinPaginar } from "../../services/ventas";
interface DeudaCliente {
  idcliente: number;
  nombre_cliente: string;
  numDocumento: string;
  items_pendientes: number;
  items_pagados: number;
  total_deuda: string; 
  total_pagado: string;
  saldo: string;
  fecha_deuda: string;
  created_at: string;
}
interface Totals {
  itemsPendientes: number;
  totalDeuda: number;
  saldo: number;
}

const fmt = new Intl.NumberFormat("es-PY", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const fmtMoney = (v: number | string) =>
  new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
  }).format(+v);

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border p-6 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.04]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

export default function DeudasClientes() {
  const [rows, setRows] = useState<DeudaCliente[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await listarDeudasVentaAgrupadasPorClienteSinPaginar();
      setRows(res.data.data);
      setTotals(res.data.totals);
    } catch (e) {
      console.error(e);
      setErr("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Cargando…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!totals) return null;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <Card title="Ítems pendientes" value={fmt.format(totals.itemsPendientes)} />
        <Card title="Total deuda"       value={fmtMoney(totals.totalDeuda)} />
        <Card title="Saldo pendiente"   value={fmtMoney(totals.saldo)} />
      </div>
       <div className="flex-1 overflow-auto rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 dark:text-gray-300">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-600 dark:text-gray-300">
                Documento
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-600 dark:text-gray-300">
                Pendientes
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-600 dark:text-gray-300">
                Total deuda
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-600 dark:text-gray-300">
                Saldo
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((r, i) => (
              <tr
                key={r.idcliente}
                className={i % 2 ? "bg-white dark:bg-gray-800/30" : "bg-gray-50 dark:bg-gray-800/10"}
              >
                <td className="px-4 py-3 whitespace-nowrap">{r.nombre_cliente}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.numDocumento}</td>
                <td className="px-4 py-3 text-right">{fmt.format(r.items_pendientes)}</td>
                <td className="px-4 py-3 text-right">{fmtMoney(r.total_deuda)}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {fmtMoney(r.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-gray-900/60 border-t dark:border-gray-700">
            <tr>
              <th colSpan={2} className="px-4 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                Totales&nbsp;↠
              </th>
              <th className="px-4 py-4 text-right text-sm font-bold">
                {fmt.format(totals.itemsPendientes)}
              </th>
              <th className="px-4 py-4 text-right text-sm font-bold">
                {fmtMoney(totals.totalDeuda)}
              </th>
              <th className="px-4 py-4 text-right text-sm font-bold">
                {fmtMoney(totals.saldo)}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
