import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    name: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, required: true, index: 'text' },
    category: { type: String, required: true, lowercase: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: 'https://placehold.co/400' },
    attributes: { type: Map, of: String, default: {} },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
