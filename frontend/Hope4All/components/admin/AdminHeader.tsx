import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.adminTag}>HOPE4ALL • ADMIN DASHBOARD</Text>
          <Text style={styles.welcome}>Control Panel</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#f87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  adminTag: {
    color: '#64748b',
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  welcome: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
});
