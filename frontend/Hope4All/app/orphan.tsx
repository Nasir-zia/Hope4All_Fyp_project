import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchOrphanFees, 
  createOrphanFee, 
  fetchOrphanRequests, 
  fetchOrphanProgress, 
  submitMaterialRequest,
  fetchOrphanProfile,
  registerOrphanProfile,
  fetchOrphanageOptions
} from '@/constants/api';

import BackButton from './components/BackButton';

export default function OrphanDashboard() {
  const { user, logout } = useAuth();
  
  const [fees, setFees] = useState<any[]>([]);
  const [feeTitle, setFeeTitle] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeDate, setFeeDate] = useState('');
  const [loadingFees, setLoadingFees] = useState(false);
  const [submittingFee, setSubmittingFee] = useState(false);

  // New Dynamic States
  const [materialRequests, setMaterialRequests] = useState<any[]>([]);
  const [progressReports, setProgressReports] = useState<any[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Material Request Form State
  const [reqType, setReqType] = useState<'stationery' | 'uniforms' | 'books' | 'other'>('stationery');
  const [reqDesc, setReqDesc] = useState('');
  const [reqUnits, setReqUnits] = useState('1');
  const [reqSchool, setReqSchool] = useState('');

  // Profile Completion States
  const [orphanProfile, setOrphanProfile] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('male');
  const [regLocation, setRegLocation] = useState('');
  const [profilePicUri, setProfilePicUri] = useState<string | null>(null);
  const [docUri, setDocUri] = useState<string | null>(null);
  const [docName, setDocName] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProfileAndData();
    }
  }, [user?.id]);

  const loadProfileAndData = async () => {
    if (!user?.id) return;
    setLoadingExtras(true);
    try {
      const profile = await fetchOrphanProfile(user.id);
      if (profile) {
        setOrphanProfile(profile);
        loadFees();
        loadExtras();
      } else {
        setIsRegistering(true);
      }
    } catch (err) {
      console.log('Error loading profile:', err);
      // Fallback: stay in registration if profile fetch fails due to 404
      setIsRegistering(true);
    } finally {
      setLoadingExtras(false);
    }
  };

  const loadExtras = async () => {
    if (!user?.id) return;
    setLoadingExtras(true);
    try {
      const [reqs, progress] = await Promise.all([
        fetchOrphanRequests(user.id),
        fetchOrphanProgress(user.id)
      ]);
      setMaterialRequests(reqs);
      setProgressReports(progress);
    } catch (err) {
      console.log('Error loading extras:', err);
    } finally {
      setLoadingExtras(false);
    }
  };

  const loadFees = async () => {
    if (!user?.id) return;
    
    setLoadingFees(true);
    try {
      const fetchedFees = await fetchOrphanFees(user.id);
      setFees(fetchedFees);
    } catch (err) {
      console.log('Error fetching fees:', err);
    } finally {
      setLoadingFees(false);
    }
  };

  const handleAddFee = async () => {
    if (!feeTitle || !feeAmount || !feeDate) {
      Alert.alert("Missing Fields", "Please enter title, amount, and due date (YYYY-MM-DD).");
      return;
    }
    setSubmittingFee(true);
    try {
      await createOrphanFee({
        orphanId: user!.id,
        title: feeTitle,
        amount: Number(feeAmount),
        dueDate: feeDate
      });
      Alert.alert("Success", "Fee request added successfully!");
      setFeeTitle('');
      setFeeAmount('');
      setFeeDate('');
      loadFees();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not add fee");
    } finally {
      setSubmittingFee(false);
    }
  };

  const handleAddMaterialRequest = async () => {
    if (!reqDesc || !reqSchool || !reqUnits) {
      Alert.alert("Missing Fields", "Please enter description, school, and units.");
      return;
    }
    setSubmittingFee(true); // Reusing submitting state for simplicity in form
    try {
      // For orphanageId, we'll try to get it from profile, using a fallback for now
      // ideally we fetch orphan profile in useEffect
      await submitMaterialRequest({
        orphanId: user!.id,
        orphanageId: "650000000000000000000001", // Placeholder or fetch from profile
        type: reqType,
        units: Number(reqUnits),
        unitType: reqType === 'stationery' ? 'items' : 'sets',
        description: reqDesc,
        school: reqSchool
      });
      Alert.alert("Success", "Material request submitted!");
      setReqDesc('');
      setReqSchool('');
      setShowRequestModal(false);
      loadExtras();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not submit request");
    } finally {
      setSubmittingFee(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePicUri(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setDocUri(result.assets[0].uri);
        setDocName(result.assets[0].name);
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };

  const handleProfileSubmit = async () => {
    if (!regName || !regAge || !regLocation || !profilePicUri || !docUri) {
      Alert.alert("Missing Fields", "Please complete all fields and upload required files.");
      return;
    }

    setSubmittingProfile(true);
    try {
      const formData = new FormData();
      formData.append('userId', user!.id);
      formData.append('name', regName);
      formData.append('age', regAge);
      formData.append('gender', regGender);
      formData.append('location', regLocation);

      // Handle file uploads - ensure URI is formatted for Android
      const formatFileUri = (uri: string) => {
        return Platform.OS === 'android' ? uri : uri.replace('file://', '');
      };

      const picName = profilePicUri.split('/').pop() || 'profile.jpg';
      formData.append('profilePic', {
        uri: profilePicUri,
        name: picName,
        type: 'image/jpeg',
      } as any);

      const documentName = docUri.split('/').pop() || 'document.pdf';
      formData.append('supportingDocs', {
        uri: docUri,
        name: documentName,
        type: 'application/pdf',
      } as any);

      await registerOrphanProfile(formData);
      Alert.alert("Success", "Profile completed! Welcome to Hope4All.");
      setIsRegistering(false);
      loadProfileAndData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not save profile");
    } finally {
      setSubmittingProfile(false);
    }
  };

  if (isRegistering) {
    return (
      <View style={styles.container}>
        <View style={styles.regHeader}>
          <Text style={styles.regTitle}>Complete Profile</Text>
          <Text style={styles.regSub}>Tell us more about yourself</Text>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 50 }}
        >
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Basic Information</Text>
            <TextInput style={styles.input} value={regName} onChangeText={setRegName} placeholder="Full Name" placeholderTextColor="#aaa" />
            <TextInput style={styles.input} value={regAge} onChangeText={setRegAge} placeholder="Age" keyboardType="numeric" placeholderTextColor="#aaa" />
            
            <Text style={[styles.formLabel, { marginTop: 15 }]}>Gender</Text>
            <View style={styles.typeSelector}>
              {(['male', 'female', 'other'] as const).map(g => (
                <TouchableOpacity 
                  key={g}
                  style={[styles.genderBtn, regGender === g && styles.genderBtnActive]}
                  onPress={() => setRegGender(g)}
                >
                  <Text style={[styles.genderBtnText, regGender === g && styles.genderBtnTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput style={[styles.input, { marginTop: 20 }]} value={regLocation} onChangeText={setRegLocation} placeholder="City (e.g. Karachi)" placeholderTextColor="#aaa" />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Required Verifications</Text>
            <TouchableOpacity style={[styles.pickerBtn, profilePicUri && styles.pickerBtnActive]} onPress={pickImage}>
              <Ionicons name="camera-outline" size={22} color={profilePicUri ? "#fff" : "#0077cc"} />
              <Text style={[styles.pickerBtnText, profilePicUri && styles.pickerBtnTextActive]}>
                {profilePicUri ? "Profile Photo Ready" : "Upload Profile Photo"}
              </Text>
              {profilePicUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{marginLeft: 'auto'}} />}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.pickerBtn, docUri && styles.pickerBtnActive]} onPress={pickDocument}>
              <Ionicons name="document-text-outline" size={22} color={docUri ? "#fff" : "#0077cc"} />
              <Text style={[styles.pickerBtnText, docUri && styles.pickerBtnTextActive]}>
                {docName ? (docName.length > 20 ? docName.substring(0, 20) + "..." : docName) : "Birth Certificate / ID"}
              </Text>
              {docUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{marginLeft: 'auto'}} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.primarySubmitBtn, submittingProfile && styles.btnDisabled]} 
            onPress={handleProfileSubmit}
            disabled={submittingProfile}
          >
            {submittingProfile ? <ActivityIndicator color="#fff" /> : <Text style={styles.primarySubmitBtnText}>Save & Enter Dashboard</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelLink} onPress={handleLogout}>
            <Text style={styles.cancelLinkText}>Not an Orphan? Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: handleLogout }
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.username}>{orphanProfile?.name || 'Orphan'}</Text>
        </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Learning Journey</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="book-outline" size={32} color="#4da6ff" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#33cc99" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fee Management</Text>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Request New Fee Payment</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Fee Title (e.g. Term 1 School Fee)" 
            value={feeTitle}
            onChangeText={setFeeTitle}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Amount (e.g. 50)" 
            value={feeAmount}
            onChangeText={setFeeAmount}
            keyboardType="numeric"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Due Date (YYYY-MM-DD)" 
            value={feeDate}
            onChangeText={setFeeDate}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleAddFee} disabled={submittingFee}>
            {submittingFee ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit Fee Request</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.subTitle}>My Fee Requests</Text>
        {loadingFees ? <ActivityIndicator size="small" color="#4da6ff"/> : null}
        {fees.length === 0 && !loadingFees && <Text style={styles.emptyText}>No fees added yet.</Text>}
        {fees.map((fee, index) => (
          <View key={index} style={styles.feeCard}>
            <View>
              <Text style={styles.feeTitle}>{fee.title}</Text>
              <Text style={styles.feeDate}>Due: {new Date(fee.dueDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.feeRight}>
              <Text style={styles.feeAmount}>${fee.amount}</Text>
              <Text style={[
                styles.statusText, 
                fee.status === 'pending' ? styles.statusPending : fee.status === 'pledged' ? styles.statusPledged : styles.statusPaid
              ]}>
                {fee.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {showRequestModal && (
        <View style={styles.section}>
          <View style={styles.formContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.formLabel}>Request New Supplies</Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
            <View style={styles.typeSelector}>
              {(['stationery', 'uniforms', 'books'] as const).map(t => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.typeBtn, reqType === t && styles.typeBtnSelected]}
                  onPress={() => setReqType(t)}
                >
                  <Text style={[styles.typeBtnText, reqType === t && styles.typeBtnTextSelected]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="School/College Name" 
              value={reqSchool}
              onChangeText={setReqSchool}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Description (e.g. 5 notebooks, 2 pens)" 
              value={reqDesc}
              onChangeText={setReqDesc}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Total Units" 
              value={reqUnits}
              onChangeText={setReqUnits}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddMaterialRequest}>
              <Text style={styles.submitBtnText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {materialRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subTitle}>Material Request Status</Text>
          {materialRequests.map((req, idx) => (
            <View key={idx} style={styles.feeCard}>
              <View>
                <Text style={styles.feeTitle}>{req.type.toUpperCase()}: {req.description}</Text>
                <Text style={styles.feeDate}>Requested: {new Date(req.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.feeRight}>
                <Text style={styles.statusText}>{req.status.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {progressReports.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subTitle}>My Progress Reports</Text>
          {progressReports.map((report, idx) => (
            <View key={idx} style={[styles.feeCard, { borderLeftColor: '#33cc99' }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.feeTitle}>{report.title}</Text>
                <Text style={styles.feeDate}>{report.category} • {new Date(report.date).toLocaleDateString()}</Text>
                {report.remarks && <Text style={styles.actionDesc}>{report.remarks}</Text>}
              </View>
              <View style={styles.feeRight}>
                <Text style={[styles.statNumber, { fontSize: 20, marginTop: 0 }]}>{report.score}</Text>
                <Text style={styles.statusText}>VERIFIED</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Resources</Text>
        <TouchableOpacity 
          style={[styles.actionCard, styles.primaryCard]}
          onPress={() => setShowRequestModal(true)}
        >
          <Ionicons name="school-outline" size={24} color="#4da6ff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Request Materials</Text>
            <Text style={styles.actionDesc}>Books, stationery & supplies</Text>
          </View>
          {materialRequests.length > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeText}>{materialRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/messages')}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#ff66b2" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Ask for Help</Text>
            <Text style={styles.actionDesc}>Connect with donors & volunteers</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="document-outline" size={24} color="#33cc99" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Progress Report</Text>
            <Text style={styles.actionDesc}>View your achievements ({progressReports.length})</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    top: 40,
    padding: 10,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    zIndex: 20,
  },
  welcome: {
    fontSize: 18,
    color: '#666',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 5,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
    marginLeft: 5,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#4da6ff10',
    borderLeftWidth: 4,
    borderLeftColor: '#4da6ff',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 15,
    flex: 1,
  },
  actionDesc: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
  logoutBtn: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    marginTop: 15,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f5f7fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1e5eb',
  },
  submitBtn: {
    backgroundColor: '#4da6ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
  feeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f1c40f',
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  feeDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  feeRight: {
    alignItems: 'flex-end',
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#33cc99',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusPending: { color: '#f39c12' },
  statusPledged: { color: '#3498db' },
  statusPaid: { color: '#2ecc71' },
  badgeCount: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f5f7fa',
    borderWidth: 1,
    borderColor: '#e1e5eb',
  },
  typeBtnSelected: {
    backgroundColor: '#4da6ff',
    borderColor: '#4da6ff',
  },
  typeBtnText: {
    fontSize: 12,
    color: '#666',
  },
  typeBtnTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orphanageList: {
    marginBottom: 20,
  },
  orphanageItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e5eb',
  },
  orphanageItemActive: {
    borderColor: '#4da6ff',
    backgroundColor: '#4da6ff10',
  },
  orphanageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orphanageNameActive: {
    color: '#0077cc',
  },
  orphanageCity: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e1e5eb',
    borderStyle: 'dashed',
  },
  filePickerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4da6ff',
    fontWeight: '600',
  },
  // New Registration Styles
  regHeader: {
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  regTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  regSub: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e1e5eb',
  },
  genderBtnActive: {
    backgroundColor: '#0077cc',
    borderColor: '#0077cc',
  },
  genderBtnText: {
    color: '#666',
    fontWeight: '600',
  },
  genderBtnTextActive: {
    color: '#fff',
  },
  orphanageListContainer: {
    marginTop: 10,
  },
  orgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orgCardActive: {
    borderColor: '#0077cc',
    backgroundColor: '#f0f9ff',
  },
  orgName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  orgNameActive: {
    color: '#0077cc',
  },
  orgCity: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0077cc',
    borderStyle: 'dashed',
  },
  pickerBtnActive: {
    backgroundColor: '#0077cc',
    borderStyle: 'solid',
  },
  pickerBtnText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#0077cc',
    fontWeight: '700',
  },
  pickerBtnTextActive: {
    color: '#fff',
  },
  primarySubmitBtn: {
    backgroundColor: '#0077cc',
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0077cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primarySubmitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  cancelLink: {
    marginTop: 25,
    alignItems: 'center',
    paddingBottom: 20,
  },
  cancelLinkText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

