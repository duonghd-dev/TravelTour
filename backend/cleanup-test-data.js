import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from './src/modules/user/user.model.js';
import Artisan from './src/modules/artisan/artisan.model.js';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/travel_tour';

async function cleanup() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Kết nối MongoDB thành công');

    // Delete test artisans (those with email containing test keywords)
    const testEmails = [
      'master-silk@example.com',
      'ceramic-master@example.com',
      'woodcarving-master@example.com',
      'lacquer-master@example.com',
      'embroidery-master@example.com',
    ];

    const result1 = await User.deleteMany({ email: { $in: testEmails } });
    console.log(`✓ Xóa ${result1.deletedCount} user test`);

    // Delete test artisans by craft type (more reliable)
    const testCrafts = [
      'Silk Weaving',
      'Ceramics',
      'Woodworking',
      'Lacquerwork',
      'Embroidery',
    ];

    const result2 = await Artisan.deleteMany({ craft: { $in: testCrafts } });
    console.log(`✓ Xóa ${result2.deletedCount} artisan test`);

    // Verify deletion
    const remainingArtisans = await Artisan.countDocuments();
    const remainingUsers = await User.countDocuments();

    console.log('\n📊 Số lượng còn lại:');
    console.log(`  Artisans: ${remainingArtisans}`);
    console.log(`  Users: ${remainingUsers}`);

    console.log('\n✓ Xóa dữ liệu test hoàn thành!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

cleanup();
