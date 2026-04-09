const mongoose = require('mongoose');

/**
 * Migration: Seed Main Collections Data
 * Thêm dữ liệu chính: users, artisans, experiences, hotels, tours, bookings, payments
 */

module.exports = {
  async up() {
    try {
      const db = mongoose.connection;

      // Users
      const users = [
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a5e'),
          firstName: 'Phạm',
          lastName: 'Văn Gốm',
          avatar:
            'https://file3.qdnd.vn/data/images/0/2025/01/31/upload_1021/gom2.jpg?dpi=150&quality=100&w=870',
          gender: 'male',
          email: 'artisan1@example.com',
          phone: '0933456789',
          role: 'artisan',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: true,
          isActive: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a5f'),
          firstName: 'Lê',
          lastName: 'Thị Thêu',
          avatar:
            'https://images2.thanhnien.vn/528068263637045248/2024/11/21/c3608mp400505710still002-1732187342444691988050.png',
          gender: 'female',
          email: 'artisan2@example.com',
          phone: '0944567890',
          role: 'artisan',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: true,
          isActive: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a60'),
          firstName: 'Trần',
          lastName: 'Văn Lụa',
          avatar:
            'https://file3.qdnd.vn/data/images/0/2025/01/07/upload_1021/nghenhanlua8.jpg?dpi=150&quality=100&w=870',
          gender: 'male',
          email: 'artisan3@example.com',
          phone: '0955678901',
          role: 'artisan',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: true,
          isActive: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a61'),
          firstName: 'Nguyễn',
          lastName: 'Thị Nón',
          avatar:
            'https://thuonghieuvaphapluat.vn/Images/huyentt/2023/02/27/ce3%20(1).png',
          gender: 'female',
          email: 'artisan4@example.com',
          phone: '0966789012',
          role: 'artisan',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: true,
          isActive: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a62'),
          firstName: 'Hoàng',
          lastName: 'Văn Sơn',
          avatar:
            'https://file3.qdnd.vn/data/images/0/2023/02/14/tranthaiphuong/z4109062766378_2c301111624d743b299ecfe4b581b2d9.jpg?dpi=150&quality=100&w=870',
          gender: 'male',
          email: 'artisan5@example.com',
          phone: '0977890123',
          role: 'artisan',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: true,
          isActive: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          firstName: 'Dương',
          lastName: 'Đức',
          avatar:
            'https://lh3.googleusercontent.com/a/ACg8ocKtSi0WcQ-DfP7REyJ2qzlfsVM1Ja0qKkLB7TPbMrOJZWaBEFXt=s96-c',
          gender: 'other',
          email: 'haynhantin11@gmail.com',
          phone: '0702374978',
          role: 'customer',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: false,
          isActive: true,
          createdAt: new Date('2026-04-05T10:45:36.782Z'),
          updatedAt: new Date('2026-04-08T15:36:58.965Z'),
          lastLoginAt: new Date('2026-04-08T15:36:58.912Z'),
          favorites: [],
          __v: 9,
        },
        {
          _id: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          firstName: 'Van Hoa Trinh',
          lastName: 'Travel',
          avatar:
            'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1551773339239708&height=200&width=200&ext=1777977949&hash=AT-aEaUtXH7QBa-JRzyMsgTY',
          gender: 'other',
          email: 'hoducduong48@icloud.com',
          role: 'admin',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: false,
          isActive: true,
          createdAt: new Date('2026-04-05T10:45:48.045Z'),
          updatedAt: new Date('2026-04-08T18:06:35.714Z'),
          lastLoginAt: new Date('2026-04-08T18:06:35.710Z'),
          favorites: [
            {
              itemId: new mongoose.Types.ObjectId('69d297b5543cce0ccd8373a6'),
              itemType: 'hotel',
              savedAt: new Date('2026-04-06T01:40:48.773Z'),
              _id: new mongoose.Types.ObjectId('69d30f204602295c5e07521f'),
            },
            {
              itemId: new mongoose.Types.ObjectId('69d297b6543cce0ccd8373b3'),
              itemType: 'hotel',
              savedAt: new Date('2026-04-06T01:40:49.652Z'),
              _id: new mongoose.Types.ObjectId('69d30f214602295c5e075223'),
            },
            {
              itemId: new mongoose.Types.ObjectId('69d2a4e7bfa05cf29f08f80c'),
              itemType: 'tour',
              savedAt: new Date('2026-04-06T01:47:30.231Z'),
              _id: new mongoose.Types.ObjectId('69d310b279aaf2d92a105262'),
            },
          ],
          __v: 24,
        },
        {
          _id: new mongoose.Types.ObjectId('69d3b10bf71368431975fe57'),
          firstName: 'Test',
          lastName: 'User',
          gender: 'other',
          email: 'test@example.com',
          phone: '0987654321',
          role: 'customer',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: true,
          isActive: true,
          favorites: [],
          createdAt: new Date('2026-04-06T13:11:39.145Z'),
          updatedAt: new Date('2026-04-06T13:12:51.160Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d3cd7c1f042490e4259fe3'),
          firstName: '21312',
          lastName: '12321',
          gender: 'other',
          email: 'tes2t@example.com',
          phone: '0321321321312',
          role: 'customer',
          isEmailVerified: true,
          twoFactorEnabled: false,
          isFirstLogin: true,
          isActive: true,
          favorites: [],
          createdAt: new Date('2026-04-06T15:13:00.859Z'),
          updatedAt: new Date('2026-04-06T15:13:10.423Z'),
          __v: 0,
        },
      ];

      // Insert users
      const insertedUsers = await db.collection('users').insertMany(users);
      console.log(`✓ ${insertedUsers.insertedCount} users inserted`);

      // Insert test bookings
      const bookings = [
        {
          _id: new mongoose.Types.ObjectId('69d4571958520b3d200964c8'),
          experienceId: new mongoose.Types.ObjectId('69d2a4e7bfa05cf29f08f80c'),
          userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          guestsCount: 2,
          totalPrice: 3000000,
          status: 'confirmed',
          bookingDate: new Date('2026-04-07'),
          createdAt: new Date('2026-04-07T01:00:09.506Z'),
          updatedAt: new Date('2026-04-07T01:00:47.943Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4988dca6b068995a80ad4'),
          experienceId: new mongoose.Types.ObjectId('69d2a4e7bfa05cf29f08f80c'),
          userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          guestsCount: 2,
          totalPrice: 3000000,
          status: 'pending',
          bookingDate: new Date('2026-04-07'),
          createdAt: new Date('2026-04-07T05:39:25.776Z'),
          updatedAt: new Date('2026-04-07T05:39:25.776Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4fc93aaced606fa6496b3'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a78'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          bookingDate: new Date('2026-04-07'),
          timeSlot: '10:00 AM',
          guestsCount: 1,
          totalPrice: 450000,
          status: 'pending',
          createdAt: new Date('2026-04-07T12:46:11.823Z'),
          updatedAt: new Date('2026-04-07T12:46:11.823Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d697cb9cb74b0a90e89f54'),
          hotelId: new mongoose.Types.ObjectId('69d297b5543cce0ccd8373a6'),
          userId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          bookingDate: new Date('2026-04-15'),
          guestsCount: 1,
          totalPrice: 2100000,
          status: 'pending',
          billingInfoId: new mongoose.Types.ObjectId(
            '69d697cb9cb74b0a90e89f56'
          ),
          createdAt: new Date('2026-04-08T18:00:43.493Z'),
          updatedAt: new Date('2026-04-08T18:00:43.530Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d6982c9cb74b0a90e89f65'),
          hotelId: new mongoose.Types.ObjectId('69d297b6543cce0ccd8373b3'),
          userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          bookingDate: new Date('2026-04-09'),
          guestsCount: 1,
          totalPrice: 3600000,
          status: 'pending',
          billingInfoId: new mongoose.Types.ObjectId(
            '69d6982c9cb74b0a90e89f67'
          ),
          createdAt: new Date('2026-04-08T18:02:20.267Z'),
          updatedAt: new Date('2026-04-08T18:02:20.282Z'),
          __v: 0,
        },
      ];

      await db.collection('bookings').insertMany(bookings);
      console.log(`✓ ${bookings.length} bookings inserted`);

      // Payments
      const payments = [
        {
          _id: new mongoose.Types.ObjectId('69d4571958520b3d200964cc'),
          bookingId: new mongoose.Types.ObjectId('69d4571958520b3d200964c8'),
          userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          amount: 3000000,
          currency: 'USD',
          paymentMethod: 'paypal',
          paymentGateway: 'paypal',
          transactionId: 'PAYPAL_1775523609841_zm9154r7l',
          status: 'completed',
          paymentDetails: {
            status: 'COMPLETED',
            paypalEmail: 'sb-dvbsw50406857@personal.example.com',
            captureTime: new Date('2026-04-07T01:00:47.927Z'),
          },
          isEncrypted: false,
          gatewayReference: '7JV74327DG097094M',
          createdAt: new Date('2026-04-07T01:00:09.843Z'),
          updatedAt: new Date('2026-04-07T01:00:47.928Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d697cc9cb74b0a90e89f5b'),
          bookingId: new mongoose.Types.ObjectId('69d697cb9cb74b0a90e89f54'),
          userId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          amount: 2100000,
          currency: 'USD',
          paymentMethod: 'vnpay',
          paymentGateway: 'vnpay',
          transactionId: 'VNP_1775671244268_tz4hlnjrz',
          status: 'pending',
          isEncrypted: false,
          createdAt: new Date('2026-04-08T18:00:44.269Z'),
          updatedAt: new Date('2026-04-08T18:00:44.269Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d6982d9cb74b0a90e89f6d'),
          bookingId: new mongoose.Types.ObjectId('69d6982c9cb74b0a90e89f65'),
          userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          amount: 3600000,
          currency: 'USD',
          paymentMethod: 'paypal',
          paymentGateway: 'paypal',
          transactionId: 'PAYPAL_1775671341002_n73n7ldfx',
          status: 'pending',
          isEncrypted: false,
          gatewayReference: '4WE61214WB500552F',
          createdAt: new Date('2026-04-08T18:02:21.004Z'),
          updatedAt: new Date('2026-04-08T18:02:22.535Z'),
          __v: 0,
        },
      ];

      await db.collection('payments').insertMany(payments);
      console.log(`✓ ${payments.length} payments inserted`);

      console.log('\n✅ All main data seeded successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error seeding main data:', error);
      throw error;
    }
  },

  async down() {
    try {
      const db = mongoose.connection;

      await db.collection('users').deleteMany({});
      await db.collection('bookings').deleteMany({});
      await db.collection('payments').deleteMany({});

      console.log('✓ Rollback completed');
      return true;
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  },
};
