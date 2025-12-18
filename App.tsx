
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiagnosisScreen from './screens/DiagnosisScreen';
import ExplanationScreen from './screens/ExplanationScreen';
import WorkshopScreen from './screens/WorkshopScreen';
import LearningScreen from './screens/LearningScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import SettingsScreen from './screens/SettingsScreen';
import Navigation from './components/Navigation';
import { Screen, UserProfile, DiagnosticResult, Vehicle } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('WELCOME');
  const [user, setUser] = useState<UserProfile>({
    name: 'Valmar',
    level: 'Mecânico Aprendiz',
    xp: 450,
    premium: false,
    garage: [
      { id: '1', make: 'Volkswagen', model: 'Golf', year: '2018' },
      { id: '2', make: 'Honda', model: 'Civic', year: '2022' }
    ],
    activeVehicleId: '1'
  });
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const activeVehicle = user.garage.find(v => v.id === user.activeVehicleId);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'WELCOME':
        return <WelcomeScreen onNavigate={navigate} />;
      case 'LOGIN':
        return <LoginScreen onNavigate={navigate} />;
      case 'DASHBOARD':
        return <DashboardScreen user={user} onNavigate={navigate} />;
      case 'DIAGNOSIS':
        return <DiagnosisScreen 
          onNavigate={navigate} 
          vehicle={activeVehicle}
          onSelectCode={(code) => {
            setSelectedCode(code);
            navigate('EXPLANATION');
          }} 
        />;
      case 'EXPLANATION':
        return <ExplanationScreen code={selectedCode || 'P0301'} onNavigate={navigate} />;
      case 'WORKSHOP':
        return <WorkshopScreen 
          onNavigate={navigate} 
          currentCode={selectedCode || 'P0301'}
          onComplete={() => {
            handleUpdateUser({ xp: user.xp + 50 });
            navigate('DASHBOARD');
          }} 
        />;
      case 'LEARNING':
        return <LearningScreen onNavigate={navigate} />;
      case 'ACHIEVEMENTS':
        return <AchievementsScreen user={user} onNavigate={navigate} />;
      case 'SETTINGS':
        return <SettingsScreen user={user} onNavigate={navigate} onUpdateUser={handleUpdateUser} />;
      default:
        return <WelcomeScreen onNavigate={navigate} />;
    }
  };

  const showNav = !['WELCOME', 'LOGIN'].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 overflow-hidden relative border-x border-slate-800 shadow-2xl">
      <main className="flex-1 overflow-y-auto">
        {renderScreen()}
      </main>
      {showNav && (
        <Navigation 
          currentScreen={currentScreen} 
          onNavigate={navigate} 
        />
      )}
    </div>
  );
};

export default App;
