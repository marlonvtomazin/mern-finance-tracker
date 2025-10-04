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

const loginUser = async (req, res) => {
    // 1. Obter email e senha
    const { email, password } = req.body;

    try {
        // 2. Encontrar o usuário pelo email, forçando a inclusão do campo 'password'
        const user = await User.findOne({ email }).select('+password'); 

        // 3. Verificar se o usuário existe E se a senha fornecida corresponde
        if (user && await user.matchPassword(password)) {
            
            // 4. Login bem-sucedido: retorna os dados e um novo Token JWT
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,           
                token: generateToken(user._id),
            });
            
        } else {
            // 5. Falha na autenticação
            res.status(401).json({ message: 'Credenciais inválidas.' });
        }

    } catch (error) {
        console.error('Erro no Login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

const logoutUser = (req, res) => {
    // Para JWT, o logout é puramente no cliente (removendo o token).
    // Aqui, podemos limpar um cookie se estivéssemos usando-o,
    // mas para JWT no Local Storage, apenas enviamos uma resposta de sucesso.
    res.status(200).json({ message: 'Logout bem-sucedido. Token deve ser removido pelo cliente.' });
};

export {
    registerUser,
    loginUser,
    logoutUser,
};