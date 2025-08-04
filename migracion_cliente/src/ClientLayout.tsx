'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import AppSidebar from './components/Sidebar';
import { generateNavItems } from './utils/generateNavItems';

const ClientLayout = () => {
  const navigate = useNavigate();
  const userRole = useUserStore((state: { userRole: any; }) => state.userRole);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (!userRole) {
      const stored = localStorage.getItem('usuario');
      if (!stored) {
        navigate('/login');
      }
    }
  }, [userRole]);

  const navItems = generateNavItems(userRole);

  return (
    <div className="flex min-h-screen">
      <AppSidebar
        navItems={navItems}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <main
        className={`transition-all duration-300 ${isExpanded ? 'ml-72' : 'ml-20'
          } flex-1 p-4 bg-gray-100`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
