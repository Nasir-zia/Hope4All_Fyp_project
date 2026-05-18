import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface VolunteerHeaderProps {
  name: string;
  onLogout: () => void;
  onMessages: () => void;
}

export const VolunteerHeader: React.FC<VolunteerHeaderProps> = ({ name, onLogout, onMessages }) => {
  return (
    <LinearGradient
      colors={['#0077cc', '#005fa3']}
      style={styles.header}
    >
      <View style={styles.topRow}>
        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={onMessages}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Hello,</Text>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.subText}>Ready for today&apos;s mission?</Text>
      </View>

      <View style={styles.decoration} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 40,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    zIndex: 2,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
  },
  content: {
    marginTop: 10,
    zIndex: 2,
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
  decoration: {
    position: 'absolute',
    left: -30,
    bottom: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 1,
  },
});
