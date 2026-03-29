import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import Artisan from './src/modules/artisan/artisan.model.js';
import { getAllArtisans } from './src/modules/artisan/artisan.service.js';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/travel_db';

async function testService() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Kết nối MongoDB thành công');

    // Test raw query
    const rawArtisans = await Artisan.find({ status: 'approved' }).lean();
    console.log(`✓ Raw query - Found: ${rawArtisans.length} artisans`);

    // Test with populate
    const populatedArtisans = await Artisan.find({ status: 'approved' })
      .populate('userId', 'firstName lastName avatar')
      .lean();
    console.log(
      `✓ With populate - Found: ${populatedArtisans.length} artisans`
    );

    if (populatedArtisans.length > 0) {
      console.log('\n📋 First artisan:');
      console.log(JSON.stringify(populatedArtisans[0], null, 2));
    }

    // Test service
    console.log('\n🔧 Testing getAllArtisans service...');
    const result = await getAllArtisans();
    console.log('Service result:');
    console.log(JSON.stringify(result, null, 2));

    await mongoose.connection.close();
  } catch (error) {
    console.error('✗ Lỗi:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testService();
