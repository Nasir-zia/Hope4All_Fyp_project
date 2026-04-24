import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '@/hooks/useAuth';
import { registerOrphanProfile } from '@/constants/api';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

export const OrphanRegistration: React.FC = () => {
  const { user, logout } = useAuth();
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
      console.log('Document picker error:', err);
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
          <Text style={styles.label}>Basic Information</Text>
          <TextInput 
            style={styles.input} 
            value={regName} 
            onChangeText={setRegName} 
            placeholder="Full Name" 
            placeholderTextColor="#94a3b8" 
          />
          <TextInput 
            style={[styles.input, { marginTop: 15 }]} 
            value={regAge} 
            onChangeText={setRegAge} 
            placeholder="Age" 
            keyboardType="numeric" 
            placeholderTextColor="#94a3b8" 
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Gender</Text>
          <View style={[styles.typeSelector, { marginTop: 5 }]}>
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

          <TextInput 
            style={[styles.input, { marginTop: 20 }]} 
            value={regLocation} 
            onChangeText={setRegLocation} 
            placeholder="City (e.g. Karachi)" 
            placeholderTextColor="#94a3b8" 
          />
          <TextInput 
            style={[styles.input, { marginTop: 15 }]} 
            value={regPhone} 
            onChangeText={setRegPhone} 
            placeholder="Phone Number" 
            keyboardType="phone-pad" 
            placeholderTextColor="#94a3b8" 
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Required Verifications</Text>
          <TouchableOpacity 
            style={[styles.pickerBtn, profilePicUri && styles.pickerBtnActive]} 
            onPress={pickImage}
          >
            <Ionicons name="camera-outline" size={22} color={profilePicUri ? "#fff" : "#0077cc"} />
            <Text style={[styles.pickerBtnText, profilePicUri && styles.pickerBtnTextActive]}>
              {profilePicUri ? "Profile Photo Ready" : "Upload Profile Photo"}
            </Text>
            {profilePicUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginLeft: 'auto' }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.pickerBtn, docUri && styles.pickerBtnActive]} 
            onPress={pickDocument}
          >
            <Ionicons name="document-text-outline" size={22} color={docUri ? "#fff" : "#0077cc"} />
            <Text style={[styles.pickerBtnText, docUri && styles.pickerBtnTextActive]}>
              {docName ? (docName.length > 25 ? docName.substring(0, 25) + "..." : docName) : "Birth Certificate / ID"}
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

        <TouchableOpacity style={styles.cancelLink} onPress={logout}>
          <Text style={styles.cancelLinkText}>Not an Orphan? Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
