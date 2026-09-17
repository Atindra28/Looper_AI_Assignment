/**
 * Seed script — imports transaction dataset into MongoDB and creates demo users.
 * Run: npm run seed
 *
 * IMPORTANT: This script drops existing Transaction and User collections
 * before re-seeding, so it is safe to run multiple times.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import Transaction from './models/Transaction.model';
import User from './models/User.model';

interface RawTransaction {
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
}

const DEMO_USERS = [
  {
    email: 'admin@penta.com',
    password: 'password123',
    name: 'Admin User',
    avatarUrl: 'https://thispersondoesnotexist.com/',
  },
  {
    email: 'alex@penta.com',
    password: 'password123',
    name: 'Alex Morgan',
    avatarUrl: 'https://thispersondoesnotexist.com/',
  },
];

const seed = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // ── Users ──────────────────────────────────────────────────────────
    console.log('Seeding users...');
    await User.deleteMany({});
    // Use save() instead of insertMany so the pre-save bcrypt hook runs
    for (const userData of DEMO_USERS) {
      const user = new User(userData);
      await user.save();
    }
    console.log(`✓ Seeded ${DEMO_USERS.length} users`);

    // ── Transactions ────────────────────────────────────────────────────
    const dataPath = path.join(__dirname, '../../data/transactions.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Dataset file not found at: ${dataPath}`);
    }

    const rawData: RawTransaction[] = JSON.parse(
      fs.readFileSync(dataPath, 'utf-8')
    );

    console.log(`Loading ${rawData.length} transactions...`);
    await Transaction.deleteMany({});

    const txDocs = rawData.map((t) => ({
      id: t.id,
      date: new Date(t.date),
      amount: t.amount,
      category: t.category,
      status: t.status,
      user_id: t.user_id,
      user_profile: t.user_profile,
    }));

    await Transaction.insertMany(txDocs, { ordered: false });
    console.log(`✓ Seeded ${txDocs.length} transactions`);

    console.log('\n── Seed complete ──────────────────────────────────────');
    console.log('Demo login credentials:');
    console.log('  Email:    admin@penta.com');
    console.log('  Password: password123');
    console.log('────────────────────────────────────────────────────────\n');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

seed();
