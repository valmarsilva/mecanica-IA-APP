
import React from 'react';
import { Screen, UserProfile } from '../types';
import { X, Home, Scan, Settings, LogOut, Hammer } from 'lucide-react';
import { BRAND_CONFIG } from '../brandConfig';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, user, onLogout }) => {
  const menuItems = [
    { id: 'DASHBOARD' as Screen, icon: Home, label: 'Painel Inicial' },
    { id: 'DIAGNOSIS' as Screen, icon: Scan, label: 'Scanner OBD2' },
    { id: 'SETTINGS' as Screen, icon: Settings, label: 'Minha Garagem' },
  ];

  const handleNav = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-900 z-[70] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Hammer size={18} className="text-white" />
              </div>
              <span className="font-oswald text-xl text-white uppercase tracking-tighter">Oficina IA</span>
            </div>
            <button onClick={onClose} className="text-slate-500"><X size={24} /></button>
          </div>

          <div className="p-6 bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full border-2 border-slate-800 overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user?.level}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="w-full flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-white hover:bg-slate-900 rounded-2xl transition-all"
              >
                <item.icon size={20} />
                <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-900">
            <button 
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-bold uppercase tracking-tight">Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
