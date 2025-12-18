
import React from 'react';
import { Screen, UserProfile } from '../types';
import { Scan, Hammer, GraduationCap, Trophy, Settings, Bell, Zap } from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate }) => {
  const menuItems = [
    { id: 'DIAGNOSIS' as Screen, label: 'Diagnóstico OBD2', icon: Scan, color: 'bg-red-500', desc: 'Leia códigos em tempo real' },
    { id: 'WORKSHOP' as Screen, label: 'Oficina Virtual', icon: Hammer, color: 'bg-blue-500', desc: 'Simulador 3D interativo' },
    { id: 'LEARNING' as Screen, label: 'Aprendizado', icon: GraduationCap, color: 'bg-emerald-500', desc: 'Aulas e Quizzes' },
    { id: 'ACHIEVEMENTS' as Screen, label: 'Conquistas', icon: Trophy, color: 'bg-amber-500', desc: 'Nível: ' + user.level },
  ];

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-400 text-sm font-medium">Bem-vindo de volta,</h2>
          <h1 className="text-2xl font-bold text-white">{user.name}! 👋</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-slate-800 rounded-full text-slate-400 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-slate-700 overflow-hidden">
            <img src="https://picsum.photos/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Progress Card */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nível Atual</p>
              <h3 className="text-lg font-bold text-white uppercase font-oswald">{user.level}</h3>
            </div>
            <div className="text-right">
              <span className="text-blue-400 font-bold">{user.xp}</span>
              <span className="text-slate-500 text-sm"> / 1000 XP</span>
            </div>
          </div>
          <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000" 
              style={{ width: `${(user.xp / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
        <Zap className="absolute -right-4 -bottom-4 text-slate-700/30 rotate-12" size={120} />
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 gap-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">O que vamos fazer hoje?</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group flex items-center gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all text-left"
            >
              <div className={`${item.color} p-3 rounded-xl text-white shadow-lg`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.label}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Zap size={20} />
        </div>
        <div className="flex-1">
          <h5 className="text-sm font-bold text-blue-400">Dica do Especialista IA</h5>
          <p className="text-xs text-slate-400">"Falhas de ignição P0301 são frequentemente velas gastas. Verifique o eletrodo!"</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
