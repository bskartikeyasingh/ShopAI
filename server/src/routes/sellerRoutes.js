import express from 'express';
import {
  getSellerProducts,
  getSellerProfile,
  autoApproveSeller,
  createProduct,
  updateProduct,
  getSellerOrders,
  updateSubOrderStatus
} from '../controllers/sellerController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize('seller'));

router.get('/products', getSellerProducts);
router.get('/profile', getSellerProfile);
router.post('/auto-approve', autoApproveSeller);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.patch('/products/:id', updateProduct);
router.get('/orders', getSellerOrders);
router.patch('/orders/:subOrderId/status', updateSubOrderStatus);
router.put('/orders/:subOrderId/status', updateSubOrderStatus);

export default router;
