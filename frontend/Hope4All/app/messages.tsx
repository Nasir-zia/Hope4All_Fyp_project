import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [activeTab, setActiveTab] = useState<'Message' | 'Group'>('Message');
  
  const flatListRef = useRef<FlatList>(null);

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
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      Alert.alert('Error', 'Could not send message.');
    }
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(conv => 
      conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  // Main list view
  if (!selectedUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Chat</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconButton}>
              <Ionicons name="search-outline" size={22} color="#1e293b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <Ionicons name="person-add-outline" size={22} color="#1e293b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            onPress={() => setActiveTab('Message')}
            style={[styles.tabItem, activeTab === 'Message' && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, activeTab === 'Message' && styles.activeTabText]}>Message</Text>
            {activeTab === 'Message' && <View style={styles.activeDot} />}
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('Group')}
            style={[styles.tabItem, activeTab === 'Group' && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, activeTab === 'Group' && styles.activeTabText]}>Group</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Active Now List */}
          <View style={styles.activeNowContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeNowScroll}>
              {conversations.map((conv, idx) => (
                <TouchableOpacity key={conv.user._id} style={styles.activeUserItem} onPress={() => handleSelectUser(conv.user)}>
                  <View style={styles.activeAvatarContainer}>
                    <View style={styles.activeAvatarPlaceholder}>
                      <Text style={styles.avatarInitial}>{conv.user.name?.[0] || conv.user.username?.[0]}</Text>
                    </View>
                    <View style={styles.onlineStatusIndicator} />
                  </View>
                  <Text style={styles.activeUserName} numberOfLines={1}>
                    {conv.user.name?.split(' ')[0] || conv.user.username}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#00C2E0" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              scrollEnabled={false}
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
                  <Text style={styles.emptyTitle}>No conversations</Text>
                </View>
              }
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Chat view
  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <MessageInput onSend={handleSend} sending={sending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    gap: 25,
  },
  tabItem: {
    paddingVertical: 8,
    position: 'relative',
  },
  activeTabItem: {},
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  activeTabText: {
    color: '#1e293b',
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    right: -8,
    top: 8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00C2E0',
  },

  // Active Now
  activeNowContainer: {
    paddingVertical: 10,
  },
  activeNowScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },
  activeUserItem: {
    alignItems: 'center',
    width: 65,
  },
  activeAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  activeAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00C2E0',
    padding: 2,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  onlineStatusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeUserName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },

  messageList: { paddingHorizontal: 15, paddingTop: 15 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 50, marginTop: 50 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#94a3b8', marginTop: 15 },
});
