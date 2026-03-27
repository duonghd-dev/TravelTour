import mongoose from 'mongoose';
import logger from '../common/utils/logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    logger.info('Kết nối MongoDB thành công');
  } catch (error) {
    logger.error('Lỗi khi kết nối DB:', error.message);
    process.exit(1);
  }
};
