// server/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome é obrigatório'],
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true, // Garante que não haja emails duplicados
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        select: false, // Importante: Garante que a senha NÃO seja retornada nas consultas padrão
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Limita as opções para user ou admin
        default: 'user',        // O valor padrão para novos registros é 'user'
    }
}, { timestamps: true });

// Middleware Mongoose (Hook) para CRIPTOGRAFAR a senha antes de salvar
UserSchema.pre('save', async function(next) {
    // Só criptografa se a senha foi modificada ou é nova
    if (!this.isModified('password')) {
        return next();
    }

    // Gera um salt (semente aleatória)
    const salt = await bcrypt.genSalt(10);
    // Criptografa a senha usando o salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método que o Express usará para comparar a senha fornecida no login com a senha criptografada
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);