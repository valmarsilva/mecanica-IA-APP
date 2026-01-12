
import React, { useState } from 'react';
import { Screen, UserProfile, Vehicle } from '../types';
import { Car, LogOut, ChevronRight, Plus, Check, Trash2, Edit3, Settings as SettingsIcon } from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onNavigate, onUpdateUser, onLogout }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCar, setNewCar] = useState<Partial<Vehicle>>({ make: '', model: '', year: '' });

  const handleAddCar = () => {
    if (newCar.make && newCar.model && newCar.year) {
      const vehicle: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        make: newCar.make,
        model: newCar.model,
        year: newCar.year,
      };
      const newGarage = [...user.garage, vehicle];
      onUpdateUser({ 
        garage: newGarage, 
        activeVehicleId: user.activeVehicleId || vehicle.id 
      });
      setNewCar({ make: '', model: '', year: '' });
      setIsAdding(false);
    }
  };

  const handleRemoveCar = (id: string) => {
    const newGarage = user.garage.filter(v => v.id !== id);
    let activeId = user.activeVehicleId;
    if (activeId === id) activeId = newGarage.length > 0 ? newGarage[0].id : undefined;
    onUpdateUser({ garage: newGarage, activeVehicleId: activeId });
  };

  return (
    <div className="p-6 space-y-8 bg-slate-900 min-h-full pb-24">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full border-4 border-slate-800 overflow-hidden shadow-xl">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white uppercase">{user.name}</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.level}</p>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Minha Garagem</h3>
          <button onClick={() => setIsAdding(!isAdding)} className="text-blue-500 p-1">
            <Plus size={20} />
          </button>
        </div>

        {isAdding && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500/30 space-y-4 animate-in zoom-in duration-300">
            <input 
              value={newCar.make} 
              onChange={e => setNewCar({...newCar, make: e.target.value})}
              placeholder="Marca (Ex: Honda)" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
            />
            <input 
              value={newCar.model} 
              onChange={e => setNewCar({...newCar, model: e.target.value})}
              placeholder="Modelo (Ex: Civic)" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
            />
            <input 
              value={newCar.year} 
              onChange={e => setNewCar({...newCar, year: e.target.value})}
              placeholder="Ano (Ex: 2022)" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              type="number"
            />
            <div className="flex gap-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase">Cancelar</button>
              <button onClick={handleAddCar} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-600/20">Salvar</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {user.garage.map((v) => {
            const isActive = user.activeVehicleId === v.id;
            return (
              <div key={v.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${isActive ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-800/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-600'}`}>
                    <Car size={20} />
                  </div>
                  <div onClick={() => onUpdateUser({ activeVehicleId: v.id })} className="cursor-pointer">
                    <h4 className="text-sm font-bold text-white">{v.make} {v.model}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">{v.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isActive && <Check size={18} className="text-blue-500" />}
                  <button onClick={() => handleRemoveCar(v.id)} className="text-slate-600 hover:text-red-500 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {user.garage.length === 0 && !isAdding && (
            <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-2xl opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nenhum veículo cadastrado</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3 pt-4 border-t border-slate-800">
        <button onClick={() => onNavigate('DASHBOARD')} className="w-full bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-3 rounded-xl text-slate-600 group-hover:text-blue-500"><SettingsIcon size={20} /></div>
            <span className="text-sm font-bold text-white">Voltar ao Início</span>
          </div>
          <ChevronRight size={18} className="text-slate-700" />
        </button>
        <button onClick={onLogout} className="w-full p-4 text-red-500 border border-red-500/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest mt-4">
          <LogOut size={18} /> Sair do Sistema
        </button>
      </section>
    </div>
  );
};

export default SettingsScreen;
