import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import Artisan from './src/modules/artisan/artisan.model.js';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/travel_db';

async function checkDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Kết nối MongoDB thành công');

    const totalCount = await Artisan.countDocuments();
    console.log(`📊 Tổng artisans trong database: ${totalCount}`);

    const approvedCount = await Artisan.countDocuments({ status: 'approved' });
    console.log(`✓ Approved artisans: ${approvedCount}`);

    const allArtisans = await Artisan.find().lean();
    console.log('\n📋 Danh sách tất cả artisans:');
    allArtisans.forEach((art, i) => {
      console.log(
        `  ${i + 1}. ${art.title} (status: ${art.status}, verified: ${art.isVerified})`
      );
    });

    if (approvedCount === 0) {
      console.log('\n⚠️ Không có approved artisans! Kiểm tra status field...');
      const sample = await Artisan.findOne();
      if (sample) {
        console.log('Sample artisan:', JSON.stringify(sample, null, 2));
      }
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('✗ Lỗi:', error.message);
    process.exit(1);
  }
}

checkDatabase();
