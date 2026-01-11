
import React, { useState } from 'react';
import { Screen, SystemCategory, Module } from '../types';
import { getDetailedLesson } from '../geminiService';
import { BookOpen, PlayCircle, Lock, ArrowLeft, X, Loader2, FileText, Download, Zap, Play, ExternalLink, Printer, Sparkles } from 'lucide-react';

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
      // Se não houver descrição longa, gera via IA
      const text = mod.desc.length > 100 ? mod.desc : await getDetailedLesson(mod.title);
      setContent(text);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Simula download abrindo a caixa de impressão do navegador (que permite salvar como PDF)
    window.print();
  };

  const categoryStyles = {
    MECANICA: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    ELETRICA: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    ELETRONICA: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-full pb-24 relative overflow-y-auto">
      {/* Visualizador de Conteúdo (Modal Fullscreen) */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-500 no-print">
          <header className="p-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${mode === 'VIDEO' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                {mode === 'VIDEO' ? <PlayCircle size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm truncate max-w-[180px]">{selected.title}</h3>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{selected.category} • {mode === 'VIDEO' ? 'Demonstração Prática' : 'Manual Técnico'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mode === 'PDF' && (
                <button 
                  onClick={handleDownload}
                  className="p-2.5 bg-slate-800 text-blue-400 rounded-xl hover:bg-slate-700 transition-colors"
                  title="Baixar Manual"
                >
                  <Printer size={18} />
                </button>
              )}
              <button onClick={() => {setSelected(null); setMode(null);}} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5">
            {mode === 'VIDEO' && selected.videoUrl ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={selected.videoUrl} 
                    title={selected.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" /> Resumo da Prática
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    {selected.desc.split('.')[0]}. Siga os passos demonstrados para garantir a correta aplicação técnica no veículo.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl min-h-full max-w-2xl mx-auto border border-slate-200">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={32} className="text-blue-500 animate-spin" />
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Gerando PDF Valtec...</p>
                  </div>
                ) : (
                  <article className="prose prose-sm text-slate-800 max-w-none">
                    <div className="border-b-2 border-slate-100 pb-6 mb-6">
                      <h1 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{selected.title}</h1>
                      <div className="flex gap-4">
                        <span className="text-[9px] font-black text-blue-600 uppercase">Oficina IA • Technical Guide</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap font-serif text-[14px] leading-relaxed text-slate-700">
                      {content}
                    </div>
                  </article>
                )}
              </div>
            )}
          </div>
          
          <div className="p-5 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 shrink-0">
            <button 
              onClick={() => setSelected(null)} 
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Concluir Aula
            </button>
          </div>
        </div>
      )}

      {/* Versão para Impressão (Invisível na UI normal) */}
      <div className="hidden print-only bg-white text-black p-10 font-serif">
        <h1 className="text-3xl font-bold mb-4 uppercase">{selected?.title}</h1>
        <p className="mb-8 text-xs text-slate-500 italic">Manual Técnico Gerado pela Oficina IA Valtec</p>
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
      </div>

      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Academia Valtec</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Treinamento Especializado IA</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-print">
        {['ALL', 'MECANICA', 'ELETRICA', 'ELETRONICA'].map(c => (
          <button 
            key={c} 
            onClick={() => setFilter(c as any)} 
            className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === c ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            {c === 'ALL' ? 'Tudo' : c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 no-print">
        {filtered.map(mod => {
          const isPractical = !!mod.videoUrl;
          return (
            <div key={mod.id} className="bg-slate-900/50 border border-slate-800/40 p-5 rounded-[2rem] group hover:border-slate-700 transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${categoryStyles[mod.category]}`}>
                    {mod.category}
                  </span>
                  {isPractical && (
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1">
                      <Sparkles size={8} /> Prático
                    </span>
                  )}
                </div>
                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{mod.level}</span>
              </div>
              
              <h4 className="font-bold text-white text-base mb-1 tracking-tight">{mod.title}</h4>
              <p className="text-[10px] text-slate-500 mb-5 leading-relaxed line-clamp-2 italic">"{mod.desc}"</p>
              
              <div className="grid grid-cols-2 gap-3">
                {isPractical ? (
                  <button 
                    onClick={() => openMod(mod, 'VIDEO')} 
                    className="col-span-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg shadow-red-600/10"
                  >
                    <Play size={12} fill="currentColor" /> Assistir Prática
                  </button>
                ) : (
                  <div className="col-span-1 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-center gap-2 text-[8px] text-slate-700 font-black uppercase">
                    <Play size={10} className="opacity-20" /> Vídeo Indisponível
                  </div>
                )}
                <button 
                  onClick={() => openMod(mod, 'PDF')} 
                  className="col-span-1 flex items-center justify-center gap-2 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all"
                >
                  <FileText size={12} /> Manual PDF
                </button>
              </div>

              {isPractical && <PlayCircle size={64} className="absolute -right-4 -bottom-4 text-white/[0.02] -rotate-12" />}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-slate-700 opacity-20 space-y-4">
          <BookOpen size={48} />
          <p className="text-[10px] font-black uppercase tracking-widest">Nenhum módulo encontrado</p>
        </div>
      )}
    </div>
  );
};

export default LearningScreen;
