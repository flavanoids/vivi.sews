import express from 'express';
import { 
  uploadFabricImage, 
  uploadProjectImage, 
  uploadPatternImage, 
  uploadImage, 
  deleteImage 
} from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All upload routes require authentication
router.use(authenticateToken);

// Upload routes
router.post('/fabric', uploadFabricImage, uploadImage);
router.post('/project', uploadProjectImage, uploadImage);
router.post('/pattern', uploadPatternImage, uploadImage);

// Delete file route
router.delete('/file', deleteImage);

export default router;
