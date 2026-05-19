import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchDonorProfile,
  registerDonorProfile,
  fetchMatchedRequests,
  fetchMatchedOrphans,
  toggleMatchOrphanApi,
  makeDonation,
  fetchAvailableFees,
  pledgeFee,
  updateRequestStatus,
  rejectRequestApi,
  addCourseApi,
  fetchDonorCourses,
  updateDonorProfile,
  fetchDonationHistory,
  deleteDonationApi,
  fetchOrphanages,
  uploadDonationPhotoApi
} from '@/constants/api';
import { fetchOrphanProgress } from '@/api/progress/progressApi';
import * as ImagePicker from 'expo-image-picker';

export const useDonorDashboard = () => {
  const { user, logout } = useAuth();
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dynamic States
  const [requests, setRequests] = useState<any[]>([]);
  const [orphans, setOrphans] = useState<any[]>([]);
  const [availableFees, setAvailableFees] = useState<any[]>([]);
  const [donorCourses, setDonorCourses] = useState<any[]>([]);
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [orphanages, setOrphanages] = useState<any[]>([]);
  const [pledgingFee, setPledgingFee] = useState<string | null>(null);

  // Profile View States
  const [selectedOrphanForProfile, setSelectedOrphanForProfile] = useState<any>(null);
  const [directRecipient, setDirectRecipient] = useState<any>(null);
  const [orphanProgress, setOrphanProgress] = useState<any[]>([]);
  const [loadingOrphanData, setLoadingOrphanData] = useState(false);
  const [selectedOrphanage, setSelectedOrphanage] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOrphanageModal, setShowOrphanageModal] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [showAddDonationModal, setShowAddDonationModal] = useState(false);

  // Registration Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);

  // Temporary state for editing preferences
  const [tempCauses, setTempCauses] = useState<string[]>([]);
  const [tempAreas, setTempAreas] = useState<string[]>([]);
  const [tempLevels, setTempLevels] = useState<string[]>([]);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [tempUrgentOnly, setTempUrgentOnly] = useState(false);

  // Donation Form State
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [units, setUnits] = useState('');
  const [requestPhoto, setRequestPhoto] = useState<string | null>(null);

  // Manual Donation State
  const [manualType, setManualType] = useState('Books');
  const [manualUnits, setManualUnits] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualPhoto, setManualPhoto] = useState<string | null>(null);

  // Course Form State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [courseCategory, setCourseCategory] = useState('Academic');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  const causeOptions = ['Books', 'Stationery', 'Uniforms', 'School_Fees', 'Other'];

  const toggleCause = (cause: string) => {
    setSelectedCauses(prev =>
      prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    );
  };

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
      const [reqsData, orphansData, feesData, coursesData, donationsData, orphanagesData] = await Promise.all([
        fetchMatchedRequests(donorId),
        fetchMatchedOrphans(donorId), // Keep this for "Matches" if we want, but we'll prioritize all
        fetchAvailableFees(),
        fetchDonorCourses(user!.id),
        fetchDonationHistory(user!.id),
        fetchOrphanages()
      ]);
      setRequests(reqsData || []);
      setOrphans(orphansData || []);
      setAvailableFees(feesData || []);
      setDonorCourses(coursesData || []);
      setMyDonations(donationsData || []);
      setOrphanages(orphanagesData || []);
    } catch (err) {
      console.log("Error fetching dashboard data: ", err);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !city) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setSaving(true);
    try {
      const profile = await registerDonorProfile({
        userId: user!.id,
        name,
        phone,
        city,
        preferences: { causeType: [], area: [city], schoolLevel: [] }
      });
      setDonorProfile(profile);
      loadDashboardData(profile._id);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDonate = async () => {
    if (saving) return;
    if (!selectedRequest || !units) {
      Alert.alert("Error", "Please select a request and enter units.");
      return;
    }

    const unitsNum = Number(units);
    if (isNaN(unitsNum) || unitsNum <= 0) {
      Alert.alert("Error", "Please enter a valid quantity.");
      return;
    }

    if (selectedRequest.isUrgent && !requestPhoto) {
      Alert.alert("Photo Required", "Urgent needs require a photo of the item being sent.");
      return;
    }

    setSaving(true);
    console.log("Attempting Urgent Donation with data:", {
      requestId: selectedRequest._id,
      units: unitsNum,
      isUrgent: selectedRequest.isUrgent,
      hasPhoto: !!requestPhoto
    });
    try {
      const res = await makeDonation({
        donorId: donorProfile._id,
        requestId: selectedRequest._id,
        units: unitsNum,
        recipientName: selectedRequest.orphanId?.name || (selectedRequest.isInstitutional ? selectedRequest.orphanageId?.name : 'Child'),
        city: donorProfile.city || '',
        itemName: selectedRequest.description || selectedRequest.type
      }, user?.token);

      const donationId = res.donation?._id;

      if (requestPhoto && donationId) {
        try {
          const formData = new FormData();
          formData.append('photo', {
            uri: requestPhoto,
            name: `urgent_don_${donationId}.jpg`,
            type: 'image/jpeg',
          } as any);
          await uploadDonationPhotoApi(donationId, formData, user!.token);
        } catch (uploadErr) {
          console.error("Photo upload failed, but donation was created:", uploadErr);
        }
      }

      Alert.alert(
        "Donation Confirmed!",
        `Thank you for your generous support.\n\nPlease send your donation package to:\nMain Head Office\nFaisalabad D Ground, Office #12\n\nInclude your Donation ID: ${donationId}`,
        [{ text: "OK" }]
      );
      setUnits('');
      setSelectedRequest(null);
      setRequestPhoto(null);
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
      Alert.alert("Success", "Course added successfully!");
      setShowCourseModal(false);
      setCourseTitle('');
      setCourseDesc('');
      setCourseLink('');
      setCourseCategory('Academic');
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSubmittingCourse(false);
    }
  };

  const handleToggleMatchOrphan = async (orphan: any) => {
    if (!donorProfile) return;
    try {
      const res = await toggleMatchOrphanApi(donorProfile._id, orphan._id);
      Alert.alert("Success", res.message);
      const profile = await fetchDonorProfile(user!.id);
      if (profile) {
        setDonorProfile(profile);
        await loadDashboardData(profile._id);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update match.");
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

  const handleUpdatePreferences = async () => {
    if (tempCauses.length === 0) {
      Alert.alert("Error", "Please select at least one item.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateDonorProfile(user!.id, {
        preferences: {
          ...donorProfile.preferences,
          causeType: tempCauses,
          area: tempAreas,
          schoolLevel: tempLevels,
          urgentOnly: tempUrgentOnly
        }
      });
      setDonorProfile(updated);
      setUrgentOnly(tempUrgentOnly);
      setShowPreferenceModal(false);
      Alert.alert("Success", "Preferences updated!");
      loadDashboardData(updated._id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePickRequestPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) setRequestPhoto(result.assets[0].uri);
    } catch (err) {
      Alert.alert("Error", "Could not pick image");
    }
  };

  const handlePickDonationPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) setManualPhoto(result.assets[0].uri);
    } catch (err) {
      Alert.alert("Error", "Could not pick image");
    }
  };

  const handleManualDonation = async () => {
    if (saving) return;
    if (!manualUnits || !manualType) {
      Alert.alert("Error", "Please enter units and type.");
      return;
    }

    if (manualType.toLowerCase().includes('stationary') && !manualPhoto) {
      Alert.alert("Photo Required", "Please upload a photo of the stationery item.");
      return;
    }

    setSaving(true);
    try {
      const donationPayload: any = {
        donorId: donorProfile._id,
        units: Number(manualUnits),
        type: manualType,
        description: manualDesc,
        itemName: manualDesc || manualType,
        city: donorProfile.city || '',
        unitType: manualType === 'Cash' ? 'PKR' : 'Units'
      };

      if (directRecipient) {
        donationPayload.recipientId = directRecipient._id;
        donationPayload.recipientName = directRecipient.name;
        donationPayload.orphanageId = directRecipient.orphanageId?._id || directRecipient.orphanageId;
      }

      const res = await makeDonation(donationPayload, user?.token);

      const donationId = res.donation?._id;

      if (manualPhoto && donationId) {
        const formData = new FormData();
        formData.append('photo', {
          uri: manualPhoto,
          name: `manual_don_${donationId}.jpg`,
          type: 'image/jpeg',
        } as any);
        await uploadDonationPhotoApi(donationId, formData, user!.token);
      }

      Alert.alert(
        "Donation Confirmed!",
        `Thank you for your generous support.\n\nPlease send your donation package to:\nMain Head Office\nFaisalabad D Ground, Office #12\n\nInclude your Donation ID: ${donationId}`,
        [{ text: "OK" }]
      );
      setShowAddDonationModal(false);
      setDirectRecipient(null);
      setManualUnits('');
      setManualDesc('');
      setManualPhoto(null);
      setManualType('');
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteDonationApi(id);
            loadDashboardData(donorProfile._id);
          } catch (err: any) {
            Alert.alert("Error", err.message);
          }
        }
      }
    ]);
  };

  const handleUploadDonationPhoto = async (donationId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const photoUri = result.assets[0].uri;
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        name: `donation_${donationId}.jpg`,
        type: 'image/jpeg',
      } as any);

      setSaving(true);
      await uploadDonationPhotoApi(donationId, formData, user!.token);
      Alert.alert("Success", "Donation photo uploaded! Status is now 'In-Progress'.");
      loadDashboardData(donorProfile._id);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not upload photo");
    } finally {
      setSaving(false);
    }
  };

  const toggleTempCause = (cause: string) => {
    setTempCauses(prev =>
      prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    );
  };

  const toggleTempItem = (list: string[], setter: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleOpenPreferenceModal = () => {
    setTempCauses(donorProfile?.preferences?.causeType || []);
    setTempAreas(donorProfile?.preferences?.area || []);
    setTempLevels(donorProfile?.preferences?.schoolLevel || []);
    setTempUrgentOnly(donorProfile?.preferences?.urgentOnly || false);
    setShowPreferenceModal(true);
  };

  const handleOpenDirectDonation = (orphan: any) => {
    setDirectRecipient(orphan);
    setManualType('Books');
    setManualUnits('');
    setManualDesc('');
    setManualPhoto(null);
    setShowAddDonationModal(true);
  };

  const handleMessage = (orphan: any) => {
    // Messaging MUST use User IDs, not Profile IDs
    const targetUserId = orphan?.userId?._id || orphan?.userId || orphan?._id;
    if (!targetUserId) return;
    
    router.push({
      pathname: '/messages',
      params: {
        userId: String(targetUserId),
        username: orphan.name || orphan.username || 'User'
      }
    });
  };

  const handleViewOrphanProfile = async (orphan: any) => {
    setSelectedOrphanForProfile(orphan);
    setLoadingOrphanData(true);
    setShowProfileModal(true);
    try {
      const progress = await fetchOrphanProgress(orphan._id);
      setOrphanProgress(progress || []);
    } catch (err) {
      console.log("Error fetching orphan progress:", err);
    } finally {
      setLoadingOrphanData(false);
    }
  };

  return {
    user, logout, donorProfile, loading, saving,
    requests, orphans, availableFees, donorCourses, myDonations, pledgingFee, orphanages,
    filteredRequests: requests.filter(req => {
      const matchCause = !donorProfile?.preferences?.causeType?.length ||
        donorProfile.preferences.causeType.some((pref: string) => req.type.toLowerCase() === pref.toLowerCase());
      const matchUrgent = !donorProfile?.preferences?.urgentOnly || req.isUrgent;
      
      const matchLevel = !donorProfile?.preferences?.schoolLevel?.length ||
        !req.orphanId ||
        !req.orphanId.classLevel ||
        donorProfile.preferences.schoolLevel.some((pref: string) => {
          const classLvl = req.orphanId.classLevel.toLowerCase();
          const pf = pref.toLowerCase();
          return classLvl.includes(pf) || pf.includes(classLvl);
        });
      
      // Location matching (Preferred Areas substring match)
      const preferredAreas = (donorProfile?.preferences?.area || []).map((a: string) => a.toLowerCase());
      const orphanCity = req.orphanId?.location?.toLowerCase();
      const orphanageCity = req.orphanageId?.location?.city?.toLowerCase() || req.orphanageId?.location?.toLowerCase();
      
      let matchCity = true;
      if (preferredAreas.length > 0) {
        matchCity = false;
        if (orphanCity && preferredAreas.some((pref: string) => orphanCity.includes(pref) || pref.includes(orphanCity))) {
          matchCity = true;
        }
        if (!matchCity && orphanageCity && preferredAreas.some((pref: string) => orphanageCity.includes(pref) || pref.includes(orphanageCity))) {
          matchCity = true;
        }
      }

      return matchCause && matchUrgent && matchCity && matchLevel;
    }),
    filteredOrphans: (() => {
      const res = orphans.filter(orphan => {
        const preferredAreas = (donorProfile?.preferences?.area || []).map((a: string) => a.toLowerCase());
        const orphanCity = orphan.location?.toLowerCase();
        
        let matchCity = true;
        if (preferredAreas.length > 0) {
          matchCity = false;
          if (orphanCity && preferredAreas.some((pref: string) => orphanCity.includes(pref) || pref.includes(orphanCity))) {
            matchCity = true;
          }
        }

        const matchLevel = !donorProfile?.preferences?.schoolLevel?.length ||
          !orphan.classLevel ||
          donorProfile.preferences.schoolLevel.some((pref: string) => {
            const classLvl = orphan.classLevel.toLowerCase();
            const pf = pref.toLowerCase();
            return classLvl.includes(pf) || pf.includes(classLvl);
          });

        return matchCity && matchLevel;
      });
      return res.length > 0 ? res : orphans;
    })(),
    selectedOrphanForProfile, handleViewOrphanProfile,
    orphanProgress, loadingOrphanData,
    selectedOrphanage, setSelectedOrphanage,
    showProfileModal, setShowProfileModal,
    showOrphanageModal, setShowOrphanageModal,
    showPreferenceModal, setShowPreferenceModal,
    showAddDonationModal, setShowAddDonationModal,
    name, setName, phone, setPhone, city, setCity, selectedCauses, setSelectedCauses,
    areaOptions: ['Faisalabad'],
    levelOptions: ['Primary', 'Secondary', 'Higher'],
    tempCauses, setTempCauses,
    tempAreas, setTempAreas,
    tempLevels, setTempLevels,
    toggleTempItem,
    tempUrgentOnly, setTempUrgentOnly,
    selectedRequest, setSelectedRequest, units, setUnits,
    manualType, setManualType, manualUnits, setManualUnits, manualDesc, setManualDesc,
    showCourseModal, setShowCourseModal,
    courseTitle, setCourseTitle, courseDesc, setCourseDesc, courseLink, setCourseLink, courseCategory, setCourseCategory,
    submittingCourse, setSubmittingCourse,
    causeOptions, toggleCause, toggleTempCause,
    handleRegister, handleDonate, handlePledgeFee, handleApproveRequest, handleRejectRequest,
    handleCourseSubmit, handleOpenDoc, handleUpdatePreferences, handleManualDonation, handleDeleteDonation,
    handleOpenPreferenceModal, handleMessage, handleUploadDonationPhoto, handlePickDonationPhoto, manualPhoto, handlePickRequestPhoto, requestPhoto,
    directRecipient, setDirectRecipient, handleOpenDirectDonation, handleToggleMatchOrphan
  };
};
