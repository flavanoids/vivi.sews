import express from 'express';
import {
  getFabrics,
  getFabric,
  createFabric,
  updateFabric,
  deleteFabric,
  togglePin,
  recordUsage,
  getUsageHistory
} from '../controllers/fabricController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All fabric routes require authentication
router.use(authenticateToken);

// Fabric CRUD operations
router.get('/', getFabrics);
router.get('/:id', getFabric);
router.post('/', createFabric);
router.put('/:id', updateFabric);
router.delete('/:id', deleteFabric);

// Fabric actions
router.patch('/:id/pin', togglePin);
router.post('/:fabricId/usage', recordUsage);

// Usage history
router.get('/usage/history', getUsageHistory);

export default router;
