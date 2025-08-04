import type { FC } from 'react';

const TotalCompra: FC<{ total: number }> = ({ total }) => (
  <div className="text-right text-xl text-gray-700 mt-4">
    <strong>Total:</strong> {total.toLocaleString()} Gs
  </div>
);

export default TotalCompra;
