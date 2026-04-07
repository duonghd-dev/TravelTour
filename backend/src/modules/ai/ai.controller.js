import groqService from '../../services/groq.service.js';
import Experience from '../../modules/experience/experience.model.js';
import Tour from '../../modules/tour/tour.model.js';
import Artisan from '../../modules/artisan/artisan.model.js';
import Hotel from '../../modules/hotel/hotel.model.js';
import asyncHandler from '../../common/utils/asyncHandler.js';
import AppError from '../../common/errors/AppError.js';

/**
 * Tìm dữ liệu liên quan từ DB dựa vào query
 */
const searchRelevantData = async (query) => {
  try {
    const searchRegex = new RegExp(query, 'i');

    const [experiences, tours, artisans, hotels] = await Promise.all([
      Experience.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
        ],
      }).limit(3),
      Tour.find({
        $or: [{ name: searchRegex }, { description: searchRegex }],
      }).limit(3),
      Artisan.find({
        $or: [
          { craft: searchRegex },
          { category: searchRegex },
          { storytelling: searchRegex },
        ],
      })
        .populate('userId', 'firstName lastName')
        .limit(3),
      Hotel.find({
        $or: [{ name: searchRegex }, { description: searchRegex }],
      }).limit(3),
    ]);

    return {
      experiences,
      tours,
      artisans,
      hotels,
    };
  } catch (error) {
    console.error('[searchRelevantData] Error:', error);
    return {
      experiences: [],
      tours: [],
      artisans: [],
      hotels: [],
    };
  }
};

/**
 * @route   POST /api/v1/ai/suggest
 * @desc    Lấy tư vấn từ AI dựa vào dữ liệu database
 * @access  Public
 */
export const getAISuggestion = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    throw new AppError('Vui lòng nhập câu hỏi', 400);
  }

  if (!process.env.GROQ_API_KEY) {
    throw new AppError('Groq API key không được cấu hình', 500);
  }

  // Tìm dữ liệu liên quan
  const contextData = await searchRelevantData(message);

  // Gọi Groq API
  const result = await groqService.generateAdvice(message, contextData);

  if (!result.success) {
    throw new AppError('Không thể lấy tư vấn từ AI', 500);
  }

  res.status(200).json({
    success: true,
    data: {
      suggestion: result.data,
      usage: result.usage,
    },
    message: 'Lấy tư vấn thành công',
  });
});

/**
 * @route   GET /api/v1/ai/health
 * @desc    Kiểm tra Groq API connection
 * @access  Public
 */
export const checkAIHealth = asyncHandler(async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(200).json({
      success: false,
      message: 'Groq API key không được cấu hình',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Groq API sẵn sàng',
  });
});
