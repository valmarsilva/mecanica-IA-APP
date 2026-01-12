
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { ChevronRight, Zap, Target, Wrench, Smartphone, QrCode, X, Share, MoreVertical, PlusSquare, Download, Apple, Copy, Check } from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const [imageError, setImageError] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const hasCustomLogo = BRAND_CONFIG.logoImageUrl !== "" && !imageError;
  
  // URL Limpa para o QR Code
  const getAppUrl = () => {
    const url = new URL(window.location.href);
    return url.origin + url.pathname;
  };

  useEffect(() => {
    // Detecção de iOS
    const apple = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(apple);

    // Evento de instalação nativa (Android/Chrome)
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('Prompt de instalação capturado');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Se não houver prompt nativo (iOS ou já instalado), mostra o modal de ajuda
      setShowInstallModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getAppUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
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
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] animate-in zoom-in duration-700">
              <Wrench size={56} className="text-white" />
            </div>
          )}
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
        </div>

        {/* BOTAO DE INSTALAÇÃO PRINCIPAL */}
        <button 
          onClick={handleNativeInstall}
          className="w-full max-w-xs py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-between group relative overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-2xl text-white">
              <Smartphone size={22} />
            </div>
            <div className="text-left">
              <p className="text-[12px] font-black text-white uppercase tracking-widest leading-none">Fixar na Tela de Início</p>
              <p className="text-[9px] text-blue-100 uppercase font-bold mt-1 opacity-70">Usar como Aplicativo</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/50" />
        </button>

        <div className="flex flex-col items-center gap-4 opacity-50">
           <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Plataforma Certificada PWA</p>
           <div className="flex gap-4">
              <Zap size={16} />
              <Target size={16} />
              <Smartphone size={16} />
           </div>
        </div>
      </div>

      <div className="p-8 space-y-4 bg-slate-900 border-t border-slate-800 relative z-10">
        <button 
          onClick={() => onNavigate('LOGIN')}
          className="w-full py-4 text-slate-400 hover:text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] border border-slate-800"
        >
          ACESSAR CONTA <ChevronRight size={16} />
        </button>
      </div>

      {/* MODAL DE QR CODE E INSTALAÇÃO */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative">
            <button onClick={() => setShowInstallModal(false)} className="absolute top-6 right-6 text-slate-400 p-2">
              <X size={24} />
            </button>
            
            <div className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-oswald text-white uppercase">Instalar no Celular</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-tight">Escaneie o código ou use o link abaixo</p>
              </div>

              {/* QR CODE - USANDO API DO GOQR.ME (MUITO ESTÁVEL) */}
              <div className="flex flex-col items-center space-y-6">
                <div className="p-5 bg-white rounded-[2.5rem] shadow-2xl relative">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getAppUrl())}&margin=10&bgcolor=ffffff&color=020617`} 
                    alt="QR Link"
                    className="w-44 h-44"
                    onError={(e) => {
                      // Fallback se a API falhar
                      (e.target as HTMLImageElement).src = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(getAppUrl())}`;
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 qr-scan-line shadow-[0_0_15px_#3b82f6]"></div>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex-1 truncate font-mono">{getAppUrl()}</span>
                    <button onClick={copyToClipboard} className="p-2 bg-blue-600 text-white rounded-lg">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* INSTRUÇÕES DINÂMICAS */}
              <div className="space-y-4 bg-slate-950/50 p-5 rounded-3xl border border-slate-800">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                   Passo a Passo:
                </h4>
                <div className="flex items-start gap-4">
                   <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                     {isIOS ? <Share size={18} /> : <MoreVertical size={18} />}
                   </div>
                   <p className="text-[11px] text-slate-300 leading-relaxed">
                     {isIOS ? (
                       <>No Safari, clique em <b>Compartilhar</b> e depois em <b>"Adicionar à Tela de Início"</b>.</>
                     ) : (
                       <>No Chrome, clique nos <b>3 pontos</b> e selecione <b>"Instalar Aplicativo"</b>.</>
                     )}
                   </p>
                </div>
              </div>

              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest"
              >
                ENTENDI!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
