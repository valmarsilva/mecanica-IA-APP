
import React, { useState } from 'react';
import { Screen, UserProfile } from '../types';
import { 
  X, Home, Scan, Hammer, GraduationCap, Trophy, 
  Settings, ShieldAlert, LogOut, Mail, User, Star
} from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, user, onLogout }) => {
  const [imageError, setImageError] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD' as Screen, icon: Home, label: 'Painel Inicial' },
    { id: 'DIAGNOSIS' as Screen, icon: Scan, label: 'Diagnóstico OBD2' },
    { id: 'WORKSHOP' as Screen, icon: Hammer, label: 'Oficina Virtual' },
    { id: 'LEARNING' as Screen, icon: GraduationCap, label: 'Academia Técnica' },
    { id: 'ACHIEVEMENTS' as Screen, icon: Trophy, label: 'Minhas Conquistas' },
    { id: 'SETTINGS' as Screen, icon: Settings, label: 'Configurações' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'ADMIN' as Screen, icon: ShieldAlert, label: 'Painel Admin' });
  }

  const handleNav = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-[70] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full shadow-none'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!imageError && BRAND_CONFIG.logoImageUrl ? (
                <img 
                  src={BRAND_CONFIG.logoImageUrl} 
                  alt="Logo" 
                  className="h-7 w-auto rounded-md" 
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Hammer size={16} className="text-white" />
                </div>
              )}
              <span className="font-oswald text-lg text-white uppercase tracking-tighter">{BRAND_CONFIG.name}</span>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 bg-slate-800/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full border-2 border-slate-700 overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">{user?.name}</p>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user?.level}</span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all group"
                >
                  <Icon size={20} className="group-hover:text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Suporte Técnico</p>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={12} />
                <span className="text-[10px] font-bold">jarvixkonan@gmail.com</span>
              </div>
            </div>
            
            <button 
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-bold uppercase tracking-tight">Sair da Conta</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
