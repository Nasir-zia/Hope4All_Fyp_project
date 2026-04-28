import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RegistrationFormProps {
  name: string;
  setName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  gender: 'male' | 'female' | 'other';
  setGender: (v: 'male' | 'female' | 'other') => void;
  profilePicUri: string | null;
  onPickImage: () => void;
  docUri: string | null;
  docName: string;
  onPickDocument: () => void;
  onSubmit: () => void;
  onLogout: () => void;
  submitting: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  name, setName, age, setAge, location, setLocation, phone, setPhone, gender, setGender,
  profilePicUri, onPickImage, docUri, docName, onPickDocument, onSubmit, onLogout, submitting
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Hope4All</Text>
        <Text style={styles.subtitle}>Complete your profile to access your dashboard</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Personal Details</Text>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor="#94a3b8" />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputBox, { flex: 1 }]}>
              <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" placeholderTextColor="#94a3b8" />
            </View>
            <View style={styles.genderSelector}>
              {(['male', 'female'] as const).map(g => (
                <TouchableOpacity 
                  key={g} 
                  style={[styles.genderBtn, gender === g && styles.genderBtnActive]} 
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="City / Location" placeholderTextColor="#94a3b8" />
          </View>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone Number" keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Verification Documents</Text>
          <TouchableOpacity style={[styles.picker, profilePicUri && styles.pickerActive]} onPress={onPickImage}>
            <Ionicons name="camera" size={20} color={profilePicUri ? "#fff" : "#0077cc"} />
            <Text style={[styles.pickerText, profilePicUri && styles.pickerTextActive]}>
              {profilePicUri ? "Photo Uploaded" : "Upload Profile Photo"}
            </Text>
            {profilePicUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{marginLeft: 'auto'}} />}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.picker, docUri && styles.pickerActive]} onPress={onPickDocument}>
            <Ionicons name="document-attach" size={20} color={docUri ? "#fff" : "#0077cc"} />
            <Text style={[styles.pickerText, docUri && styles.pickerTextActive]} numberOfLines={1}>
              {docName ? docName : "Birth Certificate / ID"}
            </Text>
            {docUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{marginLeft: 'auto'}} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, submitting && styles.disabledBtn]} 
          onPress={onSubmit} 
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Complete Registration</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 30, paddingTop: 60, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 15, color: '#64748b', marginTop: 8 },
  scroll: { padding: 30 },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  inputBox: { backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { paddingVertical: 14, fontSize: 15, color: '#1e293b' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  genderSelector: { flex: 2, flexDirection: 'row', gap: 8 },
  genderBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  genderBtnActive: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  genderBtnText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  genderBtnTextActive: { color: '#fff' },
  picker: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#e0f2fe', marginBottom: 12, gap: 12 },
  pickerActive: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  pickerText: { fontSize: 14, fontWeight: '700', color: '#0077cc' },
  pickerTextActive: { color: '#fff' },
  submitBtn: { backgroundColor: '#0077cc', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10, elevation: 4 },
  disabledBtn: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  logoutBtn: { padding: 20, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#ef4444', fontWeight: '700' },
});
