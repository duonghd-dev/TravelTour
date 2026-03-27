import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { chatApi } from '@/features/chat/api';
import { useToast, useChatContext } from '@/contexts';

/**
 * Hook để bắt đầu chat với một user
 */
export const useStartChat = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const { openChat, setIsOpen } = useChatContext();

  const startChat = async (otherUserId, otherUserName = 'User') => {
    try {
      if (!currentUser) {
        toast.error('❌ Vui lòng đăng nhập để gửi tin nhắn', 3000);
        navigate('/auth/login');
        return;
      }

      if (currentUser._id === otherUserId) {
        toast.error('❌ Không thể nhắn tin cho chính mình', 3000);
        return;
      }

      // Get or create conversation
      const response = await chatApi.getOrCreateConversation(otherUserId);

      if (response.success) {
        toast.success(`✅ Đã mở cuộc trò chuyện với ${otherUserName}`, 2000);

        // Open chat with the conversation
        openChat(response.data);
        setIsOpen(true);

        // Scroll to chatbox
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      } else {
        console.error(
          '[useStartChat] API response success is false:',
          response
        );
      }
    } catch (error) {
      console.error('[useStartChat] Error:', error);
    }
  };

  return { startChat };
};
