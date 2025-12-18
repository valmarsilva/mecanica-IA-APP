
import React from 'react';
import { Screen } from '../types';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full flex flex-col p-8 bg-slate-900">
      <button onClick={() => onNavigate('WELCOME')} className="mb-12 text-slate-400 hover:text-white flex items-center gap-2">
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="mb-10">
        <h2 className="text-3xl font-oswald text-white uppercase mb-2">Bem-vindo</h2>
        <p className="text-slate-400">Faça login para continuar sua jornada.</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Esqueceu a senha?</button>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => onNavigate('DASHBOARD')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          ENTRAR
        </button>
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-[1px] bg-slate-800"></div>
          <span className="text-slate-600 text-xs font-bold">OU</span>
          <div className="flex-1 h-[1px] bg-slate-800"></div>
        </div>
        <button 
          onClick={() => onNavigate('DASHBOARD')}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
        >
          ENTRAR COMO CONVIDADO
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
