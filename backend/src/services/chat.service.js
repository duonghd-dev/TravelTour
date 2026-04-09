import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../modules/user/user.model.js';
import { encrypt, decrypt } from '../common/utils/encryption.js';

class ChatService {
  
  async getOrCreateConversation(userId1, userId2) {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [userId1, userId2] },
      })
        .populate('lastMessage')
        .populate('participants', 'firstName lastName avatar email');

      if (!conversation) {
        conversation = new Conversation({
          participants: [userId1, userId2],
          readStatus: [
            { userId: userId1, readAt: null },
            { userId: userId2, readAt: null },
          ],
        });
        await conversation.save();
        
        await conversation.populate(
          'participants',
          'firstName lastName avatar email'
        );
      }

      
      const otherParticipant = conversation.participants.find(
        (p) => p._id.toString() !== userId1.toString()
      );

      return {
        ...conversation.toObject(),
        otherParticipant,
      };
    } catch (error) {
      throw new Error(`Error getting/creating conversation: ${error.message}`);
    }
  }

  
  async sendMessage(conversationId, senderId, content, attachments = []) {
    try {
      
      let encryptedContent = null;
      let isEncrypted = false;

      if (content && content.trim()) {
        try {
          encryptedContent = encrypt(content);
          isEncrypted = true;
        } catch (encryptError) {
          
          console.error('Encryption failed:', encryptError);
          encryptedContent = content;
          isEncrypted = false;
        }
      }

      const message = new Message({
        conversationId,
        sender: senderId,
        content: encryptedContent,
        attachments,
        isEncrypted,
        readBy: [{ userId: senderId, readAt: new Date() }],
      });

      await message.save();
      await message.populate('sender', '_id firstName lastName avatar');

      
      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: message._id,
          lastMessageAt: new Date(),
        },
        { new: true }
      );

      
      const messageObj = message.toObject();
      if (isEncrypted) {
        try {
          messageObj.content = decrypt(encryptedContent);
        } catch (decryptError) {
          messageObj.content = '[Decryption failed]';
        }
      }

      return messageObj;
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  }

  
  async getMessages(conversationId, page = 1, limit = 20, currentUser = null) {
    try {
      const skip = (page - 1) * limit;

      const messages = await Message.find({ conversationId })
        .populate('sender', '_id firstName lastName avatar role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Message.countDocuments({ conversationId });

      
      let filteredMessages = messages;
      if (currentUser && currentUser.role) {
        filteredMessages = messages.filter((msg) => {
          const isSelfMessage =
            msg.sender._id.toString() === currentUser._id.toString();

          
          if (['admin', 'staff'].includes(currentUser.role)) {
            return (
              isSelfMessage || !['admin', 'staff'].includes(msg.sender.role)
            );
          }
          
          if (['customer', 'artisan'].includes(currentUser.role)) {
            return (
              isSelfMessage || ['admin', 'staff'].includes(msg.sender.role)
            );
          }
          
          return true;
        });
      }

      
      const decryptedMessages = filteredMessages.map((msg) => {
        const msgObj = msg.toObject();

        if (msgObj.isEncrypted && msgObj.content) {
          try {
            
            msgObj.content = decrypt(msgObj.content);
          } catch (decryptError) {
            console.error(
              'Decryption error for message:',
              msg._id,
              decryptError
            );
            msgObj.content =
              '[Decryption failed - Message content unavailable]';
          }
        }

        return msgObj;
      });

      return {
        messages: decryptedMessages.reverse(),
        pagination: {
          page,
          limit,
          total: filteredMessages.length,
          pages: Math.ceil(filteredMessages.length / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error getting messages: ${error.message}`);
    }
  }

  
  async markAsRead(messageId, userId) {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        {
          $addToSet: {
            readBy: { userId, readAt: new Date() },
          },
        },
        { new: true }
      ).populate('sender', '_id firstName lastName avatar');

      return message;
    } catch (error) {
      throw new Error(`Error marking message as read: ${error.message}`);
    }
  }

  
  async markConversationAsRead(conversationId, userId) {
    try {
      await Message.updateMany(
        {
          conversationId,
          'readBy.userId': { $ne: userId },
        },
        {
          $addToSet: {
            readBy: { userId, readAt: new Date() },
          },
        }
      );

      
      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $set: {
            'readStatus.$[elem].readAt': new Date(),
          },
        },
        {
          arrayFilters: [{ 'elem.userId': userId }],
          new: true,
        }
      );

      return true;
    } catch (error) {
      throw new Error(`Error marking conversation as read: ${error.message}`);
    }
  }

  
  async getUserConversations(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const conversations = await Conversation.find({
        participants: userId,
        isActive: true,
      })
        .populate('lastMessage')
        .populate('participants', 'firstName lastName avatar email')
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Conversation.countDocuments({
        participants: userId,
        isActive: true,
      });

      
      const convsWithUnread = await Promise.all(
        conversations.map(async (conv) => {
          const unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            'readBy.userId': { $ne: userId },
          });

          const otherParticipant = conv.participants.find(
            (p) => p._id.toString() !== userId.toString()
          );

          return {
            ...conv.toObject(),
            unreadCount,
            otherParticipant,
          };
        })
      );

      return {
        conversations: convsWithUnread,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error getting user conversations: ${error.message}`);
    }
  }

  
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.sender.toString() !== userId.toString()) {
        throw new Error('Only message sender can delete');
      }

      
      const deletionMessage = '[Message deleted]';
      const encryptedContent = encrypt(deletionMessage);

      
      message.content = encryptedContent;
      message.isEncrypted = true;
      message.attachments = [];
      message.isEdited = true;
      message.editedAt = new Date();

      await message.save();

      
      const msgObj = message.toObject();
      msgObj.content = deletionMessage;

      return msgObj;
    } catch (error) {
      throw new Error(`Error deleting message: ${error.message}`);
    }
  }

  
  
  
  
  async searchMessages(conversationId, keyword) {
    try {
      
      const messages = await Message.find({ conversationId })
        .populate('sender', '_id firstName lastName avatar')
        .sort({ createdAt: -1 });

      
      const decryptedMessages = messages.map((msg) => {
        const msgObj = msg.toObject();

        if (msgObj.isEncrypted && msgObj.content) {
          try {
            msgObj.content = decrypt(msgObj.content);
          } catch (decryptError) {
            msgObj.content = '';
          }
        }

        return msgObj;
      });

      
      const results = decryptedMessages.filter((msg) => {
        const content = typeof msg.content === 'string' ? msg.content : '';
        return content.toLowerCase().includes(keyword.toLowerCase());
      });

      return results;
    } catch (error) {
      throw new Error(`Error searching messages: ${error.message}`);
    }
  }
}

export default new ChatService();
