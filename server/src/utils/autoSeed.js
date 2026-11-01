import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { seedDatabase } from '../seed.js';

export const autoSeedIfEmpty = async () => {
  try {
    const [userCount, productCount] = await Promise.all([
      User.countDocuments({ role: 'admin' }),
      Product.countDocuments()
    ]);

    if (userCount === 0 || productCount === 0) {
      console.log('[AutoSeed] MongoDB appears unseeded or missing admin/products. Auto-seeding now...');
      await seedDatabase({ exitOnComplete: false });
      console.log('[AutoSeed] Auto-seeding completed successfully.');
    } else {
      console.log(`[AutoSeed] Verified existing MongoDB records: ${userCount} admin(s), ${productCount} product(s).`);
    }
  } catch (err) {
    console.error('[AutoSeed Error]:', err.message);
  }
};

export default autoSeedIfEmpty;
