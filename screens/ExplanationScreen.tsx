
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { getMechanicalExplanation } from '../geminiService';
import { ArrowLeft, Brain, Hammer, AlertTriangle, PenTool as Tool, Loader2, Gauge } from 'lucide-react';

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
        <p className="text-slate-400 font-medium text-center">IA Mestre consultando manuais técnicos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col space-y-6">
      <button onClick={() => onNavigate('DIAGNOSIS')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-2">
        <ArrowLeft size={20} />
        Voltar ao diagnóstico
      </button>

      {/* Basic Explanation */}
      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600/20 p-2 rounded-lg">
            <Brain className="text-blue-500" size={24} />
          </div>
          <h2 className="text-2xl font-oswald text-white uppercase">{code}</h2>
        </div>
        
        <p className="text-slate-300 leading-relaxed mb-6 text-sm">
          {data?.explanation}
        </p>

        {/* Technical Verification Guide - NEW */}
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-blue-500/20 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Gauge size={18} className="text-blue-400" />
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Guia de Teste do Mestre</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Ferramenta:</span>
              <span className="text-xs text-white bg-slate-800 px-2 py-1 rounded">{data?.technicalSpecs?.tool || 'Multímetro'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Referência:</span>
              <span className="text-xs text-emerald-400 font-bold">{data?.technicalSpecs?.referenceValue || '0.5 - 2.0 Ω'}</span>
            </div>
            <p className="text-[11px] text-slate-400 italic bg-slate-800/50 p-2 rounded">
              "Para confirmar o defeito: {data?.technicalSpecs?.procedure}"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Probabilidades de Falha</h4>
          {(data?.causes || []).map((cause: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white font-medium">{cause.part}</span>
                <span className="text-blue-400 font-bold">{cause.probability}%</span>
              </div>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${cause.probability}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onNavigate('WORKSHOP')}
        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
      >
        <Hammer size={24} />
        SIMULAR TESTE E REPARO
      </button>
    </div>
  );
};

export default ExplanationScreen;
