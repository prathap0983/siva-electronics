import express from 'express';
import { getAllGallery, createGallery, updateGallery, deleteGallery } from '../controllers/galleryController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGallery);
router.post('/', requireAdmin, createGallery);
router.put('/:id', requireAdmin, updateGallery);
router.delete('/:id', requireAdmin, deleteGallery);

export default router;
