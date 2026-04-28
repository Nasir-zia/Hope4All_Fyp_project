import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BackButton from '@/components/BackButton';

interface OrphanHeaderProps {
  name: string;
  profilePic?: string;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const OrphanHeader: React.FC<OrphanHeaderProps> = ({ 
  name, 
  profilePic, 
  onOpenSettings, 
  onLogout 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.topActions}>
        <View style={styles.leftActions}>
          <BackButton 
            containerStyle={{ position: 'relative', top: 0, left: 0 }} 
            buttonStyle={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', elevation: 0, shadowOpacity: 0 }}
          />
        </View>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onOpenSettings}>
            <Ionicons name="settings-outline" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.logoutBtn]} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.profileCenter}>
        <View style={styles.avatarContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{name?.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.usernameText}>{name || 'Orphan'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
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
    marginBottom: 10,
  },
  leftActions: {
    // This will hold the BackButton
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  profileCenter: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    borderWidth: 3,
    borderColor: '#e2e8f0',
    marginBottom: 15,
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
    fontSize: 36,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
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
  },
  logoutBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
});
