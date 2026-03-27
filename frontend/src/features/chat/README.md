# Chat Feature Documentation

## Overview

Hệ thống chat real-time cho phép users giao tiếp với nhau thông qua một floating widget chatbox.

## Features

- ✅ Real-time messaging với Socket.io
- ✅ Conversations management
- ✅ Read receipts (đánh dấu đã đọc)
- ✅ Typing indicators
- ✅ File/Image upload
- ✅ Message search
- ✅ Message deletion
- ✅ Unread message count
- ✅ Online/Offline status

## Backend Structure

### Models

- **Conversation.js** - Lưu trữ cuộc trò chuyện giữa 2 users
- **Message.js** - Lưu trữ các tin nhắn

### Services

- **chat.service.js** - Business logic cho chat operations

### Controllers

- **chat.controller.js** - Handle HTTP requests

### Routes

- **chat.routes.js** - API endpoints

### Socket Events

- `conversation:join` - Join conversation room
- `conversation:leave` - Leave conversation room
- `message:send` - Gửi tin nhắn
- `message:received` - Nhận tin nhắn
- `typing:start` - Bắt đầu typing
- `typing:stop` - Dừng typing
- `typing:active` - Cho biết ai đang typing
- `message:read` - Đánh dấu tin nhắn đã đọc
- `message:marked-read` - Broadcast tin nhắn đã đọc
- `user:online` - User online
- `user:offline` - User offline

## Frontend Structure

### Components

- **ChatBox.jsx** - Main floating widget container
- **ConversationList.jsx** - Danh sách cuộc trò chuyện
- **MessageList.jsx** - Danh sách tin nhắn
- **MessageItem.jsx** - Một tin nhắn
- **MessageInput.jsx** - Input form & attachment upload

### Contexts

- **SocketContext.jsx** - Socket.io global state

### Hooks

- **useChat.js** - Hook handling chat logic

### API Services

- **chatApi.js** - API calls

## Usage

### API Endpoints

#### Conversations

```
POST /api/v1/chat/conversations
- Get or create conversation with other user
- Body: { otherUserId }

GET /api/v1/chat/conversations
- Get user's conversations
- Query: { page, limit }

PATCH /api/v1/chat/conversations/:conversationId/read
- Mark conversation as read
```

#### Messages

```
POST /api/v1/chat/messages
- Send message
- Body: { conversationId, content, attachments }

GET /api/v1/chat/conversations/:conversationId/messages
- Get messages from conversation
- Query: { page, limit }

PATCH /api/v1/chat/messages/:messageId/read
- Mark message as read

DELETE /api/v1/chat/messages/:messageId
- Delete message (soft delete)

GET /api/v1/chat/messages/search
- Search messages
- Query: { conversationId, keyword }
```

### Frontend Usage

#### 1. Wrap App with SocketProvider

```jsx
import { SocketProvider } from '@/contexts';

<SocketProvider token={token}>
  <AppRouter />
</SocketProvider>;
```

#### 2. Use in Components

```jsx
import { useChat } from '@/hooks';

const MyComponent = ({ conversationId }) => {
  const {
    messages,
    loading,
    sending,
    typingUsers,
    sendMessage,
    handleTyping,
    deleteMessage,
  } = useChat(conversationId);

  // Use messages, sendMessage, etc.
};
```

#### 3. ChatBox Widget

Floating widget tự động render ở góc dưới phải màn hình khi user login.

## Database Schema

### Conversation

```javascript
{
  participants: [userId1, userId2],
  lastMessage: messageId,
  lastMessageAt: Date,
  isActive: Boolean,
  readStatus: [
    {
      userId: userId,
      readAt: Date
    }
  ]
}
```

### Message

```javascript
{
  conversationId: conversationId,
  sender: senderId,
  content: String,
  attachments: [
    {
      url: String,
      type: 'image|file|video',
      size: Number,
      name: String
    }
  ],
  readBy: [
    {
      userId: userId,
      readAt: Date
    }
  ],
  isEdited: Boolean,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Socket.io Events Flow

### User connects

1. Client emits authentication with token
2. Server validates token
3. Server stores socket ID mapping

### Sending Message

1. Client calls `sendMessage()`
2. Send message to server via HTTP
3. Emit Socket event `message:send`
4. Server broadcasts to conversation room
5. Other users receive via `message:received`

### Typing Indicator

1. User starts typing
2. Client emits `typing:start`
3. Server broadcasts to room
4. Other users receive via `typing:active`
5. Auto-stop after 3 seconds

### Read Receipt

1. User views message
2. Client emits `message:read`
3. Server updates readBy array
4. Broadcast to other users via `message:marked-read`

## Environment Variables

### Backend (.env)

```
PORT=8080
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

## Installation & Setup

### Backend

```bash
cd backend
npm install socket.io
npm run dev
```

### Frontend

```bash
cd frontend
npm install socket.io-client
npm run dev
```

## Testing

### Test with cURL/Postman

1. **Get Conversations**

```bash
GET /api/v1/chat/conversations
Headers: Authorization: Bearer <token>
```

2. **Create/Get Conversation**

```bash
POST /api/v1/chat/conversations
Headers: Authorization: Bearer <token>
Body: { "otherUserId": "userId" }
```

3. **Send Message**

```bash
POST /api/v1/chat/messages
Headers: Authorization: Bearer <token>
Body: {
  "conversationId": "id",
  "content": "Hello",
  "attachments": []
}
```

## Performance Optimizations

- Message pagination (20 per load)
- Lazy loading conversations
- Socket room-based broadcasting
- Database indexing on conversationId and sender

## Security

- JWT authentication required
- User can only access own conversations
- Soft delete for messages (no permanent deletion)
- Input validation on all endpoints
- CORS configured for frontend URL

## Future Enhancements

- [ ] Group chats
- [ ] Voice/Video calls
- [ ] Message reactions
- [ ] Message forwarding
- [ ] Chat archiving
- [ ] End-to-end encryption
- [ ] Chat backup/restore
- [ ] Push notifications
