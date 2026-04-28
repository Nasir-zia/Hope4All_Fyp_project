import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  setName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  gender: string;
  setGender: (v: 'male' | 'female' | 'other') => void;
  profilePic?: string;
  newPic?: string | null;
  onPickImage: () => void;
  onUpdate: () => void;
  loading: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible, onClose, name, setName, age, setAge, location, setLocation, phone, setPhone, gender, setGender,
  profilePic, newPic, onPickImage, onUpdate, loading
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <TouchableOpacity style={styles.avatarPicker} onPress={onPickImage}>
               <View style={styles.avatarBorder}>
                  <Image source={{ uri: newPic || profilePic }} style={styles.avatar} />
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </View>
               </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
            </View>

            <View style={styles.row}>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="Age" />
               </View>
               <View style={[styles.inputGroup, { flex: 1.5 }]}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderRow}>
                    {(['male', 'female', 'other'] as const).map(g => (
                      <TouchableOpacity 
                        key={g} 
                        style={[styles.genderChip, gender === g && styles.genderChipActive]} 
                        onPress={() => setGender(g)}
                      >
                        <Text style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>
                          {g.charAt(0).toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
               </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Current City" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="03xx-xxxxxxx" />
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, loading && styles.disabledBtn]} 
              onPress={onUpdate} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Update Profile</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { height: '85%', backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  avatarPicker: { alignSelf: 'center', marginBottom: 30 },
  avatarBorder: { width: 110, height: 110, borderRadius: 40, padding: 4, borderWidth: 2, borderColor: '#0077cc', position: 'relative' },
  avatar: { width: '100%', height: '100%', borderRadius: 36 },
  cameraIcon: { position: 'absolute', bottom: -5, right: -5, width: 34, height: 34, borderRadius: 12, backgroundColor: '#0077cc', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', color: '#1e293b', fontSize: 15 },
  row: { flexDirection: 'row', gap: 15 },
  genderRow: { flexDirection: 'row', gap: 8, height: 54 },
  genderChip: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  genderChipActive: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  genderChipText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  genderChipTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  disabledBtn: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
