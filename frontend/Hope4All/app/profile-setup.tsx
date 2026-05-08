import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/utils/apiClient';

export default function ProfileSetupPage() {
  const { user } = useAuth() as any;
  const [loading, setLoading] = useState(false);
  
  console.log('[ProfileSetup] Current User Role:', user?.role);

  const userRole = user?.role?.toLowerCase();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState<any>(null);
  const [bio, setBio] = useState('');

  // Role Specific Fields
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [location, setLocation] = useState('');
  const [school, setSchool] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [cnicOrBForm, setCnicOrBForm] = useState(''); // New Field
  const [docs, setDocs] = useState<any>(null);
  const [bFormFile, setBFormFile] = useState<any>(null);

  const pickImage = async (type: 'profile' | 'docs' | 'bform') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      if (type === 'profile') setProfilePic(result.assets[0]);
      else if (type === 'docs') setDocs(result.assets[0]);
      else if (type === 'bform') setBFormFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill basic details');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('bio', bio);

      if (profilePic) {
        formData.append('profilePic', {
          uri: profilePic.uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      let endpoint = '';
      if (userRole === 'orphan') {
        endpoint = '/orphans/register';
        formData.append('age', age);
        formData.append('gender', gender);
        formData.append('location', location);
        formData.append('school', school);
        formData.append('classLevel', classLevel);
        formData.append('cnicOrBForm', cnicOrBForm); // Sending New Field
        if (docs) {
          formData.append('supportingDocs', {
            uri: docs.uri,
            name: 'death_cert.jpg',
            type: 'image/jpeg',
          } as any);
        }
        if (bFormFile) {
          formData.append('bFormDoc', {
            uri: bFormFile.uri,
            name: 'bform.jpg',
            type: 'image/jpeg',
          } as any);
        }
      } else if (userRole === 'donor') {
        endpoint = '/donors/register';
        formData.append('city', location);
      } else if (userRole === 'volunteer') {
        endpoint = '/volunteers/register';
      } else if (userRole === 'orphanage') {
        endpoint = '/orphanages/register';
        formData.append('address', location);
      }

      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      const res = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile setup complete!', [
          { text: 'Go to Dashboard', onPress: () => router.replace(`/${user.role}` as any) }
        ]);
      } else {
        Alert.alert('Error', res.message || 'Failed to save profile');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Something went wrong while saving your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>Tell us a bit more about yourself to get started.</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={() => pickImage('profile')}>
        {profilePic ? (
          <Image source={{ uri: profilePic.uri }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={40} color="#cbd5e1" />
            <Text style={styles.imageText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your full name" />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="e.g. +92 300 1234567" keyboardType="phone-pad" />

        {userRole === 'orphan' && (
          <>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Age</Text>
                <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity onPress={() => setGender('male')} style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}>
                    <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setGender('female')} style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}>
                    <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.label}>CNIC / B-Form Number</Text>
            <TextInput 
              style={styles.input} 
              value={cnicOrBForm} 
              onChangeText={setCnicOrBForm} 
              placeholder="42101-XXXXXXX-X" 
              keyboardType="numeric" 
            />

            <Text style={styles.label}>Location / City</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter your city" />

            <Text style={styles.label}>School Name</Text>
            <TextInput style={styles.input} value={school} onChangeText={setSchool} placeholder="School name" />

            <Text style={styles.label}>Father Death Certificate (Required)</Text>
            <TouchableOpacity style={styles.docsBtn} onPress={() => pickImage('docs')}>
              <Ionicons name="document-attach-outline" size={20} color={docs ? '#059669' : '#64748b'} />
              <Text style={[styles.docsBtnText, docs && { color: '#059669' }]}>
                {docs ? 'Certificate Attached' : 'Upload Father Death Certificate'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>B-Form / Birth Certificate (Required)</Text>
            <TouchableOpacity style={styles.docsBtn} onPress={() => pickImage('bform')}>
              <Ionicons name="document-text-outline" size={20} color={bFormFile ? '#059669' : '#64748b'} />
              <Text style={[styles.docsBtnText, bFormFile && { color: '#059669' }]}>
                {bFormFile ? 'B-Form Attached' : 'Upload B-Form Document'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {userRole !== 'orphan' && (
          <>
            <Text style={styles.label}>Location / City</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter your city" />
            
            <Text style={styles.label}>Bio / Description</Text>
            <TextInput 
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
              value={bio} 
              onChangeText={setBio} 
              placeholder="Tell us about yourself..." 
              multiline 
            />
          </>
        )}

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Complete Setup</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: -8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  row: {
    flexDirection: 'row',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  genderBtnActive: {
    backgroundColor: '#0d8ddb',
    borderColor: '#0d8ddb',
  },
  genderText: {
    color: '#64748b',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#fff',
  },
  docsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  docsBtnText: {
    color: '#64748b',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#0d8ddb',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
