import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Alert, Keyboard } from 'react-native';
import { fetchConversations, fetchMessages, sendMessageApi } from '../constants/api';
import { useAuth } from './useAuth';
import { useSocket } from './useSocket';

export function useMessages(initialUserId?: string, initialUsername?: string) {
  const { user, logout } = useAuth();
  const socket = useSocket(user?.id);
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(
    initialUserId ? { _id: initialUserId, username: initialUsername } : null
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const flatListRef = useRef<any>(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (otherUserId: string) => {
    try {
      setLoading(true);
      const data = await fetchMessages(otherUserId);
      setMessages(data);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 200);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (initialUserId) {
      loadMessages(initialUserId);
    }
  }, [initialUserId, loadMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      // Check if message is from the currently selected user
      const senderId = message.senderId._id || message.senderId;
      if (selectedUser && String(senderId) === String(selectedUser._id)) {
        setMessages(prev => [...prev, message]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
      loadConversations();
    };

    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, selectedUser, loadConversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const sentMsg = await sendMessageApi(selectedUser._id, messageContent);
      
      if (socket?.connected) {
        socket.emit('send-message', {
          receiverId: selectedUser._id,
          message: messageContent
        });
      }

      setMessages(prev => [...prev, sentMsg.message || sentMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      loadConversations();
    } catch (err) {
      Alert.alert('Error', 'Could not send message. Please check your connection.');
      setNewMessage(messageContent); // Restore message on fail
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(conv => 
      conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  return {
    user,
    conversations,
    selectedUser, setSelectedUser,
    messages,
    newMessage, setNewMessage,
    loading,
    sending,
    searchQuery, setSearchQuery,
    showSearch, setShowSearch,
    filteredConversations,
    flatListRef,
    handleSendMessage,
    loadMessages,
    socketConnected: socket?.connected || false
  };
}
