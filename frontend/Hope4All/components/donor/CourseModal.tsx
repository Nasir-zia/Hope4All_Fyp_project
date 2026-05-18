import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CourseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  title: string;
  setTitle: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  link: string;
  setLink: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  duration?: string;
  setDuration?: (val: string) => void;
  assignedOrphan?: string;
  setAssignedOrphan?: (val: string) => void;
  orphans?: any[];
}

export const CourseModal: React.FC<CourseModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  title,
  setTitle,
  desc,
  setDesc,
  link,
  setLink,
  category,
  setCategory,
  duration,
  setDuration,
  assignedOrphan,
  setAssignedOrphan,
  orphans
}) => {
  const categories = ['Academic', 'Skills', 'Tech', 'Language', 'Other'];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share New Course</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#ff4444" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Course Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Basic Mathematics"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryRow}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catBtn, category === cat && styles.catBtnActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What will students learn?"
              value={desc}
              onChangeText={setDesc}
              multiline={true}
              numberOfLines={4}
            />

            <Text style={styles.label}>Course Link (YouTube/Drive)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://youtube.com/..."
              value={link}
              onChangeText={setLink}
              autoCapitalize="none"
            />

            {setDuration && (
              <View>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 4 Weeks, 12 Hours"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            )}

            {orphans && setAssignedOrphan && (
              <View>
                <Text style={styles.label}>Assign to Orphan (Optional)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.orphanScroller}>
                  <TouchableOpacity
                    style={[styles.orphanChip, !assignedOrphan && styles.orphanChipActive]}
                    onPress={() => setAssignedOrphan('')}
                  >
                    <Text style={[styles.orphanChipText, !assignedOrphan && styles.orphanChipTextActive]}>
                      All Orphans (General)
                    </Text>
                  </TouchableOpacity>
                  {orphans.map(o => (
                    <TouchableOpacity
                      key={o._id}
                      style={[styles.orphanChip, assignedOrphan === o._id && styles.orphanChipActive]}
                      onPress={() => setAssignedOrphan(o._id)}
                    >
                      <Text style={[styles.orphanChipText, assignedOrphan === o._id && styles.orphanChipTextActive]}>
                        {o.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.btnDisabled]}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Course</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catBtnActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  catBtnText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  catBtnTextActive: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: '#0f172a',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  orphanScroller: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  orphanChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orphanChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  orphanChipText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  orphanChipTextActive: {
    color: '#fff',
  },
});
