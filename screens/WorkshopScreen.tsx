
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { getWorkshopTip } from '../geminiService';
import { Hammer, ArrowLeft, CheckCircle, Info, Layers, Zap, MessageCircle, Loader2 } from 'lucide-react';

interface WorkshopScreenProps {
  onNavigate: (screen: Screen) => void;
  onComplete: () => void;
  currentCode?: string;
}

const WorkshopScreen: React.FC<WorkshopScreenProps> = ({ onNavigate, onComplete, currentCode = 'P0301' }) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);

  const parts = [
    { id: 'ENGINE', name: 'Motor Principal', x: '50%', y: '50%', color: 'bg-slate-700' },
    { id: 'BATTERY', name: 'Bateria', x: '15%', y: '30%', color: 'bg-red-600' },
    { id: 'COIL', name: 'Bobina de Ignição', x: '45%', y: '40%', color: 'bg-blue-600' },
    { id: 'BRAKE', name: 'Sistema de Freio', x: '75%', y: '75%', color: 'bg-slate-600' },
  ];

  const handlePartClick = async (part: any) => {
    setSelectedPart(part.id);
    setLoadingTip(true);
    setShowTip(true);
    const tip = await getWorkshopTip(currentCode, part.name);
    setAiTip(tip);
    setLoadingTip(false);
  };

  const handleRepair = () => {
    setStep(1);
    setTimeout(() => {
      setStep(2);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 pb-16">
      <div className="p-6">
        <header className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('DASHBOARD')} 
              className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              title="Voltar ao Início"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-oswald text-white uppercase tracking-tight leading-none">Oficina Virtual</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Escaneando: <span className="text-red-400">{currentCode}</span></p>
            </div>
          </div>
          <button 
            onClick={() => setShowTip(!showTip)}
            className={`p-2 rounded-full border transition-all ${showTip ? 'bg-amber-500 text-white border-amber-400' : 'bg-amber-500/20 text-amber-500 border-amber-500/30'}`}
          >
            <Zap size={20} className={loadingTip ? 'animate-pulse' : ''} />
          </button>
        </header>
      </div>

      <div className="flex-1 relative overflow-hidden bg-slate-900 border-y border-slate-800 flex items-center justify-center">
        {showTip && (
          <div className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
            <div className="bg-amber-500 px-4 py-1 flex items-center gap-2">
              <Zap size={10} className="text-white fill-white" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">IA Master - Dica Técnica</span>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                {loadingTip ? <Loader2 size={20} className="text-amber-500 animate-spin" /> : <MessageCircle size={20} className="text-amber-500" />}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-800 leading-relaxed font-semibold italic">
                  "{aiTip || "Selecione um componente para análise."}"
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-sm aspect-square relative opacity-30">
          <svg viewBox="0 0 200 200" className="w-full h-full text-slate-700">
            <rect x="40" y="40" width="120" height="120" rx="10" fill="currentColor" />
            <circle cx="100" cy="100" r="40" fill="#1e293b" />
          </svg>
        </div>

        {parts.map((part) => (
          <button
            key={part.id}
            onClick={() => handlePartClick(part)}
            style={{ left: part.x, top: part.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-all ${
              selectedPart === part.id ? 'bg-blue-500 scale-125 ring-4 ring-blue-500/30' : 'bg-slate-800'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${selectedPart === part.id ? 'bg-white' : 'bg-blue-400'}`} />
          </button>
        ))}

        {step === 1 && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-50">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <p className="text-white font-black uppercase text-[10px] tracking-widest">Sincronizando Peças com IA...</p>
          </div>
        )}

        {step === 2 && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-4 z-50">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle size={40} className="text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-oswald text-white uppercase">Reparo Aprovado!</h3>
              <p className="text-slate-400 text-sm">O Mestre IA validou sua correção técnica.</p>
            </div>
            <button 
              onClick={onComplete}
              className="mt-6 w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              CONCLUIR SERVIÇO
            </button>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 min-h-[160px]">
        {selectedPart ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-bold text-lg leading-none">{parts.find(p => p.id === selectedPart)?.name}</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-2">Pronto para Inspeção</p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><Info size={20} /></div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-2 border border-slate-700 uppercase tracking-widest">
                Multímetro
              </button>
              {(selectedPart === 'COIL' || selectedPart === 'ENGINE') && (
                <button 
                  onClick={handleRepair}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all uppercase tracking-widest"
                >
                  <Hammer size={16} /> REPARAR
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-8 opacity-40">
            <Layers size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">Toque nos pontos para iniciar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopScreen;
