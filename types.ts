
// Fix: Added missing screen names to Screen union and defined/exported SystemCategory, Module, and UserStatus types to resolve TypeScript errors across the application.

export type Screen = 
  | 'WELCOME' 
  | 'LOGIN' 
  | 'DASHBOARD' 
  | 'DIAGNOSIS' 
  | 'SETTINGS'
  | 'FORGOT_PASSWORD'
  | 'EXPLANATION'
  | 'WORKSHOP'
  | 'LEARNING'
  | 'ACHIEVEMENTS'
  | 'ADMIN'
  | 'CHECKOUT'
  | 'TEST';

export type UserStatus = 'pending' | 'approved' | 'blocked';

export type SystemCategory = 'MECANICA' | 'ELETRICA' | 'ELETRONICA';

export interface Module {
  id: string;
  title: string;
  desc: string;
  category: SystemCategory;
  level: string;
  videoUrl?: string;
  hasPdf?: boolean;
  unlocked?: boolean;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  status: UserStatus;
  level: string;
  xp: number;
  premium: boolean;
  garage: Vehicle[];
  activeVehicleId?: string;
}
