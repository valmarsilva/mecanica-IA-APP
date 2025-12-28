
import React, { useState } from 'react';
import { Screen, SystemCategory, Module } from '../types';
import { getDetailedLesson } from '../geminiService';
import { BookOpen, PlayCircle, Lock, ArrowLeft, X, Loader2, FileText, Download, Zap, Play } from 'lucide-react';

interface LearningScreenProps {
  onNavigate: (screen: Screen) => void;
  modules: Module[];
}

const LearningScreen: React.FC<LearningScreenProps> = ({ onNavigate, modules }) => {
  const [selected, setSelected] = useState<Module | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<SystemCategory | 'ALL'>('ALL');
  const [mode, setMode] = useState<'VIDEO' | 'PDF' | null>(null);

  const filtered = filter === 'ALL' ? modules : modules.filter(m => m.category === filter);

  const openMod = async (mod: Module, viewMode: 'VIDEO' | 'PDF') => {
    setSelected(mod);
    setMode(viewMode);
    if (viewMode === 'PDF') {
      setLoading(true);
      const text = mod.desc.length > 50 ? mod.desc : await getDetailedLesson(mod.title);
      setContent(text);
      setLoading(false);
    }
  };

  const categoryStyles = {
    MECANICA: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    ELETRICA: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    ELETRONICA: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-full pb-24">
      {selected && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-500">
          <header className="p-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {mode === 'VIDEO' ? <PlayCircle className="text-red-500" /> : <FileText className="text-blue-500" />}
              <div>
                <h3 className="text-white font-bold text-sm truncate max-w-[200px]">{selected.title}</h3>
                <p className="text-[9px] text-slate-500 uppercase font-black">{selected.category} • {mode}</p>
              </div>
            </div>
            <button onClick={() => {setSelected(null); setMode(null);}} className="p-2 bg-slate-800 text-slate-400 rounded-full"><X size={20} /></button>
          </header>
          <div className="flex-1 overflow-y-auto p-5">
            {mode === 'VIDEO' && selected.videoUrl ? (
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <iframe width="100%" height="100%" src={selected.videoUrl} frameBorder="0" allowFullScreen></iframe>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl shadow-2xl min-h-[400px]">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4"><Loader2 size={32} className="text-blue-500 animate-spin" /><p className="text-[10px] text-slate-500 font-black uppercase">Gerando Manual Técnico...</p></div>
                ) : (
                  <div className="prose prose-sm text-slate-800 whitespace-pre-wrap font-serif text-[13px] leading-relaxed">{content}</div>
                )}
              </div>
            )}
          </div>
          <div className="p-5 bg-slate-900 border-t border-slate-800"><button onClick={() => setSelected(null)} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-widest">Concluir Aula</button></div>
        </div>
      )}

      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Academia Valtec</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Conteúdo Técnico Multimodal</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', 'MECANICA', 'ELETRICA', 'ELETRONICA'].map(c => (
          <button key={c} onClick={() => setFilter(c as any)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === c ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{c === 'ALL' ? 'Tudo' : c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(mod => (
          <div key={mod.id} className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${categoryStyles[mod.category]}`}>{mod.category}</span>
              <span className="text-[8px] text-slate-600 font-bold uppercase">{mod.level}</span>
            </div>
            <h4 className="font-bold text-white text-base mb-1">{mod.title}</h4>
            <p className="text-[10px] text-slate-500 mb-5 leading-relaxed line-clamp-2">{mod.desc}</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => openMod(mod, 'VIDEO')} disabled={!mod.videoUrl} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${mod.videoUrl ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-900 text-slate-700 opacity-50'}`}><Play size={12} fill="currentColor" /> Vídeo Aula</button>
              <button onClick={() => openMod(mod, 'PDF')} className="flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest"><FileText size={12} /> Guia PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningScreen;
