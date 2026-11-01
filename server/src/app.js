import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { seedDatabase } from './seed.js';

const app = express();

// Trust reverse proxy (Render, Cloudflare, Heroku) to fix express-rate-limit X-Forwarded-For error
app.set('trust proxy', 1);

const allowedOrigins = [
  ENV.FRONTEND_ORIGIN,
  'https://shopagent-client.onrender.com',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// Mount Endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ShopAgent Express Core' }));

// On-demand database seeding endpoint for demo & presentation setup
app.all('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase({ exitOnComplete: false });
    res.json({
      success: true,
      message: 'MongoDB successfully seeded with demo accounts and full product catalog!',
      ...result
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed database', detail: err.message });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorHandler);

export default app;
