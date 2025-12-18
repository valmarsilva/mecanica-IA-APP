
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
// Fixed missing Hammer icon import
import { Menu, Bell, Hammer } from 'lucide-react';
import { Screen, UserProfile, Vehicle } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('WELCOME');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Carregar banco de dados e sessão
  useEffect(() => {
    const savedUsers = localStorage.getItem('oficina_ia_users');
    const sessionUser = localStorage.getItem('oficina_ia_session');
    
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    } else {
      const defaultAdmin: UserProfile = {
        id: 'admin-1',
        email: 'admin@oficina.ia',
        name: 'Administrador Master',
        role: 'admin',
        level: 'Especialista',
        xp: 5000,
        premium: true,
        garage: [],
      };
      setAllUsers([defaultAdmin]);
      localStorage.setItem('oficina_ia_users', JSON.stringify([defaultAdmin]));
    }

    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
      setCurrentScreen('DASHBOARD');
    }
  }, []);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('oficina_ia_session', JSON.stringify(user));
    navigate('DASHBOARD');
  };

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('oficina_ia_session', JSON.stringify(updatedUser));
    
    const updatedAllUsers = allUsers.map(u => u.id === currentUser.id ? updatedUser : u);
    setAllUsers(updatedAllUsers);
    localStorage.setItem('oficina_ia_users', JSON.stringify(updatedAllUsers));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('oficina_ia_session');
    navigate('WELCOME');
  };

  const activeVehicle = currentUser?.garage.find(v => v.id === currentUser.activeVehicleId);

  const renderScreen = () => {
    if (!currentUser && !['WELCOME', 'LOGIN', 'FORGOT_PASSWORD'].includes(currentScreen)) {
      return <WelcomeScreen onNavigate={navigate} />;
    }

    switch (currentScreen) {
      case 'WELCOME': return <WelcomeScreen onNavigate={navigate} />;
      case 'LOGIN': return <LoginScreen onNavigate={navigate} allUsers={allUsers} onLogin={handleLogin} onRegister={(u) => { setAllUsers([...allUsers, u]); handleLogin(u); }} />;
      case 'FORGOT_PASSWORD': return <ForgotPasswordScreen onNavigate={navigate} />;
      case 'DASHBOARD': return <DashboardScreen user={currentUser!} onNavigate={navigate} />;
      case 'DIAGNOSIS': return <DiagnosisScreen onNavigate={navigate} vehicle={activeVehicle} onSelectCode={(code) => { navigate('EXPLANATION'); }} />;
      case 'EXPLANATION': return <ExplanationScreen code="P0301" onNavigate={navigate} />;
      case 'WORKSHOP': return <WorkshopScreen onNavigate={navigate} onComplete={() => { handleUpdateUser({ xp: currentUser!.xp + 50 }); navigate('DASHBOARD'); }} />;
      case 'LEARNING': return <LearningScreen onNavigate={navigate} />;
      case 'ACHIEVEMENTS': return <AchievementsScreen user={currentUser!} onNavigate={navigate} />;
      case 'SETTINGS': return <SettingsScreen user={currentUser!} onNavigate={navigate} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      case 'ADMIN': return <AdminScreen onNavigate={navigate} allUsers={allUsers} />;
      case 'CHECKOUT': return <CheckoutScreen onNavigate={navigate} onPaymentSuccess={() => handleUpdateUser({ premium: true })} />;
      case 'TESTS': return <TestScreen onNavigate={navigate} />;
      default: return <WelcomeScreen onNavigate={navigate} />;
    }
  };

  const showNavAndHeader = !['WELCOME', 'LOGIN', 'FORGOT_PASSWORD', 'TESTS', 'ADMIN', 'CHECKOUT'].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 overflow-hidden relative border-x border-slate-800 shadow-2xl">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={navigate} 
        user={currentUser} 
        onLogout={handleLogout}
      />

      {/* Global Header */}
      {showNavAndHeader && currentUser && (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-40">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Hammer size={14} className="text-white" />
            </div>
            <span className="font-oswald text-lg text-white uppercase tracking-tighter">Oficina IA</span>
          </div>
          <button className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto ${showNavAndHeader ? 'pb-16' : ''}`}>
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      {showNavAndHeader && currentUser && (
        <Navigation 
          currentScreen={currentScreen} 
          onNavigate={navigate} 
        />
      )}
    </div>
  );
};

export default App;
