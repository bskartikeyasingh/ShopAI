import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    storeName: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
      index: true
    },
    commissionRate: { type: Number, default: 0.10 }, // 10% platform fee
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    totalSales: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Seller = mongoose.model('Seller', sellerSchema);
