
import React, { useState } from 'react';
import { Screen } from '../types';
import { BookOpen, HelpCircle, Trophy, PlayCircle, Lock, Star, ArrowLeft, ChevronRight } from 'lucide-react';

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
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate('DASHBOARD')} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-oswald text-white uppercase tracking-tight leading-none">Academia IA</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Evolução Técnica</p>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
        <button 
          onClick={() => setStudyMode('FORMAL')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            studyMode === 'FORMAL' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'
          }`}
        >
          TÉCNICO
        </button>
        <button 
          onClick={() => setStudyMode('INFORMAL')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            studyMode === 'INFORMAL' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'
          }`}
        >
          OFICINA
        </button>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-xl text-white">
          <PlayCircle size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm truncate">Retomar Estudos</h4>
          <p className="text-xs text-slate-500 truncate">Módulo: Injeção Eletrônica</p>
        </div>
        <div className="text-right">
          <p className="text-blue-400 font-bold text-xs">45%</p>
        </div>
      </div>

      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <div 
            key={idx} 
            className={`bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center justify-between transition-all ${!mod.unlocked ? 'opacity-50 grayscale' : 'hover:border-blue-500/30'}`}
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">{mod.title}</h4>
                {!mod.unlocked && <Lock size={12} className="text-slate-500" />}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[9px] text-slate-500 uppercase font-black">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  {mod.level}
                </div>
                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{mod.lessons} Aulas</div>
              </div>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden w-full max-w-[120px]">
                <div className="h-full bg-blue-500" style={{ width: `${mod.progress}%` }}></div>
              </div>
            </div>
            {mod.unlocked ? (
              <ChevronRight size={18} className="text-slate-600" />
            ) : (
              <div className="text-[8px] font-black bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded">BLOQUEADO</div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
        <HelpCircle size={24} />
        QUIZ DE DIAGNÓSTICO
      </button>
    </div>
  );
};

export default LearningScreen;
