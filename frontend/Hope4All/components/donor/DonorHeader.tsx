import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DonorHeaderProps {
  name: string;
  points: number;
  onLogout: () => void;
  onMessages: () => void;
}

export const DonorHeader: React.FC<DonorHeaderProps> = ({ name, points, onLogout, onMessages }) => {
  return (
    <View style={styles.dashboardHeader}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.messagesButton} onPress={onMessages}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.welcomeTitle}>Welcome Back,</Text>
      <Text style={styles.donorName}>{name}</Text>
      
      <View style={styles.badge}>
        <Ionicons name="ribbon" size={20} color="#ffd700" />
        <Text style={styles.badgeText}>{points} Impact Points</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardHeader: {
    backgroundColor: '#0077cc',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#0077cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 10,
  },
  logoutButton: {
    position: 'absolute',
    right: 25,
    top: Platform.OS === 'ios' ? 70 : 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    zIndex: 20,
  },
  messagesButton: {
    position: 'absolute',
    right: 80,
    top: Platform.OS === 'ios' ? 70 : 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    zIndex: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    color: '#e6f4ff',
    fontWeight: '500',
    marginBottom: 5,
  },
  donorName: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },
});
