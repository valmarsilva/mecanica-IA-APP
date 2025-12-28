
import React, { useState, useEffect } from 'react';
import { Screen, UserProfile } from '../types';
import { sendRecoveryEmail, SERVER_SNIPPET } from '../services/apiService';
import { ArrowLeft, Mail, Send, CheckCircle, AlertTriangle, RefreshCw, MessageSquare, Shield, Code, Server, Terminal, Copy, Check, Database, Link, Settings } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: Screen) => void;
  allUsers: UserProfile[];
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate, allUsers }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState<{ message: string; type: 'BASE' | 'SERVER' } | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRecover = async () => {
    setError(null);
    
    if (!email.includes('@')) {
      setError({ message: "Por favor, insira um e-mail válido.", type: 'BASE' });
      return;
    }

    setLoading(true);
    
    try {
      // Tenta conexão real com o Django
      await sendRecoveryEmail(email);
      setIsSent(true);
      setResendTimer(60);
    } catch (err: any) {
      setLoading(false);
      
      if (err.message === "SERVER_OFFLINE") {
        // Se o servidor estiver offline, o protótipo avisa mas permite simular localmente se o usuário quiser
        setError({ 
          message: "Servidor Django não detectado na porta 8000. Deseja simular o fluxo local?", 
          type: 'SERVER' 
        });
      } else {
        setError({ message: err.message, type: 'BASE' });
      }
    }
  };

  const simulateLocal = () => {
    const userExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      setIsSent(true);
      setResendTimer(30);
    } else {
      setError({ message: "E-mail não encontrado na base local do navegador.", type: 'BASE' });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(SERVER_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-slate-900 overflow-y-auto pb-24">
      <header className="flex justify-between items-center mb-8">
        <button 
          onClick={() => onNavigate('LOGIN')} 
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors p-2 -ml-2 rounded-lg"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-xs uppercase tracking-widest">Login</span>
        </button>
        <button 
          onClick={() => setShowDevTools(!showDevTools)}
          className={`p-2 rounded-lg transition-all flex items-center gap-2 ${showDevTools ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}
        >
          <Settings size={18} />
        </button>
      </header>

      {showDevTools ? (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl">
            <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
              <Terminal size={16} /> Checklist de Integração
            </h3>
            <div className="space-y-3 mt-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <p className="text-[10px] text-slate-400">Instale o Django e <b>django-cors-headers</b>.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <p className="text-[10px] text-slate-400">Configure o <b>CORS_ALLOW_ALL_ORIGINS</b> no seu settings.py.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <p className="text-[10px] text-slate-400">Certifique-se que o Django está rodando em <b>localhost:8000</b>.</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-[8px] font-black text-blue-500 uppercase tracking-widest">Código Python Sugerido</div>
            <pre className="bg-black/40 border border-slate-800 p-4 rounded-xl text-[9px] text-emerald-400 font-mono overflow-x-auto">
              {SERVER_SNIPPET}
            </pre>
            <button onClick={copyCode} className="absolute top-2 right-2 p-2 bg-slate-800 rounded-md text-slate-400 hover:text-white">
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          <button onClick={() => setShowDevTools(false)} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest">Voltar</button>
        </div>
      ) : !isSent ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h2 className="text-3xl font-oswald text-white uppercase tracking-tight">Recuperar Acesso</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Conectando sua conta ao backend Django corporativo.</p>
          </div>

          {error && (
            <div className={`p-4 rounded-xl space-y-3 ${error.type === 'SERVER' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} />
                <p className="text-xs font-bold">{error.message}</p>
              </div>
              {error.type === 'SERVER' && (
                <button 
                  onClick={simulateLocal}
                  className="w-full py-2 bg-amber-500 text-slate-900 font-black text-[9px] uppercase rounded-lg"
                >
                  Usar Simulação Local do Protótipo
                </button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@oficina.ia" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <button 
            onClick={handleRecover}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <><Send size={18} /> SOLICITAR AO DJANGO</>}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-8 animate-in zoom-in duration-500 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white uppercase font-oswald">Requisição Enviada!</h3>
            <p className="text-slate-400 text-xs px-4">Se o seu servidor Django estiver configurado com SMTP, o e-mail chegará em <b>{email}</b> em breve.</p>
          </div>

          <div className="space-y-3 pt-4">
            <button 
              onClick={() => setIsSent(false)}
              className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest"
            >
              Tentar Outro E-mail
            </button>
            <button 
              onClick={() => onNavigate('LOGIN')}
              className="w-full py-4 border border-slate-800 text-slate-500 font-bold rounded-xl text-[10px] uppercase tracking-widest"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto py-6 flex flex-col items-center gap-2 text-slate-600 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
          <Shield size={14} />
          <p className="text-[9px] font-black uppercase tracking-[0.2em]">Oficina IA Security</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
