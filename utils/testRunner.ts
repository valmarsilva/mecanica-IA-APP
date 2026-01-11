
import { decodeOBD2Response } from '../geminiService';

export interface TestResult {
  id: string;
  category: 'SECURITY' | 'LOGIC' | 'INTEGRATION' | 'API' | 'HARDWARE';
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  timestamp: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const validators = {
  isValidYear: (year: string): boolean => {
    const y = parseInt(year);
    return !isNaN(y) && y >= 1970 && y <= 2025 && year.length === 4;
  },
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  hasInjectionRisk: (input: string): boolean => {
    const malicious = /['";<>|]/;
    return malicious.test(input);
  }
};

export const runSystemAudit = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  const now = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });

  const addTest = (
    category: TestResult['category'], 
    name: string, 
    criticality: TestResult['criticality'],
    logic: () => { ok: boolean | 'warn', msg: string }
  ) => {
    try {
      const { ok, msg } = logic();
      results.push({
        id: Math.random().toString(36).substr(2, 5),
        category,
        name,
        status: ok === true ? 'PASS' : ok === 'warn' ? 'WARNING' : 'FAIL',
        message: msg,
        timestamp: now(),
        criticality
      });
    } catch (e) {
      results.push({
        id: 'err-' + Math.random(),
        category,
        name,
        status: 'FAIL',
        message: "Erro de execução no teste.",
        timestamp: now(),
        criticality: 'HIGH'
      });
    }
  };

  addTest('LOGIC', 'Integridade RPM OBD2', 'HIGH', () => {
    const val = decodeOBD2Response('010C', '41 0C 1F 40'); // ~2000 RPM
    return { ok: val === 2000, msg: `Cálculo: ${val} RPM (Esperado: 2000)` };
  });

  addTest('LOGIC', 'Proteção Ano Veículo', 'MEDIUM', () => {
    const ok = !validators.isValidYear('1800') && validators.isValidYear('2024');
    return { ok, msg: "Validação de range temporal ativa (1970-2025)." };
  });

  addTest('SECURITY', 'Audit Sanitização Input', 'HIGH', () => {
    const risk = validators.hasInjectionRisk("<script>alert(1)</script>");
    return { ok: risk, msg: "Interceptador de XSS/Injeção funcionando." };
  });

  addTest('INTEGRATION', 'Sessão LocalStorage', 'HIGH', () => {
    localStorage.setItem('valtec_test', '1');
    const ok = localStorage.getItem('valtec_test') === '1';
    localStorage.removeItem('valtec_test');
    return { ok, msg: "Storage persistente disponível e gravável." };
  });

  addTest('HARDWARE', 'Interface Áudio Web', 'MEDIUM', () => {
    const hasAudio = !!(window.AudioContext || (window as any).webkitAudioContext);
    return { ok: hasAudio, msg: "Driver de som pronto para síntese TTS." };
  });

  return results;
};
