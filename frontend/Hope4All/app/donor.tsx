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
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchDonorProfile,
  registerDonorProfile,
  fetchApprovedRequests,
  fetchMatchedOrphans,
  makeDonation,
  fetchAvailableFees,
  pledgeFee
} from '@/constants/api';
import BackButton from './components/BackButton';

export default function DonorDashboard() {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data States
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [orphans, setOrphans] = useState<any[]>([]);
  const [availableFees, setAvailableFees] = useState<any[]>([]);
  const [pledgingFee, setPledgingFee] = useState<string | null>(null);

  // Registration Form State
  const [name, setName] = useState(user?.username || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Donation Form State
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [units, setUnits] = useState('');
  const [recipientName, setRecipientName] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadProfileAndData();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadProfileAndData = async () => {
    try {
      setLoading(true);
      const profile = await fetchDonorProfile(user!.id);

      if (profile) {
        setDonorProfile(profile);
        // Load additional data only if registered
        loadDashboardData(profile._id || user!.id);
      }
    } catch (error) {
      console.log('Setup missing or network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (donorId: string) => {
    try {
      const [reqsData, orphansData, feesData] = await Promise.all([
        fetchApprovedRequests(),
        fetchMatchedOrphans(donorId),
        fetchAvailableFees()
      ]);
      setRequests(reqsData || []);
      setOrphans(orphansData || []);
      setAvailableFees(feesData || []);
    } catch (err) {
      console.log("Error fetching dashboard data: ", err);
    }
  };

  const handlePledgeFee = async (feeId: string) => {
    setPledgingFee(feeId);
    try {
      await pledgeFee(feeId, donorProfile._id);
      Alert.alert('Pledge Successful', 'Thank you! You have pledged to pay this fee when it is due. You will be notified automatically.');
      const feesData = await fetchAvailableFees();
      setAvailableFees(feesData || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not pledge fee.');
    } finally {
      setPledgingFee(null);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !city) {
      Alert.alert('Missing Fields', 'Please fill in all the details.');
      return;
    }

    setSaving(true);
    try {
      const newProfile = await registerDonorProfile({
        userId: user!.id,
        email: user!.email || '',
        name,
        phone,
        city
      });
      setDonorProfile(newProfile);
      await loadDashboardData(newProfile._id || user!.id);
      Alert.alert('Success', 'Profile created successfully! Welcome to the Dashboard.');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDonate = async () => {
    if (!selectedRequest) {
      Alert.alert('Select Request', 'Please tap an active request to donate supplies to.');
      return;
    }
    if (!units || isNaN(Number(units)) || Number(units) <= 0) {
      Alert.alert('Invalid Units', 'Please enter a valid number of units.');
      return;
    }

    setSaving(true);
    try {
      const donationResponse = await makeDonation({
        donorId: donorProfile._id,
        requestId: selectedRequest._id,
        units: Number(units),
        recipientName: recipientName || selectedRequest.orphanId?.name || "Orphan"
      });

      // Instantly Update Profile Stats without complete page reload
      setDonorProfile((prev: any) => ({
        ...prev,
        totalDonated: (prev.totalDonated || 0) + Number(units),
        childrenHelped: (prev.childrenHelped || 0) + 1
      }));

      // Clear form
      setUnits('');
      setRecipientName('');
      setSelectedRequest(null);

      Alert.alert('Donation Successful', `Thank you! You have safely donated ${units} units of supplies.`);
    } catch (error: any) {
      Alert.alert('Donation Failed', error.message || 'There was an error processing your supplies.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  // Render Dashboard if profile exists
  if (donorProfile) {
    return (
      <View style={styles.container}>
        <BackButton color="#fff" />

        {/* Header Section */}
        <View style={styles.dashboardHeader}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout }
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.messagesButton} 
            onPress={() => router.push('/messages')}
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.welcomeTitle}>Welcome back,</Text>
          <Text style={styles.donorName}>{donorProfile.name}</Text>
          <View style={styles.badge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.badgeText}>Verified Donor</Text>
          </View>
        </View>

        <ScrollView style={styles.dashboardScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

          {/* Dynamic Stats Row */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={28} color="#0077cc" style={styles.statIcon} />
              <Text style={styles.statValue}>{donorProfile.childrenHelped || 0}</Text>
              <Text style={styles.statLabel}>Children Helped</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="gift" size={28} color="#ff66b2" style={styles.statIcon} />
              <Text style={styles.statValue}>{donorProfile.totalDonated || 0}</Text>
              <Text style={styles.statLabel}>Supplies Donated</Text>
            </View>
          </View>

          {/* Make A Donation Form */}
          <Text style={styles.sectionTitle}>Help Through Supplies</Text>
          <View style={styles.formPanel}>
            <Text style={styles.inputLabel}>1. Select an Approved Request:</Text>
            {requests.length === 0 ? (
              <Text style={styles.emptyText}>No requests available right now.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.requestScroller}>
                {requests.map(req => {
                  const isSelected = selectedRequest?._id === req._id;
                  return (
                    <TouchableOpacity
                      key={req._id}
                      style={[styles.requestBubble, isSelected && styles.requestBubbleSelected]}
                      onPress={() => {
                        setSelectedRequest(req);
                        setRecipientName(req.orphanId?.name || '');
                      }}
                    >
                      <Ionicons name="school" color={isSelected ? '#fff' : '#0077cc'} size={18} style={{ marginBottom: 4 }} />
                      <Text style={[styles.reqType, isSelected && styles.reqTextWhite]}>{req.type.toUpperCase()}</Text>
                      <Text style={[styles.reqName, isSelected && styles.reqTextWhite]}>For {req.orphanId?.name || 'Orphan'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>2. Number of Units to Supply:</Text>
              <View style={styles.smallInputBox}>
                <Ionicons name="cart-outline" size={20} color="#666" style={{ marginHorizontal: 10 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 5"
                  value={units}
                  onChangeText={setUnits}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.donateBtn, saving && styles.donateBtnDisabled]}
              onPress={handleDonate}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.donateBtnText}>Donate Supplies Now</Text>}
            </TouchableOpacity>
          </View>

          {/* Education Fee Pledge Row */}
          <Text style={styles.sectionTitle}>Pledge Education Fees</Text>
          {availableFees.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No fee requests pending right now.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {availableFees.map(fee => (
                <View key={fee._id} style={styles.feeCard}>
                  <Text style={styles.feeCardTitle}>{fee.title}</Text>
                  <Text style={styles.feeCardOrphan}>For: {fee.orphanId?.name || 'Child'}</Text>
                  <Text style={styles.feeCardAmount}>${fee.amount}</Text>
                  <Text style={styles.feeCardDate}>Due: {new Date(fee.dueDate).toLocaleDateString()}</Text>

                  <TouchableOpacity
                    style={styles.pledgeBtn}
                    onPress={() => handlePledgeFee(fee._id)}
                    disabled={pledgingFee === fee._id}
                  >
                    {pledgingFee === fee._id ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.pledgeBtnText}>Pledge to Pay</Text>}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Matched Orphans Row */}
          <Text style={styles.sectionTitle}>Your Matched Orphans</Text>
          {orphans.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No matches found yet. We will pair you with orphans matching your preferences soon!</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {orphans.map(orphan => (
                <View key={orphan._id} style={styles.orphanPortrait}>
                  <View style={styles.orphanInitialBox}>
                    <Text style={styles.orphanInitialText}>{(orphan.name?.charAt(0) || 'O').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.orphanName}>{orphan.name}</Text>
                  <Text style={styles.orphanLocation}>{orphan.location}</Text>
                  <TouchableOpacity 
                    style={styles.orphanMessageBtn}
                    onPress={() => router.push({
                      pathname: '/messages',
                      params: { userId: orphan._id, username: orphan.name }
                    })}
                  >
                    <Ionicons name="chatbubble-ellipses" size={16} color="#4da6ff" />
                    <Text style={styles.orphanMessageText}>Message</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Hope4All Regional Office Card */}
          <Text style={styles.sectionTitle}>Our Location</Text>
          <View style={styles.officeCard}>
            <View style={styles.officeMapIcon}>
              <Ionicons name="location" size={32} color="#ff4444" />
            </View>
            <View style={styles.officeDetails}>
              <Text style={styles.officeTitle}>Hope4All Central Office</Text>
              <Text style={styles.officeAddress}>Dground, Faisalabad</Text>
              <Text style={styles.officeSub}>Pakistan • Open Mon-Fri (9AM-5PM)</Text>
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }

  // Render Registration Form if no profile
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BackButton />

      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Profile</Text>
          <Text style={styles.subtitle}>Tell us a bit about yourself to start making an impact.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.regInputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.regInputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+1 234 567 890"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.regInputGroup}>
            <Text style={styles.label}>City</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New York"
                value={city}
                onChangeText={setCity}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Save Profile</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    position: 'absolute',
    right: 25,
    top: Platform.OS === 'ios' ? 70 : 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    zIndex: 20,
  },
  messagesButton: {
    position: 'absolute',
    right: 80,
    top: Platform.OS === 'ios' ? 70 : 50,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    zIndex: 20,
  },

  // Dashboard Styles
  dashboardHeader: {
    backgroundColor: '#0077cc',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#0077cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 10,
  },
  welcomeTitle: {
    fontSize: 18,
    color: '#e6f4ff',
    fontWeight: '500',
    marginBottom: 5,
  },
  donorName: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },
  dashboardScroll: {
    flex: 1,
    padding: 20,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 5,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statIcon: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#777',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
    marginTop: 10,
  },

  // Form Panels
  formPanel: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  requestScroller: {
    marginBottom: 20,
  },
  requestBubble: {
    backgroundColor: '#f5f7fa',
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#e1e5eb',
    width: 140,
  },
  requestBubbleSelected: {
    backgroundColor: '#0077cc',
    borderColor: '#0077cc',
  },
  reqType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0077cc',
    marginTop: 5,
  },
  reqName: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  reqTextWhite: {
    color: '#fff',
  },
  smallInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5eb',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  donateBtn: {
    backgroundColor: '#33cc99',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  donateBtnDisabled: {
    backgroundColor: '#99e6cc',
  },
  donateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Matched Orphans
  emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  orphanPortrait: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  orphanInitialBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4da6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  orphanInitialText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  orphanName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  orphanLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },

  // Regional Office Card
  officeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  officeMapIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#ffe6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  officeDetails: {
    marginLeft: 15,
    flex: 1,
  },
  officeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  officeAddress: {
    fontSize: 15,
    color: '#0077cc',
    fontWeight: '600',
    marginBottom: 4,
  },
  officeSub: {
    fontSize: 12,
    color: '#777',
  },

  // Fee Card Styles
  feeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    width: 200,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 4,
    borderTopColor: '#f1c40f',
  },
  feeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  feeCardOrphan: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  feeCardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#33cc99',
    marginVertical: 5,
  },
  feeCardDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
  },
  pledgeBtn: {
    backgroundColor: '#0077cc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  pledgeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Registration Form Styles
  formScroll: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  regInputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e1e5eb',
  },
  inputIcon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#0077cc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#0077cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#80bbfa',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  orphanMessageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e6f4ff',
    borderRadius: 12,
  },
  orphanMessageText: {
    fontSize: 12,
    color: '#0077cc',
    fontWeight: '600',
    marginLeft: 4,
  },
});
