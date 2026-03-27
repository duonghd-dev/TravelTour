import jwt from 'jsonwebtoken';
import User from '../modules/user/user.model.js';

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.userSockets = {}; // userId -> socketId mapping
    this.typingUsers = {}; // conversationId -> [userId]

    this.setupSocketEvents();
  }

  setupSocketEvents() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Missing token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
          throw new Error('User not found');
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    this.io.on('connection', (socket) => {
      // Lưu user socket
      this.userSockets[socket.user._id.toString()] = socket.id;

      // Broadcast user online
      socket.broadcast.emit('user:online', {
        userId: socket.user._id,
        isOnline: true,
      });

      // Join conversation room
      socket.on('conversation:join', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
      });

      // Leave conversation room
      socket.on('conversation:leave', (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
      });

      // Typing indicator
      socket.on('typing:start', (conversationId) => {
        if (!this.typingUsers[conversationId]) {
          this.typingUsers[conversationId] = {};
        }

        const userId = socket.user._id.toString();
        const userName =
          socket.user.role === 'admin'
            ? 'VHT Tour'
            : `${socket.user.firstName} ${socket.user.lastName}`;

        this.typingUsers[conversationId][userId] = {
          userId,
          userName,
          role: socket.user.role,
        };

        // Gửi danh sách người dùng đang nhập
        const typingUsersList = Object.values(this.typingUsers[conversationId]);
        this.io.to(`conversation:${conversationId}`).emit('typing:active', {
          conversationId,
          userId: socket.user._id,
          userName,
          typingUsers: typingUsersList,
        });
      });

      // Stop typing
      socket.on('typing:stop', (conversationId) => {
        if (this.typingUsers[conversationId]) {
          delete this.typingUsers[conversationId][socket.user._id.toString()];
        }

        const typingUsersList = this.typingUsers[conversationId]
          ? Object.values(this.typingUsers[conversationId])
          : [];

        this.io.to(`conversation:${conversationId}`).emit('typing:inactive', {
          conversationId,
          userId: socket.user._id,
          typingUsers: typingUsersList,
        });
      });

      // Message read
      socket.on('message:read', (data) => {
        const { conversationId, messageId } = data;

        this.io
          .to(`conversation:${conversationId}`)
          .emit('message:marked-read', {
            messageId,
            userId: socket.user._id,
            readAt: new Date(),
          });
      });

      // Disconnect
      socket.on('disconnect', () => {
        delete this.userSockets[socket.user._id.toString()];

        // Broadcast user offline
        socket.broadcast.emit('user:offline', {
          userId: socket.user._id,
          isOnline: false,
        });
      });
    });
  }

  // Emit message to specific conversation
  emitToConversation(conversationId, event, data) {
    this.io.to(`conversation:${conversationId}`).emit(event, data);
  }

  // Emit message to specific conversation, excluding sender
  emitToConversationExceptSender(conversationId, senderId, event, data) {
    const senderSocketId = this.userSockets[senderId.toString()];
    if (senderSocketId) {
      // Emit to all users in the room except the sender
      this.io
        .to(`conversation:${conversationId}`)
        .except(senderSocketId)
        .emit(event, data);
    } else {
      // If sender socket not found, fallback to emitting to all users
      this.io.to(`conversation:${conversationId}`).emit(event, data);
    }
  }

  // Emit message to specific user
  emitToUser(userId, event, data) {
    const socketId = this.userSockets[userId.toString()];
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Check if user is online
  isUserOnline(userId) {
    return !!this.userSockets[userId.toString()];
  }

  // Get online users in conversation
  getOnlineUsersInConversation(conversationId) {
    const room = this.io.sockets.adapter.rooms.get(
      `conversation:${conversationId}`
    );
    return room ? room.size : 0;
  }
}

export default SocketHandler;
