import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Alert,
  Keyboard,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { fetchConversations, fetchMessages, sendMessageApi, SOCKET_URL } from '@/constants/api';
import io from 'socket.io-client';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight, FadeInLeft, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function MessagesScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    loadConversations();
    setupSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (params.userId && params.username) {
      setSelectedUser({ _id: params.userId, username: params.username });
      loadMessages(params.userId as string);
    } else if (params.userId) {
      // Fallback if username is missing but userId is present
      setSelectedUser({ _id: params.userId, username: 'User' });
      loadMessages(params.userId as string);
    }
  }, [params.userId, params.username]);

  const setupSocket = () => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-user', user?.token); 
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new-message', (message: any) => {
      if (selectedUser && (String(message.senderId._id || message.senderId) === String(selectedUser._id))) {
        setMessages(prev => [...prev, message]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
      loadConversations();
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
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 200);
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
      // 1. Send via API (Guaranteed persistence)
      const sentMsg = await sendMessageApi(selectedUser._id, messageContent);
      
      // 2. Send via Socket for real-time (if connected)
      if (socketRef.current?.connected) {
        socketRef.current.emit('send-message', {
          receiverId: selectedUser._id,
          message: messageContent
        });
      }

      // 3. Local state update
      setMessages(prev => [...prev, sentMsg.message || sentMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      loadConversations();
    } catch (err) {
      Alert.alert('Error', 'Could not send message. Please check your connection.');
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

  const renderConversationItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 50)}>
      <TouchableOpacity 
        style={styles.convItem} 
        onPress={() => {
          setSelectedUser(item.user);
          loadMessages(item.user._id);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient colors={['#4da6ff', '#0077cc']} style={styles.avatarGradient}>
            <Text style={styles.avatarText}>{item.user.username?.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
          <View style={[styles.onlineBadge, { backgroundColor: isConnected ? '#22c55e' : '#94a3b8' }]} />
        </View>
        <View style={styles.convDetails}>
          <View style={styles.convHeader}>
            <Text style={styles.convName}>{item.user.username}</Text>
            <Text style={styles.convTime}>
              {item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>
          <Text style={styles.lastMsg} numberOfLines={1}>
            {item.lastMessage?.message || 'Tap to chat'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderMessageItem = ({ item }: { item: any }) => {
    const isMine = String(item.senderId._id || item.senderId) === String(user?.id);
    return (
      <Animated.View 
        entering={isMine ? FadeInRight : FadeInLeft} 
        style={[styles.msgWrapper, isMine ? styles.msgMine : styles.msgTheirs]}
      >
        <View style={[styles.msgBubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.msgText, isMine ? styles.textMine : styles.textTheirs]}>
            {item.message}
          </Text>
        </View>
        <Text style={styles.msgTime}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Animated.View>
    );
  };

  if (selectedUser) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#fff', '#f8fafc']} style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#0077cc" />
          </TouchableOpacity>
          <View style={styles.headerUser}>
            <LinearGradient colors={['#4da6ff', '#0077cc']} style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{selectedUser.username?.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <View>
              <Text style={styles.headerName}>{selectedUser.username}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: isConnected ? '#22c55e' : '#94a3b8' }]} />
                <Text style={styles.statusText}>{isConnected ? 'Active now' : 'Offline'}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputAreaWrapper}>
            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#94a3b8"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendBtn, (!newMessage.trim() || sending) && styles.sendBtnDisabled]} 
                onPress={handleSendMessage}
                disabled={!newMessage.trim() || sending}
              >
                <LinearGradient
                  colors={newMessage.trim() ? ['#4da6ff', '#0077cc'] : ['#e2e8f0', '#cbd5e1']}
                  style={styles.sendGradient}
                >
                  {sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={20} color="#fff" />}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0077cc', '#005fa3']} style={styles.listHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {showSearch ? (
          <TextInput
            autoFocus
            style={styles.headerSearchInput}
            placeholder="Search people..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        ) : (
          <Text style={styles.mainTitle}>Messages</Text>
        )}
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.headerIcon}>
          <Ionicons name={showSearch ? "close" : "search-outline"} size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0077cc" />
        </View>
      ) : (
        <View style={styles.listContent}>
          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={item => item.user._id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={80} color="#e2e8f0" />
                <Text style={styles.emptyTitle}>No conversations found</Text>
                <Text style={styles.emptySub}>Try searching for another donor or orphan.</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listHeader: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerSearchInput: { flex: 1, color: '#fff', fontSize: 18, marginHorizontal: 15, paddingVertical: 5 },
  listContent: { flex: 1 },
  convItem: { flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  avatarGradient: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  onlineBadge: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
  convDetails: { flex: 1, marginLeft: 15 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  convName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  convTime: { fontSize: 11, color: '#94a3b8' },
  lastMsg: { fontSize: 14, color: '#64748b' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { padding: 5, marginRight: 5 },
  headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerAvatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerName: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#64748b' },
  messageList: { paddingHorizontal: 15, paddingTop: 15 },
  msgWrapper: { marginBottom: 12, maxWidth: '80%' },
  msgMine: { alignSelf: 'flex-end' },
  msgTheirs: { alignSelf: 'flex-start' },
  msgBubble: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  bubbleMine: { backgroundColor: '#0077cc', borderBottomRightRadius: 2 },
  bubbleTheirs: { backgroundColor: '#f1f5f9', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 15, lineHeight: 20 },
  textMine: { color: '#fff' },
  textTheirs: { color: '#1e293b' },
  msgTime: { fontSize: 9, color: '#94a3b8', marginTop: 4, alignSelf: 'flex-end' },
  inputAreaWrapper: { paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  inputArea: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 25, paddingHorizontal: 5, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { flex: 1, fontSize: 15, color: '#1e293b', paddingHorizontal: 15, maxHeight: 100, paddingVertical: 10 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden', margin: 4 },
  sendGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 50, marginTop: 50 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 15 },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 5 }
});
