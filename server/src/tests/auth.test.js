import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';

async function runAuthTest() {
  console.log('--- [TEST] Starting Auth & JWT Verification ---');
  await mongoose.connect(ENV.MONGODB_URI);

  const testEmail = `authtest_${Date.now()}@shopagent.com`;
  const plainPassword = 'SecretPassword123';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(plainPassword, salt);

  const user = await User.create({
    name: 'Auth Tester',
    email: testEmail,
    passwordHash,
    role: 'customer'
  });

  const isMatch = await user.comparePassword(plainPassword);
  assert.equal(isMatch, true, 'Password comparison failed');

  const token = jwt.sign({ id: user._id, role: user.role }, ENV.JWT_SECRET, { expiresIn: '1h' });
  const decoded = jwt.verify(token, ENV.JWT_SECRET);
  assert.equal(decoded.id, user._id.toString(), 'Decoded token ID mismatch');
  assert.equal(decoded.role, 'customer', 'Decoded role mismatch');

  await User.findByIdAndDelete(user._id);

  console.log('--- [PASS] Auth & JWT Tests Succeeded! ---');
  process.exit(0);
}

runAuthTest().catch((err) => {
  console.error('[AUTH TEST FAILED]:', err);
  process.exit(1);
});
