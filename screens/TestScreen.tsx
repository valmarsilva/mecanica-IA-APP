
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { runSystemAudit, TestResult } from '../utils/testRunner';
import { ArrowLeft, CheckCircle2, XCircle, Beaker, RefreshCw, Activity, ShieldCheck, Terminal, AlertTriangle, Search, Filter } from 'lucide-react';

interface TestScreenProps {
  onNavigate: (screen: Screen) => void;
}

const CategoryTag = ({ category }: { category: TestResult['category'] }) => {
  const colors = {
    SECURITY: 'bg-red-500/10 text-red-500 border-red-500/20',
    LOGIC: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    INTEGRATION: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    API: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
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

  const startAudit = async () => {
    setIsRunning(true);
    setResults([]);
    // Simula tempo de processamento de auditoria
    await new Promise(r => setTimeout(r, 1500));
    const auditResults = await runSystemAudit();
    setResults(auditResults);
    setIsRunning(false);
  };

  useEffect(() => {
    startAudit();
  }, []);

  const passCount = results.filter(r => r.status === 'PASS').length;
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
            <h2 className="text-xl font-oswald text-white uppercase tracking-tight">Auditoria Técnica</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Health & Integrity Monitor</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${failCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-slate-950'}`}>
          {failCount > 0 ? 'Atenção Necessária' : 'Sistema Nominal'}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <Activity className="text-blue-500 mx-auto mb-1" size={16} />
          <p className="text-lg font-bold text-white leading-none">{results.length}</p>
          <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest mt-1">Total</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <ShieldCheck className="text-emerald-500 mx-auto mb-1" size={16} />
          <p className="text-lg font-bold text-emerald-500 leading-none">{passCount}</p>
          <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest mt-1">Ok</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <AlertTriangle className={`${failCount > 0 ? 'text-red-500' : 'text-slate-700'} mx-auto mb-1`} size={16} />
          <p className={`text-lg font-bold leading-none ${failCount > 0 ? 'text-red-500' : 'text-slate-700'}`}>{failCount}</p>
          <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest mt-1">Falhas</p>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
        <input 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filtrar por módulo ou categoria..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-[10px] text-white outline-none focus:border-blue-500/50 transition-all uppercase tracking-widest font-bold"
        />
      </div>

      <div className="flex-1 bg-slate-900/50 rounded-3xl border border-slate-800 p-2 overflow-hidden flex flex-col">
        <div className="bg-black/40 p-3 flex items-center gap-2 border-b border-slate-800">
           <Terminal size={14} className="text-blue-500" />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Console de Auditoria v2.5</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {isRunning ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-600">
              <RefreshCw size={32} className="animate-spin text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Varrendo Módulos...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((test) => (
              <div key={test.id} className="bg-slate-950/40 border border-slate-800/50 p-3 rounded-xl flex items-start gap-3 group hover:border-slate-700 transition-colors">
                {test.status === 'PASS' ? (
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="text-emerald-500" size={14} /></div>
                ) : (
                  <div className="p-1.5 bg-red-500/10 rounded-lg animate-pulse"><XCircle className="text-red-500" size={14} /></div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryTag category={test.category} />
                    <h4 className={`font-bold text-[10px] uppercase truncate ${test.status === 'PASS' ? 'text-slate-200' : 'text-red-400'}`}>
                      {test.name}
                    </h4>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-tight italic">"{test.message}"</p>
                </div>
                <div className="text-[8px] text-slate-700 font-mono self-center">{test.timestamp}</div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-2">
              <Search size={24} />
              <p className="text-[9px] font-black uppercase tracking-widest">Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={startAudit}
        disabled={isRunning}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
      >
        <Beaker size={18} />
        Re-validar Integridade do App
      </button>
    </div>
  );
};

export default TestScreen;
