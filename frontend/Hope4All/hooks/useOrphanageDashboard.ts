import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { 
  fetchOrphanageProfile, 
  fetchOrphanageOptions, 
  registerOrphanageApi,
  fetchOrphanageRequests,
  submitRequirement
} from '../constants/api';

export const useOrphanageDashboard = () => {
  const { user, logout } = useAuth();
  const [orphanageProfile, setOrphanageProfile] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Registration form states
  const [name, setName] = useState('');
  const [regNum, setRegNum] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await fetchOrphanageProfile(user!.id);
      if (profile) {
        setOrphanageProfile(profile);
        setIsRegistering(false);
        const reqs = await fetchOrphanageRequests(profile._id);
        setRequirements(reqs);
      } else {
        setIsRegistering(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !regNum || !phone || !email || !address || !city || !state || !zipCode || !capacity) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('userId', user!.id);
      formData.append('name', name);
      formData.append('registrationNumber', regNum);
      formData.append('location[address]', address);
      formData.append('location[city]', city);
      formData.append('location[state]', state);
      formData.append('location[zipCode]', zipCode);
      formData.append('contactInfo[phone]', phone);
      formData.append('contactInfo[email]', email);
      formData.append('capacity[current]', '0');
      formData.append('capacity[max]', capacity);

      await registerOrphanageApi(formData);
      Alert.alert('Success', 'Orphanage registered successfully! Please wait for admin approval.');
      loadProfile();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user, logout, orphanageProfile, loading, isRegistering, requirements,
    name, setName, regNum, setRegNum, phone, setPhone, email, setEmail,
    address, setAddress, city, setCity, state, setState, zipCode, setZipCode,
    capacity, setCapacity, submitting, handleRegister
  };
};
