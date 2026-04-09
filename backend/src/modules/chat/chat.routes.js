import express from 'express';
import chatController from './chat.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';

const router = express.Router();


router.use(authenticateToken);


router.post('/conversations', chatController.getOrCreateConversation);
router.get('/conversations', chatController.getUserConversations);
router.patch(
  '/conversations/:conversationId/read',
  chatController.markConversationAsRead
);


router.post('/messages', chatController.sendMessage);
router.post('/messages/ai-response', chatController.sendAIResponse);
router.get(
  '/conversations/:conversationId/messages',
  chatController.getMessages
);
router.patch('/messages/:messageId/read', chatController.markAsRead);
router.delete('/messages/:messageId', chatController.deleteMessage);


router.get('/messages/search', chatController.searchMessages);

export default router;
