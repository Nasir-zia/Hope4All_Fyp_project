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
  return (
    <Animated.View entering={FadeInRight.delay(index * 50)}>
      <TouchableOpacity 
        style={styles.convItem} 
        onPress={() => onPress(item.user)}
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
            <View>
              <Text style={styles.convName}>{item.user.username}</Text>
              <Text style={styles.roleLabel}>{item.user.role?.toUpperCase()}</Text>
            </View>
            <Text style={styles.convTime}>
              {item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>
          <View style={styles.lastMsgRow}>
            <Text style={[styles.lastMsg, item.unreadCount > 0 && styles.unreadMsgText]} numberOfLines={1}>
              {item.lastMessage?.message || 'Tap to chat'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  convItem: { flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  avatarGradient: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  onlineBadge: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
  convDetails: { flex: 1, marginLeft: 15 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  convName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  roleLabel: { fontSize: 9, fontWeight: '800', color: '#0077cc', marginTop: -2 },
  convTime: { fontSize: 11, color: '#94a3b8' },
  lastMsg: { fontSize: 14, color: '#64748b', flex: 1 },
  lastMsgRow: { flexDirection: 'row', alignItems: 'center' },
  unreadMsgText: { fontWeight: '700', color: '#1e293b' },
  unreadBadge: { 
    backgroundColor: '#0077cc', 
    minWidth: 20, 
    height: 20, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10,
    paddingHorizontal: 6
  },
  unreadBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
