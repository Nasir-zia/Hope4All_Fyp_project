import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput, Image, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadableUrl } from '../utils/cloudinaryUtils';

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
    capacity, setCapacity, submitting, handleRegister,
    regCert, pickDocument, buildingImages, pickImages
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
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Registration Certificate (PDF/Image) *</Text>
          <TouchableOpacity style={styles.filePicker} onPress={pickDocument}>
            <Ionicons name={regCert ? "checkmark-circle" : "document-attach-outline"} size={20} color={regCert ? "#10b981" : "#64748b"} />
            <Text style={[styles.filePickerText, regCert && { color: '#10b981' }]}>
              {regCert ? regCert.name : "Select Document"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Building Images (Multiple) *</Text>
          <TouchableOpacity style={styles.filePicker} onPress={pickImages}>
            <Ionicons name={buildingImages.length > 0 ? "images" : "images-outline"} size={20} color={buildingImages.length > 0 ? "#10b981" : "#64748b"} />
            <Text style={[styles.filePickerText, buildingImages.length > 0 && { color: '#10b981' }]}>
              {buildingImages.length > 0 ? `${buildingImages.length} images selected` : "Select Images"}
            </Text>
          </TouchableOpacity>
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
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
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

        {/* Profile Documents Section */}
        {orphanageProfile?.documents && (
          <View style={{ marginTop: 25, backgroundColor: '#fff', padding: 20, borderRadius: 24, elevation: 2 }}>
            <Text style={styles.sectionTitle}>Registration Documents</Text>
            
            {orphanageProfile.documents.registrationCert && (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.label}>Certificate:</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, { flex: 1, flexDirection: 'row', gap: 8 }]}
                    onPress={async () => {
                      try {
                        if (orphanageProfile.documents.registrationCert) {
                          await Linking.openURL(orphanageProfile.documents.registrationCert);
                        }
                      } catch (e) {
                        Alert.alert('Error', 'Could not open document.');
                      }
                    }}
                  >
                    <Ionicons name="eye-outline" size={20} color="#fff" />
                    <Text style={styles.primaryBtnText}>View Cert</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.secondaryBtn, { flex: 1, flexDirection: 'row', gap: 8, borderColor: '#16a34a', backgroundColor: '#f0fdf4' }]}
                    onPress={async () => {
                      try {
                        const url = getDownloadableUrl(orphanageProfile.documents.registrationCert);
                        if (url) await Linking.openURL(url);
                      } catch (e) {
                        Alert.alert('Error', 'Could not download document.');
                      }
                    }}
                  >
                    <Ionicons name="download-outline" size={20} color="#16a34a" />
                    <Text style={[styles.secondaryBtnText, { color: '#16a34a' }]}>Download</Text>
                  </TouchableOpacity>

                </View>
              </View>
            )}

            {orphanageProfile.documents.buildingImages && orphanageProfile.documents.buildingImages.length > 0 && (
              <View>
                <Text style={styles.label}>Building Images:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 5 }}>
                  {orphanageProfile.documents.buildingImages.map((img: string, idx: number) => (
                    <TouchableOpacity key={idx} onPress={async () => {
                      try {
                        await Linking.openURL(getDownloadableUrl(img));
                      } catch (e) {
                        Alert.alert('Error', 'Could not open image.');
                      }
                    }}>
                      <Image 
                        source={{ uri: img }} 
                        style={{ width: 120, height: 90, borderRadius: 12, backgroundColor: '#f1f5f9' }} 
                        resizeMode="cover"
                      />
                    </TouchableOpacity>

                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Upcoming Features</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 15, color: '#64748b', fontWeight: '600' },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 25, 
    paddingBottom: 25,
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    elevation: 4 
  },
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
  
  regContainer: { padding: 30, backgroundColor: '#fff' },
  regTitle: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 10 },
  regSubtitle: { fontSize: 16, color: '#64748b', marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  row: { flexDirection: 'row', gap: 15 },
  submitBtn: { backgroundColor: '#0077cc', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  logoutBtn: { padding: 20, alignItems: 'center' },
  logoutBtnText: { color: '#ef4444', fontWeight: '700' },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10
  },
  filePickerText: {
    fontSize: 14,
    color: '#64748b'
  },
  primaryBtn: {
    backgroundColor: '#0077cc',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#0077cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#0077cc',
    fontWeight: '700',
    fontSize: 14,
  },
});

