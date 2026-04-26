import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { 
  fetchDonorProfile, 
  fetchApprovedRequests, 
  fetchMatchedOrphans, 
  fetchAvailableFees, 
  registerDonorProfile,
  makeDonation,
  pledgeFee,
  createCourseApi
} from '../constants/api';
import { useAuth } from './useAuth';

export function useDonorDashboard() {
  const { user, logout } = useAuth();
  const token = user?.token;
  
  // Profile State
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dashboard Data State
  const [requests, setRequests] = useState<any[]>([]);
  const [orphans, setOrphans] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [units, setUnits] = useState('1');
  const [pledging, setPledging] = useState(false);

  // Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedOrphanForProfile, setSelectedOrphanForProfile] = useState<any>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [courseCategory, setCourseCategory] = useState('Academic');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  const loadData = useCallback(async (showIndicator = true) => {
    if (!user?.id) return;
    if (showIndicator) setLoading(true);
    
    try {
      const profile = await fetchDonorProfile(user.id);
      setDonorProfile(profile);
      
      if (profile && profile.status === 'approved') {
        const [approvedReqs, matchedOrphans, availableFees] = await Promise.all([
          fetchApprovedRequests(),
          fetchMatchedOrphans(profile._id),
          fetchAvailableFees()
        ]);
        setRequests(approvedReqs);
        setOrphans(matchedOrphans);
        setFees(availableFees);
      }
    } catch (error) {
      console.error('Error loading donor dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRegister = async () => {
    if (!name || !phone || !city) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    setSaving(true);
    try {
      const profile = await registerDonorProfile({ 
        userId: user!.id, 
        name, 
        email: user?.email || '', 
        phone, 
        city 
      });
      setDonorProfile(profile);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDonate = async () => {
    if (!selectedRequest || !units) return;
    setPledging(true);
    try {
      await makeDonation({
        donorId: donorProfile._id,
        requestId: selectedRequest._id,
        units: parseInt(units),
        recipientName: selectedRequest.orphanId?.name || 'Orphan'
      }, token || undefined);
      
      Alert.alert('Success', 'Pledge successful!');
      setSelectedRequest(null);
      setUnits('1');
      loadData(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pledge donation');
    } finally {
      setPledging(false);
    }
  };

  const handlePledgeFee = async (feeId: string) => {
    try {
      await pledgeFee(feeId, donorProfile._id, token || undefined);
      Alert.alert('Success', 'Fee pledged successfully!');
      loadData(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pledge fee');
    }
  };

  const handleCreateCourse = async () => {
    if (!courseTitle || !courseDesc || !courseLink) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    setSubmittingCourse(true);
    try {
      await createCourseApi({
        donorId: donorProfile._id,
        title: courseTitle,
        description: courseDesc,
        link: courseLink,
        category: courseCategory
      }, token || undefined);
      
      Alert.alert('Success', 'Course submitted for approval!');
      setShowCourseModal(false);
      setCourseTitle('');
      setCourseDesc('');
      setCourseLink('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit course');
    } finally {
      setSubmittingCourse(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(false);
  }, [loadData]);

  return {
    // Auth
    logout,
    
    // State
    donorProfile,
    loading,
    saving,
    requests,
    orphans,
    fees,
    refreshing,
    
    // Forms
    name, setName,
    phone, setPhone,
    city, setCity,
    selectedRequest, setSelectedRequest,
    units, setUnits,
    pledging,
    
    // Modals
    showProfileModal, setShowProfileModal,
    selectedOrphanForProfile, setSelectedOrphanForProfile,
    showCourseModal, setShowCourseModal,
    courseTitle, setCourseTitle,
    courseDesc, setCourseDesc,
    courseLink, setCourseLink,
    courseCategory, setCourseCategory,
    submittingCourse,
    
    // Actions
    handleRegister,
    handleDonate,
    handlePledgeFee,
    handleCreateCourse,
    onRefresh
  };
}
