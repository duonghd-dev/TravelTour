const mongoose = require('mongoose');

/**
 * Migration: Seed Artisans Data
 * Thêm dữ liệu nghệ nhân với thông tin chi tiết
 */

module.exports = {
  async up() {
    try {
      const db = mongoose.connection;

      const artisans = [
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a65'),
          userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a5e'),
          bio: 'Tôi là một thợ gốm truyền thống với hơn 30 năm kinh nghiệm. Tôi đã học từ cha mình và hiện đang dạy cho các con trai của tôi.',
          skills: ['Gốm Bát Tràng', 'Tạo hình tay', 'Quay bánh xe gốm'],
          images: [
            'https://file3.qdnd.vn/data/images/0/2025/01/31/upload_1021/gom1.jpg?dpi=150&quality=100&w=870',
            'https://file3.qdnd.vn/data/images/0/2025/01/31/upload_1021/gom3.jpg?dpi=150&quality=100&w=870',
          ],
          certifications: [
            {
              name: 'Nhà thủ công truyền thống',
              issuedBy: 'Bộ Du lịch',
              issuedDate: new Date('2020-01-15'),
            },
          ],
          workshopLocation: {
            type: 'Point',
            coordinates: [105.8337, 20.9841],
          },
          languagesSpoken: ['Tiếng Việt', 'Tiếng Anh cơ bản'],
          yearsExperience: 30,
          studioName: 'Gốm Bát Tràng Truyền Thống',
          studioDescription:
            'Một xưởng gốm gia đình truyền thống nằm ở trung tâm ngôi làng nổi tiếng Bát Tràng',
          rating: 4.8,
          reviewCount: 18,
          responseTime: 24,
          cancellationRate: 0,
          isVerified: true,
          verificationDate: new Date('2026-01-15'),
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a66'),
          userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a5f'),
          bio: 'Thợ thêu tay truyền thống với kỹ năng khâu tay tinh tế. Tôi chuyên về các mô típ truyền thống Việt Nam.',
          skills: ['Thêu tay', 'Thêu lụa', 'Thêu vàng'],
          images: [
            'https://images2.thanhnien.vn/528068263637045248/2024/11/21/c3608mp400505710still002-1732187342444691988050.png',
          ],
          certifications: [
            {
              name: 'Thợ thêu cấp cao',
              issuedBy: 'Hiệp hội Thêu Việt Nam',
              issuedDate: new Date('2019-06-20'),
            },
          ],
          workshopLocation: {
            type: 'Point',
            coordinates: [105.8456, 20.9912],
          },
          languagesSpoken: ['Tiếng Việt', 'Tiếng Pháp'],
          yearsExperience: 25,
          studioName: 'Xưởng Thêu Lụa Hà Nội',
          studioDescription:
            'Xưởng thêu lụa truyền thống với các bản vẽ độc lập từ các thợ thêu có kinh nghiệm',
          rating: 4.9,
          reviewCount: 22,
          responseTime: 12,
          cancellationRate: 0,
          isVerified: true,
          verificationDate: new Date('2026-01-20'),
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a67'),
          userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a60'),
          bio: 'Thợ dệt lụa tơ tằm với kỹ năng sử dụng khung dệt truyền thống. Tôi sản xuất lụa nguyên chất từ tơ tằm.',
          skills: ['Dệt lụa', 'Nhuộm lụa', 'Thiết kế hoa văn'],
          images: [
            'https://file3.qdnd.vn/data/images/0/2025/01/07/upload_1021/nghenhanlua8.jpg?dpi=150&quality=100&w=870',
          ],
          certifications: [
            {
              name: 'Nhà sản xuất lụa truyền thống',
              issuedBy: 'Bộ Công Thương',
              issuedDate: new Date('2018-03-10'),
            },
          ],
          workshopLocation: {
            type: 'Point',
            coordinates: [105.7985, 20.978],
          },
          languagesSpoken: ['Tiếng Việt'],
          yearsExperience: 28,
          studioName: 'Xưởng Dệt Lụa Mỹ Đức',
          studioDescription:
            'Xưởng dệt lụa với các khung dệt truyền thống, sản xuất lụa cao cấp từ tơ tằm',
          rating: 4.7,
          reviewCount: 15,
          responseTime: 36,
          cancellationRate: 0,
          isVerified: true,
          verificationDate: new Date('2026-02-05'),
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a68'),
          userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a61'),
          bio: 'Thợ làm nón truyền thống lưỡi rơi, chuyên cắt chỉ và khâu tay. Tôi đã tham gia vào dự án bảo tồn nón truyền thống.',
          skills: ['Làm nón lưỡi rơi', 'Cắt chỉ', 'Khâu tay'],
          images: [
            'https://thuonghieuvaphapluat.vn/Images/huyentt/2023/02/27/ce3%20(1).png',
          ],
          certifications: [
            {
              name: 'Nghệ nhân làm nón lưỡi rơi',
              issuedBy: 'Liên hiệp các hợp tác xã',
              issuedDate: new Date('2017-09-15'),
            },
          ],
          workshopLocation: {
            type: 'Point',
            coordinates: [105.9234, 21.0285],
          },
          languagesSpoken: ['Tiếng Việt', 'Tiếng Anh cơ bản'],
          yearsExperience: 22,
          studioName: 'Xưởng Nón Thanh Trì',
          studioDescription:
            'Xưởng sản xuất nón lưỡi rơi truyền thống của làng Thanh Trì',
          rating: 4.6,
          reviewCount: 12,
          responseTime: 48,
          cancellationRate: 2,
          isVerified: true,
          verificationDate: new Date('2026-02-10'),
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
        {
          _id: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a69'),
          userId: new mongoose.Types.ObjectId('69d1f6012b49752029cc9a62'),
          bio: 'Thợ sơn mài truyền thống với kỹ năng sơn từng lớp. Tôi chuyên về sơn mài có hoa văn truyền thống và hiện đại.',
          skills: ['Sơn mài', 'Khắc chạm', 'Tạo hoa văn'],
          images: [
            'https://file3.qdnd.vn/data/images/0/2023/02/14/tranthaiphuong/z4109062766378_2c301111624d743b299ecfe4b581b2d9.jpg?dpi=150&quality=100&w=870',
          ],
          certifications: [
            {
              name: 'Thợ sơn mài cấp cao',
              issuedBy: 'Hiệp hội Kỹ nghệ Sơn Mài',
              issuedDate: new Date('2016-05-20'),
            },
          ],
          workshopLocation: {
            type: 'Point',
            coordinates: [105.8523, 20.9756],
          },
          languagesSpoken: ['Tiếng Việt'],
          yearsExperience: 32,
          studioName: 'Xưởng Sơn Mài Cổ Truyền',
          studioDescription:
            'Xưởng sơn mài với các bản vẽ truyền thống và sản phẩm hiện đại',
          rating: 4.8,
          reviewCount: 25,
          responseTime: 24,
          cancellationRate: 0,
          isVerified: true,
          verificationDate: new Date('2026-01-25'),
          createdAt: new Date('2026-04-05T05:41:21.022Z'),
          updatedAt: new Date('2026-04-05T05:41:21.022Z'),
          __v: 0,
        },
      ];

      await db.collection('artisans').insertMany(artisans);
      console.log(`✓ ${artisans.length} artisans inserted`);

      console.log('\n✅ All artisan data seeded successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error seeding artisan data:', error);
      throw error;
    }
  },

  async down() {
    try {
      const db = mongoose.connection;
      await db.collection('artisans').deleteMany({});
      console.log('✓ Rollback completed');
      return true;
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  },
};
