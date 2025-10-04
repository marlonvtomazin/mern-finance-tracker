// server/controllers/assetController.js

import AssetSnapshot from '../models/AssetSnapshot.js';

/**
 * @desc    Adicionar ou Atualizar Registros de Ativos
 * @route   POST /api/assets
 * @access  Private (Requer token JWT)
 * * Esta função é projetada para receber o seu formato de dados JSON 
 * (com a data como chave) e converter para o formato do Mongoose.
 */
const saveAssetSnapshots = async (req, res) => {
    // O ID do usuário logado é anexado pelo middleware 'protect'
    const userId = req.user._id; 
    // O corpo da requisição é o JSON no formato { "data_chave": [ { ativos } ] }
    const snapshotsData = req.body; 

    try {
        const operations = [];

        // Itera sobre cada chave de data no JSON recebido
        for (const dateKey in snapshotsData) {
            // Converte a chave (ex: "10-16-2024") para um objeto Date
            const snapshotDate = new Date(dateKey);
            const assetsArray = snapshotsData[dateKey];

            // Cria o objeto que o Mongoose espera
            const newSnapshot = {
                user: userId,
                snapshotDate: snapshotDate,
                assets: assetsArray.map(asset => ({
                    name: asset.nome,
                    bruto: asset.bruto,
                    liquido: asset.liquido
                }))
            };

            // Prepara a operação de upsert:
            // 1. Busca um documento existente com a mesma data e usuário.
            // 2. Se encontrar, atualiza-o (com a nova lista de ativos).
            // 3. Se não encontrar, insere-o.
            operations.push({
                updateOne: {
                    filter: { user: userId, snapshotDate: snapshotDate },
                    update: { $set: newSnapshot },
                    upsert: true // Insere se não encontrar
                }
            });
        }

        // Executa todas as operações em lote
        const result = await AssetSnapshot.bulkWrite(operations);

        res.status(201).json({ 
            message: 'Registros de ativos salvos com sucesso.', 
            summary: result 
        });

    } catch (error) {
        console.error('Erro ao salvar snapshots de ativos:', error);
        res.status(500).json({ message: 'Erro interno ao processar os ativos.', error: error.message });
    }
};

/**
 * @desc    Obter todos os Registros de Ativos de um usuário
 * @route   GET /api/assets
 * @access  Private (Requer token JWT)
 */
const getAssetSnapshots = async (req, res) => {
    // O Middleware 'protect' garante que apenas os ativos do usuário logado sejam buscados.
    const snapshots = await AssetSnapshot.find({ user: req.user._id })
        .sort({ snapshotDate: 1 }); // Ordena por data (o mais antigo primeiro)

    res.json(snapshots);
};

export {
    saveAssetSnapshots,
    getAssetSnapshots
};