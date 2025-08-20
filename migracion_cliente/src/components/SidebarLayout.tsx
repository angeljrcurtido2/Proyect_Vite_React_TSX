'use client';

import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { generateNavItems } from '../utils/generateNavItems';
import AppSidebar from './Sidebar';

interface SidebarLayoutProps {
  children?: ReactNode; 
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const userRole = useUserStore((state) => state.userRole);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (!userRole && !stored) {
      navigate('/login');
    }
  }, [userRole]);

  const navItems = generateNavItems(userRole);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AppSidebar
        navItems={navItems}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <main className={`transition-all duration-300 ${isExpanded ? 'ml-72' : 'ml-20'} flex-1 `}>
        {children ?? <Outlet />} 
      </main>
    </div>
  );
}