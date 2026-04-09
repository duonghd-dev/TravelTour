/**
 * Utility để xử lý emoji trong hệ thống
 * Để đảm bảo không có emoji trong toàn bộ ứng dụng
 */

/**
 * Kiểm tra xem text có chứa emoji không
 * @param {string} text - Text cần kiểm tra
 * @returns {boolean}
 */
const hasEmoji = (text) => {
  if (!text) return false;
  const emojiRegex =
    /(\u{1F300}-\u{1F9FF})|(\u{2600}-\u{27BF})|(\u{1F600}-\u{1F64F})|(\u{1F680}-\u{1F6FF})|(\u{2300}-\u{23FF})|(\u{2B50})|(\u{2B06})|(\u{2B07})|(\u{2B05})|(\u{27A1})/gu;
  return emojiRegex.test(String(text));
};

/**
 * Loại bỏ tất cả emoji từ text
 * @param {string} text - Text cần làm sạch
 * @returns {string} - Text đã xoá emoji
 */
const stripEmoji = (text) => {
  if (!text) return text;
  const emojiRegex =
    /(\u{1F300}-\u{1F9FF})|(\u{2600}-\u{27BF})|(\u{1F600}-\u{1F64F})|(\u{1F680}-\u{1F6FF})|(\u{2300}-\u{23FF})|(\u{2B50})|(\u{2B06})|(\u{2B07})|(\u{2B05})|(\u{27A1})/gu;
  return String(text).replace(emojiRegex, '').trim();
};

/**
 * Middleware để tự động loại bỏ emoji từ request body
 * Sử dụng: app.use(stripEmojiMiddleware);
 */
const stripEmojiMiddleware = (req, res, next) => {
  const stripValue = (value) => {
    if (typeof value === 'string') {
      return stripEmoji(value);
    } else if (typeof value === 'object' && value !== null) {
      const stripped = {};
      for (const key in value) {
        stripped[key] = stripValue(value[key]);
      }
      return Array.isArray(value) ? Object.values(stripped) : stripped;
    }
    return value;
  };

  if (req.body) {
    req.body = stripValue(req.body);
  }

  next();
};

/**
 * Validator cho Mongoose schema để ngăn chặn emoji
 * Sử dụng trong schema: city: { type: String, validate: emojiValidator }
 */
const emojiValidator = {
  validator: function (value) {
    if (!value) return true;
    return !hasEmoji(value);
  },
  message:
    'Trường này không được chứa emoji (Emoji không được phép trong dữ liệu)',
};

/**
 * Sanitize object - xóa emoji từ tất cả string fields
 * @param {object} obj - Object cần sanitize
 * @returns {object} - Object đã được làm sạch
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? stripEmoji(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        sanitized[key] = stripEmoji(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

export {
  hasEmoji,
  stripEmoji,
  stripEmojiMiddleware,
  emojiValidator,
  sanitizeObject,
};
