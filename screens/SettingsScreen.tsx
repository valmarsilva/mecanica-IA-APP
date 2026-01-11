
import React, { useState } from 'react';
import { Screen, UserProfile, Vehicle } from '../types';
import { validators } from '../utils/testRunner';
import { QRCodeSVG } from 'qrcode.react';
import { Car, Shield, MessageSquare, LogOut, ChevronRight, CreditCard, Edit3, PlusCircle, Sparkles, Home, Beaker, LayoutDashboard, QrCode, X, Share2 } from 'lucide-react';

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
  const [showQR, setShowQR] = useState(false);
  
  const SUPPORT_EMAIL = 'jarvixkonan@gmail.com';

  const isYearValid = carData.year === '' || validators.isValidYear(carData.year);
  const isFormValid = carData.make.length >= 2 && carData.model.length >= 2 && validators.isValidYear(carData.year);

  const handleSaveCar = () => {
    if (!isFormValid) return;
    let newGarage = [...user.garage];
    const newCar = { ...carData, id: carData.id || Math.random().toString(36).substr(2, 9) };
    
    if (editingCarId) {
      newGarage = newGarage.map(v => v.id === editingCarId ? newCar : v);
    } else {
      newGarage.push(newCar);
    }
    
    onUpdateUser({ garage: newGarage, activeVehicleId: user.activeVehicleId || newCar.id });
    setIsAddingCar(false);
    setEditingCarId(null);
    setCarData({ id: '', make: '', model: '', year: '', engine: '', fuel: '' });
  };

  const sections = [
    { title: 'Painel Inicial', desc: 'Voltar ao Dashboard', icon: Home, action: () => onNavigate('DASHBOARD') },
    ...(user.role === 'admin' ? [{ title: 'Admin', desc: 'Gerenciar App', icon: LayoutDashboard, action: () => onNavigate('ADMIN') }] : []),
    { title: 'Identidade Mecânica', desc: 'Gerar QR Code de Perfil', icon: QrCode, action: () => setShowQR(true) },
    { title: 'Oficina IA Pro', desc: user.premium ? 'Membro Pro Ativo' : 'Assinar Plano Premium', icon: CreditCard, action: () => onNavigate('CHECKOUT') },
    { title: 'Auditoria Técnica', desc: 'Saúde do Sistema', icon: Beaker, action: () => onNavigate('TESTS') },
    { title: 'Suporte', desc: SUPPORT_EMAIL, icon: MessageSquare, action: () => window.location.href = `mailto:${SUPPORT_EMAIL}` },
  ];

  const profileUrl = `valtec-ia://profile/${user.id}`;

  return (
    <div className="p-6 space-y-8 pb-24 bg-slate-900 min-h-full">
      {/* Modal QR Code */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] w-full max-w-sm flex flex-col items-center space-y-6 relative shadow-2xl">
            <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full text-slate-400">
              <X size={20} />
            </button>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-oswald text-white uppercase tracking-tight">QR Connect</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sua Identidade Valtec IA</p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-500/10">
              <QRCodeSVG 
                value={profileUrl}
                size={200}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6946a4c9ab084c9f3c4e7142/fa407d51d_logo-oficinapng.png",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-white font-bold text-sm">{user.name}</p>
              <p className="text-[10px] text-blue-500 font-black uppercase mt-1">{user.level}</p>
            </div>

            <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
              <Share2 size={16} /> Compartilhar Cartão
            </button>
          </div>
        </div>
      )}

      <header className="flex flex-col items-center pt-4">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-600 rounded-full border-4 border-slate-800 overflow-hidden mb-4 shadow-xl">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {user.premium && <div className="absolute top-0 right-0 bg-amber-500 p-1.5 rounded-full border-4 border-slate-900 text-white"><Sparkles size={12} /></div>}
        </div>
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">{user.name}</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{user.level}</p>
      </header>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Minha Garagem</h3>
        {(isAddingCar || editingCarId) ? (
          <div className="bg-slate-800 border-2 border-blue-500/30 p-6 rounded-[2rem] space-y-4 animate-in zoom-in duration-300">
            <input value={carData.make} onChange={e => setCarData({...carData, make: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none transition-all" placeholder="Marca (Ex: Toyota)" />
            <input value={carData.model} onChange={e => setCarData({...carData, model: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none transition-all" placeholder="Modelo (Ex: Corolla)" />
            <div className="space-y-1">
              <input value={carData.year} onChange={e => setCarData({...carData, year: e.target.value})} className={`w-full bg-slate-950 border rounded-xl p-3 text-xs text-white outline-none transition-all ${!isYearValid && carData.year !== '' ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'}`} placeholder="Ano" type="number" />
              {!isYearValid && carData.year !== '' && <p className="text-[8px] text-red-500 font-bold uppercase ml-1">Ano Inválido (1970-2025)</p>}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setIsAddingCar(false); setEditingCarId(null); setCarData({ id: '', make: '', model: '', year: '', engine: '', fuel: '' }); }} className="flex-1 py-3 bg-slate-700 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">Cancelar</button>
              <button onClick={handleSaveCar} disabled={!isFormValid} className="flex-1 py-3 bg-blue-600 disabled:opacity-50 rounded-xl text-[10px] font-black text-white shadow-lg shadow-blue-600/20 uppercase tracking-widest">Salvar</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {user.garage.map((v) => (
              <div key={v.id} className="bg-slate-800/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-900 p-3 rounded-xl text-slate-500 group-hover:text-blue-500 transition-colors"><Car size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{v.make} {v.model}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{v.year}</p>
                  </div>
                </div>
                <button onClick={() => { setEditingCarId(v.id); setCarData(v); }} className="p-2 text-slate-600 hover:text-white transition-colors"><Edit3 size={18} /></button>
              </div>
            ))}
            <button onClick={() => setIsAddingCar(true)} className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-blue-500 hover:border-blue-500/50 transition-all">
              <PlusCircle size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Novo Veículo</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sections.map((item, idx) => (
          <button key={idx} onClick={item.action} className="w-full bg-slate-800/30 border border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-all group">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-xl text-slate-600 group-hover:text-blue-500 transition-colors"><item.icon size={20} /></div>
              <div className="text-left">
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-700 group-hover:text-white transition-all" />
          </button>
        ))}
      </div>

      <button onClick={onLogout} className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-black rounded-2xl flex items-center justify-center gap-3 border border-red-500/10 transition-all text-[10px] uppercase tracking-widest">
        <LogOut size={18} /> Sair do Sistema
      </button>
    </div>
  );
};

export default SettingsScreen;
