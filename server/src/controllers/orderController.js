import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Seller } from '../models/Seller.js';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';

export const checkoutOrder = async (req, res, next) => {
  const { items, shippingAddress } = req.body;
  const customerId = req.user._id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart items cannot be empty.' });
  }

  // Normalize shipping address
  const normalizedShippingAddress = {
    street: shippingAddress?.street || '123 Tech Park Ave',
    city: shippingAddress?.city || 'Guntur',
    state: shippingAddress?.state || 'AP',
    zipCode: shippingAddress?.zipCode || shippingAddress?.postalCode || '522001',
    country: shippingAddress?.country || 'India'
  };

  // 1. Group items by vendor/seller and validate upfront
  const itemsBySeller = {};
  for (const item of items) {
    const pId = item._id || item.id || item.productId;
    const product = await Product.findById(pId);
    if (!product || !product.active) {
      return res.status(400).json({ message: `Product "${item.name || item.nameSnapshot || pId}" is not available.` });
    }
    const requestedQty = Number(item.quantity || 1);
    if (product.stock < requestedQty) {
      return res.status(400).json({
        message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${requestedQty}`
      });
    }

    const sellerKey = product.sellerId.toString();
    if (!itemsBySeller[sellerKey]) itemsBySeller[sellerKey] = [];
    itemsBySeller[sellerKey].push({
      product,
      quantity: requestedQty,
      unitPrice: Number(product.price)
    });
  }

  // 2. Calculate grand total and prepare sub-orders
  let grandTotal = 0;
  const subOrders = [];

  for (const sellerId in itemsBySeller) {
    const sellerLines = itemsBySeller[sellerId];
    const sellerDoc = await Seller.findById(sellerId);
    const commissionRate = sellerDoc ? (sellerDoc.commissionRate || 0.10) : 0.10;

    let subTotal = 0;
    const lineItems = [];
    for (const line of sellerLines) {
      const lineTotal = line.unitPrice * line.quantity;
      subTotal += lineTotal;
      grandTotal += lineTotal;
      lineItems.push({
        productId: line.product._id,
        sellerId: line.product.sellerId,
        nameSnapshot: line.product.name,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
        itemTotal: lineTotal
      });
    }

    const platformFee = Number((subTotal * commissionRate).toFixed(2));
    const sellerPayout = Number((subTotal - platformFee).toFixed(2));

    subOrders.push({
      sellerId,
      items: lineItems,
      subtotal: subTotal,
      platformFee,
      sellerPayout,
      fulfillmentStatus: 'processing'
    });
  }

  // 3. Attempt Replica Set Transaction; fall back to Atomic Operations on Standalone MongoDB
  let session = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    useTransaction = true;
  } catch (sessErr) {
    session = null;
    useTransaction = false;
  }

  if (useTransaction && session) {
    try {
      // Decrement stock in transaction
      for (const sellerId in itemsBySeller) {
        for (const line of itemsBySeller[sellerId]) {
          const updated = await Product.findOneAndUpdate(
            { _id: line.product._id, stock: { $gte: line.quantity } },
            { $inc: { stock: -line.quantity } },
            { session, new: true }
          );
          if (!updated) {
            throw new Error(`Insufficient stock for "${line.product.name}".`);
          }
        }
      }

      const [createdOrder] = await Order.create(
        [
          {
            customerId,
            shippingAddress: normalizedShippingAddress,
            totalAmount: grandTotal,
            paymentStatus: 'paid',
            subOrders
          }
        ],
        { session }
      );

      await Cart.findOneAndUpdate({ userId: customerId }, { $set: { items: [] } }, { session });
      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        message: 'Checkout successful! Multi-vendor sub-orders dispatched.',
        orderId: createdOrder._id,
        parentOrderId: createdOrder._id,
        totalAmount: grandTotal,
        subOrders: createdOrder.subOrders,
        subOrdersCount: createdOrder.subOrders.length,
        subOrdersCreated: createdOrder.subOrders.length,
        paymentStatus: createdOrder.paymentStatus || 'paid'
      });
    } catch (txErr) {
      if (session) {
        try { await session.abortTransaction(); } catch (_) {}
        session.endSession();
      }

      const isReplicaSetError = txErr.message && txErr.message.includes('replica set member or mongos');
      if (!isReplicaSetError) {
        return res.status(400).json({ message: txErr.message || 'Checkout failed.' });
      }
      console.warn('[Checkout] Standalone MongoDB detected. Falling back to atomic conditional operations.');
    }
  }

  // 4. Standalone MongoDB Atomic Fallback Execution
  const decrementedProducts = [];
  try {
    for (const sellerId in itemsBySeller) {
      for (const line of itemsBySeller[sellerId]) {
        const updated = await Product.findOneAndUpdate(
          { _id: line.product._id, stock: { $gte: line.quantity } },
          { $inc: { stock: -line.quantity } },
          { new: true }
        );
        if (!updated) {
          throw new Error(`Stock conflict: "${line.product.name}" was purchased by another buyer.`);
        }
        decrementedProducts.push({ id: line.product._id, quantity: line.quantity });
      }
    }

    const createdOrder = await Order.create({
      customerId,
      shippingAddress: normalizedShippingAddress,
      totalAmount: grandTotal,
      paymentStatus: 'paid',
      subOrders
    });

    await Cart.findOneAndUpdate({ userId: customerId }, { $set: { items: [] } });

    return res.status(201).json({
      message: 'Checkout successful! Multi-vendor sub-orders dispatched.',
      orderId: createdOrder._id,
      parentOrderId: createdOrder._id,
      totalAmount: grandTotal,
      subOrders: createdOrder.subOrders,
      subOrdersCount: createdOrder.subOrders.length,
      subOrdersCreated: createdOrder.subOrders.length,
      paymentStatus: createdOrder.paymentStatus || 'paid'
    });
  } catch (fallbackErr) {
    // Rollback decremented stock if an error occurred while saving order
    for (const item of decrementedProducts) {
      try {
        await Product.findByIdAndUpdate(item.id, { $inc: { stock: item.quantity } });
      } catch (_) {}
    }
    console.error('Checkout atomic fallback error:', fallbackErr);
    return res.status(400).json({ message: fallbackErr.message || 'Checkout failed.' });
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export default { checkoutOrder, getMyOrders };
