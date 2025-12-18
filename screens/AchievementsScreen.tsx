
import React from 'react';
import { Screen, UserProfile } from '../types';
import { Trophy, Medal, Star, Crown, Zap, BarChart3, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface AchievementsScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ user, onNavigate }) => {
  const achievements = [
    { id: '1', title: 'Primeira Graxa', desc: 'Realizou o primeiro diagnóstico', icon: Medal, unlocked: true },
    { id: '2', title: 'Doutor da Bobina', desc: 'Simulou 5 trocas de bobina', icon: Zap, unlocked: true },
    { id: '3', title: 'Cérebro Eletrônico', desc: 'Acertou 10 questões seguidas', icon: Star, unlocked: false },
    { id: '4', title: 'Mestre da Oficina', desc: 'Chegou ao nível 10', icon: Crown, unlocked: false },
  ];

  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('DASHBOARD')} 
          className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-oswald text-white uppercase tracking-tight">Suas Conquistas</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Progressão do Mecânico</p>
        </div>
      </header>

      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/20">
            <Trophy size={48} className="text-amber-900" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 px-3 py-1 rounded-full border-2 border-slate-900 text-[10px] font-black text-white uppercase">
            {user.level.split(' ')[1] || 'Pro'}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white uppercase font-oswald tracking-wide">{user.level}</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Faltam 550 XP para Próximo Nível</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center space-y-2 shadow-lg">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">XP Total</p>
          <div className="text-xl font-bold text-white flex items-center justify-center gap-1 font-oswald">
            <Star className="text-amber-500 fill-amber-500" size={16} />
            {user.xp}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center space-y-2 shadow-lg">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Reparos</p>
          <div className="text-xl font-bold text-white flex items-center justify-center gap-1 font-oswald">
            <BarChart3 className="text-blue-500" size={16} />
            12
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Medalhas Desbloqueadas</h3>
          <button className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
            Ranking <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  item.unlocked 
                    ? 'bg-slate-800/80 border-slate-700' 
                    : 'bg-slate-900/40 border-slate-800 grayscale opacity-40'
                }`}
              >
                <div className={`${item.unlocked ? 'bg-amber-500/20 text-amber-500 shadow-inner' : 'bg-slate-800 text-slate-600'} p-3 rounded-xl`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
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

export default AchievementsScreen;
