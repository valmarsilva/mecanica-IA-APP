
import React, { useState } from 'react';
import { Screen, UserProfile } from '../types';
import { ArrowLeft, Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    if (isRegistering) {
      if (!email || !password || !name) {
        setError("Todos os campos são obrigatórios!");
        return;
      }
      if (!email.includes('@')) {
        setError("Digite um e-mail válido!");
        return;
      }
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres!");
        return;
      }
      
      const emailExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError("Este e-mail já está em uso!");
        return;
      }

      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase(),
        name,
        role: 'user',
        level: 'Mecânico Aprendiz',
        xp: 0,
        premium: false,
        garage: [],
      };
      onRegister(newUser);
    } else {
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        // No protótipo não validamos senha real por simplicidade, mas o fluxo existe
        onLogin(found);
      } else {
        setError("E-mail ou senha não encontrados na base.");
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-8 bg-slate-900">
      <button onClick={() => onNavigate('WELCOME')} className="mb-12 text-slate-400 hover:text-white flex items-center gap-2 transition-colors w-fit p-2 -ml-2 rounded-lg hover:bg-white/5">
        <ArrowLeft size={20} />
        <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
      </button>

      <div className="mb-10">
        <h2 className="text-3xl font-oswald text-white uppercase mb-2 tracking-tight">
          {isRegistering ? 'Criar Conta' : 'Bem-vindo'}
        </h2>
        <p className="text-slate-400 text-sm">
          {isRegistering ? 'Cadastre-se para começar os diagnósticos.' : 'Faça login para gerenciar sua oficina.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <p className="text-xs font-bold">{error}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {isRegistering && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Mecânico</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Valmar Silva" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
          
          {!isRegistering && (
            <div className="flex justify-end px-1">
              <button 
                onClick={() => onNavigate('FORGOT_PASSWORD')}
                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-tight"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
        >
          {isRegistering ? 'REALIZAR CADASTRO' : 'ENTRAR NA PLATAFORMA'}
        </button>
        
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-slate-900 px-3 text-slate-600">novo por aqui?</span></div>
        </div>

        <button 
          onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
          className="w-full py-4 border border-slate-700 text-slate-400 font-bold rounded-xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isRegistering ? <User size={18} /> : <UserPlus size={18} />}
          {isRegistering ? 'VOLTAR PARA LOGIN' : 'CRIAR MINHA CONTA AGORA'}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
