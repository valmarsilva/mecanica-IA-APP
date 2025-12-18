
import React from 'react';
import { Screen, UserProfile } from '../types';
import { Scan, Hammer, GraduationCap, Trophy, Settings, Bell, Zap, ChevronRight } from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate }) => {
  const menuItems = [
    { id: 'DIAGNOSIS' as Screen, label: 'Diagnóstico OBD2', icon: Scan, color: 'bg-red-500', desc: 'Leia códigos em tempo real' },
    { id: 'WORKSHOP' as Screen, label: 'Oficina Virtual', icon: Hammer, color: 'bg-blue-500', desc: 'Simulador 3D interativo' },
    { id: 'LEARNING' as Screen, label: 'Academia IA', icon: GraduationCap, color: 'bg-emerald-500', desc: 'Aulas e Quizzes' },
    { id: 'ACHIEVEMENTS' as Screen, label: 'Conquistas', icon: Trophy, color: 'bg-amber-500', desc: 'Nível: ' + user.level },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col">
        <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status Operacional</h2>
        <h1 className="text-2xl font-bold text-white leading-none">Olá, {user.name.split(' ')[0]}! 👋</h1>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-800 rounded-[2rem] p-6 border border-slate-700 shadow-2xl overflow-hidden relative group">
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Progresso Técnico</p>
              <h3 className="text-xl font-bold text-white uppercase font-oswald tracking-tight">{user.level}</h3>
            </div>
            <div className="text-right">
              <span className="text-white font-bold text-lg">{user.xp}</span>
              <span className="text-slate-500 text-xs font-bold"> / 1000 XP</span>
            </div>
          </div>
          <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
              style={{ width: `${(user.xp / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
        <Zap className="absolute -right-6 -bottom-6 text-slate-700/20 rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0 duration-700" size={140} />
      </div>

      {/* Grid Menu */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Atividades Principais</h3>
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group flex items-center gap-4 bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800 transition-all text-left shadow-lg active:scale-[0.98]"
              >
                <div className={`${item.color} p-3.5 rounded-[1.2rem] text-white shadow-xl group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors truncate">{item.label}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-600/5 border border-blue-500/20 rounded-[1.5rem] p-5 flex items-start gap-4 shadow-inner">
        <div className="bg-blue-600/20 p-2.5 rounded-xl text-blue-500 shrink-0">
          <Zap size={20} className="fill-blue-500" />
        </div>
        <div>
          <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Insight do Mestre IA</h5>
          <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
            "Sempre cheque a continuidade dos cabos antes de condenar o sensor. O multímetro é seu melhor amigo!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
