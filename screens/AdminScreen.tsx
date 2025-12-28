
import React, { useState } from 'react';
import { Screen, UserProfile, UserStatus, Module, SystemCategory } from '../types';
import { getDetailedLesson } from '../geminiService';
import { 
  ArrowLeft, Users, Check, X, Search, Video, FileText, Plus, Trash2, 
  Edit3, Save, Globe, Database, UserCheck, UserMinus, LayoutDashboard,
  Cpu, Zap, BookOpen, Loader2, Sparkles, AlertCircle
} from 'lucide-react';

interface AdminScreenProps {
  onNavigate: (screen: Screen) => void;
  allUsers: UserProfile[];
  modules: Module[];
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  onUpdateModules: (modules: Module[]) => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onNavigate, allUsers, modules, onUpdateUserStatus, onUpdateModules }) => {
  const [tab, setTab] = useState<'USERS' | 'CMS'>('USERS');
  const [search, setSearch] = useState('');
  const [editingMod, setEditingMod] = useState<Partial<Module> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveModule = () => {
    if (!editingMod?.title) return;
    const isNew = !editingMod.id;
    const newMod = {
      ...editingMod,
      id: editingMod.id || Math.random().toString(36).substr(2, 9),
      createdAt: editingMod.createdAt || new Date().toISOString(),
    } as Module;

    const updated = isNew ? [...modules, newMod] : modules.map(m => m.id === newMod.id ? newMod : m);
    onUpdateModules(updated);
    setEditingMod(null);
  };

  const handleGenerateContent = async () => {
    if (!editingMod?.title) return;
    setIsGenerating(true);
    const content = await getDetailedLesson(editingMod.title);
    setEditingMod({ ...editingMod, desc: content });
    setIsGenerating(false);
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SETTINGS')} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-oswald text-white uppercase tracking-tight">Comando Valtec</h2>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Painel Administrativo v3.0</p>
          </div>
        </div>
      </header>

      <div className="flex bg-slate-900 border-b border-slate-800 shrink-0">
        <button 
          onClick={() => setTab('USERS')} 
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${tab === 'USERS' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'}`}
        >
          <Users size={14} /> Assinantes
        </button>
        <button 
          onClick={() => setTab('CMS')} 
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${tab === 'CMS' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'}`}
        >
          <BookOpen size={14} /> Aulas & CMS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {tab === 'USERS' ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Buscar por nome ou e-mail..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-blue-500 transition-all outline-none" 
              />
            </div>
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white leading-none">{user.name}</h4>
                      <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tight">{user.email}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${user.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {user.status === 'approved' ? 'ATIVO' : 'PENDENTE'}
                        </span>
                        {user.premium && <span className="bg-blue-500/10 text-blue-500 text-[7px] font-black px-1.5 py-0.5 rounded uppercase">PREMIUM</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.status === 'pending' ? (
                      <button 
                        onClick={() => onUpdateUserStatus(user.id, 'approved')} 
                        className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                        title="Aprovar Acesso"
                      >
                        <UserCheck size={16} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onUpdateUserStatus(user.id, 'blocked')} 
                        className="p-2.5 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        title="Bloquear Acesso"
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {editingMod ? (
              <div className="bg-slate-900 border-2 border-blue-500/30 p-6 rounded-[2.5rem] space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Injetar Novo Conteúdo</h3>
                  <button onClick={() => setEditingMod(null)} className="p-2 text-slate-500 hover:text-white"><X size={18} /></button>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Título da Aula Técnica</label>
                  <input value={editingMod.title} onChange={e => setEditingMod({...editingMod, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none" placeholder="Ex: Diagnóstico de ABS via Rede CAN" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Sistema</label>
                    <select value={editingMod.category} onChange={e => setEditingMod({...editingMod, category: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-black uppercase text-slate-400 outline-none">
                      <option value="MECANICA">Mecânica</option>
                      <option value="ELETRICA">Elétrica</option>
                      <option value="ELETRONICA">Eletrônica</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Nível</label>
                    <select value={editingMod.level} onChange={e => setEditingMod({...editingMod, level: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-black uppercase text-slate-400 outline-none">
                      <option value="Iniciante">Iniciante</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Avançado">Avançado</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Link de Vídeo (YouTube Embed)</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input value={editingMod.videoUrl} onChange={e => setEditingMod({...editingMod, videoUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none" placeholder="https://www.youtube.com/embed/..." />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Manual Técnico (Guia PDF)</label>
                    <button 
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !editingMod.title}
                      className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30"
                    >
                      {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} Gerar via IA
                    </button>
                  </div>
                  <textarea value={editingMod.desc} onChange={e => setEditingMod({...editingMod, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white min-h-[120px] outline-none font-mono" placeholder="Escreva os detalhes técnicos ou gere via IA..." />
                </div>

                <button onClick={handleSaveModule} className="w-full py-4 bg-blue-600 text-white font-black rounded-xl text-[10px] uppercase shadow-xl shadow-blue-600/30 active:scale-95 transition-all">
                  Sincronizar com a Academia Valtec
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pronto para Hostinger</h4>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Sincronização persistente via LocalDB</p>
                  </div>
                </div>

                <button onClick={() => setEditingMod({ title: '', category: 'MECANICA', level: 'Técnico', videoUrl: '', desc: '', hasPdf: true, unlocked: true })} className="w-full py-6 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-blue-500 hover:border-blue-500 transition-all group">
                  <div className="p-3 bg-slate-900 rounded-full group-hover:bg-blue-600/10 transition-all">
                    <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Criar Nova Aula Técnica</span>
                </button>

                <div className="space-y-3 pt-2">
                  <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Aulas Sincronizadas ({modules.length})</h3>
                  {modules.map(mod => (
                    <div key={mod.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`p-3 rounded-xl shrink-0 ${mod.category === 'MECANICA' ? 'bg-blue-500/10 text-blue-500' : mod.category === 'ELETRICA' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'}`}>
                          {mod.videoUrl ? <Video size={18} /> : <FileText size={18} />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white truncate">{mod.title}</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{mod.category} • {mod.level}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingMod(mod)} className="p-2 text-slate-500 hover:text-white transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => onUpdateModules(modules.filter(m => m.id !== mod.id))} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] shrink-0">
        <div className="flex items-center gap-2"><Database size={12} /><span>Cloud Persistence: Active</span></div>
        <div className="flex items-center gap-2 text-emerald-500"><Zap size={12} fill="currentColor" /><span>System Nominal</span></div>
      </footer>
    </div>
  );
};

export default AdminScreen;
