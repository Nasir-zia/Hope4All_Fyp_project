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
  Platform,
  Modal,
  Image
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
  updateOrphanProfile,
  fetchOrphanageOptions,
  fetchOrphanAidFeed,
  createProgressApi,
  deleteProgressApi
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
  const [aidFeed, setAidFeed] = useState<any[]>([]);
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
  const [regGender, setRegGender] = useState<'male' | 'female' | 'other'>('male');
  const [regLocation, setRegLocation] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [profilePicUri, setProfilePicUri] = useState<string | null>(null);
  const [docUri, setDocUri] = useState<string | null>(null);
  const [docName, setDocName] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState('male');
  const [newProfilePicUri, setNewProfilePicUri] = useState<string | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Achievement (Progress) CRUD States
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progTitle, setProgTitle] = useState('');
  const [progCategory, setProgCategory] = useState<'Academic' | 'Sports' | 'Behavioral' | 'Health'>('Academic');
  const [progScore, setProgScore] = useState('');
  const [progRemarks, setProgRemarks] = useState('');
  const [progImgUri, setProgImgUri] = useState<string | null>(null);
  const [submittingProg, setSubmittingProg] = useState(false);
  const [showFullProgressList, setShowFullProgressList] = useState(false);

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
        loadFees(profile._id);
        loadExtras(profile._id);
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

  const loadExtras = async (profileId?: string) => {
    const targetId = profileId || orphanProfile?._id;
    if (!targetId) return;
    setLoadingExtras(true);
    try {
      const [reqs, progress, aid] = await Promise.all([
        fetchOrphanRequests(targetId),
        fetchOrphanProgress(targetId),
        fetchOrphanAidFeed(targetId)
      ]);
      setMaterialRequests(reqs);
      setProgressReports(progress);
      setAidFeed(aid);
    } catch (err) {
      console.log('Error loading extras:', err);
    } finally {
      setLoadingExtras(false);
    }
  };

  const loadFees = async (profileId?: string) => {
    const targetId = profileId || orphanProfile?._id;
    if (!targetId) return;

    setLoadingFees(true);
    try {
      const fetchedFees = await fetchOrphanFees(targetId);
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
        orphanId: orphanProfile._id,
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
      await submitMaterialRequest({
        orphanId: orphanProfile._id,
        orphanageId: orphanProfile.orphanageId || "650000000000000000000001", 
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

  const openSettings = () => {
    if (!orphanProfile) return;
    setEditName(orphanProfile.name);
    setEditAge(String(orphanProfile.age));
    setEditGender(orphanProfile.gender || 'male');
    setEditLocation(orphanProfile.location || '');
    setEditPhone(orphanProfile.phone || '');
    setNewProfilePicUri(null);
    setShowEditModal(true);
  };

  const handleUpdateProfile = async () => {
    if (!editName || !editAge || !editLocation) {
      Alert.alert("Error", "Please fill in all basic fields.");
      return;
    }

    setUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('age', editAge);
      formData.append('gender', editGender);
      formData.append('location', editLocation);
      formData.append('phone', editPhone);

      if (newProfilePicUri) {
        const picName = newProfilePicUri.split('/').pop() || 'profile.jpg';
        formData.append('profilePic', {
          uri: newProfilePicUri,
          name: picName,
          type: 'image/jpeg',
        } as any);
      }

      const updated = await updateOrphanProfile(user!.id, formData);
      setOrphanProfile(updated);
      setShowEditModal(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err: any) {
      Alert.alert("Update Error", err.message || "Could not update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddProgress = async () => {
    if (!progTitle || !progScore) {
      Alert.alert("Missing Fields", "Please enter at least a title and score/grade.");
      return;
    }

    setSubmittingProg(true);
    try {
      const formData = new FormData();
      formData.append('orphanId', orphanProfile._id);
      formData.append('title', progTitle);
      formData.append('category', progCategory);
      formData.append('score', progScore);
      formData.append('remarks', progRemarks);

      if (progImgUri) {
        const picName = progImgUri.split('/').pop() || 'certificate.jpg';
        formData.append('achievementImage', {
          uri: progImgUri,
          name: picName,
          type: 'image/jpeg',
        } as any);
      }

      await createProgressApi(formData);
      Alert.alert("Success", "Achievement saved successfully!");
      setProgTitle('');
      setProgScore('');
      setProgRemarks('');
      setProgImgUri(null);
      setShowProgressModal(false);
      loadExtras();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not save achievement");
    } finally {
      setSubmittingProg(false);
    }
  };

  const handleDeleteProgress = async (id: string) => {
    Alert.alert(
      "Delete Achievement",
      "Are you sure you want to remove this record?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteProgressApi(id);
              loadExtras();
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          }
        }
      ]
    );
  };

  const pickImage = async (forEdit = false, forProgress = false) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: forProgress ? [4, 3] : [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (forProgress) {
        setProgImgUri(result.assets[0].uri);
      } else if (forEdit) {
        setNewProfilePicUri(result.assets[0].uri);
      } else {
        setProfilePicUri(result.assets[0].uri);
      }
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
    if (!regName || !regAge || !regLocation || !regPhone || !profilePicUri || !docUri) {
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
      formData.append('phone', regPhone);

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
            <TextInput style={[styles.input, { marginTop: 15 }]} value={regPhone} onChangeText={setRegPhone} placeholder="Phone Number (e.g. 0300-1234567)" keyboardType="phone-pad" placeholderTextColor="#aaa" />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Required Verifications</Text>
            <TouchableOpacity style={[styles.pickerBtn, profilePicUri && styles.pickerBtnActive]} onPress={() => pickImage()}>
              <Ionicons name="camera-outline" size={22} color={profilePicUri ? "#fff" : "#0077cc"} />
              <Text style={[styles.pickerBtnText, profilePicUri && styles.pickerBtnTextActive]}>
                {profilePicUri ? "Profile Photo Ready" : "Upload Profile Photo"}
              </Text>
              {profilePicUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginLeft: 'auto' }} />}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.pickerBtn, docUri && styles.pickerBtnActive]} onPress={() => pickDocument()}>
              <Ionicons name="document-text-outline" size={22} color={docUri ? "#fff" : "#0077cc"} />
              <Text style={[styles.pickerBtnText, docUri && styles.pickerBtnTextActive]}>
                {docName ? (docName.length > 20 ? docName.substring(0, 20) + "..." : docName) : "Birth Certificate / ID"}
              </Text>
              {docUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginLeft: 'auto' }} />}
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

  // Render Pending View if User is not verified
  if (user?.status === 'pending') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="time-outline" size={80} color="#f59e0b" />
        <Text style={[styles.username, { color: '#333', marginTop: 20 }]}>Pending Verification</Text>
        <Text style={[styles.welcome, { textAlign: 'center', marginHorizontal: 30, marginTop: 10 }]}>
          Your account is currently under review by our administration. Once verified, your dashboard will be fully unlocked.
        </Text>
        <TouchableOpacity 
          style={[styles.logoutBtn, { width: 200, marginTop: 40 }]} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openSettings}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
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

          <View style={styles.avatarContainer}>
            {orphanProfile?.profilePic ? (
              <Image source={{ uri: orphanProfile.profilePic }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={40} color="#ccc" />
              </View>
            )}
          </View>

          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.username}>{orphanProfile?.name || 'Orphan'}</Text>
        </View>

        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.editModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.editAvatarContainer} onPress={() => pickImage(true)}>
                  <Image
                    source={{ uri: newProfilePicUri || orphanProfile?.profilePic }}
                    style={styles.editAvatar}
                  />
                  <View style={styles.editIconBadge}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </View>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Name"
                />

                <Text style={styles.formLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={editAge}
                  onChangeText={setEditAge}
                  keyboardType="numeric"
                  placeholder="Age"
                />

                <Text style={styles.formLabel}>Gender</Text>
                <View style={styles.typeSelector}>
                  {(['male', 'female', 'other'] as const).map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderBtn, editGender === g && styles.genderBtnActive]}
                      onPress={() => setEditGender(g)}
                    >
                      <Text style={[styles.genderBtnText, editGender === g && styles.genderBtnTextActive]}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editLocation}
                  onChangeText={setEditLocation}
                  placeholder="City"
                />

                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Contact Number"
                  keyboardType="phone-pad"
                />

                <TouchableOpacity
                  style={[styles.primarySubmitBtn, updatingProfile && styles.btnDisabled]}
                  onPress={handleUpdateProfile}
                  disabled={updatingProfile}
                >
                  {updatingProfile ? <ActivityIndicator color="#fff" /> : <Text style={styles.primarySubmitBtnText}>Save Changes</Text>}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Main Dashboard - Only show if not in full progress view */}
        {!showFullProgressList ? (
          <>
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

              <Text style={styles.sectionTitle}>Your Supporters</Text>
              <Text style={styles.sectionSub}>Kind people who are helping you reach your goals.</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.aidScroller}>
                {aidFeed.length === 0 ? (
                  <View style={styles.emptyAidCard}>
                    <Text style={styles.emptyText}>Your requests are being reviewed by our community. Help is on the way!</Text>
                  </View>
                ) : (
                  aidFeed.map((aid, index) => (
                    <View key={index} style={styles.aidCard}>
                      <View style={styles.donorHeader}>
                        <View style={styles.donorAvatar}>
                          <Text style={styles.donorInitial}>{(aid.donorId?.name?.charAt(0) || 'D').toUpperCase()}</Text>
                        </View>
                        <View>
                          <Text style={styles.donorName}>{aid.donorId?.name || 'Anonymous Donor'}</Text>
                          <Text style={styles.aidTime}>{new Date(aid.createdAt).toLocaleDateString()}</Text>
                        </View>
                      </View>
                      <View style={styles.aidDetail}>
                        <Text style={styles.aidType}>{aid.requestId?.type?.toUpperCase() || 'SUPPLIES'}</Text>
                        <Text style={styles.aidQty}>{aid.units} {aid.requestId?.unitType || 'units'} sent</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.thanksBtn}
                        onPress={() => router.push({
                          pathname: '/messages',
                          params: { userId: aid.donorId?._id, username: aid.donorId?.name }
                        })}
                      >
                        <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0077cc" />
                        <Text style={styles.thanksBtnText}>Say Thanks</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>
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
                      <View style={[
                        styles.statusBadge,
                        req.status === 'pending' ? styles.statusPendingBg : 
                        req.status === 'approved' ? styles.statusApprovedBg : 
                        styles.statusFulfilledBg
                      ]}>
                        <Text style={styles.statusBadgeText}>{req.status.toUpperCase()}</Text>
                      </View>
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

              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => setShowFullProgressList(true)}
              >
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
          </>
        ) : (
          /* Detailed Progress Report View */
          <View style={styles.section}>
            <View style={styles.viewHeader}>
              <TouchableOpacity onPress={() => setShowFullProgressList(false)} style={styles.viewBack}>
                <Ionicons name="arrow-back" size={24} color="#333" />
                <Text style={styles.viewBackText}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFullBtn} onPress={() => setShowProgressModal(true)}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addFullBtnText}>Add New</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.viewTitle}>My Achievements</Text>
            <Text style={styles.viewSub}>A history of your certificates and progress.</Text>
            
            {progressReports.length === 0 && (
              <View style={styles.emptyView}>
                <Ionicons name="medal-outline" size={60} color="#cbd5e1" />
                <Text style={styles.emptyViewText}>No achievements yet. Upload your certificates!</Text>
              </View>
            )}
            
            {progressReports.map((report, idx) => (
              <View key={idx} style={[styles.feeCard, { borderLeftColor: '#33cc99' }]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  {report.achievementImage ? (
                    <Image source={{ uri: report.achievementImage }} style={styles.progThumbLarge} />
                  ) : (
                    <View style={[styles.progThumbLarge, styles.progThumbPlaceholder]}>
                      <Ionicons name="medal-outline" size={24} color="#999" />
                    </View>
                  )}
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.feeTitle}>{report.title}</Text>
                    <Text style={styles.feeDate}>{report.category} • {new Date(report.date).toLocaleDateString()}</Text>
                    {report.remarks && <Text style={styles.actionDesc}>{report.remarks}</Text>}
                  </View>
                </View>
                <View style={styles.feeRight}>
                  <Text style={[styles.statNumber, { fontSize: 22, marginTop: 0 }]}>{report.score}</Text>
                  <TouchableOpacity onPress={() => handleDeleteProgress(report._id)} style={styles.deleteCircleLarge}>
                    <Ionicons name="trash-outline" size={16} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={{ height: 40 }} />
          </View>
        )}
      </ScrollView>

      {/* Progress / Achievement Modal */}
      <Modal
        visible={showProgressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProgressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContainer, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Achievement</Text>
              <TouchableOpacity onPress={() => setShowProgressModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Achievement Title (e.g. Matric Exam, Web Course)</Text>
              <TextInput 
                style={styles.input} 
                value={progTitle} 
                onChangeText={setProgTitle} 
                placeholder="Course or Degree Name" 
              />

              <Text style={styles.formLabel}>Grade / Score (e.g. A+, 85%, Pass)</Text>
              <TextInput 
                style={styles.input} 
                value={progScore} 
                onChangeText={setProgScore} 
                placeholder="Your result" 
              />

              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.typeSelector}>
                {(['Academic', 'Sports', 'Behavioral', 'Health'] as const).map(cat => (
                  <TouchableOpacity 
                    key={cat}
                    style={[styles.typeBtn, progCategory === cat && styles.typeBtnSelected]}
                    onPress={() => setProgCategory(cat)}
                  >
                    <Text style={[styles.typeBtnText, progCategory === cat && styles.typeBtnTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Remarks / Description</Text>
              <TextInput 
                style={[styles.input, { height: 80 }]} 
                value={progRemarks} 
                onChangeText={setProgRemarks} 
                placeholder="Any extra details..." 
                multiline
              />

              <Text style={styles.formLabel}>Certificate / Course Photo</Text>
              <TouchableOpacity 
                style={[styles.pickerBtn, progImgUri && styles.pickerBtnActive]} 
                onPress={() => pickImage(false, true)}
              >
                <Ionicons name="image-outline" size={22} color={progImgUri ? "#fff" : "#0077cc"} />
                <Text style={[styles.pickerBtnText, progImgUri && styles.pickerBtnTextActive]}>
                  {progImgUri ? "Photo Selected" : "Upload Certificate Photo"}
                </Text>
                {progImgUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{marginLeft: 'auto'}} />}
              </TouchableOpacity>

              {progImgUri && (
                <Image source={{ uri: progImgUri }} style={styles.progPreview} />
              )}

              <TouchableOpacity 
                style={[styles.primarySubmitBtn, submittingProg && styles.btnDisabled]} 
                onPress={handleAddProgress}
                disabled={submittingProg}
              >
                {submittingProg ? <ActivityIndicator color="#fff" /> : <Text style={styles.primarySubmitBtnText}>Save Achievement</Text>}
              </TouchableOpacity>
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 50,
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
    textAlign: 'center',
    marginTop: 10,
  },
  aidScroller: {
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 5,
  },
  aidCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    width: 220,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#33cc99',
  },
  donorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  donorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  donorInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  donorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  aidTime: {
    fontSize: 11,
    color: '#999',
  },
  aidDetail: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  aidType: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
    letterSpacing: 0.5,
  },
  aidQty: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  thanksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#e6f4ff',
  },
  thanksBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0077cc',
    marginLeft: 6,
  },
  emptyAidCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: 300,
    alignItems: 'center',
  },
  sectionSub: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    marginTop: -10,
    marginBottom: 10,
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
    paddingTop: 50,
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
  settingsButton: {
    position: 'absolute',
    right: 70,
    top: 40,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 50,
    padding: 3,
    backgroundColor: '#fff',
    shadowColor: '#0077cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#0077cc',
  },
  avatarPlaceholder: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  editModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  editAvatarContainer: {
    alignSelf: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#0077cc',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  addMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077cc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addMiniBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  progThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  progThumbPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  deleteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  progPreview: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  viewBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewBackText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addFullBtn: {
    backgroundColor: '#0077cc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  addFullBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  viewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  viewSub: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 20,
  },
  emptyViewText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 15,
    fontSize: 14,
  },
  progThumbLarge: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  deleteCircleLarge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusPendingBg: {
    backgroundColor: '#f59e0b', // Amber/Orange
  },
  statusApprovedBg: {
    backgroundColor: '#10b981', // Green
  },
  statusFulfilledBg: {
    backgroundColor: '#3b82f6', // Blue
  },
});

