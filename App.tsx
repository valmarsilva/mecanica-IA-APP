
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
import { Menu, Bell, Hammer } from 'lucide-react';
import { Screen, UserProfile, UserStatus, Module } from './types';

// Conteúdo inicial que será salvo no "Banco de Dados" (LocalStorage)
const INITIAL_MODULES: Module[] = [
  { id: '1', title: 'Manutenção de Injeção GDI', category: 'MECANICA', level: 'Técnico', unlocked: true, videoUrl: 'https://www.youtube.com/embed/vEwS_vH9G7o', desc: 'Guia completo sobre bicos injetores de alta pressão.', hasPdf: true, createdAt: new Date().toISOString() },
  { id: '2', title: 'Diagnóstico de Alternadores', category: 'ELETRICA', level: 'Técnico', unlocked: true, videoUrl: 'https://www.youtube.com/embed/v-T7tXU0tG4', desc: 'Como testar alternadores pilotados via PWM.', hasPdf: true, createdAt: new Date().toISOString() },
  { id: '3', title: 'Análise de Redes CAN', category: 'ELETRONICA', level: 'Expert', unlocked: true, videoUrl: 'https://www.youtube.com/embed/v7qH9Xv-M-E', desc: 'Osciloscópio aplicado ao diagnóstico de redes de dados.', hasPdf: true, createdAt: new Date().toISOString() },
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('WELCOME');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Sincronização com o "Banco de Dados" (LocalStorage para Hostinger)
    const savedUsers = localStorage.getItem('valtec_db_users');
    const savedModules = localStorage.getItem('valtec_db_modules');
    const sessionUser = localStorage.getItem('valtec_session');
    
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    } else {
      // Cria o administrador padrão no primeiro acesso
      const admin: UserProfile = {
        id: 'admin-master',
        email: 'admin@valtec.com',
        name: 'Administrador Valtec',
        role: 'admin',
        status: 'approved',
        level: 'Especialista Master',
        xp: 9999,
        premium: true,
        garage: [],
      };
      const initialUsers = [admin];
      setAllUsers(initialUsers);
      localStorage.setItem('valtec_db_users', JSON.stringify(initialUsers));
    }

    if (savedModules) {
      setModules(JSON.parse(savedModules));
    } else {
      setModules(INITIAL_MODULES);
      localStorage.setItem('valtec_db_modules', JSON.stringify(INITIAL_MODULES));
    }

    if (sessionUser) {
      const parsedSession = JSON.parse(sessionUser);
      // Verifica se o usuário ainda é válido e aprovado
      const usersList = JSON.parse(localStorage.getItem('valtec_db_users') || '[]');
      const user = usersList.find((u: UserProfile) => u.id === parsedSession.id);
      if (user && user.status === 'approved') {
        setCurrentUser(user);
        setCurrentScreen('DASHBOARD');
      }
    }
  }, []);

  const handleUpdateModules = (newModules: Module[]) => {
    setModules(newModules);
    localStorage.setItem('valtec_db_modules', JSON.stringify(newModules));
  };

  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    const updatedUsers = allUsers.map(u => u.id === userId ? { ...u, status } : u);
    setAllUsers(updatedUsers);
    localStorage.setItem('valtec_db_users', JSON.stringify(updatedUsers));
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
