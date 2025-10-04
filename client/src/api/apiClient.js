import axios from 'axios';

// 1. Cria uma instância base do Axios
const apiClient = axios.create({
    // Define a URL base do seu backend Express
    // O frontend (React) rodará na porta 5173 (ou similar), o backend na 5000
    baseURL: 'http://localhost:5000/api', 
    // Garante que cookies e credenciais sejam enviados, importante para CORS
    withCredentials: true, 
});

// 2. Interceptor de Requisições (Onde a mágica do JWT acontece)
apiClient.interceptors.request.use(
    (config) => {
        // Tenta pegar o token do Local Storage
        const token = localStorage.getItem('token'); 

        // Se houver um token, anexa-o ao cabeçalho Authorization
        if (token) {
            // O formato deve ser "Bearer <token>" para o middleware 'protect' funcionar
            config.headers.Authorization = `Bearer ${token}`; 
        }

        return config;
    },
    (error) => {
        // Trata erros de requisição
        return Promise.reject(error);
    }
);

// 3. Interceptor de Respostas (Útil para logout automático, por exemplo)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Se o servidor retornar 401 (Não Autorizado), é um bom lugar para deslogar
        if (error.response && error.response.status === 401) {
            console.log('Token expirado ou inválido. Deslogando...');
            // Exemplo de como deslogar (remover token e redirecionar)
            // localStorage.removeItem('token');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;