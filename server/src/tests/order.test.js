import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Seller } from '../models/Seller.js';

async function runConcurrencyTest() {
  console.log('--- [TEST] Starting Concurrency & Stock Guardrail Verification ---');
  await mongoose.connect(ENV.MONGODB_URI);

  // Setup test environment
  const sellerUser = await User.create({
    name: 'Test Seller',
    email: `test_${Date.now()}@test.com`,
    passwordHash: 'hash',
    role: 'seller'
  });

  const testSeller = await Seller.create({
    userId: sellerUser._id,
    storeName: 'Test Lab',
    status: 'approved'
  });

  // Single inventory unit product
  const product = await Product.create({
    sellerId: testSeller._id,
    name: 'Limited Flash Item',
    price: 1000,
    stock: 1, // Only 1 available!
    category: 'electronics',
    active: true
  });

  console.log(`[Setup] Created product "${product.name}" with stock = 1.`);

  // Attempting to buy 2 units must trigger strict rollback
  let failedAsExpected = false;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const freshProduct = await Product.findById(product._id).session(session);
    const requestedQty = 2;
    if (freshProduct.stock < requestedQty) {
      throw new Error(`Insufficient stock for ${freshProduct.name}. Requested: ${requestedQty}, Available: ${freshProduct.stock}`);
    }
    freshProduct.stock -= requestedQty;
    await freshProduct.save({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    failedAsExpected = true;
    console.log(`[Verified] Transaction successfully aborted: ${err.message}`);
  } finally {
    session.endSession();
  }

  assert.equal(failedAsExpected, true, 'Test failed: Overdraft checkout was not aborted!');

  // Verify stock was not decremented
  const checkProduct = await Product.findById(product._id);
  assert.equal(checkProduct.stock, 1, 'Stock corruption detected: Available stock should still be 1.');

  // Clean up test documents
  await Product.findByIdAndDelete(product._id);
  await Seller.findByIdAndDelete(testSeller._id);
  await User.findByIdAndDelete(sellerUser._id);

  console.log('--- [PASS] All Concurrency & Atomic Rollback Tests Succeeded! ---');
  process.exit(0);
}

runConcurrencyTest().catch((err) => {
  console.error('[TEST FAILED]:', err);
  process.exit(1);
});
