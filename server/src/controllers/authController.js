import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Seller } from '../models/Seller.js';
import { Cart } from '../models/Cart.js';
import { ENV } from '../config/env.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, storeName, storeDescription } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const requestedRole = ['seller', 'customer'].includes(role) ? role : 'customer';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: requestedRole
    });

    // Auto-create cart for customers
    await Cart.create({ userId: user._id, items: [] });

    // If registered as seller, create pending seller record
    if (requestedRole === 'seller') {
      await Seller.create({
        userId: user._id,
        storeName: storeName || `${name}'s Store`,
        description: storeDescription || '',
        status: 'pending'
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or credentials' });
    }

    let sellerStatus = null;
    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user._id });
      sellerStatus = seller ? seller.status : null;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerStatus
      }
    });
  } catch (error) {
    next(error);
  }
};
