import { Product } from '../models/Product.js';
import { Seller } from '../models/Seller.js';
import { Order } from '../models/Order.js';

export const getSellerProfile = async (req, res, next) => {
  try {
    let seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      // Auto-provision and auto-approve for seamless testing
      seller = await Seller.create({
        userId: req.user._id,
        storeName: `${req.user.name}'s Store`,
        description: 'Independent marketplace vendor',
        status: 'approved'
      });
    } else if (seller.status === 'pending') {
      // Auto-approve in development
      seller.status = 'approved';
      await seller.save();
    }
    return res.json(seller);
  } catch (err) {
    next(err);
  }
};

export const autoApproveSeller = async (req, res, next) => {
  try {
    let seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      seller = await Seller.create({
        userId: req.user._id,
        storeName: `${req.user.name}'s Store`,
        description: 'Independent marketplace vendor',
        status: 'approved'
      });
    } else {
      seller.status = 'approved';
      await seller.save();
    }
    return res.json({ message: 'Seller approved successfully!', seller });
  } catch (err) {
    next(err);
  }
};

export const getSellerProducts = async (req, res, next) => {
  try {
    let seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      seller = await Seller.create({
        userId: req.user._id,
        storeName: `${req.user.name}'s Store`,
        status: 'approved'
      });
    }
    const products = await Product.find({ sellerId: seller._id }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    let seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      seller = await Seller.create({
        userId: req.user._id,
        storeName: `${req.user.name}'s Store`,
        status: 'approved'
      });
    } else if (seller.status !== 'approved') {
      // Auto-approve so demo listings work instantly
      seller.status = 'approved';
      await seller.save();
    }

    const { name, description, category, price, stock, imageUrl, attributes } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Product Name, Price, and Stock are required.' });
    }

    const product = new Product({
      sellerId: seller._id,
      name,
      description: description || 'High-quality marketplace product.',
      category: (category || 'general').toLowerCase(),
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      attributes: attributes || {},
      active: true
    });

    await product.save();
    return res.status(201).json({ message: 'Product published successfully!', product, ...product.toObject() });
  } catch (err) {
    console.error('Create product error:', err);
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });

    const product = await Product.findOne({ _id: req.params.id, sellerId: seller._id });
    if (!product) {
      return res.status(404).json({ error: 'Product listing not found or not owned by seller' });
    }

    const updates = ['name', 'description', 'category', 'price', 'stock', 'imageUrl', 'active'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    await product.save();
    return res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) return res.json([]);

    const orders = await Order.find({ 'subOrders.sellerId': seller._id })
      .select('shippingAddress totalAmount createdAt subOrders')
      .sort({ createdAt: -1 });

    const sellerSpecificOrders = [];
    orders.forEach((order) => {
      order.subOrders
        .filter((so) => so.sellerId.toString() === seller._id.toString())
        .forEach((so) => {
          sellerSpecificOrders.push({
            _id: so._id,
            orderId: order._id,
            createdAt: order.createdAt,
            shippingAddress: order.shippingAddress,
            items: so.items,
            subtotal: so.subtotal,
            platformFee: so.platformFee,
            sellerPayout: so.sellerPayout,
            fulfillmentStatus: so.fulfillmentStatus,
            status: so.fulfillmentStatus,
            subOrder: so
          });
        });
    });

    return res.json(sellerSpecificOrders);
  } catch (err) {
    next(err);
  }
};

export const updateSubOrderStatus = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });

    const { status } = req.body;
    const { subOrderId } = req.params;

    const order = await Order.findOne({
      'subOrders._id': subOrderId,
      'subOrders.sellerId': seller._id
    });

    if (!order) {
      return res.status(404).json({ error: 'Sub-order not found or unauthorized' });
    }

    const subOrder = order.subOrders.id(subOrderId);
    if (!subOrder) {
      return res.status(404).json({ error: 'Sub-order item not found' });
    }

    subOrder.fulfillmentStatus = status;
    await order.save();

    return res.json({ message: 'Sub-order status updated', subOrder });
  } catch (err) {
    next(err);
  }
};

export default {
  getSellerProducts,
  getSellerProfile,
  autoApproveSeller,
  createProduct,
  updateProduct,
  getSellerOrders,
  updateSubOrderStatus
};
