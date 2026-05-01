import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatHeaderProps {
  user: any;
  onBack: () => void;
  isConnected: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack, isConnected }) => {
  return (
    <LinearGradient colors={['#fff', '#f8fafc']} style={styles.chatHeader}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#0077cc" />
      </TouchableOpacity>
      <View style={styles.headerUser}>
        <LinearGradient colors={['#4da6ff', '#0077cc']} style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{user.username?.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <View>
          <Text style={styles.headerName}>{user.username}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#22c55e' : '#94a3b8' }]} />
            <Text style={styles.statusText}>{isConnected ? 'Active now' : 'Offline'}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  chatHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 12, 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  backBtn: { padding: 5, marginRight: 5 },
  headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerAvatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerName: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#64748b' },
});
