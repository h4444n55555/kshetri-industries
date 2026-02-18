import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  const getButtonStyles = (path: string) => {
    const isActive = location.pathname === path;
    const base = "px-10 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center tracking-wide";
    
    if (isActive) {
      // Pressed state (Concave)
      return `${base} text-primary shadow-clay-inset bg-background-light translate-y-[1px]`;
    }
    // Floating state (Convex)
    return `${base} text-text-muted hover:text-primary shadow-clay-btn hover:shadow-clay-sm hover:-translate-y-1 bg-background-light`;
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-6 md:px-12 lg:px-24 pointer-events-none">
      <nav className="pointer-events-auto bg-background-light shadow-clay-md rounded-full flex items-center justify-between px-8 py-5 relative max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div className="flex items-center gap-4 cursor-pointer z-20 group" onClick={() => handleNav('/')}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background-light shadow-clay-btn group-hover:shadow-clay-inset transition-all duration-300 overflow-hidden text-slate-800 group-hover:text-primary">
             <Logo className="h-full w-full p-1" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-800 leading-none group-hover:text-primary transition-colors">
              Kshetri
            </span>
            <span className="text-sm font-semibold text-text-muted tracking-widest">INDUSTRIES</span>
          </div>
        </div>
        
        {/* Centered Desktop Navigation - Floating Island Effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8 bg-background-light p-2 rounded-3xl shadow-clay-inset z-10">
          <button 
            onClick={() => handleNav('/')} 
            className={getButtonStyles('/')}
          >
            HOME
          </button>
          <button 
            onClick={() => handleNav('/products')} 
            className={getButtonStyles('/products')}
          >
            PRODUCTS
          </button>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden h-12 w-12 flex items-center justify-center rounded-2xl text-slate-600 shadow-clay-btn active:shadow-clay-inset transition-all z-20 bg-background-light"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-28 left-4 right-4 z-40 md:hidden">
          <div className="bg-background-light shadow-clay-lg rounded-3xl p-6 flex flex-col gap-4 animate-fade-in-down border border-white/50">
             <button 
               className={`text-center font-bold text-lg p-4 rounded-2xl transition-all ${location.pathname === '/' ? 'shadow-clay-inset text-primary' : 'shadow-clay-btn text-slate-600'}`} 
               onClick={() => handleNav('/')}
             >
               Home
             </button>
             <button 
               className={`text-center font-bold text-lg p-4 rounded-2xl transition-all ${location.pathname === '/products' ? 'shadow-clay-inset text-primary' : 'shadow-clay-btn text-slate-600'}`} 
               onClick={() => handleNav('/products')}
             >
               Products
             </button>
          </div>
        </div>
      )}
    </header>
  );
};