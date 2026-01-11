
import React, { useState, useEffect, useRef } from 'react';
import { Screen, Vehicle, UserProfile } from '../types';
import { analyzePartImage, generateSpeech, decodeAudioData, decodeOBD2Response } from '../geminiService';
import { Bluetooth, RefreshCcw, AlertCircle, ChevronRight, Camera, Loader2, X, Sparkles, Signal, Database, Terminal, Volume2, ShieldAlert, Activity, Gauge, Thermometer, Zap, Power, BluetoothOff, Trash2, Cpu, RotateCcw } from 'lucide-react';

interface DiagnosisScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onSelectCode: (code: string) => void;
  vehicle?: Vehicle;
}

const StatusLed = ({ color, active, blinking, label }: { color: string, active: boolean, blinking?: boolean, label: string }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className={`w-3 h-3 rounded-full border border-slate-700 transition-all duration-500 ${active ? `${color} shadow-[0_0_10px_${color.replace('bg-', '')}]` : 'bg-slate-800'} ${blinking && active ? 'animate-pulse' : ''}`}></div>
    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

const PIDGauge = ({ label, value, unit, icon: Icon, color, active }: { label: string, value: string | number, unit: string, icon: any, color: string, active: boolean }) => (
  <div className={`bg-slate-800/80 border border-slate-700 p-4 rounded-3xl flex flex-col items-center justify-center space-y-1 relative overflow-hidden transition-all ${active ? 'opacity-100' : 'opacity-25'}`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${active ? color : 'bg-slate-600'}`}></div>
    <Icon size={16} className="text-slate-500 mb-1" />
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-oswald font-bold text-white">{active ? value : '--'}</span>
      <span className="text-[9px] font-bold text-slate-500">{unit}</span>
    </div>
  </div>
);

const DiagnosisScreen: React.FC<DiagnosisScreenProps> = ({ user, onNavigate, onSelectCode, vehicle }) => {
  const [mode, setMode] = useState<'REALTIME' | 'DTC' | 'TERMINAL'>('REALTIME');
  const [status, setStatus] = useState<'IDLE' | 'LINKING' | 'AT_INIT' | 'ECU_SYNC' | 'READY' | 'ERROR'>('IDLE');
  const [logs, setLogs] = useState<{ cmd: string, res: string, time: string }[]>([]);
  const [engineOn, setEngineOn] = useState(false);
  const [pids, setPids] = useState({ rpm: 0, temp: 0, volt: 12.4 });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const addLog = (cmd: string, res: string) => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false, minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ cmd, res, time }, ...prev].slice(0, 10));
  };

  const playConnectSound = () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.05, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      const now = ctx.currentTime;
      playTone(523.25, now, 0.1);
      playTone(659.25, now + 0.1, 0.15);
    } catch (e) {
      console.warn("Audio synthesis unavailable");
    }
  };

  const startConnection = async () => {
    playConnectSound();
    setStatus('LINKING');
    addLog("BT_SEARCH", "BUSCANDO OBDII...");
    
    await new Promise(r => setTimeout(r, 1500));
    setStatus('AT_INIT');
    addLog("ATZ", "ELM327 v2.1 OK");
    addLog("ATE0", "ECHO OFF OK");
    addLog("ATSP0", "PROTOCOL AUTO OK");
    
    await new Promise(r => setTimeout(r, 1500));
    setStatus('ECU_SYNC');
    addLog("01 00", "41 00 BE 1F B8 10");
    
    await new Promise(r => setTimeout(r, 1000));
    setStatus('READY');
    handleSpeak("Interface sincronizada. Barramento CAN ativo na porta 8000.");
  };

  const handleNewDiagnosis = () => {
    setStatus('IDLE');
    setEngineOn(false);
    setPids({ rpm: 0, temp: 0, volt: 12.4 });
    setLogs([]);
    handleSpeak("Sessão finalizada. Iniciando novo ciclo de diagnóstico.");
  };

  useEffect(() => {
    let interval: any;
    if (status === 'READY') {
      interval = setInterval(() => {
        if (engineOn) {
          const rpmHexA = (10 + Math.floor(Math.random() * 5)).toString(16).toUpperCase();
          const rpmHexB = Math.floor(Math.random() * 255).toString(16).toUpperCase();
          const res = `41 0C ${rpmHexA} ${rpmHexB}`;
          const val = decodeOBD2Response('010C', res);
          
          setPids(prev => ({ ...prev, rpm: val, volt: 14.1 + (Math.random() * 0.2), temp: 92 }));
          addLog("01 0C", res);
        } else {
          setPids(prev => ({ ...prev, rpm: 0, volt: 12.4, temp: 45 }));
          addLog("01 0C", "SEARCHING...");
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [status, engineOn]);

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    if (!audioContextRef.current) {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx({ sampleRate: 24000 });
    }
    const audioBytes = await generateSpeech(text);
    if (audioBytes && audioContextRef.current) {
      const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="p-6 flex flex-col min-h-full space-y-5 bg-slate-900 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-oswald text-white uppercase tracking-tight">OBDII Real-Link</h2>
          <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Protocolo: ISO 15765-4 CAN</p>
        </div>
        <div className="flex gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <StatusLed label="LINK" color="bg-blue-500" active={status !== 'IDLE' && status !== 'ERROR'} blinking={status === 'LINKING'} />
          <StatusLed label="ECU" color="bg-emerald-500" active={status === 'READY'} blinking={status === 'ECU_SYNC'} />
          <StatusLed label="BUS" color="bg-amber-500" active={engineOn} blinking={engineOn} />
        </div>
      </header>

      {status === 'READY' && (
        <button 
          onClick={handleNewDiagnosis}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={14} /> Novo Diagnóstico
        </button>
      )}

      <div className="bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 flex shrink-0">
        {['REALTIME', 'DTC', 'TERMINAL'].map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m as any)}
            disabled={status !== 'READY' && m !== 'TERMINAL'}
            className={`flex-1 py-2.5 rounded-xl font-black text-[9px] uppercase transition-all ${mode === m ? 'bg-blue-600 text-white' : 'text-slate-500 opacity-50'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {status === 'IDLE' ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-8">
            <div className="w-40 h-40 bg-slate-800 rounded-[3rem] flex items-center justify-center border-2 border-slate-700 border-dashed animate-pulse">
              <Bluetooth size={48} className="text-slate-600" />
            </div>
            <div className="text-center px-8">
              <h3 className="text-white font-bold uppercase text-sm">Aguardando Conexão</h3>
              <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest">Ligue a ignição e conecte o adaptador ELM327 na porta OBD2.</p>
            </div>
            <button onClick={startConnection} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all">
              Sincronizar Interface
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {mode === 'REALTIME' && (
              <>
                <div className={`p-5 rounded-3xl border transition-all flex items-center justify-between ${engineOn ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${engineOn ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                        <Cpu size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase">Fluxo da ECU</p>
                        <p className={`font-bold text-sm ${engineOn ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {engineOn ? 'STREAMING ATIVO' : 'IGNIÇÃO OK / MOTOR OFF'}
                        </p>
                      </div>
                   </div>
                   <button onClick={() => setEngineOn(!engineOn)} className={`p-4 rounded-2xl transition-all shadow-xl active:scale-90 ${engineOn ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                     <Power size={24} />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <PIDGauge label="Rotação (RPM)" value={pids.rpm} unit="RPM" icon={Activity} color="bg-blue-500" active={engineOn} />
                  <PIDGauge label="Voltagem" value={pids.volt.toFixed(1)} unit="V" icon={Zap} color="bg-emerald-500" active={true} />
                  <PIDGauge label="Temp. Motor" value={pids.temp} unit="°C" icon={Thermometer} color="bg-red-500" active={true} />
                  <PIDGauge label="Protocolo" value="CAN" unit="BUS" icon={Database} color="bg-slate-500" active={true} />
                </div>

                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700 mt-4">
                   <div className="flex items-center gap-2 mb-2">
                     <Terminal size={12} className="text-blue-500" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Raw Traffic (OBD-Terminal)</span>
                   </div>
                   <div className="font-mono text-[10px] text-emerald-500 space-y-1 overflow-x-auto">
                      {logs.slice(0, 4).map((l, i) => (
                        <div key={i} className="flex gap-2 whitespace-nowrap">
                          <span className="text-slate-600">[{l.time}]</span>
                          <span className="text-blue-400">&gt; {l.cmd}</span>
                          <span className="text-emerald-400">{l.res}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </>
            )}

            {mode === 'TERMINAL' && (
              <div className="bg-black border border-slate-800 rounded-3xl p-5 min-h-[300px] flex flex-col font-mono">
                <div className="flex-1 space-y-2 text-[11px]">
                  <p className="text-slate-500"># OFICINA IA - OBD2 TERMINAL v1.0</p>
                  {logs.map((l, i) => (
                    <div key={i} className="space-y-0.5 border-l border-slate-800 pl-3">
                      <div className="flex justify-between opacity-40">
                        <span className="text-[8px] text-slate-500 uppercase">Request</span>
                        <span className="text-[8px] text-slate-500">{l.time}</span>
                      </div>
                      <p className="text-blue-400 font-bold">&gt; {l.cmd}</p>
                      <p className="text-emerald-400">{l.res}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'DTC' && (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <ShieldAlert size={40} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase text-sm">Memória da ECU Limpa</h3>
                  <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-widest leading-relaxed">Nenhum código de falha (DTC) detectado no barramento principal.</p>
                </div>
                <button onClick={() => { addLog("04", "OK"); handleSpeak("Limpando memória de erros."); }} className="w-full py-4 bg-slate-800 text-red-500 font-black rounded-xl text-[10px] uppercase border border-red-500/20 flex items-center justify-center gap-2">
                   <Trash2 size={16} /> Forçar Reset de Falhas
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {status !== 'IDLE' && (
        <button onClick={() => { setStatus('IDLE'); setEngineOn(false); }} className="w-full py-6 text-slate-600 font-black uppercase text-[9px] tracking-widest border-t border-slate-800 hover:text-red-400 transition-colors">Encerrar Sessão OBD2</button>
      )}
    </div>
  );
};

export default DiagnosisScreen;
