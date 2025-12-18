
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

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  engine?: string;
  fuel?: string;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  level: string;
  xp: number;
  premium: boolean;
  garage: Vehicle[];
  activeVehicleId?: string;
}
