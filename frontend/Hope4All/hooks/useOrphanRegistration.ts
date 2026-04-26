import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { registerOrphanProfile } from '../constants/api';
import { useAuth } from './useAuth';
import { useOrphan } from '../contexts/OrphanContext';

export function useOrphanRegistration() {
  const { user, logout } = useAuth();
  const token = user?.token;
  const { loadProfileAndData } = useOrphan();

  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState<'male' | 'female' | 'other'>('male');
  const [regLocation, setRegLocation] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [profilePicUri, setProfilePicUri] = useState<string | null>(null);
  const [docUri, setDocUri] = useState<string | null>(null);
  const [docName, setDocName] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePicUri(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (!result.canceled) {
        setDocUri(result.assets[0].uri);
        setDocName(result.assets[0].name);
      }
    } catch (err) {
      console.error('Document picker error:', err);
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
      formData.append('userId', user?.id || '');
      formData.append('name', regName);
      formData.append('age', regAge);
      formData.append('gender', regGender);
      formData.append('location', regLocation);
      formData.append('phone', regPhone);

      const formatFileUri = (uri: string) => {
        return Platform.OS === 'android' ? uri : uri.replace('file://', '');
      };

      const picName = profilePicUri.split('/').pop() || 'profile.jpg';
      formData.append('profilePic', {
        uri: formatFileUri(profilePicUri),
        name: picName,
        type: 'image/jpeg',
      } as any);

      const documentName = docName || docUri.split('/').pop() || 'document.pdf';
      formData.append('supportingDocs', {
        uri: formatFileUri(docUri),
        name: documentName,
        type: documentName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      } as any);

      await registerOrphanProfile(formData);
      Alert.alert("Success", "Profile completed! Welcome to Hope4All.");
      loadProfileAndData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save profile");
    } finally {
      setSubmittingProfile(false);
    }
  };

  return {
    logout,
    regName, setRegName,
    regAge, setRegAge,
    regGender, setRegGender,
    regLocation, setRegLocation,
    regPhone, setRegPhone,
    profilePicUri, docUri, docName,
    submittingProfile,
    pickImage,
    pickDocument,
    handleProfileSubmit
  };
}
