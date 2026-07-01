import React from 'react';
import { Home, LayoutGrid, Leaf, BarChart3, Sun, Moon } from 'lucide-react';
import logoSiagaTani from '../assets/logo-siaga-tani.png';

export default function Navbar({ activeSection, onSectionChange, theme, onToggleTheme }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'crops', label: 'Sektor', icon: <Leaf className="w-5 h-5" /> },
    { id: 'analysis', label: 'Analisis Risiko', icon: <BarChart3 className="w-5 h-5" /> }
  ];

  return (
    <nav className="w-full lg:w-20 xl:w-24 flex flex-row lg:flex-col items-center justify-between px-4 py-3 lg:px-0 lg:py-8 h-16 lg:h-auto lg:min-h-screen glass-card lg:rounded-r-3xl lg:rounded-l-none border-b lg:border-b-0 lg:border-r border-emerald-500/15 dark:border-white/5 relative z-40 transition-all duration-300">

      <div className="flex items-center gap-3 lg:flex-col lg:gap-2">
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-500/20 dark:border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform bg-white">
            <img src={logoSiagaTani} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
        </div>
        <div className="lg:hidden flex flex-col">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">SiagaTani</span>
          <span className="text-[9px] text-slate-400 leading-none">Petani Modern</span>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col gap-2.5 lg:gap-4.5 my-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.06)]'
                  : 'bg-transparent text-slate-400 dark:text-slate-500 border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-900/60 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={item.label}
            >
              {item.icon}
              <span className="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl border border-slate-800">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-center"
          title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-500" />
          )}
        </button>
      </div>

    </nav>
  );
}
