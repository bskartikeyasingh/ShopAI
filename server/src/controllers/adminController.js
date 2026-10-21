import { Seller } from '../models/Seller.js';
import { AuditEvent } from '../models/AuditEvent.js';
import { Order } from '../models/Order.js';

export const listSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(sellers);
  } catch (error) {
    next(error);
  }
};

export const updateSellerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid seller status provided' });
    }

    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });

    seller.status = status;
    await seller.save();

    await AuditEvent.create({
      actorId: req.user._id,
      action: `SELLER_STATUS_${status.toUpperCase()}`,
      targetType: 'Seller',
      targetId: seller._id,
      metadata: { newStatus: status }
    });

    res.json({ message: `Seller status updated to ${status}`, seller });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditEvent.find().populate('actorId', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
