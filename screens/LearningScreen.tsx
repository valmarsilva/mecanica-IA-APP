
import React, { useState } from 'react';
import { Screen, SystemCategory, Module } from '../types';
import { getDetailedLesson } from '../geminiService';
import { BookOpen, PlayCircle, Lock, ArrowLeft, X, Loader2, FileText, Download, Zap, Play, Youtube, ExternalLink } from 'lucide-react';

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
      // Se a descrição for curta, gera uma longa via IA
      const text = mod.desc.length > 300 ? mod.desc : await getDetailedLesson(mod.title);
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
          <header className="p-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-xl">
            <div className="flex items-center gap-3">
              {mode === 'VIDEO' ? <Youtube className="text-red-500" /> : <FileText className="text-blue-500" />}
              <div>
                <h3 className="text-white font-bold text-sm truncate max-w-[200px]">{selected.title}</h3>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{selected.category} • {mode}</p>
              </div>
            </div>
            <button onClick={() => {setSelected(null); setMode(null);}} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:text-white transition-colors"><X size={20} /></button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-5">
            {mode === 'VIDEO' && selected.videoUrl ? (
              <div className="space-y-6">
                <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selected.videoUrl.includes('youtube.com/watch?v=') ? selected.videoUrl.replace('watch?v=', 'embed/') : selected.videoUrl} 
                    frameBorder="0" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-amber-500" size={20} />
                    <h4 className="text-white font-bold uppercase text-xs tracking-widest">Recomendação Técnica</h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed italic">
                    Vídeo indicado pela IA Master Mechanic (GPT 5.2). Referência: Revista O Mecânico / Doutor IE.
                  </p>
                  <a 
                    href={selected.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-600/20"
                  >
                    Assistir no Youtube <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-[2.5rem] shadow-2xl min-h-[400px] border border-slate-200">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4 text-slate-900">
                    <Loader2 size={40} className="text-blue-600 animate-spin" />
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Gerando Manual GPT 5.2...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm text-slate-800 whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
                    <div className="flex flex-col items-center mb-8 border-b border-slate-200 pb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                        <FileText size={24} className="text-white" />
                      </div>
                      <h2 className="text-xl font-oswald text-slate-900 uppercase text-center">{selected.title}</h2>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Biblioteca Técnica Valtec IA</p>
                    </div>
                    <div className="prose-headings:text-slate-900 prose-headings:font-oswald prose-headings:uppercase">
                      {content}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="p-5 bg-slate-900 border-t border-slate-800">
            <button onClick={() => setSelected(null)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Concluir Módulo</button>
          </div>
        </div>
      )}

      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Academia Valtec</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Motor GPT 5.2 • Conteúdo Multimodal</p>
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
              <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{mod.level}</span>
            </div>
            <h4 className="font-bold text-white text-base mb-1 group-hover:text-blue-400 transition-colors">{mod.title}</h4>
            <p className="text-[10px] text-slate-500 mb-5 leading-relaxed line-clamp-2">{mod.desc}</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => openMod(mod, 'VIDEO')} 
                disabled={!mod.videoUrl} 
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${mod.videoUrl ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-slate-900 text-slate-700 opacity-50'}`}
              >
                <Youtube size={14} /> Vídeo Aula
              </button>
              <button 
                onClick={() => openMod(mod, 'PDF')} 
                className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
              >
                <FileText size={14} /> Guia Técnico
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-700 opacity-20">
            <BookOpen size={48} />
            <p className="text-[10px] font-black uppercase mt-4 tracking-widest">Nenhuma aula disponível</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningScreen;
