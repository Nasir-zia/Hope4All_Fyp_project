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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileSetupPage() {
  const { user } = useAuth() as any;
  const [loading, setLoading] = useState(false);

  const userRole = user?.role?.toLowerCase();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState<any>(null);
  const [bio, setBio] = useState('');

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [location, setLocation] = useState('');
  const [school, setSchool] = useState('');
  const [cnicOrBForm, setCnicOrBForm] = useState('');
  const [docs, setDocs] = useState<any>(null);
  const [bFormFile, setBFormFile] = useState<any>(null);

  // ✅ FIXED IMAGE PICKER (LATEST EXPO API)
  const pickImage = async (type: 'profile' | 'docs' | 'bform') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const file = result.assets[0];

      if (type === 'profile') setProfilePic(file);
      else if (type === 'docs') setDocs(file);
      else if (type === 'bform') setBFormFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill basic details');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not loaded');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('userId', user.id);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('bio', bio || '');

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
        formData.append('cnicOrBForm', cnicOrBForm);

        if (docs) {
          formData.append('supportingDocs', {
            uri: docs.uri,
            name: 'doc.jpg',
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

      // 🔥 FIXED API URL (NO localhost)
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          // ❌ DO NOT set Content-Type (IMPORTANT FIX)
        },
        body: formData,
      });

      const text = await response.text();
      console.log('RAW RESPONSE:', text);

      let res;
      try {
        res = JSON.parse(text);
      } catch {
        res = {};
      }

      if (response.ok) {
        Alert.alert('Success', 'Profile setup complete!', [
          { text: 'Go to Dashboard', onPress: () => router.replace(`/${user.role}` as any) }
        ]);
      } else {
        Alert.alert('Error', res.message || 'Failed to save profile');
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Network or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TouchableOpacity onPress={() => pickImage('profile')}>
        {profilePic ? (
          <Image source={{ uri: profilePic.uri }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={40} color="#aaa" />
            <Text>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} />

      {userRole === 'orphan' && (
        <>
          <TextInput placeholder="Age" value={age} onChangeText={setAge} style={styles.input} />
          <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
          <TextInput placeholder="School" value={school} onChangeText={setSchool} style={styles.input} />
          <TextInput placeholder="CNIC/B-Form" value={cnicOrBForm} onChangeText={setCnicOrBForm} style={styles.input} />
        </>
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Submit</Text>}
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { padding: 20 },
  input: { backgroundColor: '#f2f2f2', marginVertical: 8, padding: 12, borderRadius: 10 },
  btn: { backgroundColor: '#0d8ddb', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center' },
  imagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 }
});