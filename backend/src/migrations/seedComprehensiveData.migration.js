const mongoose = require('mongoose');

/**
 * Migration: Seed Comprehensive Data
 * Thêm dữ liệu đầy đủ vào database: reviews, conversations, messages,
 * oauthproviders, experiences, bookings, hotels, artisans, billinginfos, users, payments, tours
 */

module.exports = {
  async up() {
    try {
      const db = mongoose.connection;

      // Reviews
      await db.collection('reviews').insertMany([
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9aae'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a6a'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a64'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Trải nghiệm tuyệt vời! Nghệ nhân rất tư cấn và giảng dạy tốt. Tôi học được rất nhiều kỹ thuật mới!',
          createdAt: new Date('2026-02-19T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9aaf'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a6a'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a64'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 4,
          content:
            'Rất hay! Chỉ tiếc là thời gian quá ngắn, muốn học thêm nữa. Sẽ quay lại!',
          createdAt: new Date('2026-03-01T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab0'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a6f'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a64'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Khóa nâng cao quá tuyệt! Học được những kỹ thuật độc đáo. Khuyên các bạn nên học!',
          createdAt: new Date('2026-03-11T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab1'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a74'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a64'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Dạo xưởng rất thú vị! Được nhìn thợ gốm thực hành và tự làm là một trải nghiệm không quên!',
          createdAt: new Date('2026-03-21T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab2'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a78'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Thêu tay thật đẹp! Cô ấy rất kiên nhẫn trong việc hướng dẫn. Tôi tạo được một tranh thêu rất xinh!',
          createdAt: new Date('2026-03-06T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab3'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a78'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Một trải nghiệm không quên! Hãy chắc chắn đặt lịch trước. Cô hướng dẫn rất chi tiết!',
          createdAt: new Date('2026-03-16T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab4'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a7d'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 4,
          content:
            'Khóa nâng cao rất bổ ích. Tôi học được cách tạo tranh thêu phức tạp hơn!',
          createdAt: new Date('2026-03-24T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab5'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a81'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Workshop thêu ren rất hay! Thế hệ thợ thêu chuyên nghiệp. Sẽ quay lại để học thêm!',
          createdAt: new Date('2026-03-28T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab6'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a85'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Dệt lụa tơ tằm là một nghệ thuật tuyệt vời! Được học từ một thợ dệt kỳ cựu. Tôi rất hài lòng!',
          createdAt: new Date('2026-02-24T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab7'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a85'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 4,
          content:
            'Khoá học rất bổ ích. Tôi hiểu rõ hơn về lịch sử dệt lụa Hà Đông!',
          createdAt: new Date('2026-03-08T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab8'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a8a'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Nhuộm lụa màu tự nhiên tuyệt vời! Tôi thích cách cô kết hợp các chất nhuộm tự nhiên.',
          createdAt: new Date('2026-03-18T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ab9'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a8f'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Tạo hoa văn trên lụa rất sáng tạo! Học được cách kết hợp dệt và vẽ hoa văn!',
          createdAt: new Date('2026-03-26T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9aba'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a93'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Làm nón lá sơ cấp rất vui! Được tạo một chiếc nón lá truyền thống đẹp lắm!',
          createdAt: new Date('2026-02-26T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9abb'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a93'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Cô ấy hướng dẫn rất kỹ về cách chọn lá và bện nón. Tôi tạo được nón lá đẹp!',
          createdAt: new Date('2026-03-10T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9abc'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a98'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 4,
          content:
            'Vẽ hoa văn trên nón lá rất thú vị. Tôi vẽ được một bức tranh hoa văn đẹp!',
          createdAt: new Date('2026-03-20T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9abd'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a9c'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Khóa nâng cao nón lá rất chuyên nghiệp! Cô là một nghệ nhân tài ba!',
          createdAt: new Date('2026-03-29T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9abe'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9aa0'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Sơn mài cơ bản rất hay! Được học về lịch sử sơn mài Việt Nam và tạo tác phẩm sơn mài đầu tiên!',
          createdAt: new Date('2026-02-22T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9abf'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9aa0'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Thầy dạy rất tâm huyết! Tôi hiểu rõ hơn về sơn mài truyền thống. Sẽ quay lại!',
          createdAt: new Date('2026-03-04T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ac0'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9aa5'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5b'),
          rating: 5,
          content:
            'Sơn mài nâng cao và vàng mài quá tuyệt! Học được kỹ thuật vàng mài cao cấp!',
          createdAt: new Date('2026-03-14T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9ac1'),
          experienceId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9aa9'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
          userId: new mongoose.Types.ObjectId('69d1f6002b49752029cc9a5c'),
          rating: 5,
          content:
            'Workshop sơn mài bàn rất sáng tạo! Được tạo một mặt bàn sơn mài độc đáo!',
          createdAt: new Date('2026-03-27T05:41:21.065Z'),
          updatedAt: new Date('2026-04-05T05:41:21.068Z'),
          __v: 0,
        },
      ]);

      console.log('✓ Reviews inserted successfully');

      // Conversations
      await db.collection('conversations').insertMany([
        {
          _id: new mongoose.Types.ObjectId('69cab7a956313757df02eb52'),
          participants: [
            new mongoose.Types.ObjectId('69ca858962b49311f02f913c'),
            new mongoose.Types.ObjectId('69c692409d86f20939e3deac'),
          ],
          lastMessage: new mongoose.Types.ObjectId('69cab9eb56313757df02f661'),
          lastMessageAt: new Date('2026-03-30T17:59:07.028Z'),
          isActive: true,
          readStatus: [
            {
              userId: new mongoose.Types.ObjectId('69ca858962b49311f02f913c'),
              readAt: new Date('2026-03-31T05:02:39.970Z'),
              _id: new mongoose.Types.ObjectId('69cab7a956313757df02eb53'),
            },
            {
              userId: new mongoose.Types.ObjectId('69c692409d86f20939e3deac'),
              readAt: new Date('2026-03-30T17:59:11.488Z'),
              _id: new mongoose.Types.ObjectId('69cab7a956313757df02eb54'),
            },
          ],
          createdAt: new Date('2026-03-30T17:49:29.785Z'),
          updatedAt: new Date('2026-03-31T05:02:39.970Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69cb58ebed81e11d1390c01d'),
          participants: [
            new mongoose.Types.ObjectId('69cb56dfed81e11d1390be19'),
            new mongoose.Types.ObjectId('69c692409d86f20939e3deac'),
          ],
          lastMessage: new mongoose.Types.ObjectId('69cb63163f4c82dc3d177197'),
          lastMessageAt: new Date('2026-03-31T06:00:54.693Z'),
          isActive: true,
          readStatus: [
            {
              userId: new mongoose.Types.ObjectId('69cb56dfed81e11d1390be19'),
              readAt: new Date('2026-03-31T05:17:32.011Z'),
              _id: new mongoose.Types.ObjectId('69cb58ebed81e11d1390c01e'),
            },
            {
              userId: new mongoose.Types.ObjectId('69c692409d86f20939e3deac'),
              readAt: new Date('2026-04-05T04:56:58.043Z'),
              _id: new mongoose.Types.ObjectId('69cb58ebed81e11d1390c01f'),
            },
          ],
          createdAt: new Date('2026-03-31T05:17:31.921Z'),
          updatedAt: new Date('2026-04-05T04:56:58.044Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d34be6451f23ce2374a5e9'),
          participants: [
            new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
            new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          ],
          lastMessage: new mongoose.Types.ObjectId('69d690bb8ed33d42d973346c'),
          lastMessageAt: new Date('2026-04-08T17:30:35.412Z'),
          isActive: true,
          readStatus: [
            {
              userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
              readAt: new Date('2026-04-08T17:30:30.441Z'),
              _id: new mongoose.Types.ObjectId('69d34be7451f23ce2374a5ea'),
            },
            {
              userId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
              readAt: new Date('2026-04-08T12:24:49.085Z'),
              _id: new mongoose.Types.ObjectId('69d34be7451f23ce2374a5eb'),
            },
          ],
          createdAt: new Date('2026-04-06T06:00:07.130Z'),
          updatedAt: new Date('2026-04-08T17:30:35.412Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d3d4781f042490e425a238'),
          participants: [
            new mongoose.Types.ObjectId('69d3cd7c1f042490e4259fe3'),
            new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          ],
          lastMessage: new mongoose.Types.ObjectId('69d3dd88eac17cc0da8ba822'),
          lastMessageAt: new Date('2026-04-06T16:21:28.250Z'),
          isActive: true,
          readStatus: [
            {
              userId: new mongoose.Types.ObjectId('69d3cd7c1f042490e4259fe3'),
              readAt: new Date('2026-04-06T15:42:48.074Z'),
              _id: new mongoose.Types.ObjectId('69d3d4781f042490e425a239'),
            },
            {
              userId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
              readAt: new Date('2026-04-06T17:22:22.366Z'),
              _id: new mongoose.Types.ObjectId('69d3d4781f042490e425a23a'),
            },
          ],
          createdAt: new Date('2026-04-06T15:42:48.015Z'),
          updatedAt: new Date('2026-04-06T17:22:22.372Z'),
          __v: 0,
        },
      ]);

      console.log('✓ Conversations inserted successfully');

      // OAuthProviders
      await db.collection('oauthproviders').insertMany([
        {
          _id: new mongoose.Types.ObjectId('69d23d504be4c43be5973662'),
          userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          provider: 'google',
          providerId: '102510768576564135716',
          email: 'haynhantin11@gmail.com',
          displayName: 'Dương Đức',
          photoUrl:
            'https://lh3.googleusercontent.com/a/ACg8ocKtSi0WcQ-DfP7REyJ2qzlfsVM1Ja0qKkLB7TPbMrOJZWaBEFXt=s96-c',
          connectedAt: new Date('2026-04-05T10:45:36.803Z'),
          createdAt: new Date('2026-04-05T10:45:36.804Z'),
          updatedAt: new Date('2026-04-05T10:45:36.804Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366d'),
          userId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          provider: 'facebook',
          providerId: '1551773339239708',
          email: 'hoducduong48@icloud.com',
          displayName: 'Đức Dương',
          photoUrl:
            'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1551773339239708&height=200&width=200&ext=1777977949&hash=AT-aEaUtXH7QBa-JRzyMsgTY',
          connectedAt: new Date('2026-04-05T10:45:48.047Z'),
          createdAt: new Date('2026-04-05T10:45:48.047Z'),
          updatedAt: new Date('2026-04-05T10:45:48.047Z'),
          __v: 0,
        },
      ]);

      console.log('✓ OAuthProviders inserted successfully');

      // BillingInfos
      await db.collection('billinginfos').insertMany([
        {
          _id: new mongoose.Types.ObjectId('69d697cb9cb74b0a90e89f56'),
          bookingId: new mongoose.Types.ObjectId('69d697cb9cb74b0a90e89f54'),
          encryptedData:
            '87b8f578e821f7337b7fa16ef37a3bb01448f2bea61a75eb9e106285d5687258a976dc1ea5023afa315c0b5558402be848cccec1de83157845ddb76d6da67870f4284b0eee6cd6ddff835a47c5c214df9cff767b64dce97908ad93c6fb601067b8d6d962cf95ab',
          iv: 'f1ac9d79caa84f14bb5aebdc10e321dc',
          authTag: '62a6e8e8d0eca1cd645ade1f6a2890d8',
          isEncrypted: true,
          createdAt: new Date('2026-04-08T18:00:43.520Z'),
          updatedAt: new Date('2026-04-08T18:00:43.520Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d6982c9cb74b0a90e89f67'),
          bookingId: new mongoose.Types.ObjectId('69d6982c9cb74b0a90e89f65'),
          encryptedData:
            'f1042f2d0894d19493aeaf3042715a81df6694e8f4bc4abf011be060c675bbbba46a62e59fa305188635c3bdf1251843909c1c64761b08b5665a8f6a94adbadb0a717c392560388b5316832e9ff5e059ac92283148713ba1e751972420a569be9386b696a9edf936e48761',
          iv: 'aa59a31e2320087efc54e8f6c7371fe9',
          authTag: '2184a151a2d29a92bf905d7c4387b70a',
          isEncrypted: true,
          createdAt: new Date('2026-04-08T18:02:20.277Z'),
          updatedAt: new Date('2026-04-08T18:02:20.277Z'),
          __v: 0,
        },
      ]);

      console.log('✓ BillingInfos inserted successfully');

      console.log('\n✅ All comprehensive data seeded successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error seeding data:', error);
      throw error;
    }
  },

  async down() {
    try {
      const db = mongoose.connection;

      // Remove all collections
      await db.collection('reviews').deleteMany({});
      await db.collection('conversations').deleteMany({});
      await db.collection('oauthproviders').deleteMany({});
      await db.collection('billinginfos').deleteMany({});

      console.log('✓ Rollback completed - data removed');
      return true;
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  },
};
