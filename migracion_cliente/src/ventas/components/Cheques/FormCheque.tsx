'use client';

import { type FC } from 'react';

interface Props {
    onClose: () => void;
    datosCheque: any;
    setDatosCheque: (data: any) => void;
}

const FormCheque: FC<Props> = ({  onClose, datosCheque, setDatosCheque }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatosCheque((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
            {[
                { label: 'Banco', name: 'banco' },
                { label: 'Nro. Cheque', name: 'nro_cheque' },
                { label: 'Monto', name: 'monto', type: 'number' },
                { label: 'Fecha Emisión', name: 'fecha_emision', type: 'date' },
                { label: 'Fecha Vencimiento', name: 'fecha_vencimiento', type: 'date' },
                { label: 'Titular', name: 'titular' },
            ].map(({ label, name, type = 'text' }) => (
                <div key={name}>
                    <label className="text-sm">{label}</label>
                    <input
                        type={type}
                        name={name}
                        value={datosCheque[name] || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                </div>
            ))}
            <button
                onClick={onClose}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
                Confirmar
            </button>
        </div>
    );
};

export default FormCheque;
