import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { autoSeedIfEmpty } from './utils/autoSeed.js';

const startServer = async () => {
  await connectDB();
  try {
    await autoSeedIfEmpty();
  } catch (err) {
    console.warn('[AutoSeed warning]:', err.message);
  }

  app.listen(ENV.PORT, () => {
    console.log(`[ShopAgent Server] running on http://localhost:${ENV.PORT}`);
  });
};

startServer();
