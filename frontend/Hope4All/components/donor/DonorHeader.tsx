import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';

interface DonorHeaderProps {
  name: string;
  points: number;
  onLogout: () => void;
  onMessages: () => void;
}

export const DonorHeader: React.FC<DonorHeaderProps> = ({ 
  name, 
  points, 
  onLogout, 
  onMessages 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.topActions}>
        <View style={styles.leftActions}>
          <BackButton 
            containerStyle={{ position: 'relative', top: 0, left: 0 }} 
            buttonStyle={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', elevation: 0 }}
          />
        </View>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onMessages}>
            <Ionicons name="mail-outline" size={22} color="#475569" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.logoutBtn]} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{name?.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
           <View style={styles.badge}>
             <Text style={styles.badgeText}>DONOR DASHBOARD</Text>
           </View>
           <Text style={styles.welcomeText}>Great to see you,</Text>
           <Text style={styles.usernameText}>{name || 'Donor'}</Text>
           <View style={styles.pointsBadge}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.pointsText}>{points} Impact Units</Text>
           </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftActions: {},
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  logoutBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0077cc',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0077cc',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  usernameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fffbeb',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0077cc',
    letterSpacing: 0.5,
  },
});
