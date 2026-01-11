
import React from 'react';
import { Home, Scan, Hammer, GraduationCap, User } from 'lucide-react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const items = [
    { id: 'DASHBOARD' as Screen, icon: Home, label: 'Início' },
    { id: 'DIAGNOSIS' as Screen, icon: Scan, label: 'Diag.' },
    { id: 'WORKSHOP' as Screen, icon: Hammer, label: 'Oficina' },
    { id: 'LEARNING' as Screen, icon: GraduationCap, label: 'Estudo' },
    { id: 'SETTINGS' as Screen, icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="h-16 bg-slate-800 border-t border-slate-700 flex items-center justify-around px-2 shrink-0 z-50">
      {items.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all flex-1 ${
              isActive ? 'text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
