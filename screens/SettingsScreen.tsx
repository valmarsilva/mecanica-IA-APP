
import React, { useState } from 'react';
import { Screen, UserProfile, Vehicle } from '../types';
import { getVehicleSpecs } from '../geminiService';
import { Car, Shield, History, MessageSquare, LogOut, ChevronRight, CreditCard, Save, Edit3, Trash2, Plus, Check, PlusCircle, Sparkles, Loader2, AlertCircle, Beaker, LayoutDashboard, Info, Home } from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onNavigate, onUpdateUser, onLogout }) => {
  const [isAddingCar, setIsAddingCar] = useState(user.garage.length === 0);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carData, setCarData] = useState<Vehicle>({ id: '', make: '', model: '', year: '', engine: '', fuel: '' });
  
  const [isSearchingSpecs, setIsSearchingSpecs] = useState(false);
  const SUPPORT_EMAIL = 'jarvixkonan@gmail.com';

  const handleSupport = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Suporte Oficina IA - Usuário: ${user.name}`;
  };

  const isFormValid = carData.make.length >= 2 && carData.model.length >= 2 && carData.year.length === 4;

  const handleSaveCar = () => {
    if (!isFormValid) return;
    let newGarage = [...user.garage];
    if (editingCarId) {
      newGarage = newGarage.map(v => v.id === editingCarId ? carData : v);
    } else {
      newGarage.push(carData);
    }
    onUpdateUser({ garage: newGarage, activeVehicleId: user.activeVehicleId || carData.id });
    setIsAddingCar(false);
    setEditingCarId(null);
  };

  const sections = [
    { title: 'Início', desc: 'Voltar ao Dashboard', icon: Home, action: () => onNavigate('DASHBOARD') },
    ...(user.role === 'admin' ? [{ title: 'Admin', desc: 'Gerenciar App', icon: LayoutDashboard, action: () => onNavigate('ADMIN') }] : []),
    { title: 'Assinar Premium', desc: user.premium ? 'Membro Pro' : 'Desbloqueie tudo', icon: CreditCard, action: () => onNavigate('CHECKOUT') },
    { title: 'Health Check', desc: 'Segurança & Integridade', icon: Beaker, action: () => onNavigate('TESTS') },
    { title: 'Suporte Técnico', desc: SUPPORT_EMAIL, icon: MessageSquare, action: handleSupport },
  ];

  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex flex-col items-center pt-4">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-600 rounded-full border-4 border-slate-800 overflow-hidden mb-4 shadow-xl">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {user.premium && <div className="absolute top-0 right-0 bg-amber-500 p-1.5 rounded-full border-4 border-slate-900 text-white"><Sparkles size={12} /></div>}
        </div>
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{user.level}</p>
      </header>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Minha Garagem</h3>
        {(isAddingCar || editingCarId) ? (
          <div className="bg-slate-800 border-2 border-blue-500/50 p-6 rounded-3xl space-y-4">
            <input value={carData.make} onChange={e => setCarData({...carData, make: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white" placeholder="Marca" />
            <input value={carData.model} onChange={e => setCarData({...carData, model: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white" placeholder="Modelo" />
            <input value={carData.year} onChange={e => setCarData({...carData, year: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white" placeholder="Ano (Ex: 2020)" type="number" />
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setIsAddingCar(false); setEditingCarId(null); }} className="flex-1 py-3 bg-slate-700 rounded-xl text-xs font-bold text-white">CANCELAR</button>
              <button onClick={handleSaveCar} disabled={!isFormValid} className="flex-1 py-3 bg-blue-600 disabled:opacity-50 rounded-xl text-xs font-bold text-white">SALVAR</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {user.garage.map((v) => (
              <div key={v.id} className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-lg text-slate-400"><Car size={18} /></div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{v.make} {v.model}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{v.year}</p>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setIsAddingCar(true)} className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-blue-400 hover:border-blue-400 transition-all">
              <PlusCircle size={18} /> <span className="text-[10px] font-bold uppercase tracking-widest">Adicionar Veículo</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sections.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button key={idx} onClick={item.action} className="w-full bg-slate-800/40 border border-slate-700 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-all group">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-3 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors"><Icon size={20} /></div>
                <div className="text-left">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          );
        })}
      </div>

      <button onClick={onLogout} className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl flex items-center justify-center gap-2 border border-red-500/20 transition-all">
        <LogOut size={20} /> SAIR DA CONTA
      </button>
    </div>
  );
};

export default SettingsScreen;
