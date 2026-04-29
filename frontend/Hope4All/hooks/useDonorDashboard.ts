import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { router } from 'expo-router';
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
  fetchDonorCourses,
  updateDonorProfile,
  fetchDonationHistory,
  deleteDonationApi,
  fetchOrphanages
} from '@/constants/api';

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

  // Donation Form State
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [units, setUnits] = useState('');

  // Manual Donation State
  const [manualType, setManualType] = useState('Books');
  const [manualUnits, setManualUnits] = useState('');
  const [manualDesc, setManualDesc] = useState('');

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
        fetchApprovedRequests(),
        fetchMatchedOrphans(donorId),
        fetchAvailableFees(),
        fetchDonorCourses(donorId),
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
        preferences: { causeType: [], area: [], schoolLevel: [] }
      });
      setDonorProfile(profile);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save profile');
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
      Alert.alert(
        "Donation Confirmed",
        "Thank you! Please send your donated items to our main office:\n\n Address: Faisalabad D Ground, Office #12\n\nPlease mention your Donation ID on the package.",
        [{ text: "OK" }]
      );
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
          causeType: tempCauses
        }
      });
      setDonorProfile(updated);
      setShowPreferenceModal(false);
      Alert.alert("Success", "Preferences updated!");
      loadDashboardData(updated._id);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleManualDonation = async () => {
    if (!manualUnits || !manualType) {
      Alert.alert("Error", "Please enter units and type.");
      return;
    }
    setSaving(true);
    try {
      await makeDonation({
        donorId: donorProfile._id,
        units: Number(manualUnits),
        type: manualType,
        description: manualDesc,
        unitType: manualType === 'Cash' ? 'PKR' : 'Units'
      });
      Alert.alert("Success", "Donation recorded successfully!");
      setShowAddDonationModal(false);
      setManualUnits('');
      setManualDesc('');
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

  const toggleTempCause = (cause: string) => {
    setTempCauses(prev =>
      prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    );
  };

  const handleOpenPreferenceModal = () => {
    setTempCauses(donorProfile?.preferences?.causeType || []);
    setShowPreferenceModal(true);
  };

  const handleMessage = (orphan: any) => {
    if (!orphan?._id) return;
    router.push({
      pathname: '/messages',
      params: {
        userId: orphan._id,
        username: orphan.name || orphan.username || 'User'
      }
    });
  };

  return {
    user, logout, donorProfile, loading, saving,
    requests, orphans, availableFees, donorCourses, myDonations, pledgingFee, orphanages,
    filteredRequests: requests.filter(req =>
      !donorProfile?.preferences?.causeType?.length ||
      donorProfile.preferences.causeType.some((pref: string) => req.type.toLowerCase() === pref.toLowerCase())
    ),
    filteredOrphans: orphans,
    selectedOrphanForProfile, setSelectedOrphanForProfile,
    selectedOrphanage, setSelectedOrphanage,
    showProfileModal, setShowProfileModal,
    showOrphanageModal, setShowOrphanageModal,
    showPreferenceModal, setShowPreferenceModal,
    showAddDonationModal, setShowAddDonationModal,
    name, setName, phone, setPhone, city, setCity, selectedCauses, setSelectedCauses,
    tempCauses, setTempCauses,
    selectedRequest, setSelectedRequest, units, setUnits,
    manualType, setManualType, manualUnits, setManualUnits, manualDesc, setManualDesc,
    showCourseModal, setShowCourseModal,
    courseTitle, setCourseTitle, courseDesc, setCourseDesc, courseLink, setCourseLink, courseCategory, setCourseCategory,
    submittingCourse, setSubmittingCourse,
    causeOptions, toggleCause, toggleTempCause,
    handleRegister, handleDonate, handlePledgeFee, handleApproveRequest, handleRejectRequest,
    handleCourseSubmit, handleOpenDoc, handleUpdatePreferences, handleManualDonation, handleDeleteDonation,
    handleOpenPreferenceModal, handleMessage
  };
};
