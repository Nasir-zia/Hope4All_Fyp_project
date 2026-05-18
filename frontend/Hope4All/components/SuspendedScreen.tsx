import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SuspendedScreenProps {
  reason?: string;
  onLogout: () => void;
}

export const SuspendedScreen: React.FC<SuspendedScreenProps> = ({ reason, onLogout }) => {
  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="ban" size={52} color="#ef4444" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Account Suspended</Text>
        <Text style={styles.subtitle}>Your access has been restricted by the administration.</Text>

        {/* Reason Card */}
        <View style={styles.reasonCard}>
          <View style={styles.reasonHeader}>
            <Ionicons name="document-text-outline" size={20} color="#ef4444" />
            <Text style={styles.reasonLabel}>Reason from Admin</Text>
          </View>
          <Text style={styles.reasonText}>
            {reason && reason.trim() !== ''
              ? reason
              : 'No specific reason was provided. Please contact the Hope4All support team for more information.'}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <Ionicons name="mail-outline" size={18} color="#0077cc" />
          <Text style={styles.contactText}>
            If you believe this is a mistake, please contact us at{' '}
            <Text style={styles.contactEmail}>support@hope4all.org</Text>
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 36,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 2,
    borderColor: '#fee2e2',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  reasonCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ef4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
  },
  contactCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    marginBottom: 36,
  },
  contactText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  contactEmail: {
    color: '#0077cc',
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 16,
  },
});
