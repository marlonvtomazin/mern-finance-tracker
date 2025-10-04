// server/routes/authRoutes.js

import express from 'express';
// Importamos a função de registro do nosso controlador
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js'; 

// Cria uma instância de Router para definir rotas
const router = express.Router();

// Define a rota POST para /register
// Esta rota chama a função registerUser
router.post('/register', registerUser);

// NOVO: Rota de Login
router.post('/login', loginUser); 

router.post('/logout', logoutUser);

export default router;