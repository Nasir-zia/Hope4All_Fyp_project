import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './useAuth';
import { 
  fetchOrphanageProfile, 
  fetchOrphanageOptions, 
  registerOrphanageApi,
  fetchOrphanageRequests,
  submitRequirement
} from '../constants/api';

export const useOrphanageDashboard = () => {
  const { user, logout, updateUser } = useAuth();
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
  
  // File states
  const [regCert, setRegCert] = useState<any>(null);
  const [buildingImages, setBuildingImages] = useState<any[]>([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (!result.canceled) {
        setRegCert(result.assets[0]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setBuildingImages(result.assets);
      }
    } catch (err) {
      console.error('Error picking images:', err);
    }
  };

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

      if (regCert) {
        formData.append('registrationCert', {
          uri: regCert.uri,
          name: regCert.name,
          type: regCert.mimeType || 'application/pdf',
        } as any);
      }

      if (buildingImages.length > 0) {
        buildingImages.forEach((img, index) => {
          formData.append('buildingImages', {
            uri: img.uri,
            name: `building_${index}.jpg`,
            type: 'image/jpeg',
          } as any);
        });
      }

      await registerOrphanageApi(formData);
      
      // Update local auth status to pending
      await updateUser({ status: 'pending' });

      Alert.alert('Success', 'Orphanage Registered Successfully! Please wait for admin approval.');
      loadProfile();
    } catch (err: any) {
      console.error('Registration error:', err);
      Alert.alert('Error', err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user, logout, orphanageProfile, loading, isRegistering, requirements,
    name, setName, regNum, setRegNum, phone, setPhone, email, setEmail,
    address, setAddress, city, setCity, state, setState, zipCode, setZipCode,
    capacity, setCapacity, submitting, handleRegister,
    regCert, pickDocument, buildingImages, pickImages
  };
};
