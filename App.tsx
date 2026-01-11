
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiagnosisScreen from './screens/DiagnosisScreen';
import ExplanationScreen from './screens/ExplanationScreen';
import WorkshopScreen from './screens/WorkshopScreen';
import LearningScreen from './screens/LearningScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import SettingsScreen from './screens/SettingsScreen';
import TestScreen from './screens/TestScreen';
import AdminScreen from './screens/AdminScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import { ValtecAPI } from './services/apiService';
import { Menu, Bell, Hammer, Loader2 } from 'lucide-react';
import { Screen, UserProfile, UserStatus, Module } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('WELCOME');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      setIsSyncing(true);
      
      // 1. Tenta carregar dados da "Nuvem" (API)
      const cloudModules = await ValtecAPI.getModules();
      const cloudUsers = await ValtecAPI.getUsers();
      
      setModules(cloudModules);
      setAllUsers(cloudUsers);

      // 2. Verifica Sessão
      const sessionUser = localStorage.getItem('valtec_session');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        const user = cloudUsers.find((u: UserProfile) => u.id === parsed.id);
        if (user && user.status === 'approved') {
          setCurrentUser(user);
          setCurrentScreen('DASHBOARD');
        }
      }
      
      setIsSyncing(false);
    };

    initApp();
  }, []);

  const handleUpdateModules = async (newModules: Module[]) => {
    setModules(newModules);
    // Aqui enviaríamos para a API o módulo específico alterado
    // Por simplicidade no protótipo, salvamos o lote no LocalStorage também
    localStorage.setItem('valtec_db_modules', JSON.stringify(newModules));
  };

  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    await ValtecAPI.updateStatus(userId, status);
    const updatedUsers = allUsers.map(u => u.id === userId ? { ...u, status } : u);
    setAllUsers(updatedUsers);
  };

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('valtec_session', JSON.stringify(updatedUser));
    const updatedAllUsers = allUsers.map(u => u.id === currentUser.id ? updatedUser : u);
    setAllUsers(updatedAllUsers);
    localStorage.setItem('valtec_db_users', JSON.stringify(updatedAllUsers));
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('valtec_session', JSON.stringify(user));
    navigate('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('valtec_session');
    navigate('WELCOME');
  };

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  if (isSyncing) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Hammer size={40} className="text-blue-500 animate-bounce" />
          <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full"></div>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Sincronizando Valtec Cloud...</p>
      </div>
    );
  }

  const renderScreen = () => {
    if (!currentUser && !['WELCOME', 'LOGIN', 'FORGOT_PASSWORD'].includes(currentScreen)) {
      return <WelcomeScreen onNavigate={navigate} />;
    }
    
    switch (currentScreen) {
      case 'WELCOME': return <WelcomeScreen onNavigate={navigate} />;
      case 'LOGIN': return <LoginScreen onNavigate={navigate} allUsers={allUsers} onLogin={handleLogin} onRegister={(u) => {
        const newUsers = [...allUsers, u];
        setAllUsers(newUsers);
        localStorage.setItem('valtec_db_users', JSON.stringify(newUsers));
      }} />;
      case 'FORGOT_PASSWORD': return <ForgotPasswordScreen onNavigate={navigate} allUsers={allUsers} />;
      case 'DASHBOARD': return <DashboardScreen user={currentUser!} onNavigate={navigate} />;
      case 'DIAGNOSIS': return <DiagnosisScreen user={currentUser!} onNavigate={navigate} onSelectCode={() => navigate('EXPLANATION')} />;
      case 'EXPLANATION': return <ExplanationScreen code="P0301" onNavigate={navigate} />;
      case 'WORKSHOP': return <WorkshopScreen onNavigate={navigate} onComplete={() => navigate('DASHBOARD')} />;
      case 'LEARNING': return <LearningScreen onNavigate={navigate} modules={modules} />;
      case 'ACHIEVEMENTS': return <AchievementsScreen user={currentUser!} onNavigate={navigate} />;
      case 'SETTINGS': return <SettingsScreen user={currentUser!} onNavigate={navigate} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      case 'ADMIN': return <AdminScreen onNavigate={navigate} allUsers={allUsers} modules={modules} onUpdateUserStatus={handleUpdateUserStatus} onUpdateModules={handleUpdateModules} />;
      case 'CHECKOUT': return <CheckoutScreen onNavigate={navigate} onPaymentSuccess={() => handleUpdateUser({ premium: true })} />;
      case 'TESTS': return <TestScreen onNavigate={navigate} />;
      default: return <WelcomeScreen onNavigate={navigate} />;
    }
  };

  const showFrame = !['WELCOME', 'LOGIN', 'FORGOT_PASSWORD', 'ADMIN', 'TESTS'].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 overflow-hidden relative border-x border-slate-900 shadow-2xl font-inter">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={navigate} user={currentUser} onLogout={handleLogout} />
      
      {showFrame && currentUser && (
        <header className="h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"><Menu size={22} /></button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Hammer size={16} className="text-white" />
            </div>
            <span className="font-oswald text-sm text-white uppercase tracking-tighter">Valtec <span className="text-blue-500">IA</span></span>
          </div>
          <button className="p-2 -mr-2 text-slate-400 relative"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></button>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto ${showFrame ? 'pb-16' : ''}`}>
        {renderScreen()}
      </main>

      {showFrame && currentUser && <Navigation currentScreen={currentScreen} onNavigate={navigate} />}
    </div>
  );
};

export default App;
