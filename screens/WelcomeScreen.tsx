
import React, { useState } from 'react';
import { Screen } from '../types';
import { ChevronRight, Shield, Zap, Target, Sparkles, Wrench } from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const [imageError, setImageError] = useState(false);
  const hasCustomLogo = BRAND_CONFIG.logoImageUrl !== "" && !imageError;
  
  // Divide o nome para destacar o "Valtec"
  const nameParts = BRAND_CONFIG.name.split(' ');
  const mainName = nameParts.slice(0, 2).join(' '); // Oficina IA
  const brandName = nameParts.slice(2).join(' '); // Valtec

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Efeito de luz de fundo azulada para combinar com a logo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 relative z-10">
        {/* CONTAINER DA LOGO - Estilo arredondado suave */}
        <div className="relative group">
          {hasCustomLogo ? (
            <div className="animate-in zoom-in duration-700">
              <img 
                src={BRAND_CONFIG.logoImageUrl} 
                alt={BRAND_CONFIG.name} 
                className="w-40 h-40 object-contain rounded-[2.5rem] drop-shadow-[0_0_35px_rgba(37,99,235,0.4)] transition-transform duration-700 group-hover:scale-105 border-2 border-white/5"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] animate-in zoom-in duration-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)]"></div>
              <Wrench size={56} className="text-white -rotate-12 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-blue-400/10 blur-3xl rounded-full scale-150 -z-10 animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-oswald font-bold uppercase tracking-tighter leading-none">
              {mainName} <span className="text-blue-500">{brandName}</span>
            </h1>
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
              {BRAND_CONFIG.tagline}
            </p>
          </div>
          
          <div className="max-w-[280px] mx-auto">
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-y border-slate-800/50 py-3">
              "{BRAND_CONFIG.slogan}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-xs pt-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-blue-400 shadow-inner">
              <Zap size={18} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Prática</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-blue-400 shadow-inner">
              <Shield size={18} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Precisão</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-blue-400 shadow-inner">
              <Target size={18} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Foco</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-4 bg-slate-800/80 border-t border-slate-700 backdrop-blur-md relative z-10">
        <button 
          onClick={() => onNavigate('LOGIN')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 text-xs uppercase tracking-widest"
        >
          INICIAR JORNADA <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
