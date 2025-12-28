
/**
 * API Service - Oficina IA
 * Centraliza a comunicação com o seu Back-end Django.
 */

// Em desenvolvimento local, o Django geralmente roda na porta 8000
const BASE_URL = 'http://127.0.0.1:8000/api'; 

export const sendRecoveryEmail = async (email: string) => {
  try {
    const response = await fetch(`${BASE_URL}/recuperar-senha/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Erro ao processar requisição no Django');
    }

    return data;
  } catch (error) {
    // Se for um erro de conexão (TypeError), o servidor provavelmente está offline
    if (error instanceof TypeError) {
      console.error("Servidor Django Offline em: " + BASE_URL);
      throw new Error("SERVER_OFFLINE");
    }
    throw error;
  }
};

/**
 * GUIA RÁPIDO PARA O DESENVOLVEDOR (DJANGO)
 * 
 * 1. Crie um projeto: django-admin startproject backend
 * 2. Crie um app: python manage.py startapp core
 * 3. No core/views.py, cole o snippet abaixo.
 */
export const DJANGO_SNIPPET = `
# views.py
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def recuperar_senha(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            # TODO: Validar se o usuário existe no seu banco de dados (User.objects.filter)
            
            send_mail(
                'Recuperação de Senha - Oficina IA',
                'Seu token de acesso é: IA-PRO-99',
                'seu-email@gmail.com',
                [email],
                fail_silently=False,
            )
            return JsonResponse({'status': 'success', 'msg': 'E-mail enviado com sucesso!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'msg': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'msg': 'Método não permitido'}, status=405)
`;

export const SERVER_SNIPPET = DJANGO_SNIPPET;
