'use client';

import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/solid';

import type { ForwardedRef } from 'react';
import type { ArqueoCaja } from '../CierreCaja/CajaResumen';

interface CrearArqueoProps {
    idmovimiento: number;
    arqueoCerrado?: ArqueoCaja;  
    estadoMovimiento?: boolean;   
}

const denominaciones = [
    50, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000,
];

const CrearArqueoCaja = forwardRef(
    (
        { idmovimiento, arqueoCerrado, estadoMovimiento = false }: CrearArqueoProps,
        ref: ForwardedRef<any>
    ) => {

        const [cantidades, setCantidades] = useState<{ [k: string]: number }>({});
        const [detalles, setDetalles] = useState<
            { detalle: string; monto: number }[]
        >(Array(5).fill({ detalle: '', monto: 0 }));
        const [total, setTotal] = useState(0);

        useEffect(() => {
            if (estadoMovimiento && arqueoCerrado) {
           
                const newCantidades: Record<string, number> = {};
                denominaciones.forEach((den) => {
                    const raw = arqueoCerrado?.[`a${den}` as keyof ArqueoCaja] ?? 0;
                    newCantidades[`a${den}`] = Number(raw);   
                });

                setCantidades(newCantidades);

                const newDetalles = Array(5).fill({ detalle: '', monto: 0 });
                for (let i = 0; i < 5; i++) {
                    newDetalles[i] = {
                        detalle: arqueoCerrado[`detalle${i + 1}` as keyof ArqueoCaja] as string,
                        monto: Number(arqueoCerrado[`monto${i + 1}` as keyof ArqueoCaja] ?? 0),
                    };
                }
                setDetalles(newDetalles);

                setTotal(Number(arqueoCerrado.total));
            }
        }, [estadoMovimiento, arqueoCerrado]);

        useEffect(() => {
            if (estadoMovimiento) return; 
            let suma = 0;
            denominaciones.forEach((den) => (suma += den * (cantidades[`a${den}`] || 0)));
            detalles.forEach((d) => (suma += d.monto || 0));
            setTotal(suma);
        }, [cantidades, detalles, estadoMovimiento]);

        useImperativeHandle(ref, () => ({
            getArqueoData: () => ({
                total,
                payload: {
                    idmovimiento,
                    total,
                    ...Object.fromEntries(
                        denominaciones.map((den) => [`a${den}`, cantidades[`a${den}`] || 0])
                    ),
                    ...Object.fromEntries(
                        detalles.flatMap((d, i) => [
                            [`detalle${i + 1}`, d.detalle],
                            [`monto${i + 1}`, d.monto || 0],
                        ])
                    ),
                },
            }),
        }));

        const disabled = estadoMovimiento; 

        return (
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <BanknotesIcon className="h-7 w-7 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                        {disabled ? 'Arqueo de Caja (cerrado)' : 'Registrar Arqueo de Caja'}
                    </h2>
                </div>

                <div className="flex flex-row gap-4">
        
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                            💵 Cantidad de Billetes
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {denominaciones.map((den) => (
                                <div key={den}>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        {den.toLocaleString()} Gs
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        disabled={disabled}
                                        value={cantidades[`a${den}`] ?? ''}
                                        onChange={(e) =>
                                            setCantidades((prev) => ({
                                                ...prev,
                                                [`a${den}`]: parseInt(e.target.value) || 0,
                                            }))
                                        }
                                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

          
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                            📄 Otros Detalles
                        </h3>
                        <div className="space-y-4">
                            {detalles.map((detalle, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Detalle {idx + 1}
                                        </label>
                                        <input
                                            type="text"
                                            disabled={disabled}
                                            value={detalle.detalle}
                                            onChange={(e) =>
                                                setDetalles((prev) =>
                                                    prev.map((d, i) =>
                                                        i === idx ? { ...d, detalle: e.target.value } : d
                                                    )
                                                )
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Monto
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            disabled={disabled}
                                            value={detalle.monto}
                                            onChange={(e) =>
                                                setDetalles((prev) =>
                                                    prev.map((d, i) =>
                                                        i === idx
                                                            ? { ...d, monto: parseInt(e.target.value) || 0 }
                                                            : d
                                                    )
                                                )
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="bg-indigo-50 text-indigo-800 text-lg rounded-md p-4 font-semibold text-right mb-6 border border-indigo-200">
                    Total Calculado:&nbsp;
                    {total.toLocaleString()} Gs
                </div>
            </div>
        );
    }
);

export default CrearArqueoCaja;
