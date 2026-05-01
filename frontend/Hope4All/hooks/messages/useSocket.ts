import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/constants/api';

export const useSocket = (userId: string | undefined, token: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId || !token) return;

    // Initialize socket with authentication
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      auth: { token } // BUG FIX: Pass token here for middleware
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      // No need to emit 'join-user' manually, middleware handles it
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId]);

  return { socket: socketRef.current, isConnected };
};
