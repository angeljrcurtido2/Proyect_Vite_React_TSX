interface Props {
    productos: any[];
    onEditProducto: (index: number, field: string, value: string) => void;
    onDeleteProducto: (index: number) => void;
  }
  
  const TablaProductos = ({ productos, onEditProducto, onDeleteProducto  }: Props) => {
    if (productos.length === 0) return null;
  
    return (
      <div className="overflow-x-auto rounded-lg border mt-6">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 border">Producto</th>
              <th className="px-4 py-2 border">Cantidad</th>
              <th className="px-4 py-2 border">Precio Compra</th>
              <th className="px-4 py-2 border">Precio Venta</th>
              <th className="px-4 py-2 border">Cod Barra</th>
              <th className="px-4 py-2 border">Unidad</th>
              <th className="px-4 py-2 border">Ubicación</th>
              <th className="px-4 py-2 border">IVA</th>
              <th className="px-4 py-2 border">Categoría</th>
              <th className="px-4 py-2 border text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 border">
                  <input
                    type="text"
                    value={prod.nombre_producto}
                    onChange={(e) => onEditProducto(idx, 'nombre_producto', e.target.value)}
                    className="w-20 border rounded text-center"
                  />
                </td>
  
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={prod.cantidad}
                    onChange={(e) => onEditProducto(idx, 'cantidad', e.target.value)}
                    className="w-20 border rounded text-center"
                  />
                </td>
  
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={prod.precio_compra}
                    onChange={(e) => onEditProducto(idx, 'precio_compra', e.target.value)}
                    className="w-24 border rounded text-center"
                  />
                </td>
  
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={prod.precio_venta}
                    onChange={(e) => onEditProducto(idx, 'precio_venta', e.target.value)}
                    className="w-24 border rounded text-center"
                  />
                </td>
                <td className="px-4 py-2 border">{prod.cod_barra}</td>
                <td className="px-4 py-2 border">{prod.unidad_medida}</td>
                <td className="px-4 py-2 border">{prod.ubicacion}</td>
                <td className="px-4 py-2 border">{prod.iva}</td>
                <td className="px-4 py-2 border">{prod.idcategoria}</td>
                              {/* ✅ Botón Eliminar */}
              <td className="px-4 py-2 border text-center">
                <button
                  type="button"
                  onClick={() => onDeleteProducto(idx)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TablaProductos;
  