// server/routes/assetRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import {saveAssetSnapshots, getAssetSnapshots } from '../controllers/assetController.js'; 

const router = express.Router();

// --------------------------------------------------------------------------
// TODAS estas rotas estão PROTEGIDAS pelo middleware 'protect'
// Apenas usuários que enviem um Token JWT válido no cabeçalho podem acessá-las
// --------------------------------------------------------------------------

// Rota para BUSCAR todos os snapshots de ativos do usuário logado
// Endpoint: GET /api/assets
router.route('/').get(protect, getAssetSnapshots);

// Rota para SALVAR/ATUALIZAR snapshots de ativos (recebe o JSON complexo)
// Endpoint: POST /api/assets
router.route('/').post(protect, saveAssetSnapshots);

export default router;