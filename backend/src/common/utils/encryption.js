/**
 * Encryption/Decryption Utility
 * Sử dụng AES-256-GCM cho dữ liệu nhạy cảm (messages, payment info, personal data)
 * Sử dụng HMAC SHA256 cho hashing (OTP verification)
 */

import crypto from 'crypto';
import { logger } from './logger.js';

// Lấy encryption key từ environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const HASH_ALGORITHM = 'sha256';

// Validate ENCRYPTION_KEY
if (!ENCRYPTION_KEY) {
  logger.warn(
    '⚠️  ENCRYPTION_KEY không được set trong .env - Encryption sẽ không hoạt động. Thiết lập: ENCRYPTION_KEY=<32-byte-hex-key>'
  );
}

/**
 * Encrypt data sử dụng AES-256-GCM
 * @param {string} plaintext - Dữ liệu cần mã hóa
 * @returns {object} { encryptedData, iv, authTag } - Cần lưu cả 3 để decrypt
 * @throws {Error} nếu ENCRYPTION_KEY không được set
 */
const encrypt = (plaintext) => {
  if (!ENCRYPTION_KEY) {
    logger.error('❌ ENCRYPTION_KEY not found in environment variables');
    throw new Error('Encryption key is not configured');
  }

  try {
    // Tạo IV (Initialization Vector) ngẫu nhiên 16 bytes
    const iv = crypto.randomBytes(16);

    // Convert key từ hex string thành Buffer (ENCRYPTION_KEY phải 32 bytes = 64 hex chars)
    const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

    // Tạo cipher
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, keyBuffer, iv);

    // Mã hóa dữ liệu
    let encryptedData = cipher.update(plaintext, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // Lấy authentication tag (GCM mode)
    const authTag = cipher.getAuthTag();

    // Trả về object với tất cả cần thiết để decrypt
    return {
      encryptedData,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  } catch (error) {
    logger.error('❌ Encryption error:', error.message);
    throw error;
  }
};

/**
 * Decrypt data sử dụng AES-256-GCM
 * @param {object} encryptedObject - { encryptedData, iv, authTag }
 * @returns {string} - Plaintext đã giải mã
 * @throws {Error} nếu authentication tag không khớp (dữ liệu bị modify)
 */
const decrypt = (encryptedObject) => {
  if (!ENCRYPTION_KEY) {
    logger.error('❌ ENCRYPTION_KEY not found in environment variables');
    throw new Error('Encryption key is not configured');
  }

  try {
    const { encryptedData, iv, authTag } = encryptedObject;

    if (!encryptedData || !iv || !authTag) {
      throw new Error('Missing required fields: encryptedData, iv, authTag');
    }

    // Convert hex string thành Buffer
    const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    // Tạo decipher
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      keyBuffer,
      ivBuffer
    );

    // Set auth tag
    decipher.setAuthTag(authTagBuffer);

    // Giải mã dữ liệu
    let plaintext = decipher.update(encryptedData, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
  } catch (error) {
    logger.error('❌ Decryption error:', error.message);
    throw new Error('Decryption failed - data may be corrupted or tampered');
  }
};

/**
 * Encrypt object (JSON) - tiện lợi cho dữ liệu complex
 * @param {object} data - Object cần mã hóa
 * @returns {object} - Encrypted object
 */
const encryptObject = (data) => {
  const jsonString = JSON.stringify(data);
  return encrypt(jsonString);
};

/**
 * Decrypt object (JSON)
 * @param {object} encryptedObject - Encrypted JSON object
 * @returns {object} - Decrypted object
 */
const decryptObject = (encryptedObject) => {
  const plaintext = decrypt(encryptedObject);
  return JSON.parse(plaintext);
};

/**
 * Hash data sử dụng HMAC SHA256
 * Dùng cho OTP verification, không cần decrypt (so sánh hash)
 * @param {string} data - Dữ liệu cần hash
 * @returns {string} - Hash hex
 */
const hashData = (data) => {
  if (!ENCRYPTION_KEY) {
    logger.error('❌ ENCRYPTION_KEY not found');
    throw new Error('Encryption key is not configured');
  }

  try {
    const hmac = crypto.createHmac(HASH_ALGORITHM, ENCRYPTION_KEY);
    hmac.update(data);
    return hmac.digest('hex');
  } catch (error) {
    logger.error('❌ Hash error:', error.message);
    throw error;
  }
};

/**
 * Verify hash (so sánh 2 hash)
 * @param {string} data - Dữ liệu gốc
 * @param {string} hash - Hash để so sánh
 * @returns {boolean}
 */
const verifyHash = (data, hash) => {
  if (!ENCRYPTION_KEY) {
    logger.error('❌ ENCRYPTION_KEY not found');
    return false;
  }

  try {
    const computedHash = hashData(data);
    // Dùng timingAttackSafe comparison
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
  } catch (error) {
    return false;
  }
};

/**
 * Generate encryption key (chỉ dùng 1 lần để setup)
 * Key = 32 bytes = 64 hex characters
 * @returns {string} - 64-character hex string
 */
const generateEncryptionKey = () => {
  const key = crypto.randomBytes(32);
  return key.toString('hex');
};

/**
 * Mask sensitive string (hiển thị cho user)
 * Ví dụ: masking("1234567890", 4) -> "****67890"
 * @param {string} value - String cần mask
 * @param {number} visibleChars - Số ký tự cuối hiển thị
 * @returns {string}
 */
const maskSensitiveData = (value, visibleChars = 4) => {
  if (!value || value.length <= visibleChars) return '****';

  const hiddenLength = value.length - visibleChars;
  return '*'.repeat(hiddenLength) + value.slice(-visibleChars);
};

export {
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  hashData,
  verifyHash,
  generateEncryptionKey,
  maskSensitiveData,
};
