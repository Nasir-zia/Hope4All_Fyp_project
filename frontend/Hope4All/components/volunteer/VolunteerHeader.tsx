import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VolunteerHeaderProps {
  name: string;
  onLogout: () => void;
  onMessages: () => void;
}

export const VolunteerHeader: React.FC<VolunteerHeaderProps> = ({ name, onLogout, onMessages }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.msgBtn} onPress={onMessages}>
        <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.welcomeTitle}>Hello,</Text>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.subText}>Ready for today's mission?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    backgroundColor: '#0077cc',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoutBtn: {
    position: 'absolute',
    right: 25,
    top: 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  msgBtn: {
    position: 'absolute',
    right: 80,
    top: 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    color: '#e6f4ff',
    fontWeight: '500',
  },
  nameText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#e6f4ff',
    opacity: 0.8,
  },
});
