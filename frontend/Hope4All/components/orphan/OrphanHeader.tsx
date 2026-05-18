import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import BackButton from '@/components/BackButton';

interface OrphanHeaderProps {
  name: string;
  profilePic?: string;
  onOpenSettings: () => void;
  onLogout: () => void;
}

import { LinearGradient } from 'expo-linear-gradient';

export const OrphanHeader: React.FC<OrphanHeaderProps> = ({ 
  name, 
  profilePic, 
  onOpenSettings, 
  onLogout 
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.header}
      >
        <View style={styles.topActions}>
          <View style={styles.leftActions}>
            <BackButton 
              containerStyle={{ position: 'relative', top: 0, left: 0 }} 
              buttonStyle={{ backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', elevation: 0, shadowOpacity: 0 }}
              color="#fff"
            />
          </View>
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/messages')}>
              <Ionicons name="chatbubbles-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={onOpenSettings}>
              <Ionicons name="settings-outline" size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, styles.logoutBtn]} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={22} color="#f87171" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.profileCenter}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              {profilePic ? (
                <Image source={{ uri: profilePic }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>{name?.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </View>
            <View style={styles.onlineBadge} />
          </View>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VERIFIED RECIPIENT</Text>
          </View>
          <Text style={styles.welcomeText}>Hello there,</Text>
          <Text style={styles.usernameText}>{name || 'Orphan'}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
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
    gap: 12,
  },
  profileCenter: {
    alignItems: 'center',
    marginTop: 5,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B35', // Match brand orange
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  welcomeText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 1,
  },
});
