import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.adminTag}>HOPE4ALL</Text>
      <Text style={styles.welcome}>Admin Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 70,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoutBtn: {
    position: 'absolute',
    right: 25,
    top: 60,
    padding: 8,
    backgroundColor: '#334155',
    borderRadius: 10,
    zIndex: 10,
  },
  adminTag: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 2,
  },
  welcome: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
