
import React, { useState } from 'react';
import { Screen } from '../types';
import { BookOpen, HelpCircle, Trophy, PlayCircle, Lock, Star } from 'lucide-react';

interface LearningScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LearningScreen: React.FC<LearningScreenProps> = ({ onNavigate }) => {
  const [studyMode, setStudyMode] = useState<'FORMAL' | 'INFORMAL'>('FORMAL');

  const modules = [
    { title: 'Fundamentos de Ignição', progress: 100, lessons: 12, level: 'Básico', unlocked: true },
    { title: 'Sistemas de Injeção Eletrônica', progress: 45, lessons: 24, level: 'Intermediário', unlocked: true },
    { title: 'Rede CAN e Sensores', progress: 0, lessons: 18, level: 'Avançado', unlocked: false },
    { title: 'Transmissão Automática', progress: 0, lessons: 32, level: 'Expert', unlocked: false },
  ];

  return (
    <div className="p-6 space-y-6">
      <header>
        <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Academia Mecânica</h2>
        <p className="text-slate-400 text-sm">Aprenda da forma que preferir.</p>
      </header>

      {/* Mode Selector */}
      <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
        <button 
          onClick={() => setStudyMode('FORMAL')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            studyMode === 'FORMAL' ? 'bg-blue-600 text-white' : 'text-slate-500'
          }`}
        >
          MODO TÉCNICO
        </button>
        <button 
          onClick={() => setStudyMode('INFORMAL')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            studyMode === 'INFORMAL' ? 'bg-blue-600 text-white' : 'text-slate-500'
          }`}
        >
          MODO OFICINA
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
        <div className="bg-blue-500/20 p-3 rounded-xl">
          <BookOpen className="text-blue-500" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">Continuar de onde parou</h4>
          <p className="text-xs text-slate-500">Módulo: Injeção Eletrônica - Aula 4</p>
        </div>
        <button className="ml-auto p-2 bg-blue-600 rounded-lg text-white">
          <PlayCircle size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seus Módulos</h3>
          <button className="text-xs text-blue-400 font-bold">Ver Todos</button>
        </div>

        {modules.map((mod, idx) => (
          <div 
            key={idx} 
            className={`bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center justify-between ${!mod.unlocked ? 'opacity-60 grayscale' : ''}`}
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white">{mod.title}</h4>
                {!mod.unlocked && <Lock size={14} className="text-slate-500" />}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  {mod.level}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">{mod.lessons} Aulas</div>
              </div>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden w-full max-w-[140px]">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${mod.progress}%` }}
                ></div>
              </div>
            </div>
            {mod.unlocked ? (
              <button className="p-3 bg-slate-700 text-slate-400 rounded-xl hover:text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            ) : (
              <div className="text-xs font-bold text-slate-600">LVL 5</div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
        <HelpCircle size={24} />
        DESAFIO DIÁRIO (QUIZ)
      </button>
    </div>
  );
};

// Fix: Made className optional to prevent TS error when calling without className
const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default LearningScreen;
