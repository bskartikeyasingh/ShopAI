import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    nameSnapshot: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    itemTotal: { type: Number, required: true }
  },
  { _id: false }
);

const subOrderSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    items: [lineItemSchema],
    subtotal: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    sellerPayout: { type: Number, required: true },
    fulfillmentStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' }
    },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid' // Sandbox auto-settlement
    },
    subOrders: [subOrderSchema]
  },
  { timestamps: true }
);

export const SubOrder = mongoose.models.SubOrder || mongoose.model('SubOrder', subOrderSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

