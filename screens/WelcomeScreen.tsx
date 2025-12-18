
import React from 'react';
import { Screen } from '../types';
import { Wrench } from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-900">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-12">
          <Wrench size={48} className="text-white -rotate-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-oswald text-white uppercase tracking-tighter">Oficina IA</h1>
          <p className="text-slate-400 max-w-[240px] leading-relaxed">
            Aprenda mecânica com inteligência artificial e prática real.
          </p>
        </div>
      </div>

      <div className="w-full space-y-3 pb-8">
        <button 
          onClick={() => onNavigate('LOGIN')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          ENTRAR
        </button>
        <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]">
          CRIAR CONTA
        </button>
        <p className="text-center text-slate-500 text-sm pt-4">
          “Onde a tecnologia encontra a graxa”
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
