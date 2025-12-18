
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { runAutomatedTests, TestResult } from '../utils/testRunner';
import { ArrowLeft, CheckCircle2, XCircle, Beaker, RefreshCw, Activity, ShieldCheck } from 'lucide-react';

interface TestScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ onNavigate }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const startTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const tests = runAutomatedTests();
      setResults(tests);
      setIsRunning(false);
    }, 1000);
  };

  useEffect(() => {
    startTests();
  }, []);

  const passCount = results.filter(r => r.status === 'PASS').length;

  return (
    <div className="p-6 space-y-6 flex flex-col h-full bg-slate-950">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate('SETTINGS')} className="p-2 bg-slate-800 rounded-full text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-oswald text-white uppercase">Health Check</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Integridade do Sistema</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <Activity className="text-blue-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{results.length}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Testes Rodados</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <ShieldCheck className="text-emerald-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-emerald-500">{passCount}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Aprovados</span>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 p-4 overflow-y-auto space-y-3">
        {isRunning ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-500">
            <RefreshCw size={32} className="animate-spin text-blue-500" />
            <p className="text-sm font-bold uppercase tracking-widest">Executando Bateria...</p>
          </div>
        ) : (
          results.map((test, idx) => (
            <div key={idx} className="bg-slate-950/50 border border-slate-800/50 p-4 rounded-xl flex items-start gap-4">
              {test.status === 'PASS' ? (
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              ) : (
                <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              )}
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${test.status === 'PASS' ? 'text-white' : 'text-red-400'}`}>
                  {test.name}
                </h4>
                <p className="text-[10px] text-slate-500 leading-tight mt-1">{test.message}</p>
              </div>
              <div className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                test.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {test.status}
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={startTests}
        disabled={isRunning}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
      >
        <Beaker size={20} />
        RODAR TESTES NOVAMENTE
      </button>
    </div>
  );
};

export default TestScreen;
