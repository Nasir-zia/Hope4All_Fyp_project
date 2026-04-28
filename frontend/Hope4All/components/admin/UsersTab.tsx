import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface UsersTabProps {
  users: any[];
  onUpdateStatus: (id: string, currentStatus: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ users, onUpdateStatus }) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Community Directory</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{users.length} Active</Text>
        </View>
      </View>
      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No users registered yet.</Text>
        </View>
      ) : (
        users.map((u) => (
          <View key={u._id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userMain}>
                {u.profilePic ? (
                  <Image source={{ uri: u.profilePic }} style={styles.userAvatar} />
                ) : (
                  <View style={[styles.userAvatar, { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="person" size={24} color="#94a3b8" />
                  </View>
                )}
                <View>
                  <Text style={styles.userName}>{u.name || u.username}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: u.role === 'orphan' ? '#eff6ff' : u.role === 'donor' ? '#fdf2f8' : '#f0fdf4' }]}>
                    <Text style={[styles.roleText, { color: u.role === 'orphan' ? '#2563eb' : u.role === 'donor' ? '#db2777' : '#16a34a' }]}>
                      {u.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.userActionBtn, u.status === 'suspended' && { backgroundColor: '#fee2e2' }]}
                onPress={() => onUpdateStatus(u._id, u.status)}
              >
                <Text style={[styles.userActionText, u.status === 'suspended' && { color: '#dc2626' }]}>
                  {u.status === 'verified' ? 'Suspend' : 'Verify'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>{u.email}</Text>
              </View>
              {u.location && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color="#64748b" />
                  <Text style={styles.detailText}>{u.location}</Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
};
