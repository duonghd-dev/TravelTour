

import crypto from 'crypto';
import { logger } from './logger.js';


const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const HASH_ALGORITHM = 'sha256';


if (!ENCRYPTION_KEY) {
  logger.warn(
    '⚠️  ENCRYPTION_KEY không được set trong .env - Encryption sẽ không hoạt động. Thiết lập: ENCRYPTION_KEY=<32-byte-hex-key>'
  );
}


const encrypt = (plaintext) => {
  if (!ENCRYPTION_KEY) {
    logger.error('❌ ENCRYPTION_KEY not found in environment variables');
    throw new Error('Encryption key is not configured');
  }

  try {
    
    const iv = crypto.randomBytes(16);

    
    const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

    
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, keyBuffer, iv);

    
    let encryptedData = cipher.update(plaintext, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    
    const authTag = cipher.getAuthTag();

    
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

    
    const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      keyBuffer,
      ivBuffer
    );

    
    decipher.setAuthTag(authTagBuffer);

    
    let plaintext = decipher.update(encryptedData, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
  } catch (error) {
    logger.error('❌ Decryption error:', error.message);
    throw new Error('Decryption failed - data may be corrupted or tampered');
  }
};


const encryptObject = (data) => {
  const jsonString = JSON.stringify(data);
  return encrypt(jsonString);
};


const decryptObject = (encryptedObject) => {
  const plaintext = decrypt(encryptedObject);
  return JSON.parse(plaintext);
};


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


const verifyHash = (data, hash) => {
  if (!ENCRYPTION_KEY) {
    logger.error('❌ ENCRYPTION_KEY not found');
    return false;
  }

  try {
    const computedHash = hashData(data);
    
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
  } catch (error) {
    return false;
  }
};


const generateEncryptionKey = () => {
  const key = crypto.randomBytes(32);
  return key.toString('hex');
};


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
