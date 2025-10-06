// server/routes/assetRoutes.js (COM ROTAS COMPLETAS DE CRUD SNAPSHOT)

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import { saveAssetSnapshots, getAssetSnapshots, deleteAssetSnapshot } from '../controllers/assetController.js'; 

const router = express.Router();

// Aplica o middleware 'protect' a todas as rotas neste roteador
// Todas as funções já garantem que req.user._id está presente.
router.use(protect); 

// Rota RAIZ (/) para GET e POST
// Endpoint: /api/assets
router.route('/')
    .get(getAssetSnapshots)      // CRUD: LISTAR / BUSCAR TODOS
    .post(saveAssetSnapshots);   // CRUD: CRIAR / ATUALIZAR em LOTE

// Rota PARAMETRIZADA (/:id) para DELETE
// Endpoint: /api/assets/:id
router.route('/:id')
    .delete(deleteAssetSnapshot); // CRUD: DELETAR por ID


export default router;