import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, ShoppingCart, History, LogOut, Users, DollarSign } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Orçamentos', path: '/orcamentos' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/pedidos' },
    { icon: History, label: 'Histórico', path: '/historico' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
  ];

  return (
    <aside className="bg-white border-r border-gray-200 w-64 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Logo />
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Desconectar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;