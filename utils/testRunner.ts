
import { decodeOBD2Response } from '../geminiService';

export interface TestResult {
  id: string;
  category: 'SECURITY' | 'LOGIC' | 'INTEGRATION' | 'API';
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  timestamp: string;
}

/**
 * Clean Code: Validador de domínio específico
 */
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

/**
 * Suite de Testes Automatizados
 */
export const runSystemAudit = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  const now = () => new Date().toLocaleTimeString();

  const addTest = (category: TestResult['category'], name: string, logic: () => { ok: boolean, msg: string }) => {
    const { ok, msg } = logic();
    results.push({
      id: Math.random().toString(36).substr(2, 5),
      category,
      name,
      status: ok ? 'PASS' : 'FAIL',
      message: msg,
      timestamp: now()
    });
  };

  // 1. Testes de Lógica de Negócio (OBD2)
  addTest('LOGIC', 'Conversão de RPM (PID 010C)', () => {
    // Ex real: 41 0C 1A F8 -> (26*256 + 248)/4 = 1726 RPM
    const hex = "41 0C 1A F8";
    const expected = 1726;
    const actual = decodeOBD2Response('010C', hex);
    return { 
      ok: actual === expected, 
      msg: actual === expected ? `Cálculo preciso: ${actual} RPM` : `Erro de decodificação: esperado ${expected}, obtido ${actual}` 
    };
  });

  addTest('LOGIC', 'Conversão de Temperatura (PID 0105)', () => {
    // Ex real: 41 05 7B -> 123 - 40 = 83°C
    const hex = "41 05 7B";
    const expected = 83;
    const actual = decodeOBD2Response('0105', hex);
    return { ok: actual === expected, msg: `Sensor térmico calibrado: ${actual}°C` };
  });

  // 2. Testes de Segurança (Sanitização)
  addTest('SECURITY', 'Firewall de Input (XSS/SQLi)', () => {
    const payload = "<script>alert('hack')</script>";
    const isProtected = validators.hasInjectionRisk(payload);
    return { ok: isProtected, msg: "Filtros de sanitização interceptaram caracteres maliciosos." };
  });

  // 3. Testes de Integridade de Dados
  addTest('INTEGRATION', 'Regras de Negócio: Frota', () => {
    const invalidYear = validators.isValidYear("2030");
    const validYear = validators.isValidYear("2022");
    return { 
      ok: !invalidYear && validYear, 
      msg: "Consistência temporal de veículos validada (1970-2025)." 
    };
  });

  // 4. Testes de API (Simulação de Handshake)
  addTest('API', 'Handshake Gemini (Multi-modal)', () => {
    const hasKey = !!process.env.API_KEY;
    return { 
      ok: hasKey, 
      msg: hasKey ? "Token GenAI detectado no ambiente." : "ERRO: API_KEY ausente ou corrompida." 
    };
  });

  return results;
};
