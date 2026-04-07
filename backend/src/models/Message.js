import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Nội dung tin nhắn (mã hóa)
    // Cấu trúc: { encryptedData, iv, authTag } hoặc plaintext (fallback nếu string)
    content: {
      type: mongoose.Schema.Types.Mixed, // Có thể là string hoặc object encrypted
      trim: true,
    },
    // Flag để indicate content đã được mã hóa
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    // Hỗ trợ file/image
    attachments: [
      {
        url: String,
        type: {
          type: String,
          enum: ['image', 'file', 'video'],
        },
        size: Number,
        name: String,
      },
    ],
    // Read receipt
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: Date,
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index để tìm messages của conversation
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

export default mongoose.model('Message', messageSchema);
