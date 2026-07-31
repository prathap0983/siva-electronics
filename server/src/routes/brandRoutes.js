import express from 'express';
import { getAllBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBrands);
router.post('/', requireAdmin, createBrand);
router.put('/:id', requireAdmin, updateBrand);
router.delete('/:id', requireAdmin, deleteBrand);

export default router;
