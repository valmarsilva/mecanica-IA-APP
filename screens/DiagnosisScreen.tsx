
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
  
  // Quick Entry for Vehicle
  const [quickEntry, setQuickEntry] = useState<Vehicle>({ id: 'temp', make: '', model: '', year: '', engine: '', fuel: '' });
  const [isAddingQuickVehicle, setIsAddingQuickVehicle] = useState(false);

  // Visual Analysis State
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeVehicle = vehicle || (isAddingQuickVehicle ? quickEntry : null);

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
      
      if (currentStrength >= 100) {
        clearInterval(signalInterval);
      }
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
      const base64 = (reader.result as string).split(',')[1];
      setCapturedImage(reader.result as string);
      setAnalyzingImage(true);
      
      const vehicleStr = activeVehicle?.make ? `${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.year}) ${activeVehicle.engine} ${activeVehicle.fuel}` : undefined;
      const result = await analyzePartImage(base64, file.type, vehicleStr);
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
          <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Centro de Diagnóstico</h2>
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${status !== 'IDLE' ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></div>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
               Scanner: {status === 'IDLE' ? 'Pronto' : status === 'CONNECTING' ? 'Pareando...' : status === 'SCANNING' ? 'Lendo ECU' : 'Concluído'}
             </p>
          </div>
        </div>
        {status === 'CONNECTING' && (
          <div className="bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-2 animate-in fade-in duration-300">
            <Signal size={12} className="text-blue-400" />
            <span className="text-[10px] font-black text-blue-400">{signalStrength}%</span>
          </div>
        )}
      </header>

      <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shadow-xl relative z-10">
        <button 
          onClick={() => setMode('OBD2')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            mode === 'OBD2' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Bluetooth size={16} />
          SCANNER OBD2
        </button>
        <button 
          onClick={() => setMode('VISUAL')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            mode === 'VISUAL' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Camera size={16} />
          VISÃO DO MESTRE
        </button>
      </div>

      {!activeVehicle && !isAddingQuickVehicle ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-600 border-2 border-slate-700 border-dashed">
            <Car size={40} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Identificação Necessária</h3>
            <p className="text-slate-500 text-xs px-12 leading-relaxed">Para um diagnóstico preciso, informe a Marca, Modelo e Ano do veículo.</p>
          </div>
          <button 
            onClick={() => setIsAddingQuickVehicle(true)}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold rounded-2xl flex items-center gap-2 border border-blue-500/30 transition-all active:scale-95"
          >
            <PlusCircle size={20} />
            INSERIR DADOS DO VEÍCULO
          </button>
        </div>
      ) : isAddingQuickVehicle && !vehicle ? (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-xl space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Car className="text-blue-500" size={20} />
            <h4 className="text-white font-bold uppercase text-xs tracking-widest">Identificar Veículo</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Marca</label>
              <input 
                value={quickEntry.make}
                onChange={e => setQuickEntry({...quickEntry, make: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" 
                placeholder="Ex: Honda"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Modelo</label>
              <input 
                value={quickEntry.model}
                onChange={e => setQuickEntry({...quickEntry, model: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" 
                placeholder="Ex: Civic"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Ano</label>
            <input 
              value={quickEntry.year}
              onChange={e => setQuickEntry({...quickEntry, year: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" 
              placeholder="Ex: 2022"
              type="number"
            />
          </div>
          <button 
            disabled={!quickEntry.make || !quickEntry.model || !quickEntry.year}
            onClick={() => setIsAddingQuickVehicle(false)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save size={18} />
            CONFIRMAR E INICIAR
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
                <Car size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Analisando Agora</p>
                <h4 className="text-white font-bold text-sm leading-tight">
                  {activeVehicle?.make} {activeVehicle?.model} ({activeVehicle?.year})
                </h4>
                {activeVehicle?.engine && (
                   <p className="text-[9px] text-blue-400 font-bold uppercase mt-0.5">
                     {activeVehicle.engine} • {activeVehicle.fuel}
                   </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                if (vehicle) onNavigate('SETTINGS');
                else setIsAddingQuickVehicle(true);
              }}
              className="p-2 text-slate-500 hover:text-blue-400 transition-colors"
            >
              <SettingsIcon size={18} />
            </button>
          </div>

          {mode === 'OBD2' ? (
            <div className="flex-1 flex flex-col h-full">
              {status === 'IDLE' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 border-dashed">
                      <Bluetooth size={48} className="text-blue-500 animate-pulse" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl text-white">
                      <Zap size={18} fill="currentColor" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">Scanner Bluetooth</h3>
                    <p className="text-slate-500 text-xs px-12 leading-relaxed">
                      Toque abaixo para parear o app com o seu scanner OBD2 e iniciar a varredura eletrônica.
                    </p>
                  </div>
                  <button 
                    onClick={startDiagnosis}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
                  >
                    <Bluetooth size={20} className="group-hover:rotate-12 transition-transform" />
                    CONECTAR VIA BLUETOOTH
                  </button>
                </div>
              )}

              {status === 'CONNECTING' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                  <div className="relative">
                    <div className="w-44 h-44 rounded-full border-[6px] border-slate-800 flex items-center justify-center shadow-inner overflow-hidden">
                      <div className="absolute inset-0 bg-blue-600/10 animate-pulse"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <Bluetooth size={40} className="text-blue-500 animate-bounce mb-2" />
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Buscando...</span>
                      </div>
                    </div>
                    <svg className="absolute top-0 left-0 w-44 h-44 -rotate-90">
                      <circle 
                        cx="88" cy="88" r="82" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="10" 
                        className="text-blue-600 transition-all duration-300"
                        strokeDasharray={515}
                        strokeDashoffset={515 - (515 * signalStrength / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="text-center px-6">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                      Conectando ao scanner...
                    </h3>
                    <p className="text-slate-500 text-xs font-medium animate-pulse">
                      Estabelecendo conexão via Bluetooth Low Energy
                    </p>
                  </div>
                </div>
              )}

              {status === 'SCANNING' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                  <div className="relative">
                    <div className="w-44 h-44 rounded-full border-[6px] border-slate-800 flex items-center justify-center shadow-inner overflow-hidden">
                      <div className="absolute inset-0 bg-blue-600/5 animate-ping"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <RefreshCcw size={40} className="text-blue-500 animate-spin-slow mb-2" />
                        <span className="text-3xl font-oswald font-bold text-white">{progress}%</span>
                      </div>
                    </div>
                    <svg className="absolute top-0 left-0 w-44 h-44 -rotate-90">
                      <circle 
                        cx="88" cy="88" r="82" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="10" 
                        className="text-blue-600 transition-all duration-300"
                        strokeDasharray={515}
                        strokeDashoffset={515 - (515 * progress / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="text-center px-6">
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                      Lendo dados da ECU...
                    </h3>
                    <p className="text-slate-500 text-xs font-medium">Pareado com sucesso • Protocolo CAN-BUS</p>
                  </div>
                </div>
              )}

              {status === 'DONE' && (
                <div className="flex-1 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 mb-6 shadow-lg shadow-red-500/5">
                    <AlertCircle className="text-red-500 shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-red-500 uppercase text-xs tracking-wider">Falha Crítica Detectada</h4>
                      <p className="text-slate-400 text-[11px] leading-tight mt-1">O protocolo de diagnóstico retornou um erro persistente na memória da ECU.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => onSelectCode('P0301')}
                    className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 p-6 rounded-3xl flex items-center justify-between transition-all group active:scale-95 shadow-xl"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-red-600 p-2.5 rounded-xl text-white font-bold text-sm shadow-lg shadow-red-600/30 ring-4 ring-red-600/10">
                        P0301
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">Falha de Ignição</p>
                        <p className="text-xs text-slate-500 font-medium">Cilindro 1 • Intermitente</p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button 
                    onClick={() => setStatus('IDLE')}
                    className="w-full py-4 text-slate-500 text-xs font-bold uppercase hover:text-slate-300 transition-colors"
                  >
                    Reiniciar Varredura
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-6 h-full pt-4">
              {!capturedImage ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="relative">
                    <div className="w-36 h-36 bg-slate-800 rounded-[2rem] flex items-center justify-center border-2 border-slate-700 border-dashed transform rotate-6 shadow-2xl">
                      <Camera size={52} className="text-slate-600 -rotate-6" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-slate-900 shadow-xl text-white">
                      <Sparkles size={18} fill="currentColor" />
                    </div>
                  </div>
                  <div className="px-8 space-y-3">
                    <h3 className="text-xl font-oswald text-white uppercase tracking-wide">Visão do Mestre IA</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Capture uma imagem de uma peça, vazamento ou sensor do {activeVehicle?.model}. Nossa IA analisará o estado físico.
                    </p>
                  </div>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleCapture}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 group"
                  >
                    <Camera size={22} className="group-hover:scale-110 transition-transform" />
                    TIRAR FOTO AGORA
                  </button>
                </div>
              ) : (
                <div className="flex-1 space-y-5 animate-in fade-in duration-300">
                  <div className="relative rounded-3xl overflow-hidden aspect-square border-2 border-slate-700 bg-slate-800 shadow-2xl">
                    <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                    <button 
                      onClick={resetVisual}
                      className="absolute top-4 right-4 p-2.5 bg-black/50 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-red-500 transition-colors shadow-lg"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500"></div>
                      <span className="text-[10px] text-white font-bold uppercase tracking-widest">Análise Ativa</span>
                    </div>
                  </div>

                  {analyzingImage ? (
                    <div className="bg-slate-800/80 backdrop-blur-md p-10 rounded-3xl border border-slate-700 flex flex-col items-center justify-center space-y-5 shadow-2xl border-b-blue-500/50">
                      <div className="relative">
                        <Loader2 size={44} className="text-blue-500 animate-spin" />
                        <Sparkles size={16} className="absolute -top-1 -right-1 text-blue-400 animate-pulse" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-white font-bold uppercase text-sm tracking-tight">O Mestre está consultando...</p>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">IA Motor Engine v2.5</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-500 border border-slate-200">
                      <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="text-blue-400" size={16} />
                          <h4 className="font-bold text-white uppercase text-[10px] tracking-widest">Parecer Técnico da IA</h4>
                        </div>
                        <div className="bg-blue-600 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-tighter">AI REPORT</div>
                      </div>
                      <div className="p-6 space-y-5">
                        <div className="prose prose-sm text-slate-800 leading-relaxed font-semibold text-sm border-l-4 border-blue-500 pl-4 bg-slate-50/50 py-4 rounded-r-2xl italic shadow-inner">
                          {analysisResult || "Nenhum resultado gerado."}
                        </div>
                        
                        <div className="pt-2 flex gap-3">
                          <button 
                            onClick={resetVisual}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl text-xs hover:bg-slate-200 transition-colors border border-slate-200"
                          >
                            REFAZER FOTO
                          </button>
                          <button 
                            onClick={() => {
                              onNavigate('DASHBOARD');
                            }}
                            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <History size={16} />
                            SALVAR LAUDO
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DiagnosisScreen;
