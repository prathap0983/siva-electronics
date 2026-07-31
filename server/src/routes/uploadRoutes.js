import express from 'express';
import { uploadImages } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Allow admins to upload multiple images concurrently
router.post('/', requireAdmin, upload.array('images', 10), uploadImages);

export default router;
