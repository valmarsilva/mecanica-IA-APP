
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { runSystemAudit, TestResult } from '../utils/testRunner';
import { ArrowLeft, CheckCircle2, XCircle, Beaker, RefreshCw, Activity, ShieldCheck, Terminal, AlertTriangle, Search, Filter, Shield, Zap, Info } from 'lucide-react';

interface TestScreenProps {
  onNavigate: (screen: Screen) => void;
}

const CriticalityBadge = ({ level }: { level: TestResult['criticality'] }) => {
  const colors = {
    HIGH: 'bg-red-500/20 text-red-500 border-red-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    LOW: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  };
  return (
    <span className={`text-[6px] font-black px-1 py-0.5 rounded border uppercase tracking-widest ${colors[level]}`}>
      {level}
    </span>
  );
};

const CategoryTag = ({ category }: { category: TestResult['category'] }) => {
  const colors = {
    SECURITY: 'bg-red-500/10 text-red-500 border-red-500/20',
    LOGIC: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    INTEGRATION: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    API: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    HARDWARE: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  };
  return (
    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${colors[category]}`}>
      {category}
    </span>
  );
};

const TestScreen: React.FC<TestScreenProps> = ({ onNavigate }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const startAudit = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    // Simulação de progresso para UX
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 150);

    const auditResults = await runSystemAudit();
    
    clearInterval(interval);
    setProgress(100);
    setResults(auditResults);
    setIsRunning(false);
  };

  useEffect(() => {
    startAudit();
  }, []);

  const passCount = results.filter(r => r.status === 'PASS').length;
  const warnCount = results.filter(r => r.status === 'WARNING').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  
  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(filter.toLowerCase()) || 
    r.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 flex flex-col h-full bg-slate-950 overflow-hidden">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SETTINGS')} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-oswald text-white uppercase tracking-tight">Centro de Diagnóstico</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Health Monitor v2.5.0</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${failCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-slate-950'}`}>
          {failCount > 0 ? 'FALHA NO SISTEMA' : 'TUDO NOMINAL'}
        </div>
      </header>

      {isRunning && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3b82f6]" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-[8px] font-black text-blue-500 uppercase text-center tracking-[0.4em]">Auditando Protocolos...</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl text-center">
          <p className="text-lg font-bold text-white font-oswald leading-none">{results.length}</p>
          <p className="text-[6px] text-slate-500 uppercase font-black mt-1">Total</p>
        </div>
        <div className="bg-slate-900/80 border border-emerald-500/20 p-2.5 rounded-2xl text-center">
          <p className="text-lg font-bold text-emerald-500 font-oswald leading-none">{passCount}</p>
          <p className="text-[6px] text-emerald-600 uppercase font-black mt-1">Ok</p>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/20 p-2.5 rounded-2xl text-center">
          <p className="text-lg font-bold text-amber-500 font-oswald leading-none">{warnCount}</p>
          <p className="text-[6px] text-amber-600 uppercase font-black mt-1">Avisos</p>
        </div>
        <div className="bg-slate-900/80 border border-red-500/20 p-2.5 rounded-2xl text-center">
          <p className="text-lg font-bold text-red-500 font-oswald leading-none">{failCount}</p>
          <p className="text-[6px] text-red-600 uppercase font-black mt-1">Crítico</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
        <input 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filtrar Auditoria..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-[10px] text-white outline-none focus:border-blue-500/30 transition-all uppercase tracking-widest font-black"
        />
      </div>

      <div className="flex-1 bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
        <div className="bg-slate-950/80 p-3 flex items-center justify-between border-b border-slate-800">
           <div className="flex items-center gap-2">
             <Terminal size={14} className="text-blue-500" />
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Relatório de Integridade</span>
           </div>
           <Shield size={14} className="text-slate-700" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isRunning ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
              <div className="relative">
                <RefreshCw size={48} className="animate-spin text-blue-500" />
                <Beaker size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Varrendo Módulos</p>
            </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((test) => (
              <div key={test.id} className="bg-slate-950/50 border border-slate-800/40 p-4 rounded-2xl flex items-start gap-3 group hover:border-slate-700 transition-colors">
                <div className="pt-1">
                  {test.status === 'PASS' ? (
                    <CheckCircle2 className="text-emerald-500" size={16} />
                  ) : test.status === 'WARNING' ? (
                    <AlertTriangle className="text-amber-500" size={16} />
                  ) : (
                    <XCircle className="text-red-500 animate-pulse" size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <CategoryTag category={test.category} />
                    <CriticalityBadge level={test.criticality} />
                    <h4 className={`font-black text-[10px] uppercase truncate ${test.status === 'PASS' ? 'text-slate-200' : test.status === 'WARNING' ? 'text-amber-400' : 'text-red-500'}`}>
                      {test.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight italic font-medium">"{test.message}"</p>
                </div>
                <div className="text-[8px] text-slate-700 font-mono self-center bg-slate-900 px-1.5 py-0.5 rounded">{test.timestamp}</div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-3 grayscale opacity-20">
              <Zap size={48} />
              <p className="text-[10px] font-black uppercase tracking-widest">Nada a relatar</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={startAudit}
        disabled={isRunning}
        className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 active:scale-95 transition-all text-[11px] uppercase tracking-[0.2em]"
      >
        <RefreshCw size={18} className={isRunning ? 'animate-spin' : ''} />
        Executar Auditoria Geral
      </button>
    </div>
  );
};

export default TestScreen;
