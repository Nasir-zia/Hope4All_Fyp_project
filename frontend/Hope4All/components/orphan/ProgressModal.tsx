import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProgressModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  setTitle: (v: string) => void;
  category: 'Academic' | 'Sports' | 'Behavioral' | 'Health';
  setCategory: (v: 'Academic' | 'Sports' | 'Behavioral' | 'Health') => void;
  score: string;
  setScore: (v: string) => void;
  remarks: string;
  setRemarks: (v: string) => void;
  imageUri: string | null;
  onPickImage: () => void;
  onSave: () => void;
  loading: boolean;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  visible, onClose, title, setTitle, category, setCategory, score, setScore, remarks, setRemarks,
  imageUri, onPickImage, onSave, loading
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titleText}>Add Achievement</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <TouchableOpacity style={styles.imagePicker} onPress={onPickImage}>
               {imageUri ? (
                 <Image source={{ uri: imageUri }} style={styles.pickedImage} />
               ) : (
                 <View style={styles.imagePlaceholder}>
                    <Ionicons name="cloud-upload-outline" size={32} color="#0077cc" />
                    <Text style={styles.placeholderText}>Upload Certificate/Photo</Text>
                 </View>
               )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Achievement Title</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Final Exam Results" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryRow}>
                {(['Academic', 'Sports', 'Behavioral', 'Health'] as const).map(c => (
                  <TouchableOpacity 
                    key={c} 
                    style={[styles.catChip, category === c && styles.catChipActive]} 
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Score / Grade</Text>
              <TextInput style={styles.input} value={score} onChangeText={setScore} placeholder="e.g. 95% or Grade A" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Remarks / Description</Text>
              <TextInput 
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                value={remarks} 
                onChangeText={setRemarks} 
                placeholder="Tell us about this achievement..." 
                multiline
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, loading && styles.disabledBtn]} 
              onPress={onSave} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Achievement</Text>}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  titleText: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  imagePicker: { height: 180, borderRadius: 24, backgroundColor: '#f8fafc', borderWidth: 2, borderColor: '#e2e8f0', borderStyle: 'dashed', overflow: 'hidden', marginBottom: 25 },
  pickedImage: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  placeholderText: { fontSize: 14, color: '#0077cc', fontWeight: '600' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', color: '#1e293b', fontSize: 15 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  catChipActive: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  catChipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  catChipTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  disabledBtn: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
