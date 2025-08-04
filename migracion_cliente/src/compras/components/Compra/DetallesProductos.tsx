import type { FC } from 'react';

interface Props {
  detalles: any[];
  setDetalles: (data: any[]) => void;
}

const DetallesProductos: FC<Props> = ({ detalles, setDetalles }) => {
  const updateDetalle = (index: number, field: string, value: string) => {
    const updated = [...detalles];
    updated[index][field] = value;
    setDetalles(updated);
  };

  const removeDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  if (!detalles.length) return null;

  return (
    <div className="overflow-x-auto rounded-lg border mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="px-4 py-2 border">Producto</th>
            <th className="px-4 py-2 border text-center">Cantidad</th>
            <th className="px-4 py-2 border text-center">Fec. Vencimiento</th>
            <th className="px-4 py-2 border text-center">Precio</th>
            <th className="px-4 py-2 border text-right">Subtotal</th>
            <th className="px-4 py-2 border text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2 border">{d.nombre_producto}</td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="number"
                  value={d.cantidad}
                  onChange={e => updateDetalle(idx, 'cantidad', e.target.value)}
                  className="w-20 text-center border rounded"
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="date"
                  value={d.fecha_vencimiento || ''}
                  onChange={e => updateDetalle(idx, 'fecha_vencimiento', e.target.value)}
                  className="w-full text-center border rounded"
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="number"
                  value={d.precio}
                  onChange={e => updateDetalle(idx, 'precio', e.target.value)}
                  className="w-24 text-center border rounded"
                />
              </td>
              <td className="px-4 py-2 border text-right">
                {(parseFloat(d.precio || '0') * parseFloat(d.cantidad || '0')).toLocaleString()} Gs
              </td>
              <td className="px-4 py-2 border text-center">
                <button onClick={() => removeDetalle(idx)} className="text-red-500 hover:text-red-700">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetallesProductos;
