import jwt from 'jsonwebtoken';

/**
 * Gera um token JWT (JSON Web Token) para autenticação.
 * O payload contém o ID do usuário.
 * @param {string} id - O ID do usuário (do MongoDB)
 * @returns {string} O token JWT gerado
 */
const generateToken = (id) => {
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    return jwt.sign(
        { id },
        process.env.JWT_SECRET, // 1. Chave Secreta
        { expiresIn: '1d' }     // 2. Opções (Expiração)
    );
};

export default generateToken;