/**
 * EMOJI UTILITY EXAMPLES
 * Ví dụ sử dụng các hàm xử lý emoji
 */

const {
  hasEmoji,
  stripEmoji,
  stripEmojiMiddleware,
  emojiValidator,
  sanitizeObject,
} = require('../common/utils/emoji.js');

// ============================================
// EXAMPLE 1: Kiểm tra emoji trong text
// ============================================
console.log('🧘‍♀️ Example 1: Kiểm tra emoji trong text');

const text1 = 'Meditation Spa 🧘‍♀️';
const text2 = 'Royal Citadel';

console.log(`hasEmoji("${text1}"):`, hasEmoji(text1)); // true
console.log(`hasEmoji("${text2}"):`, hasEmoji(text2)); // false

// ============================================
// EXAMPLE 2: Loại bỏ emoji
// ============================================
console.log('\n🗑️ Example 2: Loại bỏ emoji');

const dirtyText = '🏛️ Royal Citadel 🚣‍♂️ Perfume River 🗿';
const cleanText = stripEmoji(dirtyText);

console.log(`Original: ${dirtyText}`);
console.log(`Cleaned: ${cleanText}`);

// ============================================
// EXAMPLE 3: Sử dụng stripEmojiMiddleware
// ============================================
console.log('\n⚙️ Example 3: Middleware cho Express');

const exampleMiddleware = `
// Trong app.js
import { stripEmojiMiddleware } from './common/utils/emoji.js';

app.use(express.json());
app.use(stripEmojiMiddleware); // Áp dụng trên tất cả routes

// Hoặc chỉ trên route cụ thể:
app.post('/api/hotels', stripEmojiMiddleware, createHotel);
`;

console.log(exampleMiddleware);

// ============================================
// EXAMPLE 4: Dùng trong Mongoose Schema
// ============================================
console.log('\n📋 Example 4: Validator trong Schema');

const schemaExample = `
import { emojiValidator } from '../common/utils/emoji.js';

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: emojiValidator  // Ngăn emoji
  },
  amenities: [{
    icon: {
      type: String,
      validate: emojiValidator  // Ngăn emoji
    },
    name: {
      type: String,
      validate: emojiValidator
    }
  }]
});
`;

console.log(schemaExample);

// ============================================
// EXAMPLE 5: Sanitize Object
// ============================================
console.log('\n🧹 Example 5: Sanitize Object');

const dirtyObject = {
  name: 'The Ancient Lotus 🏛️',
  amenities: [
    { icon: '🧘‍♀️', name: 'Meditation Spa' },
    { icon: '🍽️', name: 'Fine Dining' },
  ],
  rating: 4.8,
};

const cleanObject = sanitizeObject(dirtyObject);

console.log('Before sanitization:');
console.log(JSON.stringify(dirtyObject, null, 2));

console.log('\nAfter sanitization:');
console.log(JSON.stringify(cleanObject, null, 2));

// ============================================
// EXAMPLE 6: Sử dụng trong Controller
// ============================================
console.log('\n🎮 Example 6: Sử dụng trong Controller');

const controllerExample = `
import { hasEmoji, stripEmoji } from '../common/utils/emoji.js';

export const createHotel = async (req, res) => {
  try {
    const { name, amenities } = req.body;

    // Kiểm tra nếu có emoji
    if (hasEmoji(name)) {
      return res.status(400).json({
        success: false,
        message: 'Tên khách sạn không được chứa emoji',
        received: name
      });
    }

    // Hoặc tự động loại bỏ
    const cleanedName = stripEmoji(name);

    const hotel = await Hotel.create({
      name: cleanedName,
      amenities
    });

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
`;

console.log(controllerExample);

// ============================================
// EXAMPLE 7: Custom validation error handling
// ============================================
console.log('\n⚠️ Example 7: Custom validation handling');

const validationExample = `
// Global error handler
app.use((error, req, res, next) => {
  if (error.message.includes('emoji')) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Dữ liệu chứa emoji không được phép. Vui lòng loại bỏ emoji và thử lại.',
      field: error.path
    });
  }
  // ... other error handling
});
`;

console.log(validationExample);

// ============================================
// EXAMPLE 8: Testing
// ============================================
console.log('\n🧪 Example 8: Unit Test Examples');

const testExample = `
const { hasEmoji, stripEmoji } = require('../common/utils/emoji.js');

describe('Emoji Utility Tests', () => {
  
  test('hasEmoji should return true for text with emoji', () => {
    const result = hasEmoji('Hello 👋');
    expect(result).toBe(true);
  });

  test('hasEmoji should return false for text without emoji', () => {
    const result = hasEmoji('Hello World');
    expect(result).toBe(false);
  });

  test('stripEmoji should remove all emojis', () => {
    const result = stripEmoji('🏛️ Royal Citadel 🚣‍♂️');
    expect(result).toBe('Royal Citadel');
  });

  test('stripEmoji should preserve text', () => {
    const input = 'Hello World 👋';
    const result = stripEmoji(input);
    expect(result).toContain('Hello World');
  });
});
`;

console.log(testExample);

// ============================================
// SUMMARY
// ============================================
console.log('\n✅ SUMMARY');
console.log('================================');
console.log('1. hasEmoji(text) - Kiểm tra emoji');
console.log('2. stripEmoji(text) - Xoá emoji');
console.log('3. stripEmojiMiddleware - Middleware cho Express');
console.log('4. emojiValidator - Validator cho Mongoose');
console.log('5. sanitizeObject(obj) - Sanitize object');
console.log('================================\n');
