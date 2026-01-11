
/**
 * API Service - Oficina IA Valtec
 * Este serviço gerencia a persistência entre LocalStorage e Cloud.
 */

// Usamos HTTPS para evitar bloqueios de conteúdo misto em deploy
const BASE_URL = 'https://api.valtec.ia/v1'; 

const fetchWithTimeout = async (url: string, options: any = {}, timeout = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
};

export const ValtecAPI = {
  async getModules() {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/modules/`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (e) {
      // Fallback imediato para LocalStorage se a nuvem falhar
      return JSON.parse(localStorage.getItem('valtec_db_modules') || '[]');
    }
  },

  async saveModule(moduleData: any) {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/modules/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      });
      return await response.json();
    } catch (e) {
      const modules = JSON.parse(localStorage.getItem('valtec_db_modules') || '[]');
      const index = modules.findIndex((m: any) => m.id === moduleData.id);
      if (index > -1) modules[index] = moduleData;
      else modules.push(moduleData);
      localStorage.setItem('valtec_db_modules', JSON.stringify(modules));
      return moduleData;
    }
  },

  async deleteModule(id: string) {
    try {
      await fetchWithTimeout(`${BASE_URL}/modules/${id}/`, { method: 'DELETE' });
    } catch (e) {
      const modules = JSON.parse(localStorage.getItem('valtec_db_modules') || '[]');
      const filtered = modules.filter((m: any) => m.id !== id);
      localStorage.setItem('valtec_db_modules', JSON.stringify(filtered));
    }
  },

  async getUsers() {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/users/`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (e) {
      const localUsers = JSON.parse(localStorage.getItem('valtec_db_users') || '[]');
      
      if (localUsers.length === 0) {
        const masterAdmin = {
          id: 'master-admin',
          email: 'admin@valtec.ia',
          name: 'Administrador Valtec',
          role: 'admin' as const,
          status: 'approved' as const,
          level: 'Master Tech AI',
          xp: 9999,
          premium: true,
          garage: []
        };
        localStorage.setItem('valtec_db_users', JSON.stringify([masterAdmin]));
        return [masterAdmin];
      }
      return localUsers;
    }
  },

  async updateStatus(userId: string, status: string) {
    try {
      await fetchWithTimeout(`${BASE_URL}/users/${userId}/status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      const users = JSON.parse(localStorage.getItem('valtec_db_users') || '[]');
      const updated = users.map((u: any) => u.id === userId ? { ...u, status } : u);
      localStorage.setItem('valtec_db_users', JSON.stringify(updated));
    }
  }
};

export const sendRecoveryEmail = async (email: string) => {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/recover-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await response.json();
  } catch (e) {
    throw new Error('SERVER_OFFLINE');
  }
};

export const SERVER_SNIPPET = `
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def recover_password(request):
    email = request.data.get('email')
    send_mail(
        'Recuperação de Senha - Oficina IA',
        'Use este link para resetar sua senha...',
        'suporte@valtec.ia',
        [email],
        fail_silently=False,
    )
    return Response({"status": "sent"})
`;
