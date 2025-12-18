
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { ArrowLeft, Mail, Send, CheckCircle, AlertTriangle, RefreshCw, MessageSquare, Shield } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const SUPPORT_EMAIL = 'jarvixkonan@gmail.com';

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRecover = (isResend = false) => {
    if (!email.includes('@')) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      setResendTimer(30);
      if (isResend) alert("Instruções reenviadas!");
    }, 1500);
  };

  const openSupport = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Suporte Oficina IA - Recuperação de Senha`;
  };

  return (
    <div className="h-full flex flex-col p-8 bg-slate-900">
      <button 
        onClick={() => onNavigate('LOGIN')} 
        className="mb-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors w-fit p-2 -ml-2 rounded-lg hover:bg-white/5"
      >
        <ArrowLeft size={20} />
        <span className="font-bold text-xs uppercase tracking-widest">Voltar para Login</span>
      </button>

      {!isSent ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h2 className="text-3xl font-oswald text-white uppercase tracking-tight">Recuperar Senha</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Esqueceu sua chave da oficina? Digite seu e-mail cadastrado e enviaremos instruções para criar uma nova.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail de Cadastro</label>
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
            onClick={() => handleRecover()}
            disabled={loading || !email}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><Send size={18} /> ENVIAR INSTRUÇÕES</>
            )}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-8 animate-in zoom-in duration-500">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">E-mail Enviado!</h3>
              <p className="text-slate-400 text-xs">Verifique <b>{email}</b> agora.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Problemas no recebimento?</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex gap-2"><span className="text-blue-500 font-bold">01.</span> Confira sua pasta de <b>Spam</b>.</li>
              <li className="flex gap-2"><span className="text-blue-500 font-bold">02.</span> Tente reenviar após o tempo de espera.</li>
              <li className="flex gap-2"><span className="text-blue-500 font-bold">03.</span> Entre em contato com <b>{SUPPORT_EMAIL}</b>.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleRecover(true)}
              disabled={resendTimer > 0 || loading}
              className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                resendTimer > 0 
                ? 'border-slate-800 text-slate-600' 
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {resendTimer > 0 ? `REENVIAR EM ${resendTimer}S` : <><RefreshCw size={14} /> REENVIAR E-MAIL</>}
            </button>

            <button 
              onClick={openSupport}
              className="w-full py-4 bg-slate-800 text-blue-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-750 transition-colors"
            >
              <MessageSquare size={14} />
              FALAR COM O SUPORTE
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-center gap-2 text-slate-600">
        <Shield size={14} />
        <p className="text-[9px] font-bold uppercase tracking-widest text-center">Oficina IA Protegida</p>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
