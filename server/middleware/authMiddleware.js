// server/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware para proteger rotas.
 * Verifica se um token JWT válido foi fornecido no cabeçalho da requisição.
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Verificar se o token existe no cabeçalho
    // Esperamos o formato: Authorization: Bearer <TOKEN>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extrair o token (remove 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 3. Decodificar o token (Verificar a assinatura com o JWT_SECRET)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Buscar o usuário pelo ID do token
            // Usamos .select('-password') para garantir que a senha nunca seja anexada à requisição
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Se o usuário for encontrado, prosseguir para o próximo middleware/controlador
            next();
        } catch (error) {
            // Token inválido (expirado, modificado ou secret errado)
            console.error('Erro de Token Inválido:', error.message);
            return res.status(401).json({ message: 'Não autorizado, token falhou.' });
        }
    }

    // Se o token não foi encontrado no cabeçalho
    if (!token) {
        return res.status(401).json({ message: 'Não autorizado, nenhum token.' });
    }
};

/**
 * Middleware para restringir o acesso a administradores.
 * Deve ser usado APÓS o middleware 'protect'.
 */
const admin = (req, res, next) => {
    // req.user foi definido pelo middleware 'protect'
    if (req.user && req.user.role === 'admin') {
        next(); // Usuário é admin, pode prosseguir
    } else {
        // Usuário não é admin ou não tem role definida (embora deva ter 'user' por padrão)
        res.status(403).json({ message: 'Não autorizado como administrador.' });
    }
};


export { protect, admin };