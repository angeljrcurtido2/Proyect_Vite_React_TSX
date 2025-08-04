import {
  Squares2X2Icon,
  BuildingStorefrontIcon,
  BanknotesIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { type ComponentType, type SVGProps } from 'react';

interface NavItem {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path?: string;
  subItems?: {
    name: string;
    path: string;
  }[];
}

export const generateNavItems = (userRole: string | null): NavItem[] => {
  const allItems: NavItem[] = [
    {
      name: 'General',
      icon: Squares2X2Icon, 
      subItems: [
        { name: 'Inicio', path: '/dashboard' },
        { name: 'Usuarios', path: '/usuario' },
      ],
    },
    {
      name: 'Gestión',
      icon: BuildingStorefrontIcon,
      subItems: [
        { name: 'Proveedor', path: '/proveedor' },
        { name: 'Cliente', path: '/clientes' },
        { name: 'Productos', path: '/productos' },
        { name: 'Facturador', path: '/facturador' },
      ],
    },
    {
      name: 'Finanzas',
      icon: BanknotesIcon,
      subItems: [
        { name: 'Compras', path: '/compras' },
        { name: 'Ventas', path: '/ventas' },
        { name: 'Ventas Programadas', path: '/ventas/ventaProgramada' },
        { name: 'Cobro Ventas Crédito', path: '/ventas/cobrodeuda' },
        { name: 'Pago Compras Crédito', path: '/compras/cobrodeuda' },
        { name: 'Movimientos', path: '/movimiento/cierrecaja' },
        { name: 'Ingresos Varios', path: '/movimiento/ingreso' },
        { name: 'Egresos Varios', path: '/movimiento/egreso' },
      ],
    },
    {
      name: 'Configuración',
      icon: Cog6ToothIcon,
      subItems: [
        { name: 'Configuración', path: '/configuracion' },
      ],
    },
  ];

  if (userRole === 'Administrador') return allItems;
  if (userRole === 'Cajero') return allItems.filter(item => item.name === 'Finanzas');
  return [];
};
