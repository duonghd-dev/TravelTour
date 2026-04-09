import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (!token) {
      console.warn(
        '[SocketContext] No token provided, skipping socket connection'
      );
      return;
    }

    const socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080',
      {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      }
    );

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('reconnect', () => {
      
      setTimeout(() => {
        setIsConnected(true);
      }, 100);
    });

    socketInstance.on('connect_error', (error) => {
      console.error(
        '[SocketContext] Socket connection error:',
        error.message || error
      );
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('[SocketContext] Socket error:', error);
    });

    socketInstance.on('user:online', ({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    });

    socketInstance.on('user:offline', ({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
