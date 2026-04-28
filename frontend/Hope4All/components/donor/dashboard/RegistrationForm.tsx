import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RegistrationFormProps {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  onSubmit: () => void;
  onLogout: () => void;
  saving: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  name, setName, phone, setPhone, city, setCity, onSubmit, onLogout, saving
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={32} color="#0077cc" />
        </View>
        <Text style={styles.title}>Join Hope4All</Text>
        <Text style={styles.subtitle}>Help children reach their full potential</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={20} color="#64748b" />
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={20} color="#64748b" />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="03xx-xxxxxxx" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={20} color="#64748b" />
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. Islamabad" />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, saving && styles.disabledBtn]} 
          onPress={onSubmit} 
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Become a Supporter</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Cancel & Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 40, paddingTop: 80, alignItems: 'center', backgroundColor: '#f8fafc' },
  iconCircle: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 8, textAlign: 'center' },
  scroll: { padding: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 15, color: '#1e293b' },
  submitBtn: { backgroundColor: '#0077cc', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 20, elevation: 4 },
  disabledBtn: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  logoutBtn: { padding: 20, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#ef4444', fontWeight: '700' },
});
