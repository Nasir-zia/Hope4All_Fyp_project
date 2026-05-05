import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Alert, Keyboard } from 'react-native';
import { fetchConversations, fetchMessages, sendMessageApi } from '../constants/api';
import { useAuth } from './useAuth';
import { useSocket } from './useSocket';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

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
  const [attachment, setAttachment] = useState<any>(null);
  const [pickingFile, setPickingFile] = useState(false);
  
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

  const pickAttachment = async (type: 'image' | 'file') => {
    try {
      setPickingFile(true);
      if (type === 'image') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.8,
        });
        if (!result.canceled) {
          setAttachment({
            uri: result.assets[0].uri,
            name: result.assets[0].uri.split('/').pop() || 'image.jpg',
            type: 'image'
          });
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
        if (!result.canceled) {
          setAttachment({
            uri: result.assets[0].uri,
            name: result.assets[0].name,
            type: 'file'
          });
        }
      }
    } catch (err) {
      console.error('Pick attachment error:', err);
    } finally {
      setPickingFile(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !attachment) || !selectedUser) return;

    const messageContent = newMessage.trim();
    const currentAttachment = attachment;
    
    setNewMessage('');
    setAttachment(null);
    setSending(true);

    try {
      let payload: string | FormData = messageContent;

      if (currentAttachment) {
        payload = new FormData();
        payload.append('receiverId', selectedUser._id);
        payload.append('message', messageContent);
        
        const fileName = currentAttachment.name;
        if (Platform.OS === 'web') {
          const response = await fetch(currentAttachment.uri);
          const blob = await response.blob();
          payload.append('file', blob, fileName);
        } else {
          payload.append('file', {
            uri: Platform.OS === 'android' ? currentAttachment.uri : currentAttachment.uri.replace('file://', ''),
            name: fileName,
            type: currentAttachment.type === 'image' ? 'image/jpeg' : 'application/octet-stream',
          } as any);
        }
      }

      const sentMsg = await sendMessageApi(selectedUser._id, payload);
      
      if (socket?.connected && !currentAttachment) { // Socket only for simple text for now, API handles broadcast for files
        socket.emit('send-message', {
          receiverId: selectedUser._id,
          message: messageContent
        });
      }

      const finalMsg = sentMsg.message || sentMsg;
      setMessages(prev => [...prev, finalMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      loadConversations();
    } catch (err) {
      Alert.alert('Error', 'Could not send message. Please check your connection.');
      setNewMessage(messageContent); 
      setAttachment(currentAttachment);
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
    pickAttachment,
    attachment, setAttachment,
    pickingFile,
    loadMessages,
    socketConnected: socket?.connected || false
  };
}
