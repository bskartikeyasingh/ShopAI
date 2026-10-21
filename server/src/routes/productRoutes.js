import express from 'express';
import { getPublicProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getPublicProducts);
router.get('/:id', getProductById);

export default router;
