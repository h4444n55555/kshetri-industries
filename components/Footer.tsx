import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-6">
      {/* Full-width footer with subtle background difference */}
      <div className="bg-slate-50 border-t border-slate-200/60">
        <div className="px-8 md:px-16 lg:px-24 py-12 md:py-16 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm overflow-hidden text-slate-800">
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
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/company/kshetri-industries/"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0A66C2] hover:shadow-md transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              </div>
            </div>

            <div className="space-y-6 md:justify-self-end">
              <h4 className="font-bold text-lg text-slate-800">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">location_on</span>
                  <span className="text-sm font-medium text-slate-600">
                    Uchekon, Imphal East, <br />Manipur, India
                  </span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">mail</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-slate-600 break-all">Kshetriindustriespvtltd@gmail.com</span>
                    <span className="text-xs text-slate-500 break-all">tojokshtrimayum@gmail.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">phone</span>
                  <span className="text-sm font-medium text-slate-600">+91 87318 68226</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manufacturing Details */}
          <div className="mt-10 pt-8 border-t border-slate-200/60">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Manufactured & Sold By</h5>
                <p className="font-bold text-slate-700 text-xs">Kshetri Industries Pvt. Ltd.</p>
              </div>
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Factory Address</h5>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">Kongba Bazar, nr. Bank of Baroda, Imphal East, Manipur — 795005</p>
              </div>
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">FSSAI Lic. No.</h5>
                <p className="text-xs text-slate-700 font-mono font-medium">21624002000327</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-text-muted uppercase tracking-wider">
            <p>© 2025 Kshetri Industries Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="cursor-pointer hover:text-primary transition-colors">Privacy</span>
              <span className="cursor-pointer hover:text-primary transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};