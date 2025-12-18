
import React, { useState } from 'react';
import { Screen, UserProfile, Vehicle } from '../types';
import { getVehicleSpecs } from '../geminiService';
import { Car, Shield, History, MessageSquare, LogOut, ChevronRight, CreditCard, Save, Edit3, Trash2, Plus, Check, PlusCircle, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [isAddingCar, setIsAddingCar] = useState(user.garage.length === 0);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carData, setCarData] = useState<Vehicle>({ id: '', make: '', model: '', year: '', engine: '', fuel: '' });
  
  // State for AI Agent suggestions
  const [isSearchingSpecs, setIsSearchingSpecs] = useState(false);
  const [suggestions, setSuggestions] = useState<{ engines: string[], fuels: string[] } | null>(null);

  // Validation Logic
  const isValidMake = (m: string) => m.trim().length >= 2;
  const isValidModel = (m: string) => m.trim().length >= 2;
  const isValidYear = (y: string) => {
    const num = parseInt(y);
    return !isNaN(num) && num >= 1970 && num <= 2025 && y.length === 4;
  };

  const isFormValid = isValidMake(carData.make) && isValidModel(carData.model) && isValidYear(carData.year);

  const handleStartAdd = () => {
    setCarData({ id: Math.random().toString(36).substr(2, 9), make: '', model: '', year: '', engine: '', fuel: '' });
    setSuggestions(null);
    setIsAddingCar(true);
  };

  const handleStartEdit = (vehicle: Vehicle) => {
    setCarData({ ...vehicle });
    setSuggestions(null);
    setEditingCarId(vehicle.id);
  };

  const handleLookupSpecs = async () => {
    if (!isFormValid) return;
    
    setIsSearchingSpecs(true);
    const specs = await getVehicleSpecs(carData.make, carData.model, carData.year);
    setSuggestions(specs);
    
    if (specs.engines.length > 0 && !carData.engine) {
      setCarData(prev => ({ ...prev, engine: specs.engines[0] }));
    }
    if (specs.fuels.length > 0 && !carData.fuel) {
      setCarData(prev => ({ ...prev, fuel: specs.fuels[0] }));
    }
    
    setIsSearchingSpecs(false);
  };

  const handleSaveCar = () => {
    if (!isValidMake(carData.make)) {
      alert("A marca do veículo deve ter pelo menos 2 caracteres.");
      return;
    }
    if (!isValidModel(carData.model)) {
      alert("O modelo do veículo deve ter pelo menos 2 caracteres.");
      return;
    }
    if (!isValidYear(carData.year)) {
      alert("Por favor, insira um ano válido com 4 dígitos entre 1970 e 2025.");
      return;
    }

    let newGarage = [...user.garage];
    if (editingCarId) {
      newGarage = newGarage.map(v => v.id === editingCarId ? carData : v);
    } else {
      newGarage.push(carData);
    }
    
    onUpdateUser({ 
      garage: newGarage,
      activeVehicleId: user.activeVehicleId || carData.id 
    });
    
    setIsAddingCar(false);
    setEditingCarId(null);
  };

  const handleDeleteCar = (id: string) => {
    const newGarage = user.garage.filter(v => v.id !== id);
    let newActiveId = user.activeVehicleId;
    if (newActiveId === id) {
      newActiveId = newGarage.length > 0 ? newGarage[0].id : undefined;
    }
    onUpdateUser({ garage: newGarage, activeVehicleId: newActiveId });
    if (newGarage.length === 0) setIsAddingCar(true);
  };

  const handleSetActive = (id: string) => {
    onUpdateUser({ activeVehicleId: id });
  };

  const sections = [
    { title: 'Plano Premium', desc: 'Vence em 15 dias', icon: CreditCard },
    { title: 'Segurança', desc: 'Mudar senha e MFA', icon: Shield },
    { title: 'Histórico', desc: 'Relatórios de diagnóstico', icon: History },
    { title: 'Suporte', desc: 'Falar com a equipe', icon: MessageSquare },
  ];

  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-600 rounded-full border-4 border-slate-800 overflow-hidden mb-4 ring-2 ring-blue-500/20">
            <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-4 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-slate-900 text-white shadow-lg">
            <Edit3 size={12} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-slate-500 text-sm">valmar.mecanica@email.com</p>
      </header>

      {/* Garage Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Minha Garagem</h3>
          {!isAddingCar && !editingCarId && (
            <button 
              onClick={handleStartAdd}
              className="flex items-center gap-1 text-blue-400 text-[10px] font-bold uppercase hover:text-blue-300 transition-colors"
            >
              <Plus size={14} /> Adicionar
            </button>
          )}
        </div>

        {(isAddingCar || editingCarId) ? (
          <div className="bg-slate-800 border-2 border-blue-500/50 p-6 rounded-3xl shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-2">
              <div className="bg-blue-600/20 p-2 rounded-lg text-blue-400">
                <Car size={20} />
              </div>
              <h4 className="text-white font-bold text-sm uppercase tracking-tight">
                {editingCarId ? 'Editar Veículo' : 'Configuração do Veículo'}
              </h4>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* MARCA */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Marca</label>
                  <div className="relative">
                    <input 
                      value={carData.make}
                      onChange={e => setCarData({...carData, make: e.target.value})}
                      className={`w-full bg-slate-900 border ${carData.make && !isValidMake(carData.make) ? 'border-red-500/50' : 'border-slate-700'} rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all`} 
                      placeholder="Ex: Honda"
                    />
                    {carData.make && !isValidMake(carData.make) && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={14} />
                    )}
                  </div>
                </div>
                {/* MODELO */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Modelo</label>
                  <div className="relative">
                    <input 
                      value={carData.model}
                      onChange={e => setCarData({...carData, model: e.target.value})}
                      className={`w-full bg-slate-900 border ${carData.model && !isValidModel(carData.model) ? 'border-red-500/50' : 'border-slate-700'} rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all`} 
                      placeholder="Ex: Civic"
                    />
                    {carData.model && !isValidModel(carData.model) && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={14} />
                    )}
                  </div>
                </div>
              </div>
              
              {/* ANO */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Ano (1970 - 2025)</label>
                <div className="relative">
                  <input 
                    value={carData.year}
                    onChange={e => {
                      if (e.target.value.length <= 4) setCarData({...carData, year: e.target.value});
                    }}
                    className={`w-full bg-slate-900 border ${carData.year && !isValidYear(carData.year) ? 'border-red-500' : 'border-slate-700'} rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all`} 
                    placeholder="Ex: 2022"
                    type="number"
                  />
                  {carData.year && !isValidYear(carData.year) && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-[9px] text-red-500 font-bold uppercase">Inválido</span>
                      <AlertCircle className="text-red-500" size={18} />
                    </div>
                  )}
                </div>
              </div>

              {/* AI SPEC AGENT TRIGGER */}
              {isFormValid && (
                <button 
                  onClick={handleLookupSpecs}
                  disabled={isSearchingSpecs}
                  className="w-full py-3 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600/30 transition-all"
                >
                  {isSearchingSpecs ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {isSearchingSpecs ? 'Agente Consultando...' : 'Buscar Ficha Técnica com IA'}
                </button>
              )}

              {/* TECHNICAL SPECS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Motorização</label>
                  {suggestions?.engines && suggestions.engines.length > 0 ? (
                    <select 
                      value={carData.engine}
                      onChange={e => setCarData({...carData, engine: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none appearance-none"
                    >
                      {suggestions.engines.map(eng => <option key={eng} value={eng}>{eng}</option>)}
                      <option value="Outro">Outro...</option>
                    </select>
                  ) : (
                    <input 
                      value={carData.engine}
                      onChange={e => setCarData({...carData, engine: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none" 
                      placeholder="Ex: 1.6 Flex"
                    />
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">Combustível</label>
                  {suggestions?.fuels && suggestions.fuels.length > 0 ? (
                    <select 
                      value={carData.fuel}
                      onChange={e => setCarData({...carData, fuel: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none appearance-none"
                    >
                      {suggestions.fuels.map(f => <option key={f} value={f}>{f}</option>)}
                      <option value="Outro">Outro...</option>
                    </select>
                  ) : (
                    <select 
                      value={carData.fuel}
                      onChange={e => setCarData({...carData, fuel: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none appearance-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="Flex">Flex</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Álcool">Álcool</option>
                      <option value="GNV">GNV</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Elétrico">Elétrico</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {user.garage.length > 0 && (
                <button 
                  onClick={() => { setIsAddingCar(false); setEditingCarId(null); }}
                  className="flex-1 py-4 bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
                >
                  CANCELAR
                </button>
              )}
              <button 
                onClick={handleSaveCar}
                disabled={!isFormValid}
                className={`flex-2 py-4 ${isFormValid ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 text-slate-500'} text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all`}
              >
                <Save size={18} />
                SALVAR VEÍCULO
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {user.garage.map((v) => (
              <div 
                key={v.id}
                className={`relative bg-slate-800/80 border ${user.activeVehicleId === v.id ? 'border-blue-500' : 'border-slate-700'} p-4 rounded-2xl flex items-center justify-between group transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${user.activeVehicleId === v.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <Car size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{v.make} {v.model}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      Ano: {v.year} • {v.engine || 'N/A'} • {v.fuel || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {user.activeVehicleId !== v.id && (
                    <button 
                      onClick={() => handleSetActive(v.id)}
                      className="p-2 text-slate-500 hover:text-emerald-500 transition-colors"
                      title="Ativar para diagnóstico"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleStartEdit(v)}
                    className="p-2 text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCar(v.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {user.activeVehicleId === v.id && (
                  <div className="absolute -top-2 -right-1 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    ATIVO
                  </div>
                )}
              </div>
            ))}
            
            <button 
              onClick={handleStartAdd}
              className="w-full py-5 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-400 hover:border-blue-400/50 transition-all bg-slate-800/20"
            >
              <PlusCircle size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Adicionar Outro Veículo</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">Preferências e Conta</h3>
        {sections.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button 
              key={idx}
              className="w-full bg-slate-800/40 border border-slate-700 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-3 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors">
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        <button 
          onClick={() => onNavigate('WELCOME')}
          className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl flex items-center justify-center gap-2 border border-red-500/20 transition-all active:scale-[0.98]"
        >
          <LogOut size={20} />
          SAIR DO APP
        </button>
        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-6">
          Oficina IA v1.2.5 (Beta)
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;
