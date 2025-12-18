
import React from 'react';
import { Screen, UserProfile } from '../types';
import { ArrowLeft, Users, Car, DollarSign, TrendingUp, ShieldCheck, Mail } from 'lucide-react';

interface AdminScreenProps {
  onNavigate: (screen: Screen) => void;
  allUsers: UserProfile[];
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onNavigate, allUsers }) => {
  const totalUsers = allUsers.length;
  const premiumUsers = allUsers.filter(u => u.premium).length;
  const totalVehicles = allUsers.reduce((acc, u) => acc + u.garage.length, 0);
  const totalRevenue = premiumUsers * 29.90;

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-full">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate('SETTINGS')} className="p-2 bg-slate-800 rounded-full text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-oswald text-white uppercase tracking-tight">Painel Admin</h2>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <Users className="text-blue-500 mb-2" size={20} />
          <p className="text-2xl font-bold text-white">{totalUsers}</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Usuários</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <DollarSign className="text-emerald-500 mb-2" size={20} />
          <p className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Faturamento</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <Car className="text-amber-500 mb-2" size={20} />
          <p className="text-2xl font-bold text-white">{totalVehicles}</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Veículos</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <ShieldCheck className="text-blue-400 mb-2" size={20} />
          <p className="text-2xl font-bold text-white">{premiumUsers}</p>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Premiums</p>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
          <TrendingUp size={14} /> Usuários Recentes
        </h3>
        <div className="space-y-3">
          {allUsers.map(user => (
            <div key={user.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{user.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">{user.email}</span>
                    {user.premium && <span className="bg-amber-500/10 text-amber-500 text-[8px] px-1 rounded">PREMIUM</span>}
                  </div>
                </div>
              </div>
              <p className="text-xs font-bold text-blue-400">{user.xp} XP</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export default AdminScreen;
