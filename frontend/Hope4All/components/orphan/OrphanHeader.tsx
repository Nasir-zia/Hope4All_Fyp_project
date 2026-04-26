import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrphanHeaderProps {
  name: string;
  location: string;
  profilePic: string;
  onLogout: () => void;
  onSettings: () => void;
  onMessages: () => void;
}

export const OrphanHeader: React.FC<OrphanHeaderProps> = ({ 
  name, 
  location, 
  profilePic, 
  onLogout, 
  onSettings, 
  onMessages 
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
        <Ionicons name="settings-outline" size={22} color="#1a1a1a" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.msgBtn} onPress={onMessages}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={40} color="#cbd5e1" />
          </View>
        )}
      </View>
      <Text style={styles.welcomeText}>Welcome, {name}</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location" size={14} color="#e6f4ff" />
        <Text style={styles.locationText}>{location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: '#0077cc',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  logoutBtn: {
    position: 'absolute',
    left: 25,
    top: 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  settingsButton: {
    position: 'absolute',
    right: 70,
    top: 40,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  msgBtn: {
    position: 'absolute',
    right: 25,
    top: 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  avatarContainer: {
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 50,
    padding: 3,
    backgroundColor: '#fff',
    shadowColor: '#0077cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#0077cc',
  },
  avatarPlaceholder: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  locationText: {
    color: '#e6f4ff',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '600',
  },
});
