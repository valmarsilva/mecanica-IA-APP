
export type Screen = 
  | 'WELCOME' 
  | 'LOGIN' 
  | 'DASHBOARD' 
  | 'DIAGNOSIS' 
  | 'EXPLANATION' 
  | 'WORKSHOP' 
  | 'LEARNING' 
  | 'ACHIEVEMENTS' 
  | 'SETTINGS';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  engine?: string; // Ex: 1.6, 2.0 Turbo, 1.0 MPI
  fuel?: string;   // Ex: Flex, GNV, Diesel, Gasolina, Álcool
}

export interface DiagnosticResult {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface UserProfile {
  name: string;
  level: string;
  xp: number;
  premium: boolean;
  garage: Vehicle[];
  activeVehicleId?: string;
}
