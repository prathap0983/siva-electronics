import express from 'express';
import { getInventoryDashboard, adjustStock, getStockHistory } from '../controllers/inventoryController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAdmin); // Protect all inventory routes

router.get('/', getInventoryDashboard);
router.post('/:id/adjust', adjustStock);
router.get('/:id/history', getStockHistory);

export default router;
