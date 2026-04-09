/**
 * Migration Script: Update Existing Database Data to Match New Schema
 * This script updates all existing documents to use new field names
 * Following the database normalization plan
 */

import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function migrateData() {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(
      process.env.MONGODB_CONNECTION || 'mongodb://localhost:27017/travel_tour',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // ============ MIGRATION 1: ARTISAN COLLECTION ============
    console.log('\n🔄 [1/5] Migrating Artisan collection...');
    const artisansResult = await db.collection('artisans').updateMany({}, [
      {
        $set: {
          isProfileVerified: { $ifNull: ['$isVerified', false] },
          verificationStatus: {
            $cond: [
              { $eq: ['$status', 'approved'] },
              'approved',
              {
                $cond: [{ $eq: ['$status', 'pending'] }, 'pending', 'rejected'],
              },
            ],
          },
        },
      },
      {
        $unset: ['isVerified', 'status', 'avatar'],
      },
    ]);
    console.log(
      `   ✅ Updated ${artisansResult.modifiedCount} artisan documents`
    );

    // ============ MIGRATION 2: EXPERIENCE COLLECTION ============
    console.log('\n🔄 [2/5] Migrating Experience collection...');
    const experiencesResult = await db
      .collection('experiences')
      .updateMany({}, [
        {
          $set: {
            publishStatus: { $ifNull: ['$status', 'active'] },
          },
        },
        {
          $unset: ['status'],
        },
      ]);
    console.log(
      `   ✅ Updated ${experiencesResult.modifiedCount} experience documents`
    );

    // ============ MIGRATION 3: HOTEL COLLECTION ============
    console.log('\n🔄 [3/5] Migrating Hotel collection...');
    const hotelsResult = await db.collection('hotels').updateMany({}, [
      {
        $set: {
          publishStatus: { $ifNull: ['$status', 'active'] },
        },
      },
      {
        $unset: ['status'],
      },
    ]);
    console.log(`   ✅ Updated ${hotelsResult.modifiedCount} hotel documents`);

    // ============ MIGRATION 4: TOUR COLLECTION ============
    console.log('\n🔄 [4/5] Migrating Tour collection...');
    const toursResult = await db.collection('tours').updateMany({}, [
      {
        $set: {
          publishStatus: { $ifNull: ['$status', 'active'] },
        },
      },
      {
        $unset: ['status'],
      },
    ]);
    console.log(`   ✅ Updated ${toursResult.modifiedCount} tour documents`);

    // ============ MIGRATION 5: BOOKING COLLECTION ============
    console.log('\n🔄 [5/5] Migrating Booking collection...');
    const bookingsResult = await db.collection('bookings').updateMany({}, [
      {
        $unset: ['paymentMethod', 'paymentStatus', 'isPaid'],
      },
    ]);
    console.log(
      `   ✅ Updated ${bookingsResult.modifiedCount} booking documents`
    );

    // ============ INDEX UPDATES ============
    console.log('\n📊 Updating database indexes...');

    try {
      // Drop old indexes
      console.log('   ⏳ Dropping old indexes...');
      await db
        .collection('artisans')
        .dropIndex('isVerified_1')
        .catch(() => {});
      await db
        .collection('artisans')
        .dropIndex('status_1')
        .catch(() => {});
      await db
        .collection('experiences')
        .dropIndex('status_1')
        .catch(() => {});
      await db
        .collection('hotels')
        .dropIndex('status_1')
        .catch(() => {});
      await db
        .collection('tours')
        .dropIndex('status_1')
        .catch(() => {});
      await db
        .collection('bookings')
        .dropIndex('paymentStatus_1')
        .catch(() => {});
      console.log('   ✅ Old indexes dropped');
    } catch (err) {
      console.log('   ℹ️  Some old indexes were not found (OK)');
    }

    try {
      // Create new indexes
      console.log('   ⏳ Creating new indexes...');
      await db.collection('artisans').createIndex({ isProfileVerified: 1 });
      await db.collection('artisans').createIndex({ verificationStatus: 1 });
      await db.collection('experiences').createIndex({ publishStatus: 1 });
      await db.collection('hotels').createIndex({ publishStatus: 1 });
      await db.collection('tours').createIndex({ publishStatus: 1 });
      console.log('   ✅ New indexes created successfully');
    } catch (err) {
      console.log('   ⚠️  Error creating indexes:', err.message);
    }

    // ============ VERIFICATION ============
    console.log('\n📋 Verification Report:');
    const artisansSample = await db.collection('artisans').findOne({});
    const experiencesSample = await db.collection('experiences').findOne({});
    const hotelsSample = await db.collection('hotels').findOne({});
    const toursSample = await db.collection('tours').findOne({});
    const bookingsSample = await db.collection('bookings').findOne({});

    console.log('\n✅ Sample Artisan document:');
    console.log(`   - isProfileVerified: ${artisansSample?.isProfileVerified}`);
    console.log(
      `   - verificationStatus: ${artisansSample?.verificationStatus}`
    );
    console.log(`   - avatar removed: ${!artisansSample?.avatar}`);

    console.log('\n✅ Sample Experience document:');
    console.log(`   - publishStatus: ${experiencesSample?.publishStatus}`);
    console.log(`   - status removed: ${!experiencesSample?.status}`);

    console.log('\n✅ Sample Hotel document:');
    console.log(`   - publishStatus: ${hotelsSample?.publishStatus}`);
    console.log(`   - status removed: ${!hotelsSample?.status}`);

    console.log('\n✅ Sample Tour document:');
    console.log(`   - publishStatus: ${toursSample?.publishStatus}`);
    console.log(`   - status removed: ${!toursSample?.status}`);

    console.log('\n✅ Sample Booking document:');
    console.log(
      `   - paymentMethod removed: ${!bookingsSample?.paymentMethod}`
    );
    console.log(
      `   - paymentStatus removed: ${!bookingsSample?.paymentStatus}`
    );
    console.log(`   - isPaid removed: ${!bookingsSample?.isPaid}`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration completed successfully!');
    console.log('='.repeat(60));

    console.log('\n📊 Summary:');
    console.log(
      `   • Artisan documents updated: ${artisansResult.modifiedCount}`
    );
    console.log(
      `   • Experience documents updated: ${experiencesResult.modifiedCount}`
    );
    console.log(`   • Hotel documents updated: ${hotelsResult.modifiedCount}`);
    console.log(`   • Tour documents updated: ${toursResult.modifiedCount}`);
    console.log(
      `   • Booking documents updated: ${bookingsResult.modifiedCount}`
    );
    console.log(
      `   • Total documents updated: ${artisansResult.modifiedCount + experiencesResult.modifiedCount + hotelsResult.modifiedCount + toursResult.modifiedCount + bookingsResult.modifiedCount}`
    );

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run migration
(async () => {
  await migrateData();
})();
