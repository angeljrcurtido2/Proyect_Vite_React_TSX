import { useState, type FC } from 'react';
import ModalAdvert from '../../../components/ModalAdvert';

interface Props {
  detalles: any[];
  setDetalles: (data: any[]) => void;
  setCantidadProducto?: (cantidad: number) => void;
}

const DetallesProductos: FC<Props> = ({ detalles, setDetalles }) => {
  const [advertMessage, setAdvertMessage] = useState<string>('');
  const [advertOpen, setAdvertOpen] = useState<boolean>(false);
  const updateDetalle = (index: number, field: string, value: string | number) => {
    const updated = [...detalles];
    updated[index][field] = value;
    setDetalles(updated);
  };

  const removeDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));

  };

  if (!detalles.length) return null;

  const showAdvert = (message: string) => {
    setAdvertMessage(message);
    setAdvertOpen(true);
  };
  console.log("Detalles productos", detalles);
  const styleTh = "px-4 py-2 border text-center";
  return (
    <div className="overflow-x-auto rounded-lg border mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="px-4 py-2 border">Producto</th>
            <th className={styleTh}>Cantidad</th>
            <th className={styleTh}>Fec. Vencimiento</th>
            <th className={styleTh}>Unidad</th>
            <th className={styleTh}>Precio</th>
            <th className={styleTh}>Subtotal</th>
            <th className={styleTh}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2 border">{d.nombre_producto}</td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="number"
                  min={d.unidad_medida === "KG" || d.unidad_medida === "L" ? 0.1 : 1}
                  step={d.unidad_medida === "KG" || d.unidad_medida === "L" ? 0.1 : 1}
                  max={d.cantidadMaximo}
                  value={d.cantidad}
                  onChange={(e) => {
                    // Permitimos que el usuario borre temporalmente el input (no forzamos corrección aquí)
                    updateDetalle(idx, "cantidad", e.target.value);
                  }}
                  onBlur={(e) => {
                    const unidadEsDecimal = d.unidad_medida === "KG" || d.unidad_medida === "L";
                    let valor = unidadEsDecimal
                      ? parseFloat(e.target.value)
                      : parseInt(e.target.value);

                    const min = unidadEsDecimal ? 0.1 : 1;
                    const max = parseFloat(d.cantidadMaximo);

                    // Si el valor es NaN o vacío, lo corregimos al mínimo
                    if (isNaN(valor)) {
                      showAdvert(`Debés ingresar una cantidad válida (mínimo ${min})`);
                      valor = min;
                    }

                    // Si es menor que el mínimo
                    if (valor < min) {
                      showAdvert(`La cantidad mínima permitida es ${min}`);
                      valor = min;
                    }

                    // Si supera el stock máximo
                    if (valor > max) {
                      showAdvert(`La cantidad no puede superar el stock disponible (${max})`);
                      valor = max;
                    }

                    // Finalmente, actualizamos
                    updateDetalle(idx, "cantidad", valor);
                  }}
                  className="w-20 text-center border rounded"
                />
              </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="date"
                  value={d.fecha_vencimiento ? new Date(d.fecha_vencimiento).toISOString().split('T')[0] : ''}
                  onChange={e => updateDetalle(idx, 'fecha_vencimiento', e.target.value)}
                  className="w-full text-center border rounded"
                />
              </td>
              <td className="px-4 py-2 border text-center">
                {d.unidad_medida === 'KG' ? 'Kg' : d.unidad_medida === 'L' ? 'L' : d.unidad_medida} </td>
              <td className="px-4 py-2 border text-center">
                <input
                  type="number"
                  value={d.precio_venta}
                  onChange={e => updateDetalle(idx, 'precio', e.target.value)}
                  className="w-24 text-center border rounded"
                />
              </td>
              <td className="px-4 py-2 border text-right">
                {(parseFloat(d.precio_venta || '0') * parseFloat(d.cantidad || '0')).toLocaleString()} Gs
              </td>
              <td className="px-4 py-2 border text-center">
                <button onClick={() => removeDetalle(idx)} className="text-red-500 hover:text-red-700">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalAdvert
        isOpen={advertOpen}
        onClose={() => setAdvertOpen(false)}
        message={advertMessage}
      />
    </div>
  );
};

export default DetallesProductos;
