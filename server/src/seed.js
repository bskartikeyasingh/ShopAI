import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from './config/env.js';
import { User } from './models/User.js';
import { Seller } from './models/Seller.js';
import { Product } from './models/Product.js';
import { Cart } from './models/Cart.js';
import { Order } from './models/Order.js';
import { AuditEvent } from './models/AuditEvent.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB at:', ENV.MONGODB_URI);

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Seller.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      AuditEvent.deleteMany({})
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

    const customer3 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@shopagent.com',
      passwordHash,
      role: 'customer'
    });
    await Cart.create({ userId: customer3._id, items: [] });

    // 3. Create Sellers
    // Seller 1: TechGear Solutions (Approved)
    const sellerUser1 = await User.create({
      name: 'Ananya Sharma',
      email: 'techgear@shopagent.com',
      passwordHash,
      role: 'seller'
    });
    const seller1 = await Seller.create({
      userId: sellerUser1._id,
      storeName: 'TechGear Solutions',
      description: 'High-performance laptops, compilation machines, and developer hardware peripherals.',
      status: 'approved',
      commissionRate: 0.10,
      rating: 4.9,
      totalSales: 164997
    });

    // Seller 2: AudioMaster Electronics (Approved)
    const sellerUser2 = await User.create({
      name: 'Vikram Patel',
      email: 'audiomaster@shopagent.com',
      passwordHash,
      role: 'seller'
    });
    const seller2 = await Seller.create({
      userId: sellerUser2._id,
      storeName: 'AudioMaster Electronics',
      description: 'High-fidelity acoustic headphones, podcast microphones, and professional audio interfaces.',
      status: 'approved',
      commissionRate: 0.12,
      rating: 4.8,
      totalSales: 89970
    });

    // Seller 3: Nordic Ergonomics (Approved)
    const sellerUser3 = await User.create({
      name: 'Freja Lindqvist',
      email: 'nordic@shopagent.com',
      passwordHash,
      role: 'seller'
    });
    const seller3 = await Seller.create({
      userId: sellerUser3._id,
      storeName: 'Nordic Ergonomics & Desks',
      description: 'Motorized sit-stand desks, lumbar-support task chairs, and minimalist sustainable workspaces.',
      status: 'approved',
      commissionRate: 0.08,
      rating: 4.95,
      totalSales: 245000
    });

    // Seller 4: CraftWorks Studio (Pending - to demonstrate Approval Workflow)
    const sellerUser4 = await User.create({
      name: 'Rohan Mehra',
      email: 'craftworks@shopagent.com',
      passwordHash,
      role: 'seller'
    });
    const seller4 = await Seller.create({
      userId: sellerUser4._id,
      storeName: 'CraftWorks Studio Keyboards',
      description: 'Handmade mechanical keycaps, brass switch plates, and custom coiled cables.',
      status: 'pending',
      commissionRate: 0.10,
      rating: 5.0,
      totalSales: 0
    });

    // 4. Create 16 Curated Seed Products with Realistic Proportions & Verified Specs
    const products = [
      {
        sellerId: seller1._id,
        name: 'DevPro 14 Coding Laptop (16GB RAM, 512GB SSD)',
        description: 'Engineered for software developers. Ryzen 7 7840HS processor, 16GB dual-channel DDR5, matte anti-glare screen under 60k budget.',
        category: 'laptops',
        price: 54999,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
        attributes: { RAM: '16GB DDR5', Storage: '512GB NVMe SSD', Processor: 'Ryzen 7 7840HS', Display: '14" FHD 100% sRGB' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'ThinkPro Ultra 15 High-Compiling Workstation',
        description: 'Flagship productivity ultrabook with Intel Core i7 13th Gen, 1TB high-speed PCIe 4.0 storage, and all-day 14-hour battery life.',
        category: 'laptops',
        price: 58999,
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        attributes: { RAM: '16GB DDR5', Storage: '1TB Gen4 SSD', Processor: 'Core i7-1360P', Battery: '75Wh 14hrs' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'UltraWide 27-inch 4K IPS Developer Monitor',
        description: 'Crisp IPS panel with 99% sRGB color calibration, USB-C single cable 65W charging pass-through, and eye-care low blue light.',
        category: 'electronics',
        price: 21999,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        attributes: { Resolution: '4K UHD (3840x2160)', RefreshRate: '75Hz', Panel: 'IPS Matte', Connectivity: 'USB-C 65W, HDMI 2.1' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'UltraCode Mechanical Keyboard RGB',
        description: 'Hot-swappable tactile Gateron Brown switches with double-shot PBT keycaps and sound-dampening silicone dampener.',
        category: 'accessories',
        price: 3499,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        attributes: { Switches: 'Gateron Brown Tactile', Keycaps: 'PBT Double-shot', Connectivity: 'Bluetooth 5.1 & Type-C' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'NoiseCancel ANC Studio Headphones',
        description: 'Hybrid active noise cancelling over-ear headphones with custom 40mm biocellulose drivers and 40-hour wireless playtime.',
        category: 'audio',
        price: 4999,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        attributes: { ANC: 'Hybrid Active -38dB', Battery: '40 hours playback', Codecs: 'LDAC, AAC, SBC' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'StudioStream USB Condenser Microphone',
        description: 'Cardioid studio condenser microphone with tap-to-mute sensor, built-in pop filter, and zero-latency headphone monitoring.',
        category: 'audio',
        price: 3499,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        attributes: { PolarPattern: 'Cardioid Studio', SampleRate: '192kHz/24bit', Interface: 'USB-C Digital' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'Hi-Res Wireless Bluetooth Earbuds',
        description: 'Compact true-wireless earbuds with dual dynamic drivers, IPX5 sweat resistance, and Qi wireless charging support.',
        category: 'audio',
        price: 2499,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
        attributes: { WaterResistance: 'IPX5 Rated', Battery: '7h earbuds + 21h case', Driver: '10mm Dynamic' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'Ergonomic Wireless Precision Mouse',
        description: 'Sculpted wireless mouse with 4000 DPI Darkfield optical sensor, hyper-fast scroll wheel, and whisper-quiet acoustic clicks.',
        category: 'accessories',
        price: 1899,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        attributes: { Sensor: '4000 DPI Optical', Connectivity: '2.4GHz Dongle & Multi-Bluetooth', Battery: '70 Days' },
        active: true
      },
      {
        sellerId: seller1._id,
        name: 'HD 1080p Pro Stream Webcam 60FPS',
        description: 'Full HD streaming camera with intelligent autofocus, dual noise-cancelling stereo microphones, and physical privacy shutter.',
        category: 'accessories',
        price: 2799,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
        attributes: { Video: '1080p 60FPS', FOV: '78-degree wide angle', Mounting: 'Universal Tripod Clip' },
        active: true
      },
      {
        sellerId: seller2._id,
        name: 'Aluminum Laptop Cooling Stand',
        description: 'Ergonomic ventilated laptop riser made of aerospace-grade CNC aluminum alloy with silicone protective padding.',
        category: 'accessories',
        price: 1299,
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
        attributes: { Material: 'Sandblasted Aluminum', Compatibility: '10 to 17.3 inch laptops', Elevation: '15cm eye-level' },
        active: true
      },
      {
        sellerId: seller3._id,
        name: 'Nordic Oak Motorized Standing Desk (140x70cm)',
        description: 'Dual-motor electric standing desk with solid oak finish, 4 memory height presets, anti-collision sensor, and integrated cable tray.',
        category: 'electronics',
        price: 28499,
        stock: 7,
        imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
        attributes: { Motors: 'Dual Whisper Motors', HeightRange: '68cm - 128cm', MaxLoad: '120kg', Surface: 'Eco FSC Oak' },
        active: true
      },
      {
        sellerId: seller3._id,
        name: 'LumbarPro Ergonomic Breathable Mesh Chair',
        description: 'Multi-adjustable lumbar support ergonomic desk chair with 3D armrests, synchronous recline tilt mechanism, and Korean mesh fabric.',
        category: 'accessories',
        price: 14999,
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1580481077195-c57409f40078?auto=format&fit=crop&w=800&q=80',
        attributes: { Mesh: 'Reinforced Breathable Mesh', Recline: '90-135 degrees lockable', WeightRating: '135kg' },
        active: true
      },
      {
        sellerId: seller3._id,
        name: 'Dual Monitor Gas Spring Arm Mount',
        description: 'Counterbalanced heavy-duty gas spring dual monitor mount with VESA 75/100 compatibility, 360 rotation, and cable routing channels.',
        category: 'accessories',
        price: 3899,
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
        attributes: { VESA: '75x75 & 100x100mm', MaxScreenSize: '32 inch per arm', LoadCapacity: '9kg each' },
        active: true
      },
      {
        sellerId: seller3._id,
        name: 'Felt & Natural Vegan Leather Desk Mat (90x40cm)',
        description: 'Dual-sided large workspace desk pad made from premium water-resistant vegan leather and soft natural felt backing.',
        category: 'accessories',
        price: 1499,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        attributes: { Dimensions: '90cm x 40cm', Thickness: '2.5mm', WaterResistant: 'Yes' },
        active: true
      },
      {
        sellerId: seller4._id,
        name: 'Artisan Keycap Set "Forest Moss" Cherry Profile',
        description: 'Thick PBT dye-sublimated keycaps with deep forest green and botanical accents, 138-key layout for standard ANSI mechanical boards.',
        category: 'accessories',
        price: 2199,
        stock: 16,
        imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
        attributes: { Profile: 'Cherry Profile', Material: '1.5mm PBT', Compatibility: 'MX Style Switches (60%, 65%, 75%, TKL)' },
        active: true
      },
      {
        sellerId: seller4._id,
        name: 'Custom Coiled Aviator USB-C Keyboard Cable',
        description: 'Double-sleeved coiled keyboard cable with detachable 4-pin metal aviator GX12 connector in forest green parashroud.',
        category: 'accessories',
        price: 1699,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        attributes: { Connector: 'GX12 Aviator 4-Pin', CoiledLength: '15cm', StraightLength: '120cm' },
        active: true
      }
    ];

    const insertedProducts = await Product.insertMany(products);

    // 5. Create Realistic Multi-Vendor Seed Orders
    // Demo Order 1: Split between TechGear and AudioMaster
    const order1 = await Order.create({
      customerId: customer1._id,
      shippingAddress: {
        street: '123 Tech Park Avenue, Flat 402',
        city: 'Guntur',
        state: 'Andhra Pradesh',
        zipCode: '522213',
        country: 'India'
      },
      totalAmount: 59998,
      paymentStatus: 'paid',
      subOrders: [
        {
          sellerId: seller1._id,
          items: [
            {
              productId: insertedProducts[0]._id,
              sellerId: seller1._id,
              nameSnapshot: insertedProducts[0].name,
              unitPrice: 54999,
              quantity: 1,
              itemTotal: 54999
            }
          ],
          subtotal: 54999,
          platformFee: 5499.9,
          sellerPayout: 49499.1,
          fulfillmentStatus: 'processing'
        },
        {
          sellerId: seller2._id,
          items: [
            {
              productId: insertedProducts[4]._id,
              sellerId: seller2._id,
              nameSnapshot: insertedProducts[4].name,
              unitPrice: 4999,
              quantity: 1,
              itemTotal: 4999
            }
          ],
          subtotal: 4999,
          platformFee: 599.88,
          sellerPayout: 4399.12,
          fulfillmentStatus: 'shipped'
        }
      ]
    });

    // Demo Order 2: Split between Nordic Ergonomics and AudioMaster
    const order2 = await Order.create({
      customerId: customer2._id,
      shippingAddress: {
        street: '74 Cyber City Boulevard',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500081',
        country: 'India'
      },
      totalAmount: 33498,
      paymentStatus: 'paid',
      subOrders: [
        {
          sellerId: seller3._id,
          items: [
            {
              productId: insertedProducts[10]._id,
              sellerId: seller3._id,
              nameSnapshot: insertedProducts[10].name,
              unitPrice: 28499,
              quantity: 1,
              itemTotal: 28499
            }
          ],
          subtotal: 28499,
          platformFee: 2279.92,
          sellerPayout: 26219.08,
          fulfillmentStatus: 'pending'
        },
        {
          sellerId: seller2._id,
          items: [
            {
              productId: insertedProducts[4]._id,
              sellerId: seller2._id,
              nameSnapshot: insertedProducts[4].name,
              unitPrice: 4999,
              quantity: 1,
              itemTotal: 4999
            }
          ],
          subtotal: 4999,
          platformFee: 599.88,
          sellerPayout: 4399.12,
          fulfillmentStatus: 'delivered'
        }
      ]
    });

    // 6. Seed Compliance Audit Events
    await AuditEvent.create([
      {
        actorId: adminUser._id,
        action: 'PLATFORM_INITIALIZATION',
        targetType: 'System',
        targetId: adminUser._id,
        metadata: { version: '2.0-forest', seedTimestamp: new Date().toISOString() }
      },
      {
        actorId: adminUser._id,
        action: 'SELLER_STATUS_APPROVED',
        targetType: 'Seller',
        targetId: seller1._id,
        metadata: { storeName: 'TechGear Solutions', commissionRate: 0.10 }
      },
      {
        actorId: adminUser._id,
        action: 'SELLER_STATUS_APPROVED',
        targetType: 'Seller',
        targetId: seller2._id,
        metadata: { storeName: 'AudioMaster Electronics', commissionRate: 0.12 }
      },
      {
        actorId: adminUser._id,
        action: 'SELLER_STATUS_APPROVED',
        targetType: 'Seller',
        targetId: seller3._id,
        metadata: { storeName: 'Nordic Ergonomics & Desks', commissionRate: 0.08 }
      },
      {
        actorId: customer1._id,
        action: 'ATOMIC_ORDER_CHECKOUT',
        targetType: 'Order',
        targetId: order1._id,
        metadata: { totalAmount: 59998, subOrdersCount: 2, escrowStatus: 'active' }
      },
      {
        actorId: customer2._id,
        action: 'ATOMIC_ORDER_CHECKOUT',
        targetType: 'Order',
        targetId: order2._id,
        metadata: { totalAmount: 33498, subOrdersCount: 2, escrowStatus: 'active' }
      }
    ]);

    console.log('\n======================================================');
    console.log('  SHOPAGENT SEED DATABASE COMPLETED SUCCESSFULLY');
    console.log('======================================================');
    console.log('\nDEMO CREDENTIALS:');
    console.log('  [Platform Admin]   admin@shopagent.com       / Password@123');
    console.log('  [Customer 1]       customer@shopagent.com    / Password@123 (Rahul Verma)');
    console.log('  [Customer 2]       buyer@shopagent.com       / Password@123 (John Buyer)');
    console.log('  [Customer 3]       sarah@shopagent.com       / Password@123 (Sarah Jenkins)');
    console.log('  [Seller 1 Approved] techgear@shopagent.com    / Password@123 (TechGear Solutions)');
    console.log('  [Seller 2 Approved] audiomaster@shopagent.com / Password@123 (AudioMaster Electronics)');
    console.log('  [Seller 3 Approved] nordic@shopagent.com      / Password@123 (Nordic Ergonomics & Desks)');
    console.log('  [Seller 4 Pending]  craftworks@shopagent.com  / Password@123 (CraftWorks Studio - for admin demo)');
    console.log(`\n  * Total Catalog Products Seeded: ${products.length}`);
    console.log(`  * Multi-Vendor Sub-Orders Pre-seeded: 4 sub-orders across 2 parent orders`);
    console.log(`  * Audit Trail Events Pre-seeded: 6 compliance events`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
