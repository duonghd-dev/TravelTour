const mongoose = require('mongoose');

/**
 * Migration: Seed Experiences and Hotels Data
 * Thêm dữ liệu trải nghiệm và khách sạn
 */

module.exports = {
  async up() {
    try {
      const db = mongoose.connection;

      // Experiences
      const experiences = [
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a78'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          title: 'Tạo hình gốm tay tự do tại Bát Tràng',
          description:
            'Tìm hiểu quy trình tạo hình gốm truyền thống với các thợ gốm lão luyện',
          category: 'pottery',
          price: 450000,
          duration: 120,
          maxParticipants: 6,
          location: {
            type: 'Point',
            coordinates: [105.8337, 20.9841],
          },
          images: [
            'https://file3.qdnd.vn/data/images/0/2025/01/31/upload_1021/gom1.jpg?dpi=150&quality=100&w=870',
            'https://file3.qdnd.vn/data/images/0/2025/01/31/upload_1021/gom2.jpg?dpi=150&quality=100&w=870',
          ],
          timeSlots: ['09:00', '14:00'],
          available: true,
          rating: 4.8,
          reviewCount: 18,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a79'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          title: 'Lớp thêu lụa tay với các mô típ truyền thống',
          description:
            'Học kỹ năng thêu tay cơ bản với các mô típ hôn nhân và phong phú',
          category: 'embroidery',
          price: 380000,
          duration: 150,
          maxParticipants: 4,
          location: {
            type: 'Point',
            coordinates: [105.8456, 20.9912],
          },
          images: [
            'https://images2.thanhnien.vn/528068263637045248/2024/11/21/c3608mp400505710still002-1732187342444691988050.png',
          ],
          timeSlots: ['08:00', '13:00', '15:30'],
          available: true,
          rating: 4.9,
          reviewCount: 22,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a7a'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          title: 'Dệt lụa trên khung dệt truyền thống',
          description:
            'Khám phá quy trình dệt lụa từ tơ tằm thô đến những sản phẩm thành phẩm',
          category: 'silk_weaving',
          price: 520000,
          duration: 180,
          maxParticipants: 3,
          location: {
            type: 'Point',
            coordinates: [105.7985, 20.978],
          },
          images: [
            'https://file3.qdnd.vn/data/images/0/2025/01/07/upload_1021/nghenhanlua8.jpg?dpi=150&quality=100&w=870',
          ],
          timeSlots: ['09:00', '14:00'],
          available: true,
          rating: 4.7,
          reviewCount: 15,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a7b'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
          title: 'Làm nón lưỡi rơi truyền thống Thanh Trì',
          description:
            'Tìm hiểu quy trình làm nón lưỡi rơi từ cắt tre đến khâu tay truyền thống',
          category: 'hat_making',
          price: 350000,
          duration: 90,
          maxParticipants: 5,
          location: {
            type: 'Point',
            coordinates: [105.9234, 21.0285],
          },
          images: [
            'https://thuonghieuvaphapluat.vn/Images/huyentt/2023/02/27/ce3%20(1).png',
          ],
          timeSlots: ['08:00', '10:00', '13:00'],
          available: true,
          rating: 4.6,
          reviewCount: 12,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a7c'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a69'),
          title: 'Sơn mài truyền thống với kỹ thuật khắc chạm',
          description:
            'Học cách sơn lớp và tạo hoa văn truyền thống trên sơn mài',
          category: 'lacquerware',
          price: 480000,
          duration: 120,
          maxParticipants: 4,
          location: {
            type: 'Point',
            coordinates: [105.8523, 20.9756],
          },
          images: [
            'https://file3.qdnd.vn/data/images/0/2023/02/14/tranthaiphuong/z4109062766378_2c301111624d743b299ecfe4b581b2d9.jpg?dpi=150&quality=100&w=870',
          ],
          timeSlots: ['09:00', '14:00'],
          available: true,
          rating: 4.8,
          reviewCount: 25,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a7d'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          title: 'Xoay bánh xe gốm - Kỹ thuật cơ bản',
          description:
            'Tìm hiểu kỹ thuật xoay bánh xe gốm, một kỹ năng cơ bản của thợ gốm',
          category: 'pottery',
          price: 500000,
          duration: 150,
          maxParticipants: 5,
          location: {
            type: 'Point',
            coordinates: [105.8337, 20.9841],
          },
          images: [
            'https://file3.qdnd.vn/data/images/0/2025/01/31/upload_1021/gom3.jpg?dpi=150&quality=100&w=870',
          ],
          timeSlots: ['10:00', '15:00'],
          available: true,
          rating: 4.5,
          reviewCount: 8,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a7e'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          title: 'Thiết kế mô típ thêu riêng',
          description:
            'Thiết kế mô típ thêu riêng dành cho bạn từ các bản vẽ truyền thống',
          category: 'embroidery',
          price: 600000,
          duration: 180,
          maxParticipants: 2,
          location: {
            type: 'Point',
            coordinates: [105.8456, 20.9912],
          },
          images: [
            'https://images2.thanhnien.vn/528068263637045248/2024/11/21/c3608mp400505710still002-1732187342444691988050.png',
          ],
          timeSlots: ['09:00', '14:00'],
          available: true,
          rating: 4.7,
          reviewCount: 10,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a7f'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          title: 'Nhuộm lụa - Quy trình nhuộm tự nhiên',
          description: 'Học quy trình nhuộm lụa bằng các nguyên liệu tự nhiên',
          category: 'silk_weaving',
          price: 420000,
          duration: 120,
          maxParticipants: 4,
          location: {
            type: 'Point',
            coordinates: [105.7985, 20.978],
          },
          images: [
            'https://file3.qdnd.vn/data/images/0/2025/01/07/upload_1021/nghenhanlua8.jpg?dpi=150&quality=100&w=870',
          ],
          timeSlots: ['08:00', '13:00'],
          available: true,
          rating: 4.4,
          reviewCount: 6,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a80'),
          artisanId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a69'),
          title: 'Khâu tay trên sơn mài',
          description:
            'Học kỹ thuật khâu tay để tạo các chi tiết tinh tế trên sơn mài',
          category: 'lacquerware',
          price: 400000,
          duration: 100,
          maxParticipants: 4,
          location: {
            type: 'Point',
            coordinates: [105.8523, 20.9756],
          },
          images: [
            'https://file3.qdnd.vn/data/images/0/2023/02/14/tranthaiphuong/z4109062766378_2c301111624d743b299ecfe4b581b2d9.jpg?dpi=150&quality=100&w=870',
          ],
          timeSlots: ['09:00', '14:00', '16:00'],
          available: true,
          rating: 4.6,
          reviewCount: 9,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
      ];

      await db.collection('experiences').insertMany(experiences);
      console.log(`✓ ${experiences.length} experiences inserted`);

      // Hotels
      const hotels = [
        {
          _id: new mongoose.Types.ObjectId('69d297b5543cce0ccd8373a6'),
          title: 'Ancient Lotus Sanctuary',
          description:
            'Một nơi trú ẩn yên tĩnh ở một Hà Nội yên tĩnh, nơi cảnh sắc Á Đông được chế tác và sáng tạo',
          category: 'boutique',
          address: 'Hoàn Kiếm, Hà Nội',
          location: {
            type: 'Point',
            coordinates: [105.8502, 21.0294],
          },
          pricePerNight: 2100000,
          starRating: 5,
          amenities: ['WiFi', 'Spa', 'Restaurant', 'Parking'],
          images: [
            'https://www.elledecoration.com.mx/upload/images/A/Ancient-Lotus-Sanctuary.jpg',
          ],
          availableRooms: 3,
          totalRooms: 12,
          rating: 4.9,
          reviewCount: 45,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d297b6543cce0ccd8373b3'),
          title: 'Sapa Jade Hill',
          description:
            'Resort bungalow nằm trên đồi ngắm nhìn thắng cảnh Sapa và vùng quanh',
          category: 'resort',
          address: 'Sapa, Lào Cai',
          location: {
            type: 'Point',
            coordinates: [103.8436, 22.3402],
          },
          pricePerNight: 3600000,
          starRating: 5,
          amenities: ['WiFi', 'Mountain View', 'Restaurant', 'Hiking Tours'],
          images: [
            'https://www.elledecoration.com.mx/upload/images/A/Sapa-Jade-Hill.jpg',
          ],
          availableRooms: 2,
          totalRooms: 8,
          rating: 4.8,
          reviewCount: 32,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d297b7543cce0ccd8373c0'),
          title: 'Mekong Riverside Hotel',
          description: 'Khách sạn ven dòng sông Mê Kông với tầm nhìn tuyệt đẹp',
          category: 'hotel',
          address: 'Cần Thơ, Tiền Giang',
          location: {
            type: 'Point',
            coordinates: [106.0297, 10.0293],
          },
          pricePerNight: 1800000,
          starRating: 4,
          amenities: ['WiFi', 'River View', 'Restaurant', 'Boat Tours'],
          images: [],
          availableRooms: 5,
          totalRooms: 20,
          rating: 4.6,
          reviewCount: 28,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d297b8543cce0ccd8373c7'),
          title: 'Halong Bay Paradise',
          description: 'Luxury cruise trên vịnh Hạ Long với đêm ở trên tàu',
          category: 'cruise',
          address: 'Hạ Long, Quảng Ninh',
          location: {
            type: 'Point',
            coordinates: [107.1909, 20.8449],
          },
          pricePerNight: 4500000,
          starRating: 5,
          amenities: ['WiFi', 'Luxury Cabins', 'Restaurant', 'Cave Tours'],
          images: [],
          availableRooms: 4,
          totalRooms: 15,
          rating: 4.9,
          reviewCount: 38,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d297b9543cce0ccd8373ce'),
          title: 'Hoi An Ancient Town Hotel',
          description: 'Khách sạn nhỏ quyến rũ trong ngôi làng cổ của Hội An',
          category: 'boutique',
          address: 'Hội An, Quảng Nam',
          location: {
            type: 'Point',
            coordinates: [108.3286, 15.8795],
          },
          pricePerNight: 2300000,
          starRating: 4,
          amenities: [
            'WiFi',
            'Ancient Town View',
            'Restaurant',
            'Lantern Dinner',
          ],
          images: [],
          availableRooms: 3,
          totalRooms: 10,
          rating: 4.7,
          reviewCount: 26,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d297ba543cce0ccd8373d5'),
          title: 'Da Lat Highland Resort',
          description:
            'Resort ở thành phố lạnh nhất Việt Nam với không khí mát mẻ',
          category: 'resort',
          address: 'Đà Lạt, Lâm Đồng',
          location: {
            type: 'Point',
            coordinates: [108.4417, 11.9388],
          },
          pricePerNight: 1900000,
          starRating: 4,
          amenities: ['WiFi', 'Flower Gardens', 'Restaurant', 'Hiking Trails'],
          images: [],
          availableRooms: 6,
          totalRooms: 18,
          rating: 4.5,
          reviewCount: 22,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
      ];

      await db.collection('hotels').insertMany(hotels);
      console.log(`✓ ${hotels.length} hotels inserted`);

      console.log('\n✅ All experiences and hotels data seeded successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error seeding experiences and hotels data:', error);
      throw error;
    }
  },

  async down() {
    try {
      const db = mongoose.connection;
      await db.collection('experiences').deleteMany({});
      await db.collection('hotels').deleteMany({});
      console.log('✓ Rollback completed');
      return true;
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  },
};
