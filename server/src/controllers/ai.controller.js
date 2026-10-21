import { Product } from '../models/Product.js';
import { Seller } from '../models/Seller.js';
import { ENV } from '../config/env.js';

export const handleAIChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'A prompt or question is required.' });
    }

    const aiServiceUrl = ENV.AI_SERVICE_URL || 'http://localhost:8001';

    let aiData;
    try {
      const response = await fetch(`${aiServiceUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': ENV.AI_SERVICE_SECRET
        },
        body: JSON.stringify({
          message: message.trim(),
          role: req.user?.role || 'customer'
        })
      });

      if (!response.ok) {
        throw new Error(`AI service responded with status ${response.status}`);
      }
      aiData = await response.json();

      // Zero-hallucination verification against live MongoDB catalog
      if (aiData.products && aiData.products.length > 0) {
        const productIds = aiData.products.map(p => p._id || p.id).filter(Boolean);
        const liveProducts = await Product.find({ _id: { $in: productIds }, active: true, stock: { $gt: 0 } })
          .populate('sellerId', 'storeName');
        
        const liveProductMap = new Map();
        liveProducts.forEach(lp => {
          liveProductMap.set(lp._id.toString(), lp);
        });

        const verifiedProducts = [];
        for (const p of aiData.products) {
          const pid = (p._id || p.id)?.toString();
          const live = liveProductMap.get(pid);
          if (live) {
            verifiedProducts.push({
              _id: live._id.toString(),
              id: live._id.toString(),
              name: live.name,
              price: live.price,
              category: live.category,
              stock: live.stock,
              imageUrl: live.imageUrl,
              description: live.description,
              sellerName: live.sellerId?.storeName || p.sellerName || 'Verified Merchant',
              reasons: p.reasons || ['Grounded in active MongoDB catalog']
            });
          }
        }

        aiData.products = verifiedProducts;

        if (verifiedProducts.length > 1) {
          aiData.bundleAction = {
            type: 'ADD_BUNDLE',
            itemCount: verifiedProducts.length,
            totalPrice: verifiedProducts.reduce((sum, item) => sum + item.price, 0),
            productIds: verifiedProducts.map(item => item._id)
          };
        } else {
          aiData.bundleAction = null;
        }
      }
    } catch (serviceErr) {
      console.warn('[AI Gateway] AI Service unreachable, activating direct database fallback:', serviceErr.message);

      const keywords = message.split(' ').filter(w => w.length > 3);
      const query = keywords.length > 0 
        ? { name: { $regex: keywords.join('|'), $options: 'i' }, active: true, stock: { $gt: 0 } }
        : { active: true, stock: { $gt: 0 } };

      const fallbackProducts = await Product.find(query).limit(4).populate('sellerId', 'storeName');
      
      const formatted = fallbackProducts.map(p => ({
        _id: p._id.toString(),
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        category: p.category,
        stock: p.stock,
        imageUrl: p.imageUrl,
        description: p.description,
        sellerName: p.sellerId?.storeName || 'Verified Merchant',
        reasons: ['Grounded in active MongoDB catalog']
      }));

      aiData = {
        reply: `Here are matching verified items from our live catalog:`,
        products: formatted,
        bundleAction: formatted.length > 1 ? {
          type: 'ADD_BUNDLE',
          itemCount: formatted.length,
          totalPrice: formatted.reduce((sum, p) => sum + p.price, 0),
          productIds: formatted.map(p => p._id)
        } : null,
        agentsUsed: ['MongoCatalogFallback']
      };
    }

    res.json(aiData);
  } catch (err) {
    console.error('[AI Chat Error]:', err);
    res.status(500).json({ message: 'Internal error communicating with AI agent' });
  }
};
