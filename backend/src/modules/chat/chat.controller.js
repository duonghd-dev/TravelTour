import chatService from '../../services/chat.service.js';
import AppError from '../../common/errors/AppError.js';
import Conversation from '../../models/Conversation.js';
import groqService from '../../services/groq.service.js';
import Experience from '../../modules/experience/experience.model.js';
import Tour from '../../modules/tour/tour.model.js';
import Artisan from '../../modules/artisan/artisan.model.js';
import Hotel from '../../modules/hotel/hotel.model.js';

class ChatController {
  constructor() {
    // Bind all methods to preserve 'this' context
    this.getOrCreateConversation = this.getOrCreateConversation.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.markConversationAsRead = this.markConversationAsRead.bind(this);
    this.getUserConversations = this.getUserConversations.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.searchMessages = this.searchMessages.bind(this);
    this.sendAIResponse = this.sendAIResponse.bind(this);
    this.generateAIResponseMessage = this.generateAIResponseMessage.bind(this);
  }

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

      // AUTO-TRIGGER AI RESPONSE (nếu sender không phải admin)
      // Check nếu tin nhắn có chứa keyword yêu cầu con người/tư vấn viên
      const requestHumanKeywords = [
        'tư vấn viên',
        'nhân viên',
        'con người',
        'human',
        'support staff',
      ];
      const messageContent = content.toLowerCase();
      const shouldDisableAI = requestHumanKeywords.some((keyword) =>
        messageContent.includes(keyword)
      );

      console.log('[Chat] Auto-AI Check:', {
        userRole: req.user.role,
        isAdmin: req.user.role === 'admin',
        shouldDisableAI: shouldDisableAI,
        willTriggerAI: !shouldDisableAI && req.user.role !== 'admin',
      });

      if (shouldDisableAI && req.user.role !== 'admin') {
        // User yêu cầu nhân viên → gửi thông báo
        try {
          const conversation = await Conversation.findById(
            conversationId
          ).populate('participants', '_id');
          const adminUser = conversation.participants.find(
            (p) => p._id.toString() !== senderId.toString()
          );

          if (adminUser) {
            const notificationMessage = await chatService.sendMessage(
              conversationId,
              adminUser._id,
              '👋 Cảm ơn bạn! Chúng tôi sẽ kết nối bạn với nhân viên hỗ trợ trong thời gian sớm nhất. Vui lòng chờ...',
              []
            );

            if (req.app.socketHandler) {
              req.app.socketHandler.emitToConversationExceptSender(
                conversationId,
                adminUser._id,
                'message:received',
                {
                  _id: notificationMessage._id,
                  conversationId: notificationMessage.conversationId,
                  sender: notificationMessage.sender,
                  content: notificationMessage.content,
                  attachments: notificationMessage.attachments,
                  readBy: notificationMessage.readBy,
                  createdAt: notificationMessage.createdAt,
                }
              );
            }
            console.log('[Chat] Human support notification sent');
          }
        } catch (notifyError) {
          console.warn(
            '[Chat] Failed to send support notification:',
            notifyError.message
          );
        }
      } else if (!shouldDisableAI && req.user.role !== 'admin') {
        // Sender là customer/artisan → auto-trigger AI response
        try {
          const { aiMessage, adminUser } = await this.generateAIResponseMessage(
            conversationId,
            content,
            senderId
          );

          // Broadcast AI message via Socket.IO
          if (req.app.socketHandler) {
            req.app.socketHandler.emitToConversationExceptSender(
              conversationId,
              adminUser._id,
              'message:received',
              {
                _id: aiMessage._id,
                conversationId: aiMessage.conversationId,
                sender: aiMessage.sender,
                content: aiMessage.content,
                attachments: aiMessage.attachments,
                readBy: aiMessage.readBy,
                createdAt: aiMessage.createdAt,
              }
            );
          }

          console.log(
            `[Chat] Auto AI response sent - ConvID: ${conversationId}, AdminID: ${adminUser._id}`
          );
        } catch (aiError) {
          console.warn('[Chat] Auto AI response failed:', aiError.message);
          // Không fail request chính vì AI là optional
        }
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

  // Helper: Extract keywords từ user message
  extractKeywords(message) {
    // Remove common Vietnamese words
    const stopwords = [
      'tôi',
      'muốn',
      'biết',
      'thông',
      'tin',
      'về',
      'cho',
      'bao',
      'nhiêu',
      'là',
      'gì',
      'nào',
      'như',
      'thế',
      'nào',
      'được',
      'không',
      'có',
      'và',
      'hoặc',
      'nhưng',
      'mà',
      'với',
      'trong',
      'ở',
      'đến',
      'từ',
    ];

    const words = message
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopwords.includes(word))
      .slice(0, 5); // Lấy 5 từ khóa chính

    return words;
  }

  // Gửi AI response từ admin
  // Helper: Generate AI response message (core logic)
  async generateAIResponseMessage(conversationId, userMessage, currentUserId) {
    // Get conversation
    const conversation = await Conversation.findById(conversationId).populate(
      'participants',
      '_id'
    );
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Find admin in participants
    const adminUser = conversation.participants.find(
      (p) => p._id.toString() !== currentUserId.toString()
    );
    if (!adminUser) {
      throw new AppError('Admin user not found in conversation', 404);
    }

    // Extract keywords từ message để search tốt hơn
    const keywords = this.extractKeywords(userMessage);
    console.log('[AI] Extracted Keywords:', keywords);

    // Build search queries từ keywords
    const keywordSearches = keywords.map((keyword) => ({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { craft: { $regex: keyword, $options: 'i' } },
        { storytelling: { $regex: keyword, $options: 'i' } },
      ],
    }));

    // Search relevant data from database for context
    const [experiences, tours, artisans, hotels] = await Promise.all([
      keywordSearches.length > 0
        ? Experience.find({ $or: keywordSearches.flatMap((q) => q.$or) }).limit(
            5
          )
        : Experience.find({}).limit(3),
      keywordSearches.length > 0
        ? Tour.find({ $or: keywordSearches.flatMap((q) => q.$or) }).limit(5)
        : Tour.find({}).limit(3),
      keywordSearches.length > 0
        ? Artisan.find({ $or: keywordSearches.flatMap((q) => q.$or) })
            .populate('userId', 'firstName lastName')
            .limit(5)
        : Artisan.find({}).populate('userId', 'firstName lastName').limit(3),
      keywordSearches.length > 0
        ? Hotel.find({ $or: keywordSearches.flatMap((q) => q.$or) }).limit(5)
        : Hotel.find({}).limit(3),
    ]);

    console.log('[AI] Database Search Results:', {
      userMessage,
      experiencesFound: experiences.length,
      toursFound: tours.length,
      artisansFound: artisans.length,
      hotelsFound: hotels.length,
      tourNames: tours.map((t) => t.name),
      hotelNames: hotels.map((h) => h.name),
    });

    const contextData = {
      experiences,
      tours,
      artisans,
      hotels,
    };

    // Get AI suggestion
    const aiResult = await groqService.generateAdvice(userMessage, contextData);

    console.log('[AI] Groq Response Length:', aiResult.data?.length || 0);

    if (!aiResult.success) {
      throw new AppError('Không thể lấy tư vấn từ AI', 500);
    }

    // Send AI response as message from admin
    const aiMessage = await chatService.sendMessage(
      conversationId,
      adminUser._id,
      aiResult.data,
      []
    );

    return { aiMessage, adminUser };
  }

  async sendAIResponse(req, res, next) {
    try {
      const { conversationId, userMessage } = req.body;
      const currentUserId = req.user._id;

      if (!conversationId || !userMessage) {
        throw new AppError('conversationId and userMessage are required', 400);
      }

      const { aiMessage, adminUser } = await this.generateAIResponseMessage(
        conversationId,
        userMessage,
        currentUserId
      );

      console.log(
        `[Chat] AI Response sent - ConvID: ${conversationId}, AdminID: ${adminUser._id}`
      );

      // Broadcast message to conversation
      if (req.app.socketHandler) {
        req.app.socketHandler.emitToConversationExceptSender(
          conversationId,
          adminUser._id,
          'message:received',
          {
            _id: aiMessage._id,
            conversationId: aiMessage.conversationId,
            sender: aiMessage.sender,
            content: aiMessage.content,
            attachments: aiMessage.attachments,
            readBy: aiMessage.readBy,
            createdAt: aiMessage.createdAt,
          }
        );
      }

      res.status(201).json({
        success: true,
        data: aiMessage,
        message: 'AI response sent successfully',
      });
    } catch (error) {
      console.error('[sendAIResponse] Error:', error);
      next(error);
    }
  }
}

export default new ChatController();
