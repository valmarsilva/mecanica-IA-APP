
import React, { useState } from 'react';
import { Screen } from '../types';
import { Smartphone, ChevronRight, X, Copy, Check, Wrench } from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.href.split('?')[0].split('#')[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 relative z-10">
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl animate-in zoom-in duration-700">
           <Wrench size={40} className="text-white" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-oswald font-bold uppercase tracking-tighter">
            OFICINA <span className="text-blue-500">IA</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Controle Total via OBD2
          </p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={() => setShowQR(true)}
            className="w-full py-5 bg-blue-600 rounded-2xl flex items-center justify-center gap-4 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Smartphone size={24} />
            <span className="text-[11px] font-black uppercase tracking-widest">Abrir no Celular</span>
          </button>

          <button 
            onClick={() => onNavigate('LOGIN')}
            className="w-full py-4 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest border border-slate-800 rounded-2xl"
          >
            Acessar no PC
          </button>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] border border-slate-800 p-8 space-y-8 relative shadow-2xl">
            <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 text-slate-500 p-2"><X size={24} /></button>
            
            <div className="text-center">
              <h3 className="text-2xl font-oswald text-white uppercase mb-1">Fixar no Celular</h3>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Escaneie o código abaixo</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="p-4 bg-white rounded-[2rem] shadow-2xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(appUrl)}&bgcolor=ffffff&color=020617&margin=10`} 
                  alt="QR Code Valtec"
                  className="w-48 h-48"
                />
              </div>

              <div className="w-full flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-hidden">
                <span className="text-[9px] text-slate-600 flex-1 truncate font-mono">{appUrl}</span>
                <button onClick={handleCopy} className="text-blue-500">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-[9px] text-slate-500 uppercase font-bold leading-relaxed px-4">
                No celular, toque em "Compartilhar" e depois em "Adicionar à Tela de Início"
              </p>
              <button 
                onClick={() => setShowQR(false)}
                className="w-full py-4 bg-slate-800 text-white font-black rounded-xl text-[10px] uppercase tracking-widest"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
