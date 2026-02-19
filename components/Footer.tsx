import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="px-6 md:px-12 lg:px-24 pb-12 pt-6">
      {/* Footer is styled as a "pressed in" tray */}
      <div className="bg-background-light shadow-clay-inset rounded-[3rem] p-12 md:p-16 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background-light shadow-clay-btn overflow-hidden text-slate-800">
                <Logo className="h-full w-full p-1" />
              </div>
              <span className="text-2xl font-black text-slate-800">Kshetri Industries</span>
            </div>
            <p className="text-base text-text-muted leading-relaxed max-w-sm font-medium">
              "FROM OUR SOIL TO GLOBAL SUCCESS."
            </p>
            <div className="text-xs text-text-muted font-bold tracking-wider uppercase">
              CIN: U11049MN2025PTC015268
            </div>
          </div>
          
          <div className="space-y-6 md:justify-self-end">
            <h4 className="font-bold text-lg text-slate-800">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-background-light shadow-clay-btn hover:shadow-clay-sm transition-shadow">
                <span className="material-symbols-outlined text-primary text-xl shrink-0">location_on</span>
                <span className="text-sm font-medium text-slate-600">
                  Uchekon, Imphal East, <br/>Manipur, India
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-background-light shadow-clay-btn hover:shadow-clay-sm transition-shadow">
                <span className="material-symbols-outlined text-primary text-xl shrink-0">mail</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-slate-600 break-all">Kshetriindustriespvtltd@gmail.com</span>
                  <span className="text-xs text-slate-500 break-all">tojokshtrimayum@gmail.com</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-background-light shadow-clay-btn hover:shadow-clay-sm transition-shadow">
                <span className="material-symbols-outlined text-primary text-xl shrink-0">phone</span>
                <span className="text-sm font-medium text-slate-600">+91 87318 68226</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-text-muted uppercase tracking-wider">
          <p>© 2025 Kshetri Industries Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-primary transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};