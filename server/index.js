// server/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Importa a função de conexão
import authRoutes from './routes/authRoutes.js'; // NOVO: Importa as rotas de autenticação
import assetRoutes from './routes/assetRoutes.js'; 

// 1. Carrega as variáveis de ambiente
dotenv.config();

// 2. Inicia a conexão com o banco
connectDB(); 

const app = express();

// Middlewares GLOBAIS
app.use(express.json()); 

// 🚨 NOVO: Configuração do Middleware CORS
// Esta configuração diz ao navegador para permitir requisições vindas
// do seu frontend (http://localhost:5173).
const allowedOrigins = ['http://localhost:5173']; 
const corsOptions = {
    origin: (origin, callback) => {
        // Permite requisições sem 'origin' (ex: ferramentas como Postman)
        if (!origin || allowedOrigins.includes(origin)) { 
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Necessário para enviar cookies/headers de autenticação
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));      

// ----------------------------------------------------
// ROTAS DA API
// ----------------------------------------------------

/**
 * ROTA DE TESTE (ENDPOINT RAIZ)
 * Verifica se o servidor Express está ativo.
 */
app.get('/', (req, res) => {
    // Responde com uma mensagem simples.
    res.send('API Finance Tracker está online.');
});

// Conecta as rotas de autenticação, prefixando todas elas com /api/auth
// A rota completa para o registro agora é: POST /api/auth/register
app.use('/api/auth', authRoutes); 

// NOVO: Rotas de Ativos (Protegidas)
app.use('/api/assets', assetRoutes); // Conecte o roteador de ativos


// ----------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR EXPRESS
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});