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
    
    
    content: {
      type: mongoose.Schema.Types.Mixed, 
      trim: true,
    },
    
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    
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


messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

export default mongoose.model('Message', messageSchema);
