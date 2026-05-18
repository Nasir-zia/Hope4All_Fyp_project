import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface PendingVerificationProps {
  onLogout: () => void;
}

export const PendingVerification: React.FC<PendingVerificationProps> = ({ onLogout }) => {
  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <View style={styles.container}>
       <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="time" size={48} color="#0077cc" />
          </View>
          <Text style={styles.title}>Under Review</Text>
          <Text style={styles.desc}>
            Your profile is currently being verified by our administration team. We will notify you once the process is complete.
          </Text>
          <View style={styles.card}>
             <Ionicons name="information-circle" size={20} color="#0077cc" />
             <Text style={styles.cardText}>You will receive a notification once your account is unlocked.</Text>
          </View>
          
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
       </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { flex: 1, justifyContent: 'center', padding: 40 },
  content: { alignItems: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 15 },
  desc: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  card: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', gap: 12, alignItems: 'center' },
  cardText: { flex: 1, fontSize: 14, color: '#475569', lineHeight: 20 },
  logoutBtn: { marginTop: 40, padding: 15 },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
});
