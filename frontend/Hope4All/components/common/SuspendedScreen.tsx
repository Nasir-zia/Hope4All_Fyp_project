import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuspendedScreenProps {
  reason: string;
  onLogout: () => void;
}

export const SuspendedScreen: React.FC<SuspendedScreenProps> = ({ reason, onLogout }) => {
  return (
    <View style={styles.container}>
       <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="warning" size={48} color="#ef4444" />
          </View>
          <Text style={styles.title}>Account Suspended</Text>
          <Text style={styles.desc}>
            Your account has been suspended by the administration. You currently cannot perform any actions on the platform.
          </Text>
          
          <View style={styles.card}>
             <Ionicons name="alert-circle" size={20} color="#ef4444" />
             <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Reason for Suspension:</Text>
                <Text style={styles.cardText}>{reason || "No specific reason provided."}</Text>
             </View>
          </View>
          
          <Text style={styles.contactText}>
            If you believe this is a mistake, please contact support@hope4all.org
          </Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 40 },
  content: { alignItems: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 15 },
  desc: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  card: { flexDirection: 'row', backgroundColor: '#fff5f5', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#fee2e2', gap: 12, alignItems: 'flex-start' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#991b1b', marginBottom: 4 },
  cardText: { fontSize: 14, color: '#b91c1c', lineHeight: 20 },
  contactText: { marginTop: 25, fontSize: 13, color: '#94a3b8', textAlign: 'center' },
  logoutBtn: { marginTop: 40, padding: 15 },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
});
