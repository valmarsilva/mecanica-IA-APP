
import React, { useState, useRef } from 'react';
import { Screen, UserProfile, Vehicle } from '../types';
import { Bluetooth, Power, Activity, Thermometer, Zap, Car, Plus, Check, ChevronRight, AlertCircle, Volume2, Loader2, Mic } from 'lucide-react';
import { generateSpeech, getMechanicalExplanation, decodeAudioData } from '../geminiService';

interface DiagnosisScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onSelectCode: (code: string) => void;
}

const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ user, onNavigate, onUpdateUser, onSelectCode }) => {
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'READY'>('IDLE');
  const [engineOn, setEngineOn] = useState(false);
  const [showPicker, setShowPicker] = useState(!user.activeVehicleId);
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '' });
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const activeVehicle = user.garage.find(v => v.id === user.activeVehicleId);

  const playConnectionSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      const now = audioCtx.currentTime;
      playTone(523.25, now, 0.1); 
      playTone(783.99, now + 0.12, 0.15);
    } catch (e) {
      console.warn("Audio feedback não suportado.");
    }
  };

  const handleVoiceDiagnosis = async () => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      // Mock de código para o protótipo (em um app real viria do OBD2)
      const code = "P0301";
      const explanation = await getMechanicalExplanation(code);
      const speechText = `Código ${code} detectado. ${explanation.explanation}. Verifique principalmente: ${explanation.causes[0]?.part || 'o sistema de ignição'}.`;
      
      const audioBytes = await generateSpeech(speechText);
      
      if (audioBytes) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const ctx = audioContextRef.current;
        const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Erro no assistente de voz:", error);
      setIsSpeaking(false);
    }
  };

  const handleStartScanner = () => {
    if (!user.activeVehicleId) {
      setShowPicker(true);
      return;
    }
    playConnectionSound();
    setStatus('CONNECTING');
    setTimeout(() => setStatus('READY'), 2000);
  };

  const handleSaveQuickVehicle = () => {
    if (newVehicle.make && newVehicle.model && newVehicle.year) {
      const vehicle: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year,
      };
      onUpdateUser({ 
        garage: [...user.garage, vehicle],
        activeVehicleId: vehicle.id
      });
      setIsAdding(false);
      setShowPicker(false);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full space-y-6 bg-slate-900 pb-24 relative overflow-hidden">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">Scanner Pro</h2>
          {activeVehicle && (
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5">
              {activeVehicle.make} {activeVehicle.model} • {activeVehicle.year}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <div className={`w-3 h-3 rounded-full border border-slate-700 ${status !== 'IDLE' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-800'}`}></div>
          <div className={`w-3 h-3 rounded-full border border-slate-700 ${status === 'READY' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'}`}></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        {status === 'IDLE' ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
            <div className="w-48 h-48 bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-600 gap-4">
              {activeVehicle ? <Car size={64} className="text-blue-500/30" /> : <Bluetooth size={64} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{activeVehicle ? 'VEÍCULO SELECIONADO' : 'AGUARDANDO VEÍCULO'}</span>
            </div>

            <div className="w-full space-y-4">
              <button 
                onClick={handleStartScanner}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 text-[11px] uppercase tracking-widest active:scale-95 transition-all"
              >
                {activeVehicle ? 'Iniciar Conexão ELM327' : 'Selecionar Veículo'}
              </button>
              <button 
                onClick={() => setShowPicker(true)}
                className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest"
              >
                Trocar Veículo da Garagem
              </button>
            </div>
          </div>
        ) : status === 'CONNECTING' ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <Bluetooth size={64} className="text-blue-500 animate-pulse" />
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Pareando ELM327...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className={`p-6 rounded-[2.5rem] border transition-all flex items-center justify-between ${engineOn ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${engineOn ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Leitura Realtime</p>
                  <p className="text-white font-bold text-sm uppercase">{engineOn ? 'Motor em Funcionamento' : 'Ignição Ligada'}</p>
                </div>
              </div>
              <button onClick={() => setEngineOn(!engineOn)} className={`p-4 rounded-2xl shadow-xl ${engineOn ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                <Power size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-3xl flex flex-col items-center justify-center space-y-2">
                <Activity size={20} className="text-blue-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">RPM</span>
                <span className="text-2xl font-oswald font-bold text-white">{engineOn ? '850' : '--'}</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-3xl flex flex-col items-center justify-center space-y-2">
                <Thermometer size={20} className="text-red-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Temp. Água</span>
                <span className="text-2xl font-oswald font-bold text-white">92°C</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-3xl flex flex-col items-center justify-center space-y-2">
                <Zap size={20} className="text-amber-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bateria</span>
                <span className="text-2xl font-oswald font-bold text-white">{engineOn ? '14.2V' : '12.4V'}</span>
              </div>
              <div 
                className={`bg-slate-800/50 border p-5 rounded-3xl flex flex-col items-center justify-center space-y-2 transition-all relative ${engineOn ? 'border-amber-500/50' : 'border-slate-700'}`}
              >
                {engineOn ? <AlertCircle size={20} className="text-amber-500" /> : <Check size={20} className="text-emerald-500" />}
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">DTC Erros</span>
                <span className="text-2xl font-oswald font-bold text-white">{engineOn ? '01' : '00'}</span>
                
                {engineOn && (
                  <button 
                    onClick={handleVoiceDiagnosis}
                    disabled={isSpeaking}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border-2 border-slate-900"
                  >
                    {isSpeaking ? <Loader2 size={14} className="text-white animate-spin" /> : <Volume2 size={14} className="text-white" />}
                  </button>
                )}
              </div>
            </div>

            {isSpeaking && (
              <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-2">
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-1 bg-blue-500 rounded-full animate-bounce" style={{ height: '12px', animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest italic">IA descrevendo falha técnica...</p>
              </div>
            )}

            <button onClick={() => setStatus('IDLE')} className="w-full py-4 text-slate-600 font-black uppercase text-[10px] tracking-widest border-t border-slate-800 pt-8">
              Encerrar Scanner
            </button>
          </div>
        )}
      </div>

      {showPicker && (
        <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] border border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-800 flex justify-center items-center">
              <h3 className="text-white font-oswald uppercase text-lg">Selecione o Veículo</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isAdding ? (
                <div className="space-y-4 animate-in zoom-in">
                  <input value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} placeholder="Marca" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white" />
                  <input value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} placeholder="Modelo" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white" />
                  <input value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} placeholder="Ano" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white" type="number" />
                  <div className="flex gap-2">
                    <button onClick={handleSaveQuickVehicle} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase">Confirmar Cadastro</button>
                  </div>
                </div>
              ) : (
                <>
                  {user.garage.map(v => (
                    <button 
                      key={v.id} 
                      onClick={() => { onUpdateUser({ activeVehicleId: v.id }); setShowPicker(false); }}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${user.activeVehicleId === v.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950/20'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Car size={18} className={user.activeVehicleId === v.id ? 'text-blue-500' : 'text-slate-600'} />
                        <div className="text-left">
                          <p className="font-bold text-white text-sm">{v.make} {v.model}</p>
                          <p className="text-[9px] text-slate-500 uppercase">{v.year}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-700" />
                    </button>
                  ))}
                  <button onClick={() => setIsAdding(true)} className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <Plus size={18} /> Novo Veículo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisScreen;
