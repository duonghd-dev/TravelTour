import mongoose from 'mongoose';
import Artisan from './src/modules/artisan/artisan.model.js';

const checkStatus = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/doantravel');
    console.log('✓ Connected to MongoDB');

    // Query 1: All artisans
    const all = await Artisan.find({});
    console.log('\n📊 Total artisans (no filter):', all.length);
    all.forEach((a, i) => {
      console.log(
        `  ${i + 1}. ${a.title} - status: "${a.status}" (type: ${typeof a.status})`
      );
    });

    // Query 2: With status filter
    const approved = await Artisan.find({ status: 'approved' });
    console.log('\n✓ Approved artisans (status: "approved"):', approved.length);
    approved.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.title}`);
    });

    // Check exact status values
    const distinct = await Artisan.distinct('status');
    console.log('\n🔍 Distinct status values in DB:', distinct);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkStatus();
