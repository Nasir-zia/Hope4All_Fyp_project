import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatHeaderProps {
  user: any;
  onBack: () => void;
  isConnected: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack, isConnected }) => {
  const displayName = user.name || user.username;

  return (
    <View style={styles.chatHeader}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={26} color="#1e293b" />
      </TouchableOpacity>

      <View style={styles.headerUser}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{displayName?.charAt(0).toUpperCase()}</Text>
          {isConnected && <View style={styles.onlineStatusIndicator} />}
        </View>
        <View>
          <Text style={styles.headerName}>{displayName}</Text>
          <Text style={styles.statusText}>{isConnected ? 'Active now' : 'Offline'}</Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerActionBtn}>
          <Ionicons name="information-circle-outline" size={26} color="#00C2E0" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  backBtn: { marginRight: 15 },
  headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative'
  },
  headerAvatarText: { color: '#1e293b', fontSize: 18, fontWeight: '700' },
  onlineStatusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  statusText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerActionBtn: { padding: 5 },
});
