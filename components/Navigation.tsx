
import React from 'react';
import { Home, Scan, User } from 'lucide-react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const items = [
    { id: 'DASHBOARD' as Screen, icon: Home, label: 'Início' },
    { id: 'DIAGNOSIS' as Screen, icon: Scan, label: 'Scanner' },
    { id: 'SETTINGS' as Screen, icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-6 z-50">
      {items.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all ${
              isActive ? 'text-blue-500 scale-110' : 'text-slate-500'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
