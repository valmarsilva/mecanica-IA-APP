
import React, { useState } from 'react';
import { Screen } from '../types';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, CheckCircle, Zap } from 'lucide-react';

interface CheckoutScreenProps {
  onNavigate: (screen: Screen) => void;
  onPaymentSuccess: () => void;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onNavigate, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      onPaymentSuccess();
    }, 2500);
  };

  if (done) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-xl shadow-emerald-500/20">
          <CheckCircle size={48} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-oswald text-white uppercase">Assinatura Ativa!</h2>
          <p className="text-slate-400 text-sm mt-2">Você agora é um Mecânico Premium. Todas as funcionalidades foram desbloqueadas.</p>
        </div>
        <button 
          onClick={() => onNavigate('DASHBOARD')}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl"
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-slate-900 h-full">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate('SETTINGS')} className="p-2 bg-slate-800 rounded-full text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-oswald text-white uppercase">Seja Premium</h2>
      </header>

      <div className="bg-blue-600 rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-blue-600/20">
        <div className="flex justify-between items-start">
          <Zap size={32} className="fill-white" />
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Anual</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Oficina IA Pro</h3>
          <p className="text-blue-100 text-sm">Acesso ilimitado, diagnósticos avançados e certificado de conclusão.</p>
        </div>
        <p className="text-3xl font-oswald">R$ 29,90 <span className="text-sm font-normal text-blue-200">/mês</span></p>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Dados do Cartão</label>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-4">
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input placeholder="0000 0000 0000 0000" className="w-full bg-transparent border-none text-white outline-none pl-10 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="MM/AA" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-white" />
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input placeholder="CVC" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium bg-slate-800/50 p-3 rounded-xl border border-slate-800">
        <ShieldCheck className="text-emerald-500" size={16} />
        Pagamento processado de forma segura via API Criptografada (Simulação)
      </div>

      <button 
        onClick={handlePay}
        disabled={loading}
        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : 'PAGAR AGORA'}
      </button>
    </div>
  );
};

export default CheckoutScreen;
