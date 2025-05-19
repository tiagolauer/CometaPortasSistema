import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, ShoppingCart, History, LogOut, Users, DollarSign, Menu } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Orçamentos', path: '/orcamentos' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/pedidos' },
    { icon: History, label: 'Histórico', path: '/historico' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
  ];

  return (
    <>
      {/* Botão de menu para mobile */}
      <button
        className="md:hidden fixed top-2 left-2 z-50 bg-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-primary-200"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar responsivo */}
      <aside
        className={`
          bg-white border-r border-gray-200 w-64 h-screen flex flex-col fixed top-0 left-0 z-40 transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex
        `}
        style={{ maxWidth: '100vw' }}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Logo />
          {/* Botão para fechar no mobile */}
          <button
            className="md:hidden ml-2"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <span className="text-2xl">&times;</span>
          </button>
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
                  onClick={() => setOpen(false)} // Fecha o menu ao clicar em um item no mobile
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

      {/* Overlay para fechar o menu ao clicar fora no mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;