
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { ChevronRight, Zap, Target, Wrench, Smartphone, QrCode, X, Share, MoreVertical, PlusSquare, Download, Apple } from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const [imageError, setImageError] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  
  const hasCustomLogo = BRAND_CONFIG.logoImageUrl !== "" && !imageError;
  const appUrl = window.location.href;

  useEffect(() => {
    // Detecta se é iPhone/iPad
    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isApple);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

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

        {/* BOTAO DE INSTALAÇÃO EM DESTAQUE */}
        <button 
          onClick={handleNativeInstall}
          className="w-full max-w-xs py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-between group relative overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-2xl text-white backdrop-blur-md">
              <Smartphone size={22} />
            </div>
            <div className="text-left">
              <p className="text-[12px] font-black text-white uppercase tracking-widest leading-none">Baixar Aplicativo</p>
              <p className="text-[9px] text-blue-100 uppercase font-bold mt-1 opacity-70">Fixar ícone no celular</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/50 group-hover:translate-x-1 transition-transform" />
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 animate-pulse pointer-events-none"></div>
        </button>

        <div className="grid grid-cols-3 gap-6 w-full max-w-xs pt-4 opacity-40">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Zap size={18} />
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest">IA Real</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Download size={18} />
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest">Offline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Target size={18} />
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest">Prático</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-4 bg-slate-900 border-t border-slate-800 relative z-10">
        <button 
          onClick={() => onNavigate('LOGIN')}
          className="w-full py-4 text-slate-400 hover:text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] border border-slate-800"
        >
          JÁ TENHO ACESSO <ChevronRight size={16} />
        </button>
      </div>

      {/* MODAL DE INSTRUÇÕES DE INSTALAÇÃO */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative">
            <button onClick={() => setShowInstallModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 bg-slate-800 rounded-full">
              <X size={20} />
            </button>
            
            <div className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-600/20">
                  <Smartphone size={32} className="text-blue-500" />
                </div>
                <h3 className="text-2xl font-oswald text-white uppercase">Instalar Oficina IA</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-tight">Siga os passos para fixar o ícone</p>
              </div>

              {/* INSTRUÇÕES DINÂMICAS */}
              <div className="space-y-4 bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
                {isIOS ? (
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Apple size={16} /> Instruções para iPhone:
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white"><Share size={16} /></div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">1. Toque no botão de <b>Compartilhar</b> no rodapé do seu Safari.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white"><PlusSquare size={16} /></div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">2. Role para baixo e clique em <b>"Adicionar à Tela de Início"</b>.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Smartphone size={16} /> Instruções para Android:
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white"><MoreVertical size={16} /></div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">1. Toque nos <b>três pontinhos</b> no canto superior do Chrome.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white"><Download size={16} /></div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">2. Selecione <b>"Instalar Aplicativo"</b> ou "Adicionar à tela inicial".</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QR CODE PARA QUEM ESTÁ NO PC */}
              <div className="flex flex-col items-center space-y-4 pt-4 border-t border-slate-800">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Abrir no Celular agora:</p>
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}&bgcolor=ffffff&color=020617`} 
                    alt="QR Download"
                    className="w-32 h-32"
                  />
                </div>
              </div>

              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                ENTENDI, VAMOS LÁ!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
