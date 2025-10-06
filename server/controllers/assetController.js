// server/controllers/assetController.js (VERSÃO FINAL E ESTÁVEL)

import AssetSnapshot from '../models/AssetSnapshot.js';
// 🚨 ESSENCIAL para a estabilidade do Express com Mongoose
import asyncHandler from 'express-async-handler'; 

// =========================================================
// ROTA: POST /api/assets (Criação/Atualização em Lote)
// =========================================================

/**
 * @desc    Adicionar ou Atualizar Registros de Ativos em LOTE (Upsert)
 * @route   POST /api/assets
 * @access  Private 
 */
const saveAssetSnapshots = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    const snapshotsData = req.body; 

    if (!snapshotsData || Object.keys(snapshotsData).length === 0) {
        res.status(400);
        throw new Error('Nenhum dado de snapshot enviado no corpo da requisição.');
    }

    const operations = [];

    // Lógica do bulkWrite (sua lógica original)
    for (const dateKey in snapshotsData) {
         const snapshotDate = new Date(dateKey + 'T00:00:00');
        const assetsArray = snapshotsData[dateKey];

        const newSnapshot = {
            user: userId,
            snapshotDate: snapshotDate,
            assets: assetsArray.map(asset => ({
                name: asset.nome,
                bruto: asset.bruto,
                liquido: asset.liquido
            }))
        };

        operations.push({
            updateOne: {
                filter: { user: userId, snapshotDate: snapshotDate },
                update: { $set: newSnapshot }, 
                upsert: true // Insere se não encontrar
            }
        });
    }

    const result = await AssetSnapshot.bulkWrite(operations);

    res.status(201).json({ 
        message: 'Registros de ativos salvos em lote com sucesso.', 
        summary: result 
    });
});

// =========================================================
// ROTA: GET /api/assets (Listagem)
// =========================================================

/**
 * @desc    Obter todos os Registros de Ativos de um usuário
 * @route   GET /api/assets
 * @access  Private 
 */
const getAssetSnapshots = asyncHandler(async (req, res) => {
    const snapshots = await AssetSnapshot.find({ user: req.user._id })
        .sort({ snapshotDate: 1 }); 
    res.json(snapshots);
});

// =========================================================
// ROTA: DELETE /api/assets/:id (Exclusão)
// =========================================================

/**
 * @desc    Deletar um Snapshot de Ativo específico
 * @route   DELETE /api/assets/:id
 * @access  Private 
 */
const deleteAssetSnapshot = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Garante que o usuário só possa deletar seus próprios snapshots
    const snapshot = await AssetSnapshot.findOneAndDelete({ 
        _id: id, 
        user: req.user._id 
    });

    if (!snapshot) {
        res.status(404);
        throw new Error('Snapshot não encontrado ou você não tem permissão para excluí-lo.');
    }

    res.status(200).json({ 
        message: 'Snapshot excluído com sucesso.', 
        id: id 
    });
});


export {
    saveAssetSnapshots,
    getAssetSnapshots,
    deleteAssetSnapshot 
};