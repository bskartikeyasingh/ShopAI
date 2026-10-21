import express from 'express';
import { getCart, updateCartItem, clearCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/item', updateCartItem);
router.delete('/', clearCart);

export default router;
