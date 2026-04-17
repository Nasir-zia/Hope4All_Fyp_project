import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { fetchConversations, fetchMessages, sendMessageApi } from '@/constants/api';
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.3:5000'; // Make sure this matches your API IP

export default function MessagesScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    loadConversations();
    setupSocket();
    
    // If opened with a specific user (e.g. from Matched Orphans)
    if (params.userId && params.username) {
      setSelectedUser({ _id: params.userId, username: params.username });
      loadMessages(params.userId as string);
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const setupSocket = () => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      // In a real app, you'd send a token here
      socket.emit('join-user', user?.token); 
    });

    socket.on('new-message', (message: any) => {
      // If the message is from the user we are currently chatting with
      if (selectedUser && (message.senderId._id === selectedUser._id || message.senderId === selectedUser._id)) {
        setMessages(prev => [...prev, message]);
        // Scroll to bottom
        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
      }
      // Reload conversations list to show last message
      loadConversations();
    });

    socket.on('error', (err: any) => {
      console.error('Socket error:', err);
    });
  };

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.log('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      setLoading(true);
      const data = await fetchMessages(otherUserId);
      setMessages(data);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 200);
    } catch (err) {
      console.log('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // Send via socket for real-time
      socketRef.current.emit('send-message', {
        receiverId: selectedUser._id,
        message: messageContent
      });

      // Also call API to ensure it's saved (though socketHandler also saves it)
      // If your socket handler already saves, you might not need this call.
      // Based on our socketHandler.js, it DOES save to DB.
      
      // Local optimistic update
      const optimisticMsg = {
        _id: Date.now().toString(),
        senderId: { _id: user?.id, username: user?.username },
        receiverId: selectedUser._id,
        message: messageContent,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, optimisticMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
      
    } catch (err) {
      Alert.alert('Error', 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const renderConversationItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.convItem} 
      onPress={() => {
        setSelectedUser(item.user);
        loadMessages(item.user._id);
      }}
    >
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{item.user.username?.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.convDetails}>
        <View style={styles.convHeader}>
          <Text style={styles.convName}>{item.user.username}</Text>
          <Text style={styles.convTime}>
            {item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
        </View>
        <Text style={styles.lastMsg} numberOfLines={1}>
          {item.lastMessage?.message || 'Started a conversation'}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: any }) => {
    const isMine = (item.senderId._id || item.senderId) === user?.id;
    return (
      <View style={[styles.msgWrapper, isMine ? styles.msgMine : styles.msgTheirs]}>
        <View style={[styles.msgBubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.msgText, isMine ? styles.textMine : styles.textTheirs]}>
            {item.message}
          </Text>
        </View>
        <Text style={styles.msgTime}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (selectedUser) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedUser(null)}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedUser.username}</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendBtn} 
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || sending}
            >
              <Ionicons name="send" size={24} color={newMessage.trim() ? "#4da6ff" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={loadConversations}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4da6ff" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.user._id}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No conversations yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  convItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4da6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  convDetails: {
    flex: 1,
    marginLeft: 15,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  convName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  convTime: {
    fontSize: 12,
    color: '#999',
  },
  lastMsg: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#ff4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageList: {
    padding: 20,
  },
  msgWrapper: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  msgMine: {
    alignSelf: 'flex-end',
  },
  msgTheirs: {
    alignSelf: 'flex-start',
  },
  msgBubble: {
    padding: 12,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: '#4da6ff',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 15,
  },
  textMine: {
    color: '#fff',
  },
  textTheirs: {
    color: '#333',
  },
  msgTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendBtn: {
    padding: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  }
});
