import express from 'express';
import { listSellers, updateSellerStatus, getAuditLogs } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/sellers', listSellers);
router.put('/sellers/:id/status', updateSellerStatus);
router.patch('/sellers/:id/status', updateSellerStatus);
router.get('/audit-logs', getAuditLogs);

export default router;
