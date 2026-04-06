import jwt from 'jsonwebtoken';
import User from '../modules/user/user.model.js';

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.userSockets = new Map(); // userId -> Set of socketIds
    this.socketUsers = new Map(); // socketId -> userId
    this.conversationRooms = new Map(); // conversationId -> Set of userIds

    this.setupMiddleware();
    this.setupConnections();
  }

  // Middleware để verify JWT token
  setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error('No token provided'));
        }

        let decoded;
        try {
          decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
          );
        } catch (jwtError) {
          console.error('[Socket] JWT verification failed:', jwtError.message);
          return next(new Error('Invalid token'));
        }

        // Support multiple JWT payload structures
        const userId = decoded.userId || decoded.id || decoded._id;
        if (!userId) {
          return next(new Error('User ID not found in token'));
        }

        try {
          const user = await User.findById(userId);
          if (!user) {
            return next(new Error('User not found'));
          }

          socket.userId = userId;
          socket.user = user;
          next();
        } catch (dbError) {
          console.error('[Socket] Database error:', dbError.message);
          next(new Error('Database error during authentication'));
        }
      } catch (error) {
        console.error('[Socket] Middleware error:', error.message);
        next(new Error('Authentication failed'));
      }
    });
  }

  // Setup socket connection handlers
  setupConnections() {
    this.io.on('connection', (socket) => {
      const userId = socket.userId;
      console.log(`[Socket] User ${userId} connected: ${socket.id}`);

      // Track user connection
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId).add(socket.id);
      this.socketUsers.set(socket.id, userId);

      // Broadcast user is online
      this.io.emit('user:online', {
        userId,
        isOnline: true,
        timestamp: new Date(),
      });

      // ===== CONVERSATION EVENTS =====
      socket.on('conversation:join', (conversationId) => {
        const room = `conversation:${conversationId}`;
        socket.join(room);

        if (!this.conversationRooms.has(conversationId)) {
          this.conversationRooms.set(conversationId, new Set());
        }
        this.conversationRooms.get(conversationId).add(userId);

        console.log(
          `[Socket] User ${userId} joined conversation ${conversationId}`
        );

        // Notify others that user is in conversation
        socket.to(room).emit('conversation:user-joined', {
          conversationId,
          userId,
          timestamp: new Date(),
        });
      });

      socket.on('conversation:leave', (conversationId) => {
        const room = `conversation:${conversationId}`;
        socket.leave(room);

        const users = this.conversationRooms.get(conversationId);
        if (users) {
          users.delete(userId);
          if (users.size === 0) {
            this.conversationRooms.delete(conversationId);
          }
        }

        console.log(
          `[Socket] User ${userId} left conversation ${conversationId}`
        );

        socket.to(room).emit('conversation:user-left', {
          conversationId,
          userId,
          timestamp: new Date(),
        });
      });

      // ===== TYPING EVENTS =====
      socket.on('typing:start', (conversationId) => {
        const room = `conversation:${conversationId}`;
        const users = this.conversationRooms.get(conversationId) || new Set();
        const typingUsers = Array.from(users).filter((u) => u !== userId);

        socket.to(room).emit('typing:active', {
          conversationId,
          typingUsers: [...typingUsers, userId],
          userId,
        });
      });

      socket.on('typing:stop', (conversationId) => {
        const room = `conversation:${conversationId}`;
        const users = this.conversationRooms.get(conversationId) || new Set();
        const typingUsers = Array.from(users).filter((u) => u !== userId);

        socket.to(room).emit('typing:inactive', {
          conversationId,
          typingUsers,
          userId,
        });
      });

      // ===== MESSAGE EVENTS =====
      socket.on('message:read', (data) => {
        try {
          const { messageId, conversationId } = data;
          if (!conversationId || !messageId) return;

          const room = `conversation:${conversationId}`;
          socket.to(room).emit('message:marked-read', {
            messageId,
            userId,
            readAt: new Date(),
          });
        } catch (error) {
          console.error('[Socket] message:read error:', error.message);
        }
      });

      // ===== DISCONNECT =====
      socket.on('disconnect', () => {
        console.log(`[Socket] User ${userId} disconnected: ${socket.id}`);

        // Remove from tracking
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            this.userSockets.delete(userId);
            // Broadcast user is offline
            this.io.emit('user:offline', {
              userId,
              isOnline: false,
              timestamp: new Date(),
            });
          }
        }
        this.socketUsers.delete(socket.id);

        // Remove from all conversation rooms
        this.conversationRooms.forEach((users, conversationId) => {
          users.delete(userId);
        });
      });
    });
  }

  // Emit to conversation except sender
  emitToConversationExceptSender(conversationId, senderId, eventName, data) {
    const room = `conversation:${conversationId}`;
    this.io.to(room).emit(eventName, data);
  }

  // Emit to specific user
  emitToUser(userId, eventName, data) {
    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        this.io.to(socketId).emit(eventName, data);
      });
    }
  }

  // Emit to conversation room
  emitToConversation(conversationId, eventName, data) {
    const room = `conversation:${conversationId}`;
    this.io.to(room).emit(eventName, data);
  }

  // Get users in conversation
  getUsersInConversation(conversationId) {
    return Array.from(this.conversationRooms.get(conversationId) || new Set());
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.userSockets.has(userId);
  }

  // Get all online users
  getOnlineUsers() {
    return Array.from(this.userSockets.keys());
  }
}

export default SocketHandler;
