
import React, { useState } from 'react';
import { Screen, UserProfile } from '../types';
import { ArrowLeft, Mail, Lock, User, UserPlus, AlertCircle, Hammer, Clock } from 'lucide-react';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
  allUsers: UserProfile[];
  onLogin: (user: UserProfile) => void;
  onRegister: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, allUsers, onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<{msg: string, type: 'error' | 'info'} | null>(null);

  const handleSubmit = () => {
    setError(null);

    if (isRegistering) {
      if (!email || !password || !name) {
        setError({msg: "Preencha todos os campos.", type: 'error'});
        return;
      }
      
      const emailExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError({msg: "Este e-mail já está cadastrado.", type: 'error'});
        return;
      }

      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase(),
        name,
        role: 'user',
        status: 'pending', // Usuário começa pendente
        level: 'Mecânico Aprendiz',
        xp: 0,
        premium: false,
        garage: [],
      };
      onRegister(newUser);
      setIsRegistering(false);
      setError({msg: "Cadastro enviado! Aguarde a aprovação do administrador.", type: 'info'});
    } else {
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (found) {
        if (found.status === 'pending') {
          setError({msg: "Sua conta ainda está aguardando aprovação administrativa.", type: 'info'});
          return;
        }
        if (found.status === 'blocked') {
          setError({msg: "Este acesso foi bloqueado por um administrador.", type: 'error'});
          return;
        }
        onLogin(found);
      } else {
        setError({msg: "E-mail ou senha incorretos.", type: 'error'});
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-8 bg-slate-900 overflow-y-auto">
      <button 
        onClick={() => onNavigate('WELCOME')} 
        className="mb-8 text-slate-500 hover:text-white flex items-center gap-2 transition-colors w-fit p-2 -ml-2"
      >
        <ArrowLeft size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Início</span>
      </button>

      <div className="mb-10">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
          <Hammer size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
          {isRegistering ? 'Nova Conta' : 'Acesso ao Painel'}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          {isRegistering ? 'Seu cadastro passará por aprovação técnica.' : 'Entre para gerenciar seus diagnósticos.'}
        </p>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
          error.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        }`}>
          {error.type === 'error' ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <Clock size={18} className="shrink-0 mt-0.5" />}
          <p className="text-xs font-bold uppercase">{error.msg}</p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {isRegistering && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Profissional</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm"
        >
          {isRegistering ? 'Solicitar Acesso' : 'Entrar'}
        </button>
        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
          className="w-full py-4 border border-slate-700 text-slate-400 font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          {isRegistering ? <User size={18} /> : <UserPlus size={18} />}
          {isRegistering ? 'Voltar para Login' : 'Criar nova conta'}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
