
import React from 'react';
import { Screen } from '../types';
import { ChevronRight, Wrench, ShieldCheck, Activity } from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 text-white overflow-hidden relative">
      {/* Efeito de iluminação de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 relative z-10">
        {/* Logo Icon */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 animate-in zoom-in duration-700">
            <Wrench size={48} className="text-white drop-shadow-lg" />
          </div>
        </div>
        
        {/* Branding */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-oswald font-bold uppercase tracking-tighter leading-none">
              OFICINA <span className="text-blue-500">IA</span>
            </h1>
            <p className="text-blue-500 font-oswald text-xl uppercase tracking-widest font-medium">Valtec</p>
          </div>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <div className="h-px w-8 bg-slate-700"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
              {BRAND_CONFIG.tagline}
            </p>
            <div className="h-px w-8 bg-slate-700"></div>
          </div>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={() => onNavigate('LOGIN')}
            className="group w-full py-5 bg-blue-600 rounded-2xl flex items-center justify-between px-8 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
          >
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-widest text-white">Acessar App</p>
              <p className="text-[9px] text-blue-200 font-bold uppercase opacity-70">Painel de Diagnóstico</p>
            </div>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-blue-500" />
              <span className="text-[8px] font-black text-slate-500 uppercase">Seguro</span>
            </div>
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col items-center gap-1">
              <Activity size={16} className="text-emerald-500" />
              <span className="text-[8px] font-black text-slate-500 uppercase">Real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-8 text-center">
        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          v4.0.0 Pro • Sistema de Inteligência Automotiva
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
