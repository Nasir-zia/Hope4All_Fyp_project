import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchDonorProfile,
  registerDonorProfile,
  fetchApprovedRequests,
  fetchMatchedOrphans,
  makeDonation,
  fetchAvailableFees,
  pledgeFee,
  updateRequestStatus,
  rejectRequestApi,
  addCourseApi,
  fetchDonorCourses
} from '@/constants/api';
import BackButton from '@/components/BackButton';
import { DonorHeader } from '@/components/donor/DonorHeader';
import { SupplyRequestCard } from '@/components/donor/SupplyRequestCard';
import { FeePledgeCard } from '@/components/donor/FeePledgeCard';
import { MatchedOrphanCard } from '@/components/donor/MatchedOrphanCard';
import { DonorCourseCard } from '@/components/donor/DonorCourseCard';
import { CourseModal } from '@/components/donor/CourseModal';

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Dynamic States
  const [requests, setRequests] = useState<any[]>([]);
  const [orphans, setOrphans] = useState<any[]>([]);
  const [availableFees, setAvailableFees] = useState<any[]>([]);
  const [donorCourses, setDonorCourses] = useState<any[]>([]);
  const [pledgingFee, setPledgingFee] = useState<string | null>(null);

  // Profile View States
  const [selectedOrphanForProfile, setSelectedOrphanForProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Donation Form State
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [units, setUnits] = useState('');

  // Course Form State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [courseCategory, setCourseCategory] = useState('Academic');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProfileAndData();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadProfileAndData = async () => {
    setLoading(true);
    try {
      const profile = await fetchDonorProfile(user!.id);
      if (profile) {
        setDonorProfile(profile);
        loadDashboardData(profile._id);
      }
    } catch (err) {
      console.log("Error loading profile: ", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (donorId: string) => {
    try {
      const [reqsData, orphansData, feesData, coursesData] = await Promise.all([
        fetchApprovedRequests(),
        fetchMatchedOrphans(donorId),
        fetchAvailableFees(),
        fetchDonorCourses(donorId)
      ]);
      setRequests(reqsData || []);
      setOrphans(orphansData || []);
      setAvailableFees(feesData || []);
      setDonorCourses(coursesData || []);
    } catch (err) {
      console.log("Error fetching dashboard data: ", err);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !city) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setSaving(true);
    try {
      const profile = await registerDonorProfile({
        userId: user!.id,
        name,
        phone,
        city
      });
      setDonorProfile(profile);
      loadDashboardData(profile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDonate = async () => {
    if (!selectedRequest || !units) {
      Alert.alert("Error", "Please select a request and enter units.");
      return;
    }
    setSaving(true);
    try {
      await makeDonation({
        donorId: donorProfile._id,
        requestId: selectedRequest._id,
        units: Number(units),
        recipientName: selectedRequest.orphanId?.name || 'Child'
      });
      Alert.alert("Success", "Thank you for your generous donation!");
      setUnits('');
      setSelectedRequest(null);
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not process donation");
    } finally {
      setSaving(false);
    }
  };

  const handlePledgeFee = async (feeId: string) => {
    setPledgingFee(feeId);
    try {
      await pledgeFee(feeId, donorProfile._id);
      Alert.alert("Success", "You have pledged to pay this fee.");
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not pledge fee.");
    } finally {
      setPledgingFee(null);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await updateRequestStatus(id, 'approved', user!.token);
      Alert.alert("Success", "Request approved.");
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await rejectRequestApi(id, donorProfile._id, user!.token);
      Alert.alert("Success", "Request rejected.");
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleCourseSubmit = async () => {
    if (!courseTitle || !courseDesc || !courseLink) {
      Alert.alert("Error", "Please fill all course details");
      return;
    }
    setSubmittingCourse(true);
    try {
      await addCourseApi({
        title: courseTitle,
        description: courseDesc,
        link: courseLink,
        category: courseCategory,
        instructorId: user!.id
      });
      Alert.alert("Success", "Course submitted for approval");
      setShowCourseModal(false);
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmittingCourse(false);
    }
  };

  const handleOpenDoc = async (url: string) => {
    if (!url) {
      Alert.alert('No Document', 'This orphan has not uploaded a verification document yet.');
      return;
    }
    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Error', 'Could not open document.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={styles.loadingText}>Preparing your dashboard...</Text>
      </View>
    );
  }

  if (donorProfile) {
    return (
      <View style={styles.container}>
        <DonorHeader 
          name={donorProfile.name} 
          points={donorProfile.totalDonated || 0}
          onLogout={logout}
          onMessages={() => router.push('/messages')}
        />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.dashboardScroll}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="heart" size={24} color="#ef4444" style={styles.statIcon} />
              <Text style={styles.statValue}>{donorProfile.totalDonated || 0}</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color="#0077cc" style={styles.statIcon} />
              <Text style={styles.statValue}>{orphans.length}</Text>
              <Text style={styles.statLabel}>Orphans</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Donate Supplies</Text>
          <View style={styles.formPanel}>
            <Text style={styles.inputLabel}>Select a request to fulfill:</Text>
            {requests.length === 0 ? (
              <Text style={styles.emptyText}>No pending material requests at the moment.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.requestScroller}>
                {requests.map(req => (
                  <SupplyRequestCard 
                    key={req._id}
                    request={req}
                    isSelected={selectedRequest?._id === req._id}
                    onPress={() => setSelectedRequest(req)}
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Units:</Text>
              <View style={styles.smallInputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 10"
                  keyboardType="numeric"
                  value={units}
                  onChangeText={setUnits}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.donateBtn} onPress={handleDonate}>
              <Text style={styles.donateBtnText}>Confirm Donation</Text>
            </TouchableOpacity>

            {selectedRequest && selectedRequest.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b981' }]} onPress={() => handleApproveRequest(selectedRequest._id)}>
                    <Text style={styles.actionBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} onPress={() => handleRejectRequest(selectedRequest._id)}>
                    <Text style={styles.actionBtnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Pledge Education Fees</Text>
          {availableFees.length === 0 ? (
            <View style={styles.emptyCard}><Text style={styles.emptyText}>No fee requests pending right now.</Text></View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {availableFees.map(fee => (
                <FeePledgeCard 
                  key={fee._id}
                  fee={fee}
                  isPledging={pledgingFee === fee._id}
                  onPledge={handlePledgeFee}
                  onViewProfile={(o) => { setSelectedOrphanForProfile(o); setShowProfileModal(true); }}
                />
              ))}
            </ScrollView>
          )}

          <Text style={styles.sectionTitle}>Your Matched Orphans</Text>
          {orphans.length === 0 ? (
            <View style={styles.emptyCard}><Text style={styles.emptyText}>No matches found yet.</Text></View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {orphans.map(orphan => (
                <MatchedOrphanCard 
                  key={orphan._id}
                  orphan={orphan}
                  onViewProfile={(o) => { setSelectedOrphanForProfile(o); setShowProfileModal(true); }}
                  onMessage={(o) => router.push({ pathname: '/messages', params: { userId: o._id, username: o.name } })}
                />
              ))}
            </ScrollView>
          )}

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Learning Management</Text>
            <TouchableOpacity onPress={() => setShowCourseModal(true)}>
              <Text style={styles.addCourseHeaderText}>+ Add Course</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formPanel}>
            {donorCourses.length === 0 ? (
              <Text style={styles.emptyText}>You haven't shared any courses yet.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {donorCourses.map(course => <DonorCourseCard key={course._id} course={course} />)}
              </ScrollView>
            )}
          </View>

          <View style={styles.officeCard}>
            <View style={styles.officeMapIcon}><Ionicons name="location" size={32} color="#ff4444" /></View>
            <View style={styles.officeDetails}>
              <Text style={styles.officeTitle}>Hope4All Central Office</Text>
              <Text style={styles.officeAddress}>Dground, Faisalabad</Text>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showProfileModal} transparent={true} animationType="fade" onRequestClose={() => setShowProfileModal(false)}>
           <View style={styles.modalOverlay}>
              <View style={styles.profileModalContent}>
                  <Text style={styles.modalTitle}>Orphan Profile</Text>
                  {selectedOrphanForProfile && (
                      <View style={styles.profileDetailContainer}>
                          <Text style={styles.detailName}>{selectedOrphanForProfile.name}</Text>
                          <TouchableOpacity style={styles.documentBtn} onPress={() => handleOpenDoc(selectedOrphanForProfile.supportingDocs)}>
                              <Text style={styles.contactBtnText}>View Docs</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setShowProfileModal(false)}><Text>Close</Text></TouchableOpacity>
                      </View>
                  )}
              </View>
           </View>
        </Modal>

        <CourseModal 
          visible={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          onSubmit={handleCourseSubmit}
          loading={submittingCourse}
          title={courseTitle}
          setTitle={setCourseTitle}
          desc={courseDesc}
          setDesc={setCourseDesc}
          link={courseLink}
          setLink={setCourseLink}
          category={courseCategory}
          setCategory={setCourseCategory}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.header}><Text style={styles.title}>Complete Profile</Text></View>
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
          <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
          <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
            <Text style={styles.submitButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  dashboardScroll: { flex: 1, padding: 20, marginTop: -20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, marginTop: 5 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center', marginHorizontal: 5, elevation: 3 },
  statIcon: { marginBottom: 10 },
  statValue: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  statLabel: { fontSize: 13, color: '#777', fontWeight: '500' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 5, marginTop: 10 },
  formPanel: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 10 },
  requestScroller: { marginBottom: 20 },
  smallInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f7fa', borderRadius: 12, borderWidth: 1, borderColor: '#e1e5eb', marginBottom: 20 },
  textInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  donateBtn: { backgroundColor: '#33cc99', padding: 16, borderRadius: 15, alignItems: 'center' },
  donateBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20 },
  emptyText: { color: '#888', fontStyle: 'italic', textAlign: 'center' },
  horizontalScroll: { marginBottom: 20 },
  officeCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 30, alignItems: 'center', elevation: 2 },
  officeMapIcon: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#ffe6e6', justifyContent: 'center', alignItems: 'center' },
  officeDetails: { marginLeft: 15, flex: 1 },
  officeTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  officeAddress: { fontSize: 15, color: '#0077cc', fontWeight: '600', marginBottom: 4 },
  formScroll: { flexGrow: 1, paddingTop: Platform.OS === 'ios' ? 100 : 80, paddingHorizontal: 25, paddingBottom: 40 },
  header: { marginBottom: 40 },
  title: { fontSize: 34, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 10 },
  formContainer: { backgroundColor: '#fff', padding: 25, borderRadius: 24, elevation: 4 },
  input: { backgroundColor: '#f5f7fa', padding: 15, borderRadius: 14, marginBottom: 15 },
  submitButton: { backgroundColor: '#0077cc', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  profileModalContent: { width: '100%', backgroundColor: '#fff', borderRadius: 30, padding: 25, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  profileDetailContainer: { alignItems: 'center' },
  detailName: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  documentBtn: { backgroundColor: '#6366f1', padding: 15, borderRadius: 18 },
  contactBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  actionRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 },
  actionBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10, marginTop: 10 },
  addCourseHeaderText: { color: '#0077cc', fontWeight: 'bold', fontSize: 14 },
});
