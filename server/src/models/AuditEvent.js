import mongoose from 'mongoose';

const auditEventSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true, index: true }, // e.g., SELLER_APPROVED, STOCK_UPDATE
    targetType: { type: String, required: true }, // Seller, Product, Order
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    metadata: { type: Object, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditEvent = mongoose.model('AuditEvent', auditEventSchema);
