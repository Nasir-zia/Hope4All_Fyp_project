import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';
import { updateOrphanProfile } from '@/constants/api';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { orphanProfile, setOrphanProfile } = useOrphan();

  const [editName, setEditName] = useState(orphanProfile?.name || '');
  const [editAge, setEditAge] = useState(String(orphanProfile?.age || ''));
  const [editLocation, setEditLocation] = useState(orphanProfile?.location || '');
  const [editPhone, setEditPhone] = useState(orphanProfile?.phone || '');
  const [editGender, setEditGender] = useState(orphanProfile?.gender || 'male');
  const [newProfilePicUri, setNewProfilePicUri] = useState<string | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (visible && orphanProfile) {
      setEditName(orphanProfile.name);
      setEditAge(String(orphanProfile.age));
      setEditLocation(orphanProfile.location || '');
      setEditPhone(orphanProfile.phone || '');
      setEditGender(orphanProfile.gender || 'male');
      setNewProfilePicUri(null);
    }
  }, [visible, orphanProfile]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewProfilePicUri(result.assets[0].uri);
    }
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

      const updated = await updateOrphanProfile(user!.id, formData, user?.token || '');
      setOrphanProfile(updated);
      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (err: any) {
      Alert.alert("Update Error", err.message || "Could not update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.editModalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.editAvatarContainer} onPress={pickImage}>
              <Image
                source={{ uri: newProfilePicUri || orphanProfile?.profilePic }}
                style={styles.editAvatar}
              />
              <View style={styles.editIconBadge}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              placeholderTextColor="#94a3b8"
            />

            <Text style={[styles.label, { marginTop: 15 }]}>Age</Text>
            <TextInput
              style={styles.input}
              value={editAge}
              onChangeText={setEditAge}
              keyboardType="numeric"
              placeholder="Age"
              placeholderTextColor="#94a3b8"
            />

            <Text style={[styles.label, { marginTop: 15 }]}>Gender</Text>
            <View style={styles.typeSelector}>
              {(['male', 'female', 'other'] as const).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, editGender === g && styles.genderBtnActive]}
                  onPress={() => setEditGender(g)}
                >
                  <Text style={[styles.genderBtnText, editGender === g && styles.genderBtnTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 15 }]}>Location</Text>
            <TextInput
              style={styles.input}
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder="City"
              placeholderTextColor="#94a3b8"
            />

            <Text style={[styles.label, { marginTop: 15 }]}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Contact Number"
              keyboardType="phone-pad"
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity
              style={[styles.primarySubmitBtn, updatingProfile && styles.btnDisabled]}
              onPress={handleUpdateProfile}
              disabled={updatingProfile}
            >
              {updatingProfile ? <ActivityIndicator color="#fff" /> : <Text style={styles.primarySubmitBtnText}>Save Changes</Text>}
            </TouchableOpacity>
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
