import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../modules/user/user.model.js';

class ChatService {
  // Lấy hoặc tạo conversation giữa 2 users
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
        // Populate participants sau khi save
        await conversation.populate(
          'participants',
          'firstName lastName avatar email'
        );
      }

      // Tạo otherParticipant field như trong getUserConversations
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

  // Gửi message
  async sendMessage(conversationId, senderId, content, attachments = []) {
    try {
      const message = new Message({
        conversationId,
        sender: senderId,
        content,
        attachments,
        readBy: [{ userId: senderId, readAt: new Date() }],
      });

      await message.save();
      await message.populate('sender', '_id firstName lastName avatar');

      // Cập nhật conversation
      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: message._id,
          lastMessageAt: new Date(),
        },
        { new: true }
      );

      return message;
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  }

  // Lấy messages của conversation (pagination)
  async getMessages(conversationId, page = 1, limit = 20, currentUser = null) {
    try {
      const skip = (page - 1) * limit;

      const messages = await Message.find({ conversationId })
        .populate('sender', '_id firstName lastName avatar role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Message.countDocuments({ conversationId });

      // Filter messages dựa trên role
      let filteredMessages = messages;
      if (currentUser && currentUser.role) {
        filteredMessages = messages.filter((msg) => {
          const isSelfMessage =
            msg.sender._id.toString() === currentUser._id.toString();

          // Nếu current user là admin/staff: show messages từ non-admin hoặc từ chính mình
          if (['admin', 'staff'].includes(currentUser.role)) {
            return (
              isSelfMessage || !['admin', 'staff'].includes(msg.sender.role)
            );
          }
          // Nếu current user là customer/artisan: show messages từ admin/staff hoặc từ chính mình
          if (['customer', 'artisan'].includes(currentUser.role)) {
            return (
              isSelfMessage || ['admin', 'staff'].includes(msg.sender.role)
            );
          }
          // Default: show all
          return true;
        });
      }

      return {
        messages: filteredMessages.reverse(),
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

  // Đánh dấu message đã đọc
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

  // Đánh dấu tất cả messages trong conversation đã đọc
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

      // Cập nhật readStatus của conversation
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

  // Lấy danh sách conversations của user
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

      // Thêm thông tin unread messages
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

  // Xóa message (soft delete hoặc yang khác)
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.sender.toString() !== userId.toString()) {
        throw new Error('Only message sender can delete');
      }

      // Edit content thay vì xóa
      message.content = '[Message deleted]';
      message.attachments = [];
      message.isEdited = true;
      message.editedAt = new Date();

      await message.save();
      return message;
    } catch (error) {
      throw new Error(`Error deleting message: ${error.message}`);
    }
  }

  // Tìm kiếm messages
  async searchMessages(conversationId, keyword) {
    try {
      const messages = await Message.find({
        conversationId,
        content: { $regex: keyword, $options: 'i' },
      })
        .populate('sender', '_id firstName lastName avatar')
        .sort({ createdAt: -1 });

      return messages;
    } catch (error) {
      throw new Error(`Error searching messages: ${error.message}`);
    }
  }
}

export default new ChatService();
