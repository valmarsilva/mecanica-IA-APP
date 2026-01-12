
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiagnosisScreen from './screens/DiagnosisScreen';
import SettingsScreen from './screens/SettingsScreen';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import { ValtecAPI } from './services/apiService';
import { Hammer, Bell, Menu } from 'lucide-react';
import { Screen, UserProfile } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('WELCOME');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const users = await ValtecAPI.getUsers();
      setAllUsers(users);
      const session = localStorage.getItem('valtec_session');
      if (session) {
        const parsed = JSON.parse(session);
        const user = users.find((u: UserProfile) => u.id === parsed.id);
        if (user && user.status === 'approved') {
          setCurrentUser(user);
          setCurrentScreen('DASHBOARD');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('valtec_session', JSON.stringify(updated));
    const db = allUsers.map(u => u.id === currentUser.id ? updated : u);
    setAllUsers(db);
    localStorage.setItem('valtec_db_users', JSON.stringify(db));
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('valtec_session', JSON.stringify(user));
    setCurrentScreen('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('valtec_session');
    setCurrentScreen('WELCOME');
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <Hammer className="text-blue-500 animate-bounce" size={40} />
    </div>
  );

  const renderScreen = () => {
    if (!currentUser && !['WELCOME', 'LOGIN', 'FORGOT_PASSWORD'].includes(currentScreen)) {
      return <WelcomeScreen onNavigate={setCurrentScreen} />;
    }
    switch (currentScreen) {
      case 'WELCOME': return <WelcomeScreen onNavigate={setCurrentScreen} />;
      case 'LOGIN': return <LoginScreen onNavigate={setCurrentScreen} allUsers={allUsers} onLogin={handleLogin} onRegister={(u) => setAllUsers([...allUsers, u])} />;
      case 'FORGOT_PASSWORD': return <ForgotPasswordScreen onNavigate={setCurrentScreen} allUsers={allUsers} />;
      case 'DASHBOARD': return <DashboardScreen user={currentUser!} onNavigate={setCurrentScreen} />;
      case 'DIAGNOSIS': return <DiagnosisScreen user={currentUser!} onNavigate={setCurrentScreen} onUpdateUser={handleUpdateUser} onSelectCode={() => {}} />;
      case 'SETTINGS': return <SettingsScreen user={currentUser!} onNavigate={setCurrentScreen} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      default: return <WelcomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  const showNav = !['WELCOME', 'LOGIN', 'FORGOT_PASSWORD'].includes(currentScreen) && currentUser;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 border-x border-slate-900 font-inter shadow-2xl overflow-hidden">
      {showNav && (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={setCurrentScreen} user={currentUser} onLogout={handleLogout} />
          <header className="h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-40">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 p-2 -ml-2"><Menu size={22} /></button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
                <Hammer size={16} className="text-white" />
              </div>
              <span className="font-oswald text-sm text-white uppercase font-bold tracking-tight">Oficina <span className="text-blue-500">IA</span></span>
            </div>
            <button className="text-slate-400 p-2 -mr-2"><Bell size={20} /></button>
          </header>
        </>
      )}
      <main className={`flex-1 overflow-y-auto ${showNav ? 'pb-16' : ''}`}>
        {renderScreen()}
      </main>
      {showNav && <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
    </div>
  );
};

export default App;
