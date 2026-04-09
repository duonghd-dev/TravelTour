/**
 * Migration: Normalize Field Names
 *
 * Thay đổi:
 * 1. Artisan.isVerified → isProfileVerified
 * 2. Artisan.status → verificationStatus
 * 3. Artisan.avatar → remove (use user.avatar via populate)
 * 4. Experience.status → publishStatus
 * 5. Hotel.status → publishStatus
 * 6. Tour.status → publishStatus
 * 7. Booking.paymentStatus, isPaid, paymentMethod → remove
 */

import mongoose from 'mongoose';
import logger from '../common/utils/logger.js';

async function migrateFieldNames() {
  const db = mongoose.connection.db;

  console.log('🔄 Starting migration: Normalize Field Names...\n');

  try {
    // Step 1: Migrate Artisan fields
    console.log('Step 1: Migrating Artisan fields...');
    const artisansResult = await db.collection('artisans').updateMany({}, [
      {
        $set: {
          isProfileVerified: { $ifNull: ['$isVerified', false] },
          verificationStatus: { $ifNull: ['$status', 'approved'] },
        },
      },
      {
        $unset: ['isVerified', 'status', 'avatar'],
      },
    ]);
    console.log(
      `✅ Artisans updated: ${artisansResult.modifiedCount} documents`
    );

    // Step 2: Migrate Experience.status → publishStatus
    console.log('\nStep 2: Migrating Experience fields...');
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
      `✅ Experiences updated: ${experiencesResult.modifiedCount} documents`
    );

    // Step 3: Migrate Hotel.status → publishStatus
    console.log('\nStep 3: Migrating Hotel fields...');
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
    console.log(`✅ Hotels updated: ${hotelsResult.modifiedCount} documents`);

    // Step 4: Migrate Tour.status → publishStatus
    console.log('\nStep 4: Migrating Tour fields...');
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
    console.log(`✅ Tours updated: ${toursResult.modifiedCount} documents`);

    // Step 5: Migrate Booking fields (remove redundant fields)
    console.log('\nStep 5: Migrating Booking fields...');
    const bookingsResult = await db.collection('bookings').updateMany(
      {},
      {
        $unset: {
          paymentStatus: '',
          isPaid: '',
          paymentMethod: '',
        },
      }
    );
    console.log(
      `✅ Bookings updated: ${bookingsResult.modifiedCount} documents`
    );

    // Step 6: Update indexes
    console.log('\nStep 6: Updating indexes...');

    // Artisan indexes
    try {
      await db.collection('artisans').dropIndex('status_1');
      console.log('  - Dropped old artisans.status index');
    } catch (e) {
      // Index may not exist
    }

    try {
      await db.collection('artisans').dropIndex('isVerified_1');
      console.log('  - Dropped old artisans.isVerified index');
    } catch (e) {
      // Index may not exist
    }

    await db.collection('artisans').createIndex({ verificationStatus: 1 });
    console.log('  - Created new artisans.verificationStatus index');

    await db.collection('artisans').createIndex({ isProfileVerified: 1 });
    console.log('  - Created new artisans.isProfileVerified index');

    // Experience indexes
    try {
      await db.collection('experiences').dropIndex('status_1');
      console.log('  - Dropped old experiences.status index');
    } catch (e) {
      // Index may not exist
    }

    // Hotel indexes
    try {
      await db.collection('hotels').dropIndex('status_1');
      console.log('  - Dropped old hotels.status index');
    } catch (e) {
      // Index may not exist
    }

    // Tour indexes
    try {
      await db.collection('tours').dropIndex('status_1');
      console.log('  - Dropped old tours.status index');
    } catch (e) {
      // Index may not exist
    }

    // Booking indexes
    try {
      await db.collection('bookings').dropIndex('paymentStatus_1');
      console.log('  - Dropped old bookings.paymentStatus index');
    } catch (e) {
      // Index may not exist
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nSummary:');
    console.log(`- Artisans: ${artisansResult.modifiedCount} updated`);
    console.log(`- Experiences: ${experiencesResult.modifiedCount} updated`);
    console.log(`- Hotels: ${hotelsResult.modifiedCount} updated`);
    console.log(`- Tours: ${toursResult.modifiedCount} updated`);
    console.log(`- Bookings: ${bookingsResult.modifiedCount} updated`);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

export default migrateFieldNames;
