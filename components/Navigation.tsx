
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
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-slate-800 border-t border-slate-700 flex items-center justify-around px-2 z-50">
      {items.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
