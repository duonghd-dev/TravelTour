import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from './src/modules/user/user.model.js';
import Artisan from './src/modules/artisan/artisan.model.js';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/travel_db';

const sampleUsers = [
  {
    firstName: 'Nguyễn',
    lastName: 'Văn Tâm',
    email: 'master-silk@example.com',
    phone: '0901234561',
    gender: 'male',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    role: 'artisan',
    status: 'active',
  },
  {
    firstName: 'Lê',
    lastName: 'Thị Mai',
    email: 'ceramic-master@example.com',
    phone: '0901234562',
    gender: 'female',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    role: 'artisan',
    status: 'active',
  },
  {
    firstName: 'Trần',
    lastName: 'Thanh Sơn',
    email: 'woodcarving-master@example.com',
    phone: '0901234563',
    gender: 'male',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    role: 'artisan',
    status: 'active',
  },
  {
    firstName: 'Đặng',
    lastName: 'Quốc Hùng',
    email: 'lacquer-master@example.com',
    phone: '0901234564',
    gender: 'male',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    role: 'artisan',
    status: 'active',
  },
  {
    firstName: 'Phạm',
    lastName: 'Thị Hương',
    email: 'embroidery-master@example.com',
    phone: '0901234565',
    gender: 'female',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    role: 'artisan',
    status: 'active',
  },
];

const createSampleArtisans = (userIds) => [
  {
    userId: userIds[0],
    title: 'Master Silk Weaver',
    craft: 'Silk Weaving',
    category: 'Traditional Crafts',
    experienceYears: 50,
    province: 'Quảng Nam',
    bio: 'Expert in traditional Vietnamese silk weaving',
    storytelling:
      'Specializing in brocade weaving techniques passed down through generations',
    isVerified: true,
    status: 'approved',
    ratingAverage: 4.9,
    totalReviews: 24,
  },
  {
    userId: userIds[1],
    title: 'Ceramic Master',
    craft: 'Ceramics',
    category: 'Traditional Crafts',
    experienceYears: 35,
    province: 'Hà Nội',
    bio: 'Creates beautiful hand-thrown ceramics',
    storytelling: 'Traditional pottery techniques with modern artistic vision',
    isVerified: true,
    status: 'approved',
    ratingAverage: 4.8,
    totalReviews: 18,
  },
  {
    userId: userIds[2],
    title: 'Wood Carving Artisan',
    craft: 'Woodworking',
    category: 'Traditional Crafts',
    experienceYears: 42,
    province: 'Ninh Bình',
    bio: 'Handcrafted wooden sculptures and furniture',
    storytelling: 'Creating masterpieces from sustainable wood sources',
    isVerified: true,
    status: 'approved',
    ratingAverage: 4.7,
    totalReviews: 31,
  },
  {
    userId: userIds[3],
    title: 'Lacquerware Expert',
    craft: 'Lacquerwork',
    category: 'Traditional Crafts',
    experienceYears: 38,
    province: 'Thừa Thiên Huế',
    bio: 'Traditional Vietnamese lacquer art',
    storytelling: 'Master of ancient lacquering techniques from Imperial Huế',
    isVerified: true,
    status: 'approved',
    ratingAverage: 5.0,
    totalReviews: 22,
  },
  {
    userId: userIds[4],
    title: 'Embroidery Master',
    craft: 'Embroidery',
    category: 'Textile Arts',
    experienceYears: 30,
    province: 'Đà Nẵng',
    bio: 'Fine hand embroidery with traditional patterns',
    storytelling: 'Creating beautiful textile art with silk threads',
    isVerified: false,
    status: 'approved',
    ratingAverage: 4.6,
    totalReviews: 15,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Kết nối MongoDB thành công');

    const deletedUsers = await User.deleteMany({
      email: { $in: sampleUsers.map((u) => u.email) },
    });
    console.log(`✓ Xóa ${deletedUsers.deletedCount} user cũ`);

    const deletedArtisans = await Artisan.deleteMany({
      title: {
        $in: [
          'Master Silk Weaver',
          'Ceramic Master',
          'Wood Carving Artisan',
          'Lacquerware Expert',
          'Embroidery Master',
        ],
      },
    });
    console.log(`✓ Xóa ${deletedArtisans.deletedCount} artisan cũ`);

    const users = await User.insertMany(sampleUsers);
    const userIds = users.map((u) => u._id);
    console.log(`✓ Tạo ${users.length} user test`);

    const sampleArtisans = createSampleArtisans(userIds);
    const artisans = await Artisan.insertMany(sampleArtisans);
    console.log(`✓ Tạo ${artisans.length} artisan test`);

    console.log('\n📋 Danh sách artisans đã tạo:');
    artisans.forEach((artisan, index) => {
      const user = users[index];
      console.log(
        `  ${index + 1}. ${user.firstName} ${user.lastName} - ${artisan.craft}`
      );
    });

    await mongoose.connection.close();
    console.log('\n✓ Hoàn thành! Database đã sẵn sàng test.');
  } catch (error) {
    console.error('✗ Lỗi:', error.message);
    process.exit(1);
  }
}

seedDatabase();
