import mongoose from 'mongoose';
import logger from '../common/utils/logger.js';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_CONNECTION;

    if (!mongoUri) {
      throw new Error('MONGODB_CONNECTION environment variable is not set');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('✅ Kết nối MongoDB thành công');
    return mongoose.connection;
  } catch (error) {
    logger.error('❌ Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

// Disconnect handler
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✅ Ngắt kết nối MongoDB thành công');
  } catch (error) {
    logger.error('❌ Lỗi ngắt kết nối MongoDB:', error.message);
  }
};

export default mongoose;
