import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface ConversationItemProps {
  item: any;
  index: number;
  onPress: (user: any) => void;
  isConnected: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ item, index, onPress, isConnected }) => {
  const lastMsgTime = item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const displayName = item.user.name || item.user.username;

  return (
    <Animated.View entering={FadeInRight.delay(index * 50)}>
      <TouchableOpacity 
        style={styles.convItem} 
        onPress={() => onPress(item.user)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{displayName?.charAt(0).toUpperCase()}</Text>
          </View>
          {isConnected && <View style={styles.onlineStatusIndicator} />}
        </View>
        
        <View style={styles.convDetails}>
          <View style={styles.convHeader}>
            <Text style={styles.convName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.convTime}>{lastMsgTime}</Text>
          </View>
          <View style={styles.lastMsgRow}>
            <Text style={[styles.lastMsg, item.unreadCount > 0 && styles.unreadMsgText]} numberOfLines={1}>
              {item.lastMessage?.message || 'Tap to chat'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadDot} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  convItem: { 
    flexDirection: 'row', 
    paddingVertical: 14, 
    paddingHorizontal: 20, 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatarContainer: { position: 'relative' },
  avatarPlaceholder: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#f1f5f9',
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarInitial: { color: '#1e293b', fontSize: 20, fontWeight: '700' },
  onlineStatusIndicator: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    backgroundColor: '#22c55e',
    borderWidth: 2, 
    borderColor: '#fff' 
  },
  convDetails: { flex: 1, marginLeft: 16 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  convName: { fontSize: 16, fontWeight: '700', color: '#1e293b', flex: 1 },
  convTime: { fontSize: 12, color: '#94a3b8' },
  lastMsg: { fontSize: 14, color: '#64748b', flex: 1 },
  lastMsgRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  unreadMsgText: { color: '#00C2E0', fontWeight: '600' },
  unreadDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#00C2E0',
  },
});
