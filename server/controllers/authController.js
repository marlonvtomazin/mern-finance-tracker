// server/controllers/authController.js

import User from '../models/User.js'; // Importa o modelo de usuário
import generateToken from '../utils/generateToken.js'; // Importa nosso gerador de token

/**
 * @desc    Registrar um novo usuário (Endpoint: POST /api/auth/register)
 * @access  Public
 */
const registerUser = async (req, res) => {
    // 1. Obtém name, email e password do corpo da requisição (JSON)
    const { name, email, password } = req.body;

    try {
        // 2. Verifica se o email já está em uso (o Mongoose busca na collection 'users')
        const userExists = await User.findOne({ email });

        if (userExists) {
            // Se existir, retorna erro 400 (Bad Request)
            return res.status(400).json({ message: 'Usuário já existe. Por favor, faça login.' });
        }

        // 3. Cria novo usuário
        // O middleware 'pre-save' no modelo User criptografa a senha antes de salvar.
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // 4. Responde com status 201 (Created) e o token
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                // Envia o JWT para o cliente, mantendo-o logado
                token: generateToken(user._id), 
            });
        } else {
            res.status(400).json({ message: 'Dados inválidos do usuário.' });
        }

    } catch (error) {
        console.error('Erro no Registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

export {
    registerUser
};