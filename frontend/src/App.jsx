import { Suspense } from 'react';
import {
  ToastProvider,
  SocketProvider,
  AuthProvider,
  ChatProvider,
} from '@/contexts';
import { ChatBox } from '@/features/chat';
import AppRouter from '@/routes/AppRouter';
import { useAuth } from '@/hooks';

function AppContent() {
  const { token, user, isLoading } = useAuth();
  const enableChatBox = import.meta.env.VITE_ENABLE_CHATBOX !== 'false';

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ChatProvider>
      <SocketProvider token={token}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouter />
          {enableChatBox && !['admin', 'staff'].includes(user?.role) && (
            <ChatBox />
          )}
        </Suspense>
      </SocketProvider>
    </ChatProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
