
import React from 'react';
import { Screen, UserProfile } from '../types';
import { Scan, Hammer, GraduationCap, Trophy, ChevronRight, Zap, Target, Star, Wrench, ShieldCheck, Bluetooth, QrCode } from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate }) => {
  const menuItems = [
    { id: 'DIAGNOSIS' as Screen, label: 'Scanner OBD2', icon: Scan, color: 'bg-blue-600', desc: 'Diagnóstico & QR Link' },
    { id: 'WORKSHOP' as Screen, label: 'Oficina Virtual', icon: Hammer, color: 'bg-indigo-600', desc: 'Treinamento Prático' },
    { id: 'LEARNING' as Screen, label: 'Academia Técnica', icon: GraduationCap, color: 'bg-emerald-600', desc: 'Módulos Especializados' },
    { id: 'ACHIEVEMENTS' as Screen, label: 'Conquistas', icon: Trophy, color: 'bg-slate-700', desc: 'Status: ' + user.level },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-full pb-24 font-inter">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Valtec Connect v2.5</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Olá, {user.name.split(' ')[0]}</h1>
        </div>
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full bg-slate-800" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-900"></div>
        </div>
      </header>

      {/* Stats Card */}
      <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.level}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
               <Bluetooth size={10} className="text-blue-400" />
               <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">BT Ready</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Experiência Técnica</span>
              <span className="text-blue-400">{user.xp} XP</span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                style={{ width: `${Math.min(100, (user.xp / 1000) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <Wrench size={120} className="absolute -right-8 -bottom-8 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-4 bg-slate-800/40 hover:bg-slate-800/60 p-5 rounded-2xl border border-slate-700/30 transition-all active:scale-[0.98] group relative"
            >
              <div className={`${item.color} p-4 rounded-xl text-white shadow-lg`}>
                <Icon size={24} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base leading-none">{item.label}</h4>
                  {item.id === 'DIAGNOSIS' && <QrCode size={12} className="text-blue-400" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
              <ChevronRight size={20} className="text-slate-600 group-hover:text-blue-400 transition-all" />
            </button>
          );
        })}
      </div>

      {/* Quick Tip */}
      <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-start gap-3 shadow-inner">
        <Zap size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed italic">
          <span className="text-amber-500 font-bold not-italic">Dica:</span> Ao usar o Scanner, certifique-se que o QR Code do adaptador está limpo para leitura imediata.
        </p>
      </div>
    </div>
  );
};

export default DashboardScreen;
