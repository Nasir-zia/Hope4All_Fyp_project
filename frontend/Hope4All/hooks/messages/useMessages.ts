import { useCallback, useEffect } from 'react';
import { useMessageStore } from '../../store/messageStore';
import { Socket } from 'socket.io-client';

export const useMessages = (selectedUserId: string | null, socket: Socket | null, token?: string) => {
  const {
    messages,
    conversations,
    loading,
    sending,
    fetchConversations,
    fetchMessages,
    sendMessage: storeSendMessage,
    handleIncomingMessage,
    setMessages
  } = useMessageStore();

  const loadConversations = useCallback(async () => {
    await fetchConversations(token);
  }, [token, fetchConversations]);

  const loadMessages = useCallback(async (otherUserId: string) => {
    await fetchMessages(otherUserId, token);
  }, [token, fetchMessages]);

  const sendMessage = useCallback(async (receiverId: string, content: string | FormData) => {
    console.log(`[useMessages] Sending to ${receiverId}`);
    return await storeSendMessage(receiverId, content, token);
  }, [token, storeSendMessage]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (message: any) => {
      console.log('New message received via socket:', message);
      handleIncomingMessage(message, selectedUserId);
      // Also refresh conversations to update unread counts
      fetchConversations(token);
    };

    socket.on('new-message', onNewMessage);
    return () => {
      socket.off('new-message', onNewMessage);
    };
  }, [socket, selectedUserId, handleIncomingMessage, fetchConversations, token]);

  return {
    messages,
    setMessages,
    conversations,
    loadConversations,
    loadMessages,
    sendMessage,
    loading,
    sending
  };
};
