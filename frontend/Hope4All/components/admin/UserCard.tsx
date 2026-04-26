import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserCardProps {
  user: any;
  onToggleStatus: (userId: string, currentStatus: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onToggleStatus }) => {
  return (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: user.profilePic || 'https://via.placeholder.com/100' }} 
            style={styles.userAvatar} 
          />
          <View>
            <Text style={styles.reqTitle}>{user.name}</Text>
            <Text style={styles.badgeText}>{user.role.toUpperCase()}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.statusToggle, 
            user.status === 'verified' ? styles.statusToggleBlocked : null
          ]}
          onPress={() => onToggleStatus(user.userId?._id, user.status)}
        >
          <Text style={styles.statusToggleText}>
            {user.status === 'verified' ? 'BLOCK' : 'VERIFY'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={14} color="#64748b" />
        <Text style={styles.infoText}>{user.location || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={14} color="#64748b" />
        <Text style={styles.infoText}>{user.phone || 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  statusToggle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fecaca',
  },
  statusToggleBlocked: {
    backgroundColor: '#dcfce7',
  },
  statusToggleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
  },
});
