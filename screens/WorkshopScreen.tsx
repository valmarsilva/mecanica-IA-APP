
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
    
    // Consultar o "Pai" (IA/API) para uma dica contextual
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
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-6">
        <button onClick={() => onNavigate('EXPLANATION')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <header className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Oficina Virtual</h2>
            <p className="text-slate-400 text-sm">Escaneando falha: <span className="text-red-400 font-bold">{currentCode}</span></p>
          </div>
          <button 
            onClick={() => setShowTip(!showTip)}
            className={`p-2 rounded-full border transition-all ${showTip ? 'bg-amber-500 text-white border-amber-400' : 'bg-amber-500/20 text-amber-500 border-amber-500/30'}`}
          >
            <Zap size={20} className={loadingTip ? 'animate-pulse' : ''} />
          </button>
        </header>
      </div>

      {/* Simulator View */}
      <div className="flex-1 relative overflow-hidden bg-slate-900 border-y border-slate-800 flex items-center justify-center">
        {showTip && (
          <div className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
            <div className="bg-amber-500 px-4 py-1 flex items-center gap-2">
              <Zap size={12} className="text-white fill-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Mestre IA em Tempo Real</span>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                {loadingTip ? <Loader2 size={20} className="text-amber-500 animate-spin" /> : <MessageCircle size={20} className="text-amber-500" />}
              </div>
              <div className="flex-1">
                {loadingTip ? (
                  <div className="space-y-2 py-1">
                    <div className="h-2 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    "{aiTip || "Selecione uma peça para receber orientação técnica."}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-sm aspect-square relative opacity-30">
          <svg viewBox="0 0 200 200" className="w-full h-full text-slate-700">
            <rect x="40" y="40" width="120" height="120" rx="10" fill="currentColor" />
            <circle cx="100" cy="100" r="40" fill="#1e293b" />
            <path d="M60 60 L140 140 M140 60 L60 140" stroke="#334155" strokeWidth="2" />
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
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-bold animate-pulse">REPARANDO COM IA...</p>
          </div>
        )}

        {step === 2 && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-4 z-50">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle size={40} className="text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-oswald text-white uppercase">Conserto Validado!</h3>
              <p className="text-slate-400">O Mestre IA confirmou que o erro {currentCode} foi solucionado.</p>
            </div>
            <button 
              onClick={onComplete}
              className="mt-6 w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              FINALIZAR DIAGNÓSTICO
            </button>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 min-h-[180px]">
        {selectedPart ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-bold text-lg">{parts.find(p => p.id === selectedPart)?.name}</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Status: Inspeção Disponível</p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Info size={20} className="text-blue-500" />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-700 transition-colors">
                <GaugeIcon size={16} className="text-blue-400" />
                USAR MULTÍMETRO
              </button>
              {(selectedPart === 'COIL' || selectedPart === 'ENGINE') && (
                <button 
                  onClick={handleRepair}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <Hammer size={16} />
                  REPARAR
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-8">
            <Layers size={32} className="opacity-20" />
            <p className="text-sm font-medium">Toque nos pontos para iniciar a inspeção do "Mestre"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GaugeIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </svg>
);

export default WorkshopScreen;
