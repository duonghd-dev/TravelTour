# 🔐 Encryption & Security Guide

## Overview

Hệ thống đã implement mã hóa cho các dữ liệu nhạy cảm:

- **🔵 Tin Nhắn (Messages)**: AES-256-GCM encryption
- **🔴 Thông Tin Payment**: Encrypt paymentDetails (card info, bank codes)
- **🟡 Thông Tin Thanh Toán (Billing)**: Encrypt billing info (name, phone, address)
- **🟢 OTP Codes**: HMAC SHA256 hashing (one-way, secure)

---

## Setup

### 1️⃣ Generate Encryption Key

Chạy command để tạo ENCRYPTION_KEY (32 bytes = 64 hex characters):

```bash
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
```

**Output ví dụ:**

```
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z0a1b2c3d4e5
```

### 2️⃣ Set Environment Variable

Thêm vào file `.env`:

```env
# .env
ENCRYPTION_KEY=your-generated-key-here
```

### 3️⃣ Verify Setup

Kiểm tra trong console/logs:

- ✅ Nếu thấy `Encryption Key configured successfully` → OK
- ❌ Nếu thấy `⚠️ ENCRYPTION_KEY not found` → Chưa set ENCRYPTION_KEY

---

## Architecture

### Encryption Utility (`src/common/utils/encryption.js`)

#### Hàm chính:

```typescript
// Encrypt text
encrypt(plaintext: string) → { encryptedData, iv, authTag }

// Decrypt text
decrypt({ encryptedData, iv, authTag }) → plaintext: string

// Encrypt object (JSON)
encryptObject(data: object) → encrypted object

// Decrypt object (JSON)
decryptObject(encryptedObject) → original object

// Hash data (one-way, for OTP)
hashData(data: string) → hash: string

// Verify hash
verifyHash(data: string, hash: string) → boolean: boolean

// Mask sensitive data for display
maskSensitiveData(value: string, visibleChars: number) → masked: string
```

---

## Encryption Flow

### 🔵 Messages

```
┌─────────────┐
│ User sends  │ "Xin chào!!!"
│  message    │
└────────┬────┘
         │
         ▼
┌──────────────────────┐
│ Backend              │
│ chat.service.js:     │
│ sendMessage()        │
└────────┬─────────────┘
         │
         ├─► encrypt(content)
         │   → { encryptedData, iv, authTag }
         │
         ▼
┌──────────────────────┐
│ MongoDB Database     │
│ Message.content =    │
│ {                    │
│   encryptedData: ".."|
│   iv: "...",         │
│   authTag: "..."     │
│ }                    │
└──────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Client receives msg  │
│ (from getMessages)   │
│ "Xin chào!!!" ✓      │
└──────────────────────┘
```

**Hàm liên quan:**

- `sendMessage()` → encrypt + save
- `getMessages()` → fetch + decrypt
- `deleteMessage()` → encrypt deletion notice
- `searchMessages()` → decrypt all + search in-memory

---

### 🔴 Payment Details

```
User fills card info:
├─ last4Digits: "1234"
├─ cardBrand: "VISA"
├─ bankCode: "NCB"
└─ bankName: "Ngân hàng NCB"
         │
         ▼
Backend: payment.service.js
├─ encryptPaymentDetails(details)
└─ Save Payment.paymentDetails (encrypted)
         │
         ▼
Admin views payment:
├─ getPayment() → decrypt
└─ maskPaymentDetails() → "****1234", "VS**", etc.

API Response (to client):
{
  paymentDetails: {
    last4Digits: "****1234",     // Masked
    cardBrand: "VI**",           // Masked
    bankCode: "NC",              // Masked
    bankName: "Ngân hàng NCB"     // Full (not sensitive)
  }
}
```

**Hàm liên quan:**

- `encryptPaymentDetails()` → encrypt + save
- `decryptPaymentDetails()` → decrypt
- `maskPaymentDetails()` → mask for display
- Service: `getPayment()`, `getUserPayments()`

---

### 🟡 Billing Info

```
Checkout form:
├─ fullName: "Nguyễn Văn A"
├─ email: "user@example.com"
├─ phone: "+84912345678"
└─ address: "123 Đường A, TP HCM"
         │
         ▼
Backend: booking.service.js
├─ encryptBillingInfo(billingInfo)
└─ Save Booking.billingInfo (encrypted)
         │
         ▼
User views booking details:
├─ getUserBookings() → decrypt
└─ Return to client

API Response:
{
  billingInfo: {
    fullName: "Nguyễn Văn A",
    email: "user@example.com",
    phone: "5678",               // Masked (only last 4 digits)
    address: "123 Đường A, TP HCM"
  }
}
```

**Hàm liên quan:**

- `encryptBillingInfo()` → encrypt + save
- `decryptBillingInfo()` → decrypt
- Service: `getUserBookings()`, `createBooking()`

---

### 🟢 OTP Codes (Hashing - NOT Encryption)

```
User requests OTP:
  registerEmail(user@gmail.com)
         │
         ▼
  Generate OTP: "123456"
  ├─ Hash: hashData("123456")
  │       → "a7f8b9c1d2e3..."
  └─ Save User.emailOTP = "a7f8b9c1d2e3..."
         │
  ┌──────┴─────────────────────┐
  │ Send via email: "123456"   │
  └────────────────────────────┘
         │
         ▼
  User submits: "123456"
  Backend: verifyEmail()
  ├─ Compare: verifyHash("123456", savedHash)
  │           → true/false (timing-safe)
  └─ Clear OTP after verify
```

**Hàm liên quan (auth.service.js):**

- `register()` → hash emailOTP
- `verifyEmail()` → compare hash
- `login()` → hash loginOTP → `verifyLoginOTP()` → compare
- `forgotPassword()` → hash resetPasswordOTP → `verifyResetPasswordOTP()` / `resetPassword()`

---

## Data Model Updates

### Message Model

```javascript
{
  content: {
    type: Mixed,  // { encryptedData, iv, authTag }
    trim: true
  },
  isEncrypted: {
    type: Boolean,
    default: false
  }
}
```

### Payment Model

```javascript
{
  paymentDetails: {
    type: Mixed  // { encryptedData, iv, authTag }
  },
  isEncrypted: {
    type: Boolean,
    default: false
  }
}
```

### Booking Model

```javascript
{
  billingInfo: {
    type: Mixed  // { encryptedData, iv, authTag }
  },
  isEncrypted: {
    type: Boolean,
    default: false
  }
}
```

### User Model

```javascript
{
  emailOTP: String,              // Hash của OTP
  resetPasswordOTP: String,      // Hash của OTP
  loginOTP: String,             // Hash của OTP
  // ... Không lưu plaintext OTP nữa!
}
```

---

## Security Best Practices

### ✅ DO:

- ✓ Regenerate ENCRYPTION_KEY định kỳ (hàng quý/năm)
- ✓ Lưu ENCRYPTION_KEY ở environment variables (không hardcode)
- ✓ Hash OTP (không lưu plaintext)
- ✓ Mask sensitive data khi return API response
- ✓ Log encryption/decryption errors (nhưng không log dữ liệu thực)
- ✓ Use HTTPS/TLS cho tất cả API calls
- ✓ Validate input trước encrypt

### ❌ DON'T:

- ✗ Lưu ENCRYPTION_KEY trong git/source code
- ✗ Expose full card numbers hoặc bank codes
- ✗ Log plaintext OTP hoặc sensitive data
- ✗ Reuse IV (tự động tạo mới mỗi lần encrypt)
- ✗ Share ENCRYPTION_KEY qua email/unencrypted channels
- ✗ Cache decrypted data lâu dài

---

## Troubleshooting

### ❌ "Encryption key is not configured"

**Nguyên nhân:** Chưa set ENCRYPTION_KEY trong .env

**Fix:**

```bash
# Generate key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
ENCRYPTION_KEY=your-key-here
```

---

### ❌ "Decryption failed - data may be corrupted"

**Nguyên nhân:**

- ENCRYPTION_KEY bị thay đổi
- Dữ liệu bị corrupt
- IV/authTag không match

**Fix:**

- Kiểm tra ENCRYPTION_KEY không bị thay đổi
- Thử decrypt từ từng field (billingInfo, paymentDetails)
- Nếu không thể recover, có thể clear encrypted field

---

### ❌ "Search doesn't work on encrypted messages"

**Nguyên nhân:** Không thể search DB trực tiếp trên encrypted data

**Solutions:**

1. ✓ Decrypt tất cả + search in-memory (hiện tại)
2. Tạo searchable plaintext field riêng (không encrypt)
3. Dùng fulltext search index
4. Disable search feature

---

## Testing

### Unit Test Example

```javascript
import { encrypt, decrypt, hashData, verifyHash } from '../encryption.js';

describe('Encryption Utility', () => {
  it('should encrypt and decrypt text', () => {
    const text = 'Hello World';
    const encrypted = encrypt(text);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  it('should hash and verify OTP', () => {
    const otp = '123456';
    const hash = hashData(otp);
    expect(verifyHash(otp, hash)).toBe(true);
    expect(verifyHash('999999', hash)).toBe(false);
  });
});
```

---

## Performance Notes

- **Encryption**: ~1-5ms per string (depending on length)
- **Decryption**: ~1-5ms per string
- **Hashing**: <1ms per operation
- **Search on encrypted**: O(n) - phải decrypt tất cả documents

⚠️ **Optimization:** Nếu search là bottleneck, consider separate searchable index.

---

## Migration Guide (nếu có dữ liệu cũ)

### Backup trước:

```bash
mongodump --db hotel-travel --out ./backup
```

### Encrypt existing data:

```javascript
// Script để encrypt existing messages
const Message = require('./Message');
const { encrypt } = require('./encryption');

async function migrateMessages() {
  const messages = await Message.find({ isEncrypted: false });

  for (const msg of messages) {
    if (msg.content && typeof msg.content === 'string') {
      msg.content = encrypt(msg.content);
      msg.isEncrypted = true;
      await msg.save();
    }
  }

  console.log(`Encrypted ${messages.length} messages`);
}
```

---

## References

- Node.js Crypto: https://nodejs.org/api/crypto.html
- AES-256-GCM: https://en.wikipedia.org/wiki/Galois/Counter_Mode
- OWASP Encryption: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html

---

**Last Updated:** April 2026
**Status:** ✅ Production Ready
