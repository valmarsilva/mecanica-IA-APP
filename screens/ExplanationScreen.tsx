
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { getMechanicalExplanation } from '../geminiService';
import { ArrowLeft, Brain, Hammer, AlertTriangle, PenTool as Tool, Loader2, Gauge, ShieldAlert } from 'lucide-react';

interface ExplanationScreenProps {
  code: string;
  onNavigate: (screen: Screen) => void;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ code, onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getMechanicalExplanation(code);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [code]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium text-center">Consultando manuais técnicos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col space-y-6 overflow-y-auto pb-24 bg-slate-900">
      <button onClick={() => onNavigate('DIAGNOSIS')} className="text-slate-400 hover:text-white flex items-center gap-2 w-fit">
        <ArrowLeft size={20} />
        <span className="text-xs font-bold uppercase">Voltar</span>
      </button>

      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
        <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-500 font-bold leading-tight uppercase tracking-tight">
          Análise Primária: O conteúdo abaixo é uma sugestão técnica da IA. A verificação física é indispensável.
        </p>
      </div>

      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600/20 p-2 rounded-lg">
            <Brain className="text-blue-500" size={24} />
          </div>
          <h2 className="text-2xl font-oswald text-white uppercase">{code}</h2>
        </div>
        
        <div className="prose prose-invert prose-sm max-w-none mb-6 text-slate-300 whitespace-pre-wrap font-medium">
          {data?.explanation}
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-4 border border-blue-500/20 mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <Gauge size={18} className="text-blue-400" />
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Guia de Teste Direto</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[8px] text-slate-500 uppercase font-black">Instrumento</span>
              <p className="text-xs text-white font-bold">{data?.technicalSpecs?.tool || 'Multímetro'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] text-slate-500 uppercase font-black">Referência</span>
              <p className="text-xs text-emerald-400 font-bold">{data?.technicalSpecs?.referenceValue || 'N/A'}</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic bg-slate-800/30 p-3 rounded-xl border border-slate-700">
            "Para confirmar: {data?.technicalSpecs?.procedure}"
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Causas Prováveis</h4>
          {(data?.causes || []).map((cause: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white font-bold">{cause.part}</span>
                <span className="text-blue-400 font-black">{cause.probability}%</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" 
                  style={{ width: `${cause.probability}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onNavigate('WORKSHOP')}
        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all uppercase text-xs tracking-widest"
      >
        <Hammer size={20} />
        Testar na Oficina
      </button>
    </div>
  );
};

export default ExplanationScreen;
