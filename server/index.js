// server/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Importa a função de conexão
import authRoutes from './routes/authRoutes.js'; // NOVO: Importa as rotas de autenticação

// 1. Carrega as variáveis de ambiente
dotenv.config();

// 2. Inicia a conexão com o banco
connectDB(); 

const app = express();

// Middlewares GLOBAIS
app.use(express.json()); 
app.use(cors());         

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

// ----------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR EXPRESS
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});