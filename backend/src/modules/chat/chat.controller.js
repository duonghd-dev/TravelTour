import chatService from '../../services/chat.service.js';
import AppError from '../../common/errors/AppError.js';
import Conversation from '../../models/Conversation.js';

class ChatController {
  // Lấy hoặc tạo conversation
  async getOrCreateConversation(req, res, next) {
    try {
      const { otherUserId } = req.body;
      const userId = req.user._id;

      if (!otherUserId) {
        throw new AppError('otherUserId is required', 400);
      }

      if (userId === otherUserId) {
        throw new AppError('Cannot create conversation with yourself', 400);
      }

      const conversation = await chatService.getOrCreateConversation(
        userId,
        otherUserId
      );

      res.status(200).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  // Gửi message
  async sendMessage(req, res, next) {
    try {
      const { conversationId, content, attachments } = req.body;
      const senderId = req.user._id;

      if (!conversationId || !content) {
        throw new AppError('conversationId and content are required', 400);
      }

      // Get conversation to validate sender is participant
      const conversation = await Conversation.findById(conversationId).populate(
        'participants',
        '_id'
      );
      if (!conversation) {
        throw new AppError('Conversation not found', 404);
      }

      // Check if sender is participant of this conversation
      const isParticipant = conversation.participants.some(
        (p) => p._id.toString() === senderId.toString()
      );
      if (!isParticipant) {
        throw new AppError(
          'You are not a participant of this conversation',
          403
        );
      }

      const message = await chatService.sendMessage(
        conversationId,
        senderId,
        content,
        attachments || []
      );

      console.log(
        `[Chat] Message sent - ConvID: ${conversationId}, SenderID: ${senderId}, Content: ${content}`
      );

      // Broadcast message to other participants via Socket.IO
      if (req.app.socketHandler) {
        const conversationRoom = `conversation:${conversationId}`;

        // Only emit to conversation room (not to all users)
        req.app.socketHandler.emitToConversationExceptSender(
          conversationId,
          senderId,
          'message:received',
          {
            _id: message._id,
            conversationId: message.conversationId,
            sender: message.sender,
            content: message.content,
            attachments: message.attachments,
            readBy: message.readBy,
            createdAt: message.createdAt,
          }
        );
      }

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy messages của conversation
  async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const currentUser = req.user;

      if (!conversationId) {
        throw new AppError('conversationId is required', 400);
      }

      const result = await chatService.getMessages(
        conversationId,
        parseInt(page),
        parseInt(limit),
        currentUser
      );

      console.log(
        `[Chat] Get messages - ConvID: ${conversationId}, User: ${currentUser._id}, Found: ${result.messages.length} messages`
      );

      res.status(200).json({
        success: true,
        data: result.messages,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Đánh dấu message đã đọc
  async markAsRead(req, res, next) {
    try {
      const { messageId } = req.params;
      const userId = req.user._id;

      if (!messageId) {
        throw new AppError('messageId is required', 400);
      }

      const message = await chatService.markAsRead(messageId, userId);

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Đánh dấu conversation đã đọc
  async markConversationAsRead(req, res, next) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      if (!conversationId) {
        throw new AppError('conversationId is required', 400);
      }

      await chatService.markConversationAsRead(conversationId, userId);

      res.status(200).json({
        success: true,
        message: 'Conversation marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy conversations của user
  async getUserConversations(req, res, next) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10 } = req.query;

      const result = await chatService.getUserConversations(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.conversations,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Xóa message
  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const userId = req.user._id;

      if (!messageId) {
        throw new AppError('messageId is required', 400);
      }

      const message = await chatService.deleteMessage(messageId, userId);

      res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Tìm kiếm messages
  async searchMessages(req, res, next) {
    try {
      const { conversationId, keyword } = req.query;

      if (!conversationId || !keyword) {
        throw new AppError('conversationId and keyword are required', 400);
      }

      const messages = await chatService.searchMessages(
        conversationId,
        keyword
      );

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
