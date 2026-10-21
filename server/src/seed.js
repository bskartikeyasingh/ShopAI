import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from './config/env.js';
import { User } from './models/User.js';
import { Seller } from './models/Seller.js';
import { Product } from './models/Product.js';
import { Cart } from './models/Cart.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB at:', ENV.MONGODB_URI);

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Seller.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({})
    ]);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password@123', salt);

    // 1. Create Admins
    const adminUser = await User.create({
      name: 'Platform Admin',
      email: 'admin@shopagent.com',
      passwordHash,
      role: 'admin'
    });

    // 2. Create Customers
    const customer1 = await User.create({
      name: 'Rahul Verma',
      email: 'customer@shopagent.com',
      passwordHash,
      role: 'customer'
    });
    await Cart.create({ userId: customer1._id, items: [] });

    const customer2 = await User.create({
      name: 'John Buyer',
      email: 'buyer@shopagent.com',
      passwordHash,
      role: 'customer'
    });
    await Cart.create({ userId: customer2._id, items: [] });

    // 3. Create Approved Sellers
    const sellerUser1 = await User.create({
      name: 'Ananya Sharma',
      email: 'techgear@shopagent.com',
      passwordHash,
      role: 'seller'
    });
    const seller1 = await Seller.create({
      userId: sellerUser1._id,
      storeName: 'TechGear Solutions',
      description: 'Laptops, coding accessories, and developer hardware',
      status: 'approved',
      commissionRate: 0.10,
      rating: 4.9
    });

    const sellerUser2 = await User.create({
      name: 'Vikram Patel',
      email: 'audiomaster@shopagent.com',
      passwordHash,
      role: 'seller'
    });
    const seller2 = await Seller.create({
      userId: sellerUser2._id,
      storeName: 'AudioMaster Electronics',
      description: 'High-fidelity headphones, microphones, and peripherals',
      status: 'approved',
      commissionRate: 0.12,
      rating: 4.8
    });

    // 4. Create 10 Diverse Seed Products across both vendors
    const products = [
      {
        sellerId: seller1._id,
        name: 'DevPro 14 Laptop (16GB RAM, 512GB SSD)',
        description: 'Ideal laptop for software development, React, and Python coding with Ryzen 7 compilation speed under 60000 budget.',
        category: 'laptops',
        price: 54999,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        attributes: { RAM: '16GB', Storage: '512GB SSD', Processor: 'Ryzen 7' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'ThinkPro Ultra 15 Laptop',
        description: 'Compact coding laptop under 60000 with 100% sRGB display and fast compilation power for developers.',
        category: 'laptops',
        price: 58999,
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        attributes: { RAM: '16GB', Storage: '1TB SSD', Processor: 'Core i5 13th Gen' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'UltraCode Mechanical Keyboard RGB',
        description: 'Hot-swappable tactile mechanical keyboard designed for programmers, typists, and developers.',
        category: 'accessories',
        price: 3499,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        attributes: { Switches: 'Brown Tactile', Backlight: 'RGB' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'Ergonomic Wireless Precision Mouse',
        description: 'High precision wireless mouse with 4000 DPI optical sensor, quiet clicks, and ergonomic thumb rest.',
        category: 'accessories',
        price: 1899,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        attributes: { Connectivity: '2.4GHz Wireless & Bluetooth', DPI: '4000' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'UltraWide 27-inch 4K Monitor',
        description: 'Crisp IPS display with 99% sRGB color accuracy and USB-C 65W charging pass-through for laptops.',
        category: 'electronics',
        price: 21999,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        attributes: { Resolution: '4K UHD', RefreshRate: '75Hz', Panel: 'IPS' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'NoiseCancel ANC Studio Headphones',
        description: 'Active noise cancelling over-ear headphones with 40-hour battery life and immersive acoustic tuning.',
        category: 'audio',
        price: 4999,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        attributes: { ANC: 'Yes', Battery: '40 hrs', Connectivity: 'Bluetooth 5.3' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'StudioStream USB Condenser Microphone',
        description: 'Plug-and-play cardioid studio condenser microphone for crystal clear meetings, podcasts, and streaming.',
        category: 'audio',
        price: 3499,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        attributes: { PolarPattern: 'Cardioid', Connection: 'USB-C' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'HD 1080p Pro Stream Webcam',
        description: 'Full HD video webcam with autofocus, dual noise-reducing stereo microphones, and privacy shutter.',
        category: 'accessories',
        price: 2799,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500',
        attributes: { Resolution: '1080p 60FPS', Mount: 'Universal Clip' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'Aluminum Laptop Cooling Stand',
        description: 'Ergonomic ventilated laptop stand crafted from anodized aluminum alloy with adjustable angles.',
        category: 'accessories',
        price: 1299,
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500',
        attributes: { Material: 'Aluminum', Compatibility: '10-17 inch laptops' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'Hi-Res Wireless Bluetooth Earbuds',
        description: 'Compact wireless earbuds with deep bass response, IPX5 water resistance, and 28-hour total playback.',
        category: 'audio',
        price: 2499,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        attributes: { WaterResistance: 'IPX5', BatteryLife: '28 hours' },
        active: true
      }
    ];

    await Product.insertMany(products);

    console.log('[Seed Complete] Database successfully seeded:');
    console.log('- Admin: admin@shopagent.com / Password@123');
    console.log('- Customer: customer@shopagent.com & buyer@shopagent.com / Password@123');
    console.log('- Sellers: techgear@shopagent.com & audiomaster@shopagent.com / Password@123');
    console.log(`- ${products.length} Active catalog products with verified specifications across multiple categories.`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
