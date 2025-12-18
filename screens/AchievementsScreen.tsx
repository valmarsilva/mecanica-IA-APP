
import React from 'react';
import { Screen, UserProfile } from '../types';
import { Trophy, Medal, Star, Crown, Zap, BarChart3, ChevronRight } from 'lucide-react';

interface AchievementsScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ user, onNavigate }) => {
  const achievements = [
    { id: '1', title: 'Primeira Graxa', desc: 'Realizou o primeiro diagnóstico', icon: Medal, unlocked: true },
    { id: '2', title: 'Doutor da Bobina', desc: 'Simulou 5 trocas de bobina', icon: Zap, unlocked: true },
    { id: '3', title: 'Cérebro Eletrônico', desc: 'Acertou 10 questões seguidas', icon: BrainIcon, unlocked: false },
    { id: '4', title: 'Mestre da Oficina', desc: 'Chegou ao nível 10', icon: Crown, unlocked: false },
  ];

  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20">
            <Trophy size={48} className="text-amber-900" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs font-bold text-white">
            Nível 4
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-oswald text-white uppercase">{user.level}</h2>
          <p className="text-slate-500 text-sm">Faltam 550 XP para Mecânico Pleno</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pontos</p>
          <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
            <Star className="text-amber-500 fill-amber-500" size={20} />
            {user.xp}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center space-y-2">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Reparos</p>
          <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
            <BarChart3 className="text-blue-500" size={20} />
            12
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suas Conquistas</h3>
          <button className="text-blue-400 text-xs font-bold flex items-center gap-1">
            Ver Ranking <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  item.unlocked 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-slate-900/50 border-slate-800 grayscale opacity-60'
                }`}
              >
                <div className={`${item.unlocked ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-600'} p-3 rounded-xl`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                {item.unlocked && <CheckCircle size={18} className="text-emerald-500" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BrainIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.5 2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2z" />
    <path d="M14 5a3 3 0 1 1 0 6 3 3 0 1 1 0-6z" />
    <path d="M10 11a3 3 0 1 1 0 6 3 3 0 1 1 0-6z" />
    <path d="M10 11V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
    <path d="M10 11h4" />
    <path d="M10 11v6a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-6" />
    <path d="M10 17h4" />
  </svg>
);

const CheckCircle = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default AchievementsScreen;
