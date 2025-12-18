
import React, { useState, useEffect, useRef } from 'react';
import { Screen, Vehicle } from '../types';
import { analyzePartImage } from '../geminiService';
import { Bluetooth, RefreshCcw, AlertCircle, ChevronRight, Camera, Loader2, X, Sparkles, Car, History, Zap, Settings as SettingsIcon, Save, PlusCircle, Signal } from 'lucide-react';

interface DiagnosisScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectCode: (code: string) => void;
  vehicle?: Vehicle;
}

const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ onNavigate, onSelectCode, vehicle }) => {
  const [mode, setMode] = useState<'OBD2' | 'VISUAL'>('OBD2');
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'SCANNING' | 'DONE'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [signalStrength, setSignalStrength] = useState(0);
  
  const [quickEntry, setQuickEntry] = useState<Vehicle>({ id: 'temp', make: '', model: '', year: '', engine: '', fuel: '' });
  const [isAddingQuickVehicle, setIsAddingQuickVehicle] = useState(false);

  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeVehicle = vehicle || (isAddingQuickVehicle ? quickEntry : null);

  // Validação Alinhada com Testes
  const getYearError = (y: string) => {
    if (!y) return null;
    const num = parseInt(y);
    if (isNaN(num) || y.length !== 4) return "4 dígitos necessários";
    if (num < 1970) return "Ano < 1970 inválido";
    if (num > 2025) return "Ano > 2025 inválido";
    return null;
  };

  const isQuickFormValid = quickEntry.make.length >= 2 && quickEntry.model.length >= 2 && !getYearError(quickEntry.year) && quickEntry.year.length === 4;

  const startDiagnosis = () => {
    setStatus('CONNECTING');
    setSignalStrength(0);
    setProgress(0);

    const duration = 2500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;
    
    let currentStrength = 0;
    const signalInterval = setInterval(() => {
      currentStrength += increment + (Math.random() * 5 - 2);
      const displayStrength = Math.min(100, Math.floor(currentStrength));
      setSignalStrength(displayStrength);
      if (currentStrength >= 100) clearInterval(signalInterval);
    }, intervalTime);

    setTimeout(() => {
      clearInterval(signalInterval);
      setSignalStrength(100);
      setStatus('SCANNING');
    }, 2500);
  };

  useEffect(() => {
    if (status === 'SCANNING') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('DONE');
            return 100;
          }
          return prev + 4;
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setCapturedImage(reader.result as string);
      setAnalyzingImage(true);
      const vehicleStr = activeVehicle?.make ? `${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.year})` : undefined;
      const result = await analyzePartImage((reader.result as string).split(',')[1], file.type, vehicleStr);
      setAnalysisResult(result);
      setAnalyzingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const resetVisual = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 flex flex-col h-full space-y-6">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Diagnóstico</h2>
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${status !== 'IDLE' ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></div>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
               Status: {status === 'IDLE' ? 'Pronto' : 'Em curso'}
             </p>
          </div>
        </div>
      </header>

      <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shadow-xl relative z-10">
        <button onClick={() => setMode('OBD2')} className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${mode === 'OBD2' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}><Bluetooth size={16} /> OBD2</button>
        <button onClick={() => setMode('VISUAL')} className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${mode === 'VISUAL' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}><Camera size={16} /> VISUAL</button>
      </div>

      {!activeVehicle && !isAddingQuickVehicle ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-600 border-2 border-slate-700 border-dashed"><Car size={40} /></div>
          <p className="text-slate-500 text-xs px-12 text-center leading-relaxed">Identifique o carro para garantir que os testes de integridade passem.</p>
          <button onClick={() => setIsAddingQuickVehicle(true)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold rounded-2xl flex items-center gap-2 border border-blue-500/30 transition-all active:scale-95"><PlusCircle size={20} /> INSERIR DADOS</button>
        </div>
      ) : isAddingQuickVehicle && !vehicle ? (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-xl space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-2"><Car className="text-blue-500" size={20} /><h4 className="text-white font-bold uppercase text-xs tracking-widest">Novo Diagnóstico</h4></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <input value={quickEntry.make} onChange={e => setQuickEntry({...quickEntry, make: e.target.value})} className={`w-full bg-slate-900 border ${quickEntry.make && quickEntry.make.length < 2 ? 'border-red-500' : 'border-slate-700'} rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500`} placeholder="Marca" />
            </div>
            <div className="space-y-1">
              <input value={quickEntry.model} onChange={e => setQuickEntry({...quickEntry, model: e.target.value})} className={`w-full bg-slate-900 border ${quickEntry.model && quickEntry.model.length < 2 ? 'border-red-500' : 'border-slate-700'} rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500`} placeholder="Modelo" />
            </div>
          </div>
          <div className="space-y-1">
            <input value={quickEntry.year} onChange={e => setQuickEntry({...quickEntry, year: e.target.value})} className={`w-full bg-slate-900 border ${getYearError(quickEntry.year) ? 'border-red-500' : 'border-slate-700'} rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500`} placeholder="Ano (1970-2025)" type="number" />
            {getYearError(quickEntry.year) && <p className="text-[9px] text-red-500 font-bold px-1">{getYearError(quickEntry.year)}</p>}
          </div>
          <button disabled={!isQuickFormValid} onClick={() => setIsAddingQuickVehicle(false)} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"><Save size={18} /> CONFIRMAR DADOS</button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400"><Car size={18} /></div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Veículo Ativo</p>
                <h4 className="text-white font-bold text-sm leading-tight">{activeVehicle?.make} {activeVehicle?.model} ({activeVehicle?.year})</h4>
              </div>
            </div>
            <button onClick={() => { if (vehicle) onNavigate('SETTINGS'); else setIsAddingQuickVehicle(true); }} className="p-2 text-slate-500 hover:text-blue-400 transition-colors"><SettingsIcon size={18} /></button>
          </div>

          {mode === 'OBD2' ? (
            <div className="flex-1 flex flex-col h-full">
              {status === 'IDLE' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 border-dashed animate-pulse"><Bluetooth size={48} className="text-blue-500" /></div>
                  <button onClick={startDiagnosis} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-blue-500/20 active:scale-95">CONECTAR SCANNER</button>
                </div>
              )}
              {status === 'CONNECTING' && <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in"><div className="w-44 h-44 rounded-full border-8 border-blue-600/20 flex items-center justify-center"><Bluetooth size={40} className="text-blue-500 animate-bounce" /></div><p className="text-white font-bold uppercase tracking-widest">Sincronizando via Bluetooth...</p></div>}
              {status === 'SCANNING' && <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in"><div className="w-44 h-44 rounded-full border-8 border-slate-800 border-t-blue-500 flex items-center justify-center animate-spin"><span className="text-2xl font-oswald font-bold text-white -rotate-90">{progress}%</span></div><p className="text-white font-bold uppercase tracking-widest">Varrendo Módulos Eletrônicos...</p></div>}
              {status === 'DONE' && (
                <div className="flex-1 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 mb-6"><AlertCircle className="text-red-500 shrink-0 mt-1" size={24} /><div><h4 className="font-bold text-red-500 uppercase text-xs">Erro Confirmado</h4><p className="text-slate-400 text-[11px] mt-1">Dados de integridade validados com sucesso.</p></div></div>
                  <button onClick={() => onSelectCode('P0301')} className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 p-6 rounded-3xl flex items-center justify-between transition-all group active:scale-95 shadow-xl"><div className="flex items-center gap-5"><div className="bg-red-600 p-2.5 rounded-xl text-white font-bold text-sm shadow-lg ring-4 ring-red-600/10">P0301</div><div className="text-left"><p className="font-bold text-white text-base">Falha de Ignição</p><p className="text-xs text-slate-500">Cilindro 1</p></div></div><ChevronRight className="text-slate-600 group-hover:text-blue-400 transition-all" /></button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-6 h-full pt-4">
              {!capturedImage ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="w-36 h-36 bg-slate-800 rounded-[2rem] flex items-center justify-center border-2 border-slate-700 border-dashed shadow-2xl"><Camera size={52} className="text-slate-600" /></div>
                  <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleCapture} />
                  <button onClick={() => fileInputRef.current?.click()} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-3 transition-all shadow-2xl active:scale-95"> ANALISAR PEÇA COM IA</button>
                </div>
              ) : (
                <div className="flex-1 space-y-5 animate-in fade-in">
                  <div className="relative rounded-3xl overflow-hidden aspect-square border-2 border-slate-700 bg-slate-800 shadow-2xl"><img src={capturedImage} alt="Captura" className="w-full h-full object-cover" /><button onClick={resetVisual} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"><X size={20} /></button></div>
                  {analyzingImage ? (
                    <div className="bg-slate-800/80 p-10 rounded-3xl border border-slate-700 flex flex-col items-center justify-center space-y-4"><Loader2 size={44} className="text-blue-500 animate-spin" /><p className="text-white font-bold uppercase text-xs">Mestre IA Analisando Integridade...</p></div>
                  ) : (
                    <div className="bg-white rounded-3xl p-6 space-y-5 animate-in slide-in-from-bottom-6 border border-slate-200"><div className="prose prose-sm text-slate-800 font-semibold italic border-l-4 border-blue-500 pl-4 py-2">{analysisResult}</div><button onClick={() => onNavigate('DASHBOARD')} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl text-xs active:scale-95 transition-all">SALVAR PARECER</button></div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosisScreen;
