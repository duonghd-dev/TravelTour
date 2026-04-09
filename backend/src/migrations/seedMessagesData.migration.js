const mongoose = require('mongoose');

/**
 * Migration: Seed Messages Data
 * Thêm dữ liệu tin nhắn mã hóa
 */

module.exports = {
  async up() {
    try {
      const db = mongoose.connection;

      const messages = [
        {
          _id: new mongoose.Types.ObjectId('69d4571958520b3d200964dd'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c6bfa05cf29f08f7ca'
          ),
          senderId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          encryptedData:
            'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1',
          iv: '5a7b9c1d3e5f7a9b',
          authTag: '8e7f6d5c4b3a2918',
          isRead: true,
          readAt: new Date('2026-04-07T01:30:00.000Z'),
          createdAt: new Date('2026-04-07T01:15:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
              readAt: new Date('2026-04-07T01:30:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4571958520b3d200964de'),
            },
          ],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4571958520b3d200964df'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c6bfa05cf29f08f7ca'
          ),
          senderId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          encryptedData:
            'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
          iv: '6b8c0d2e4f6g8a0b',
          authTag: '9f8e7d6c5b4a3029',
          isRead: true,
          readAt: new Date('2026-04-07T01:45:00.000Z'),
          createdAt: new Date('2026-04-07T01:22:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
              readAt: new Date('2026-04-07T01:45:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4571958520b3d200964e0'),
            },
          ],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4571958520b3d200964e1'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c6bfa05cf29f08f7ca'
          ),
          senderId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          encryptedData:
            'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
          iv: '7c9d1e3f5g7h9a1c',
          authTag: '0a9f8e7d6c5b4130',
          isRead: true,
          readAt: new Date('2026-04-07T02:00:00.000Z'),
          createdAt: new Date('2026-04-07T01:35:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
              readAt: new Date('2026-04-07T02:00:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4571958520b3d200964e2'),
            },
          ],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4571958520b3d200964e3'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c7bfa05cf29f08f7cb'
          ),
          senderId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          encryptedData:
            'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4',
          iv: '8d0e2f4g6h8i0a2d',
          authTag: '1b0a9f8e7d6c5241',
          isRead: false,
          createdAt: new Date('2026-04-07T02:30:00.000Z'),
          readBy: [],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4571958520b3d200964e4'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c7bfa05cf29f08f7cb'
          ),
          senderId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          encryptedData:
            'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5',
          iv: '9e1f3g5h7i9j1b3e',
          authTag: '2c1b0a9f8e7d6352',
          isRead: true,
          readAt: new Date('2026-04-07T02:45:00.000Z'),
          createdAt: new Date('2026-04-07T02:35:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
              readAt: new Date('2026-04-07T02:45:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4571958520b3d200964e5'),
            },
          ],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4572158520b3d200964e6'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c8bfa05cf29f08f7cc'
          ),
          senderId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          encryptedData:
            'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6',
          iv: '0f2g4h6i8j0k2c4f',
          authTag: '3d2c1b0a9f8e7463',
          isRead: true,
          readAt: new Date('2026-04-07T03:15:00.000Z'),
          createdAt: new Date('2026-04-07T03:00:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
              readAt: new Date('2026-04-07T03:15:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4572158520b3d200964e7'),
            },
          ],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4572158520b3d200964e8'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c8bfa05cf29f08f7cc'
          ),
          senderId: new mongoose.Types.ObjectId('69d23d504be4c43be5973660'),
          encryptedData:
            'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7',
          iv: '1g3h5i7j9k1l3d5g',
          authTag: '4e3d2c1b0a9f8574',
          isRead: true,
          readAt: new Date('2026-04-07T03:30:00.000Z'),
          createdAt: new Date('2026-04-07T03:10:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
              readAt: new Date('2026-04-07T03:30:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4572158520b3d200964e9'),
            },
          ],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4572158520b3d200964ea'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c9bfa05cf29f08f7cd'
          ),
          senderId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
          encryptedData:
            'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8',
          iv: '2h4i6j8k0l2m4e6h',
          authTag: '5f4e3d2c1b0a9685',
          isRead: false,
          createdAt: new Date('2026-04-07T03:45:00.000Z'),
          readBy: [],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4572158520b3d200964eb'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c9bfa05cf29f08f7cd'
          ),
          senderId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
          encryptedData:
            'i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9',
          iv: '3i5j7k9l1m3n5f7i',
          authTag: '6g5f4e3d2c1b0a96',
          isRead: true,
          readAt: new Date('2026-04-07T04:00:00.000Z'),
          createdAt: new Date('2026-04-07T03:50:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
              readAt: new Date('2026-04-07T04:00:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4572158520b3d200964ec'),
            },
          ],
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d4572158520b3d200964ed'),
          conversationId: new mongoose.Types.ObjectId(
            '69d2a1c9bfa05cf29f08f7cd'
          ),
          senderId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a69'),
          encryptedData:
            'j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0',
          iv: '4j6k8l0m2n4o6g8j',
          authTag: '7h6g5f4e3d2c1ba7',
          isRead: true,
          readAt: new Date('2026-04-07T04:15:00.000Z'),
          createdAt: new Date('2026-04-07T04:05:00.000Z'),
          readBy: [
            {
              userId: new mongoose.Types.ObjectId('69d23d5c4be4c43be597366b'),
              readAt: new Date('2026-04-07T04:15:00.000Z'),
              _id: new mongoose.Types.ObjectId('69d4572158520b3d200964ee'),
            },
          ],
          __v: 0,
        },
      ];

      await db.collection('messages').insertMany(messages);
      console.log(`✓ ${messages.length} messages inserted`);

      console.log('\n✅ All messages data seeded successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error seeding messages data:', error);
      throw error;
    }
  },

  async down() {
    try {
      const db = mongoose.connection;
      await db.collection('messages').deleteMany({});
      console.log('✓ Rollback completed');
      return true;
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  },
};
