import express from 'express';
import { getAllSpareParts, getSparePartById, createSparePart, updateSparePart, deleteSparePart } from '../controllers/sparePartController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllSpareParts);
router.get('/:id', getSparePartById);
router.post('/', requireAdmin, createSparePart);
router.put('/:id', requireAdmin, updateSparePart);
router.delete('/:id', requireAdmin, deleteSparePart);

export default router;
