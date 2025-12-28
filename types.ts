
export type Screen = 
  | 'WELCOME' 
  | 'LOGIN' 
  | 'DASHBOARD' 
  | 'DIAGNOSIS' 
  | 'EXPLANATION' 
  | 'WORKSHOP' 
  | 'LEARNING' 
  | 'ACHIEVEMENTS' 
  | 'SETTINGS'
  | 'TESTS'
  | 'ADMIN'
  | 'CHECKOUT'
  | 'FORGOT_PASSWORD';

export type SystemCategory = 'MECANICA' | 'ELETRICA' | 'ELETRONICA';

export interface Module {
  id: string;
  title: string;
  category: SystemCategory;
  level: 'Iniciante' | 'Técnico' | 'Avançado' | 'Expert' | 'Master';
  unlocked: boolean;
  videoUrl?: string; // Link do YouTube/Vimeo
  desc: string;     // Conteúdo técnico do "PDF"
  hasPdf: boolean;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  engine?: string;
  fuel?: string;
}

export type UserRole = 'user' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  level: string;
  xp: number;
  premium: boolean;
  garage: Vehicle[];
  activeVehicleId?: string;
}
