import express from 'express';
import { checkoutOrder, getMyOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/checkout', checkoutOrder);
router.get('/my-orders', getMyOrders);

export default router;
