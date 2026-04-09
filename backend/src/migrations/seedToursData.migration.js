const mongoose = require('mongoose');

/**
 * Migration: Seed Tours Data
 * Thêm dữ liệu tour du lịch
 */

module.exports = {
  async up() {
    try {
      const db = mongoose.connection;

      const tours = [
        {
          _id: new mongoose.Types.ObjectId('69d2a4e7bfa05cf29f08f80c'),
          title: 'Hue Heritage 3-Day Tour',
          description: 'Một tour 3 ngày khám phá những di sản lịch sử của Huế',
          location: {
            type: 'Point',
            coordinates: [107.5905, 16.4738],
          },
          price: 3000000,
          duration: 3,
          maxGuests: 8,
          highlights: [
            'Đấu tranh điện hoàng độc lập',
            'Biểu tượng của hoàng anh kingdom',
            'Những mộ vua chiêu kỳ',
          ],
          inclusions: [
            'Accommodation',
            'Meals',
            'Transportation',
            'Guided tours',
          ],
          itinerary: [
            {
              day: 1,
              activities: [
                'Arrival and city orientation',
                'Visit Thien Mu Pagoda',
                'Evening boat ride',
              ],
            },
            {
              day: 2,
              activities: [
                'Royal Citadel tour',
                'Tomb of Khai Dinh',
                'Local market visit',
              ],
            },
            {
              day: 3,
              activities: ['DMZ history tour', 'Departure'],
            },
          ],
          images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          ],
          rating: 4.7,
          reviewCount: 18,
          available: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d2a4e8bfa05cf29f08f80d'),
          title: 'Sapa Trekking 2-Day Tour',
          description:
            'Khám phá vẻ đẹp tự nhiên của Sapa qua những bước đi trên núi',
          location: {
            type: 'Point',
            coordinates: [103.8436, 22.3402],
          },
          price: 2500000,
          duration: 2,
          maxGuests: 6,
          highlights: [
            'Terraced rice fields',
            'Local Hmong villages',
            'Mountain views',
            'Homestay experience',
          ],
          inclusions: [
            'Accommodation',
            'Meals',
            'Guided trekking',
            'Transportation',
          ],
          itinerary: [
            {
              day: 1,
              activities: [
                'Arrive Sapa',
                'Trekking Cat Cat village',
                'Homestay dinner',
              ],
            },
            {
              day: 2,
              activities: [
                'Early morning trek',
                'Visit Silver Spring',
                'Return to town',
              ],
            },
          ],
          images: [],
          rating: 4.8,
          reviewCount: 25,
          available: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d2a4e9bfa05cf29f08f80e'),
          title: 'Mekong Delta Floating Market Tour',
          description:
            'Trải nghiệm thị trường nổi ngoài trời và cuộc sống sông nước',
          location: {
            type: 'Point',
            coordinates: [106.0297, 10.0293],
          },
          price: 1800000,
          duration: 1,
          maxGuests: 10,
          highlights: [
            'Floating markets',
            'Fruit orchards',
            'Traditional Vietnamese breakfast',
            'Local life',
          ],
          inclusions: ['Breakfast', 'Lunch', 'Boat tour', 'Guided tour'],
          itinerary: [
            {
              day: 1,
              activities: [
                'Early morning boat pickup',
                'Floating market visit',
                'Orchard tour',
                'Return by evening',
              ],
            },
          ],
          images: [],
          rating: 4.5,
          reviewCount: 32,
          available: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d2a4eabfa05cf29f08f80f'),
          title: 'Halong Bay Luxury Cruise 2-Day',
          description: 'Tour 2 ngày trên tàu hạng sang khám phá vịnh Hạ Long',
          location: {
            type: 'Point',
            coordinates: [107.1909, 20.8449],
          },
          price: 4500000,
          duration: 2,
          maxGuests: 4,
          highlights: [
            'UNESCO World Heritage',
            'Limestone karsts',
            'Luxury cabins',
            'Seafood dinner',
          ],
          inclusions: [
            'Luxury accommodation',
            'All meals',
            'Cave tours',
            'Entertainment',
          ],
          itinerary: [
            {
              day: 1,
              activities: [
                'Boarding cruise',
                'Titop Island swim',
                'Sunset dinner cruise',
              ],
            },
            {
              day: 2,
              activities: [
                'Early morning Tai Chi',
                'Surprise cave',
                'Return to shore',
              ],
            },
          ],
          images: [],
          rating: 4.9,
          reviewCount: 48,
          available: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d2a4ebbfa05cf29f08f810'),
          title: 'Hoi An and Da Nang 3-Day Combo',
          description:
            'Kết hợp du lịch giữa cổ thành Hội An và thành phố hiện đại Đà Nẵng',
          location: {
            type: 'Point',
            coordinates: [108.3286, 15.8795],
          },
          price: 2800000,
          duration: 3,
          maxGuests: 6,
          highlights: [
            'Ancient town',
            'Lantern heritage',
            'Beautiful beaches',
            'Modern city life',
          ],
          inclusions: ['Accommodation', 'Meals', 'Tours', 'Transportation'],
          itinerary: [
            {
              day: 1,
              activities: [
                'Arrive Hoi An',
                'Ancient town walking tour',
                'Lantern craft workshop',
              ],
            },
            {
              day: 2,
              activities: ['Cooking class', 'Local market', 'Beach time'],
            },
            {
              day: 3,
              activities: [
                'Da Nang city tour',
                'Marble mountains',
                'Departure',
              ],
            },
          ],
          images: [],
          rating: 4.6,
          reviewCount: 20,
          available: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d2a4ecbfa05cf29f08f811'),
          title: 'Da Lat Romantic Getaway 2-Day',
          description: 'Kỳ nghỉ lãng mạn tại thành phố núi Đà Lạt',
          location: {
            type: 'Point',
            coordinates: [108.4417, 11.9388],
          },
          price: 1900000,
          duration: 2,
          maxGuests: 2,
          highlights: [
            'Flower gardens',
            'Lake views',
            'Mountain air',
            'Pine forests',
          ],
          inclusions: [
            'Romantic accommodation',
            'Breakfast',
            'Dinner',
            'Flower garden tour',
          ],
          itinerary: [
            {
              day: 1,
              activities: ['Arrival', 'Flower garden tour', 'Romantic dinner'],
            },
            {
              day: 2,
              activities: [
                'Morning hike',
                'Breakfast with lake view',
                'Departure',
              ],
            },
          ],
          images: [],
          rating: 4.8,
          reviewCount: 15,
          available: true,
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
      ];

      await db.collection('tours').insertMany(tours);
      console.log(`✓ ${tours.length} tours inserted`);

      console.log('\n✅ All tours data seeded successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error seeding tours data:', error);
      throw error;
    }
  },

  async down() {
    try {
      const db = mongoose.connection;
      await db.collection('tours').deleteMany({});
      console.log('✓ Rollback completed');
      return true;
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  },
};
