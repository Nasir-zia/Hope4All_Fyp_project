import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
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
  fetchOrphanAidFeed,
  createProgressApi,
  deleteProgressApi,
  fetchApprovedCourses
} from '@/constants/api';

export const useOrphanDashboard = () => {
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
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
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
      const [reqs, progress, aid, courses] = await Promise.all([
        fetchOrphanRequests(targetId),
        fetchOrphanProgress(targetId),
        fetchOrphanAidFeed(targetId),
        fetchApprovedCourses()
      ]);
      setMaterialRequests(reqs);
      setProgressReports(progress);
      setAidFeed(aid);
      setAvailableCourses(courses);
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
    setSubmittingFee(true);
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
    Alert.alert("Delete Achievement", "Are you sure you want to remove this record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteProgressApi(id);
            loadExtras();
          } catch (err: any) {
            Alert.alert("Error", err.message);
          }
        }
      }
    ]);
  };

  const pickImage = async (forEdit = false, forProgress = false) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: forProgress ? [4, 3] : [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      if (forProgress) setProgImgUri(result.assets[0].uri);
      else if (forEdit) setNewProfilePicUri(result.assets[0].uri);
      else setProfilePicUri(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
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

  return {
    user, logout, orphanProfile, isRegistering, setIsRegistering, loadingExtras,
    fees, feeTitle, setFeeTitle, feeAmount, setFeeAmount, feeDate, setFeeDate, loadingFees, submittingFee,
    materialRequests, progressReports, aidFeed, availableCourses, showRequestModal, setShowRequestModal,
    reqType, setReqType, reqDesc, setReqDesc, reqUnits, setReqUnits, reqSchool, setReqSchool,
    regName, setRegName, regAge, setRegAge, regGender, setRegGender, regLocation, setRegLocation, regPhone, setRegPhone,
    profilePicUri, docUri, docName, submittingProfile,
    showEditModal, setShowEditModal, editName, setEditName, editAge, setEditAge, editLocation, setEditLocation,
    editPhone, setEditPhone, editGender, setEditGender, newProfilePicUri, updatingProfile,
    showProgressModal, setShowProgressModal, progTitle, setProgTitle, progCategory, setProgCategory,
    progScore, setProgScore, progRemarks, setProgRemarks, progImgUri, submittingProg, showFullProgressList, setShowFullProgressList,
    handleAddFee, handleAddMaterialRequest, openSettings, handleUpdateProfile, handleAddProgress, handleDeleteProgress,
    pickImage, pickDocument, handleProfileSubmit
  };
};
