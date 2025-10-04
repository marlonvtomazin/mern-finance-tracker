// server/models/AssetSnapshot.js

import mongoose from 'mongoose';

// Define o esquema para um item de ativo individual (Reserva de emergência, Economias, etc.)
const AssetItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    bruto: {
        type: Number,
        required: true
    },
    liquido: {
        type: Number,
        required: true
    }
}, { _id: false }); // Usamos { _id: false } para que o Mongoose não crie um ID para cada subdocumento

// Define o esquema principal para o Snapshot do Patrimônio
const AssetSnapshotSchema = new mongoose.Schema({
    // Campo crucial para segurança: associa o snapshot ao seu proprietário.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    // A data em que o snapshot foi registrado.
    snapshotDate: {
        type: Date,
        required: true,
        unique: true, // Garante que só haja um snapshot por usuário por dia (ou por data, se quisermos ser mais precisos)
    },
    // O array que contém a lista de ativos para aquela data específica.
    assets: {
        type: [AssetItemSchema], // Um array de AssetItemSchema
        required: true,
    }
}, { timestamps: true });

export default mongoose.model('AssetSnapshot', AssetSnapshotSchema);