
import React, { useState } from 'react';
import { Screen } from '../types';
import { ChevronRight, Shield, Zap, Target, Wrench, Smartphone, QrCode, X, Share, MoreVertical, PlusSquare } from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const [imageError, setImageError] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  
  const hasCustomLogo = BRAND_CONFIG.logoImageUrl !== "" && !imageError;
  const appUrl = window.location.href;

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 relative z-10">
        {/* LOGO CONTAINER */}
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
              Oficina <span className="text-blue-500">IA Valtec</span>
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
          <div className="flex flex-col items-center gap-2 text-blue-500 animate-bounce">
            <button onClick={() => setShowInstallModal(true)} className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500 flex items-center justify-center shadow-lg">
              <Smartphone size={18} />
            </button>
            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Baixar App</span>
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

      {/* MODAL DE INSTALAÇÃO (DOWNLOAD APP) */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative">
            <button onClick={() => setShowInstallModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-oswald text-white uppercase">Baixar Oficina IA</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Fixe o ícone na sua tela inicial</p>
              </div>

              {/* QR CODE DE INSTALAÇÃO */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-3xl shadow-xl relative group">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}&bgcolor=ffffff&color=020617`} 
                    alt="QR Download"
                    className="w-44 h-44 rounded-xl"
                  />
                  <div className="absolute inset-0 border-4 border-blue-600/20 rounded-3xl pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/50 qr-scan-line shadow-[0_0_15px_#3b82f6]"></div>
                </div>
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest text-center">Escaneie com a câmera do celular</p>
              </div>

              <div className="space-y-4 bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PlusSquare size={14} className="text-blue-500" /> Como instalar após abrir:
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><Share size={14} /></div>
                    <p className="text-[10px] text-slate-300 leading-relaxed"><b>iPhone (iOS):</b> Toque no ícone de <b>Compartilhar</b> e selecione <b>"Adicionar à Tela de Início"</b>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><MoreVertical size={14} /></div>
                    <p className="text-[10px] text-slate-300 leading-relaxed"><b>Android:</b> Toque nos <b>três pontinhos</b> e selecione <b>"Instalar Aplicativo"</b>.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20"
              >
                Entendi, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
