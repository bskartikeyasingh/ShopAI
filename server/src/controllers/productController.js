import { Product } from '../models/Product.js';
import { Seller } from '../models/Seller.js';
import { createProduct } from './sellerController.js';

export const getPublicProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, limit = 50, page = 1 } = req.query;

    const query = { active: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category.toLowerCase();
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('sellerId', 'storeName rating status')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Product.countDocuments(query)
    ]);

    // If caller requests flat array (e.g. some internal clients/tests) vs paginated object
    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'storeName rating description');
    if (!product || !product.active) {
      return res.status(404).json({ error: 'Product not found or currently unavailable', message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = getPublicProducts;
export { createProduct };

export default {
  getPublicProducts,
  getProducts,
  getProductById,
  createProduct
};
