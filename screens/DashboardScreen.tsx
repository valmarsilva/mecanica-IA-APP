
import React from 'react';
import { Screen, UserProfile } from '../types';
import { Scan, Settings, Car, ChevronRight, Activity, Bluetooth } from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate }) => {
  const activeCar = user.garage.find(v => v.id === user.activeVehicleId);

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-full pb-24">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Bem-vindo,</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">{user.name.split(' ')[0]}</h1>
        </div>
        <div className="w-11 h-11 rounded-2xl border border-slate-800 bg-slate-900 flex items-center justify-center text-blue-500">
           <Activity size={20} />
        </div>
      </header>

      {/* Card Principal de Conexão */}
      <button
        onClick={() => onNavigate('DIAGNOSIS')}
        className="w-full flex flex-col bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all relative overflow-hidden group text-left"
      >
        <div className="relative z-10 space-y-4">
          <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Scan size={28} />
          </div>
          <div>
            <h4 className="font-oswald text-3xl uppercase leading-none">Scanner Pro</h4>
            <p className="text-[10px] text-blue-100 mt-2 font-black uppercase tracking-widest opacity-80">Iniciar Diagnóstico OBD2</p>
          </div>
        </div>
        <Bluetooth size={140} className="absolute -right-8 -bottom-8 text-white/10 -rotate-12 group-hover:scale-110 transition-transform" />
      </button>

      {/* Grid de Funções */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onNavigate('SETTINGS')}
          className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-[2rem] text-white active:scale-[0.98] transition-all text-left"
        >
          <div className="bg-slate-800 p-4 rounded-2xl text-slate-400">
            <Car size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base leading-none">Minha Garagem</h4>
            <p className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-widest">
              {activeCar ? `${activeCar.make} ${activeCar.model}` : "Nenhum carro ativo"}
            </p>
          </div>
          <ChevronRight size={20} className="text-slate-700" />
        </button>
      </div>

      <div className="pt-8">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Servidor Valtec Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
