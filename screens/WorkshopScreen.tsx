
import React, { useState, useEffect } from 'react';
import { Screen, SystemCategory } from '../types';
import { getWorkshopTip, getDetailedLesson } from '../geminiService';
import { Hammer, ArrowLeft, CheckCircle, Info, Layers, Zap, MessageCircle, Loader2, BookOpen, X, Cpu, Battery, Settings, Wrench } from 'lucide-react';

interface WorkshopScreenProps {
  onNavigate: (screen: Screen) => void;
  onComplete: () => void;
  currentCode?: string;
}

interface Part {
  id: string;
  name: string;
  category: SystemCategory;
  x: string;
  y: string;
  icon: any;
}

const WorkshopScreen: React.FC<WorkshopScreenProps> = ({ onNavigate, onComplete, currentCode = 'P0301' }) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [activeSystem, setActiveSystem] = useState<SystemCategory>('MECANICA');
  const [step, setStep] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);
  
  const [showLesson, setShowLesson] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [loadingLesson, setLoadingLesson] = useState(false);

  const allParts: Part[] = [
    // MECÂNICA
    { id: 'ENGINE', name: 'Motor de Combustão', category: 'MECANICA', x: '50%', y: '45%', icon: Wrench },
    { id: 'TURBO', name: 'Turbocompressor', category: 'MECANICA', x: '70%', y: '35%', icon: Settings },
    { id: 'BRAKE', name: 'Servo Freio', category: 'MECANICA', x: '25%', y: '65%', icon: Layers },
    // ELÉTRICA
    { id: 'BATTERY', name: 'Bateria 12V / AGM', category: 'ELETRICA', x: '15%', y: '30%', icon: Battery },
    { id: 'ALTERNATOR', name: 'Alternador Pilotado', category: 'ELETRICA', x: '35%', y: '25%', icon: Zap },
    { id: 'STARTER', name: 'Motor de Partida', category: 'ELETRICA', x: '45%', y: '60%', icon: Zap },
    // ELETRÔNICA
    { id: 'ECU', name: 'Módulo de Injeção (ECU)', category: 'ELETRONICA', x: '80%', y: '25%', icon: Cpu },
    { id: 'MAFSENSOR', name: 'Sensor de Fluxo (MAF)', category: 'ELETRONICA', x: '60%', y: '20%', icon: Cpu },
    { id: 'ABS', name: 'Módulo ABS/ESP', category: 'ELETRONICA', x: '20%', y: '55%', icon: Cpu },
  ];

  const filteredParts = allParts.filter(p => p.category === activeSystem);

  const handlePartClick = async (part: Part) => {
    setSelectedPart(part.id);
    setLoadingTip(true);
    setShowTip(true);
    const tip = await getWorkshopTip(currentCode, part.name);
    setAiTip(tip);
    setLoadingTip(false);
  };

  const handleOpenLesson = async () => {
    const partName = allParts.find(p => p.id === selectedPart)?.name;
    if (!partName) return;
    
    setLoadingLesson(true);
    setShowLesson(true);
    const lesson = await getDetailedLesson(`Componente Automotivo: ${partName}`);
    setLessonContent(lesson);
    setLoadingLesson(false);
  };

  const handleRepair = () => {
    setStep(1);
    setTimeout(() => {
      setStep(2);
    }, 2000);
  };

  const systemStyles = {
    MECANICA: 'text-blue-500 border-blue-500 shadow-blue-500/20',
    ELETRICA: 'text-amber-500 border-amber-500 shadow-amber-500/20',
    ELETRONICA: 'text-purple-500 border-purple-500 shadow-purple-500/20',
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 pb-16 relative overflow-hidden">
      <div className="p-6">
        <header className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('DASHBOARD')} 
              className="p-2 bg-slate-800 rounded-full text-slate-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-oswald text-white uppercase tracking-tight leading-none">Oficina Valtec</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Status: <span className="text-emerald-500">Módulo Ativo</span></p>
            </div>
          </div>
          <button 
            onClick={() => setShowTip(!showTip)}
            className={`p-2 rounded-full border transition-all ${showTip ? 'bg-amber-500 text-white' : 'bg-slate-800 text-amber-500 border-amber-500/30'}`}
          >
            <Zap size={20} className={loadingTip ? 'animate-pulse' : ''} />
          </button>
        </header>

        {/* Seleção de Sistema */}
        <div className="flex gap-2 mt-6 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
          {(['MECANICA', 'ELETRICA', 'ELETRONICA'] as SystemCategory[]).map(sys => (
            <button
              key={sys}
              onClick={() => {setActiveSystem(sys); setSelectedPart(null);}}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeSystem === sys ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 opacity-50'
              }`}
            >
              {sys}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative bg-slate-900 border-y border-slate-800 flex items-center justify-center overflow-hidden">
        {showTip && (
          <div className="absolute top-4 left-4 right-4 bg-white rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-amber-500 px-4 py-1.5 flex items-center gap-2">
              <Zap size={10} className="text-white fill-white" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest tracking-widest">Master Mechanic AI</span>
            </div>
            <div className="p-4 flex gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                {loadingTip ? <Loader2 size={20} className="text-amber-500 animate-spin" /> : <MessageCircle size={20} className="text-amber-500" />}
              </div>
              <p className="text-xs text-slate-800 font-semibold italic leading-relaxed">"{aiTip || "Analise o componente selecionado para receber o roteiro de diagnóstico."}"</p>
            </div>
          </div>
        )}

        {/* Modal de Aula */}
        {showLesson && (
          <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-500" size={20} />
                <h3 className="text-white font-bold uppercase text-xs tracking-widest">Ficha Técnica do Componente</h3>
              </div>
              <button onClick={() => setShowLesson(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loadingLesson ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={40} className="text-blue-500 animate-spin" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Consultando Banco de Dados Valtec...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {lessonContent}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visualização do Motor/Carro (Placeholder) */}
        <div className="w-full h-full relative opacity-10 flex items-center justify-center">
           <Wrench size={300} strokeWidth={0.5} className="text-white" />
        </div>

        {/* Pinos de Interação Dinâmicos */}
        {filteredParts.map((part) => (
          <button
            key={part.id}
            onClick={() => handlePartClick(part)}
            style={{ left: part.x, top: part.y }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xl transition-all duration-300 ${
              selectedPart === part.id 
                ? `bg-slate-800 scale-125 ring-4 ring-offset-4 ring-offset-slate-900 ${systemStyles[activeSystem]}` 
                : 'bg-slate-900 border-slate-700 text-slate-600 opacity-60'
            }`}
          >
            <part.icon size={18} />
          </button>
        ))}

        {step === 1 && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-50">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <p className="text-white font-black uppercase text-[10px] tracking-widest">Processando Calibração...</p>
          </div>
        )}

        {step === 2 && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6 z-50">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-in zoom-in">
              <CheckCircle size={48} className="text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-oswald text-white uppercase tracking-tight">Sistema Restaurado</h3>
              <p className="text-slate-400 text-sm">O procedimento técnico foi concluído com sucesso.</p>
            </div>
            <button 
              onClick={onComplete}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Confirmar Entrega do Veículo
            </button>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-950 min-h-[160px] border-t border-slate-800">
        {selectedPart ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <div className={`w-2 h-2 rounded-full ${activeSystem === 'MECANICA' ? 'bg-blue-500' : activeSystem === 'ELETRICA' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{activeSystem}</span>
                </div>
                <h4 className="text-white font-bold text-lg leading-none">{allParts.find(p => p.id === selectedPart)?.name}</h4>
              </div>
              <button 
                onClick={handleOpenLesson}
                className="bg-blue-500/10 p-3 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
              >
                <BookOpen size={20} />
                <span className="text-[9px] font-black uppercase">Ver Dados</span>
              </button>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-slate-900 text-slate-400 font-bold rounded-xl text-[10px] border border-slate-800 uppercase tracking-widest">
                Testar Valor
              </button>
              <button 
                onClick={handleRepair}
                className="flex-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl text-[10px] shadow-xl shadow-blue-600/20 active:scale-95 transition-all uppercase tracking-widest"
              >
                Executar Reparo
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-3 py-6 opacity-30">
            <Settings size={32} className="animate-spin-slow" />
            <p className="text-[10px] font-black uppercase tracking-widest text-center">Selecione um sistema acima e<br/>toque em um componente no painel</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopScreen;
