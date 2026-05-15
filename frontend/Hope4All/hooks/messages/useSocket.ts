import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/constants/api';

export const useSocket = (userId: string | undefined, token: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId || !token) return;

    console.log(`[Socket] Connecting for user: ${userId}`);
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      auth: { token },
      query: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[Socket] Connected! ID: ${socket.id}`);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected. Reason: ${reason}`);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId, token]);

  return { socket: socketRef.current, isConnected };
};
