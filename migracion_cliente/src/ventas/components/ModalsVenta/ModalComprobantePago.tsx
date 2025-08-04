interface ModalComprobantePagoProps {
  comprobante: {
    cliente: string;
    proveedor?: string;
    fecha_pago: string;
    monto_pagado: string;
    tipoPago?: string;
    saldo: string;
    detallesVenta: {
      idproducto: number;
      producto: string;
      cantidad: string;
      precio_venta?: string;
      precio?: string;
      sub_total: string;
    }[];
    detallesCompra?: {
      idproducto: number;
      producto: string;
      cantidad: string;
      precio?: string;
      precio_venta?:string;
      sub_total: string;
    }[];
  };
  onClose: () => void;
  isProviderPay?: boolean;
}
const titleSell = "Detalle de Venta la cual se esta realizando el pago a credito"
const titleBuy = "Detalle de Compra la cual se esta realizando el pago a credito"
const ModalComprobantePago: React.FC<ModalComprobantePagoProps> = ({ comprobante, onClose, isProviderPay = false }) => {
  return (
    <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-center">🧾 Comprobante de Pago</h2>
        <p><strong>{`${isProviderPay ? "Proveedor" : "Cliente"}`}:</strong> {isProviderPay ? comprobante.proveedor : comprobante.cliente}</p>
        <p><strong>Fecha de Pago:</strong> {new Date(comprobante.fecha_pago).toLocaleDateString()}</p>
        <p><strong>Monto Pagado:</strong> {comprobante.monto_pagado} Gs</p>
        <p><strong>Tipo de Pago:</strong> {comprobante.tipoPago}</p>
        <p><strong>Saldo Pendiente:</strong> {comprobante.saldo} Gs</p>

        <h3 className="mt-4 font-semibold">{isProviderPay ? titleBuy : titleSell}</h3>
        <table className="w-full text-sm mt-2 border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">Producto</th>
              <th className="px-2 py-1 border">Cantidad</th>
              <th className="px-2 py-1 border">Precio</th>
              <th className="px-2 py-1 border">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(isProviderPay
              ? comprobante.detallesCompra ?? [] 
              : comprobante.detallesVenta
            ).map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{item.producto}</td>
                <td className="border px-2 py-1">{item.cantidad}</td>
                <td className="border px-2 py-1">
                  {isProviderPay ? item.precio ?? 0 : item.precio_venta ?? 0}
                </td>
                <td className="border px-2 py-1">{item.sub_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalComprobantePago;
