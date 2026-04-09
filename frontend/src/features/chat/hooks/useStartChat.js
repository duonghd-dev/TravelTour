import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { chatApi } from '@/features/chat/api';
import { useToast, useChatContext } from '@/contexts';

export const useStartChat = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const { openChat, setIsOpen } = useChatContext();

  const startChat = async (otherUserId, otherUserName = 'User') => {
    try {
      if (!currentUser) {
        toast.error('Vui lòng đăng nhập để gửi tin nhắn', 3000);
        navigate('/auth/login');
        return;
      }

      if (currentUser._id === otherUserId) {
        toast.error('Không thể nhắn tin cho chính mình', 3000);
        return;
      }

      const response = await chatApi.getOrCreateConversation(otherUserId);

      if (response.success) {
        toast.success(`✅ Đã mở cuộc trò chuyện với ${otherUserName}`, 2000);

        openChat(response.data);
        setIsOpen(true);

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
