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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';

// Components
import { ConversationItem } from '@/components/messages/ConversationItem';
import { MessageBubble } from '@/components/messages/MessageBubble';
import { ChatHeader } from '@/components/messages/ChatHeader';
import { MessageInput } from '@/components/messages/MessageInput';

// Hooks
import { useSocket } from '@/hooks/messages/useSocket';
import { useMessages } from '@/hooks/messages/useMessages';

export default function MessagesScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  // BUG FIX: Join socket using middleware auth
  const { socket, isConnected } = useSocket(user?.id, user?.token);
  
  const {
    messages,
    conversations,
    loadConversations,
    loadMessages,
    sendMessage,
    loading,
    sending
  } = useMessages(selectedUser?._id, socket, user?.token);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (params.userId && params.username) {
      const userObj = { _id: params.userId, username: params.username };
      setSelectedUser(userObj);
      loadMessages(params.userId as string);
    }
  }, [params.userId, params.username, loadMessages]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    loadMessages(user._id);
  };

  const handleSend = async (content: string) => {
    if (!selectedUser) return;
    try {
      await sendMessage(selectedUser._id, content);
      // Scroll to bottom after sending
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      Alert.alert('Error', 'Could not send message. Please check your connection.');
    }
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(conv => 
      conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  // Main list view
  if (!selectedUser) {
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
              renderItem={({ item, index }) => (
                <ConversationItem 
                  item={item} 
                  index={index} 
                  onPress={handleSelectUser} 
                  isConnected={isConnected} 
                />
              )}
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

  // Chat view
  return (
    <View style={styles.container}>
      <ChatHeader 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)} 
        isConnected={isConnected} 
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble 
            item={item} 
            isMine={String(item.senderId._id || item.senderId) === String(user?.id)} 
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <MessageInput onSend={handleSend} sending={sending} />
      </KeyboardAvoidingView>
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
  messageList: { paddingHorizontal: 15, paddingTop: 15 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 50, marginTop: 50 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 15 },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 5 }
});
