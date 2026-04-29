import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrphanageDashboard } from '@/hooks/useOrphanageDashboard';
import { SuspendedScreen } from '@/components/SuspendedScreen';
import { PendingVerification } from '@/components/orphan/PendingVerification';
import { RequirementsSection } from '@/components/orphanage/RequirementsSection';
import { RequirementModal } from '@/components/orphanage/RequirementModal';
import { submitRequirement } from '@/constants/api';

export default function OrphanageDashboard() {
  const {
    user, logout, orphanageProfile, loading, isRegistering, requirements,
    name, setName, regNum, setRegNum, phone, setPhone, email, setEmail,
    address, setAddress, city, setCity, state, setState, zipCode, setZipCode,
    capacity, setCapacity, submitting, handleRegister
  } = useOrphanageDashboard();

  const [showReqModal, setShowReqModal] = React.useState(false);
  const [submittingReq, setSubmittingReq] = React.useState(false);

  const handleAddRequirement = async (data: any) => {
    setSubmittingReq(true);
    try {
      await submitRequirement({ ...data, orphanageId: orphanageProfile?._id });
      Alert.alert('Success', 'Requirement submitted for admin approval!');
      setShowReqModal(false);
      // We rely on the hook to refresh or we can manually reload
      // For now, simpler to tell user to pull down to refresh if needed or add a reload in hook
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmittingReq(false);
    }
  };

  if (user?.status === 'suspended') {
    return <SuspendedScreen reason={user.suspensionReason} onLogout={logout} />;
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={styles.loadingText}>Loading Orphanage Dashboard...</Text>
      </View>
    );
  }

  if (isRegistering) {
    return (
      <ScrollView contentContainerStyle={styles.regContainer}>
        <Text style={styles.regTitle}>Register Your Orphanage</Text>
        <Text style={styles.regSubtitle}>Join Hope4All to receive support for your children.</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Orphanage Name *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Hope House" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Registration Number *</Text>
          <TextInput style={styles.input} value={regNum} onChangeText={setRegNum} placeholder="REG-12345" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1 234 567 890" keyboardType="phone-pad" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Official Email *</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="contact@orphanage.org" keyboardType="email-address" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street Address *</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="123 Care Street" />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>City *</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>State *</Text>
            <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="State" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Zip Code *</Text>
            <TextInput style={styles.input} value={zipCode} onChangeText={setZipCode} placeholder="12345" keyboardType="numeric" />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Capacity (Max Children) *</Text>
            <TextInput style={styles.input} value={capacity} onChangeText={setCapacity} placeholder="50" keyboardType="numeric" />
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Register Orphanage</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Cancel & Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (orphanageProfile?.status === 'pending') {
    return <PendingVerification onLogout={logout} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.orphanageName}>{orphanageProfile?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{orphanageProfile?.capacity?.current || 0}</Text>
            <Text style={styles.statLabel}>Children</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{requirements.length}</Text>
            <Text style={styles.statLabel}>Active Needs</Text>
          </View>
        </View>

        <RequirementsSection 
          requirements={requirements} 
          onAdd={() => setShowReqModal(true)} 
        />

        <Text style={styles.sectionTitle}>Upcoming Features</Text>
        <View style={styles.placeholderCard}>
          <Ionicons name="construct-outline" size={40} color="#64748b" />
          <Text style={styles.placeholderText}>Orphan Management coming soon!</Text>
        </View>
      </ScrollView>

      <RequirementModal 
        visible={showReqModal} 
        onClose={() => setShowReqModal(false)} 
        onSubmit={handleAddRequirement} 
        loading={submittingReq} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 15, color: '#64748b', fontWeight: '600' },
  header: { padding: 25, paddingTop: 60, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  welcomeText: { fontSize: 14, color: '#64748b' },
  orphanageName: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  iconBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 24, alignItems: 'center', elevation: 2 },
  statVal: { fontSize: 24, fontWeight: '800', color: '#0077cc' },
  statLabel: { fontSize: 14, color: '#64748b', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 15 },
  placeholderCard: { backgroundColor: '#fff', padding: 40, borderRadius: 30, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#e2e8f0' },
  placeholderText: { textAlign: 'center', color: '#64748b', marginTop: 15, lineHeight: 22 },
  
  regContainer: { padding: 30, paddingTop: 60, backgroundColor: '#fff' },
  regTitle: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 10 },
  regSubtitle: { fontSize: 16, color: '#64748b', marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  row: { flexDirection: 'row', gap: 15 },
  submitBtn: { backgroundColor: '#0077cc', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  logoutBtn: { padding: 20, alignItems: 'center' },
  logoutBtnText: { color: '#ef4444', fontWeight: '700' }
});
