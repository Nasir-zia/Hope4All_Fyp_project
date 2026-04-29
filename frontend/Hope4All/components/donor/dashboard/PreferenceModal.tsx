import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PreferenceModalProps {
  visible: boolean;
  onClose: () => void;
  causeOptions: string[];
  tempCauses: string[];
  toggleTempCause: (cause: string) => void;
  onUpdate: () => void;
}

export const PreferenceModal: React.FC<PreferenceModalProps> = ({
  visible, onClose, causeOptions, tempCauses, toggleTempCause, onUpdate
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Donation Preferences</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Text style={styles.instruction}>Select the causes you are most passionate about to personalize your dashboard needs.</Text>
            
            <View style={styles.chipGrid}>
              {causeOptions.map((cause) => {
                const isSelected = tempCauses.includes(cause);
                return (
                  <TouchableOpacity 
                    key={cause} 
                    style={[styles.chip, isSelected && styles.chipSelected]} 
                    onPress={() => toggleTempCause(cause)}
                  >
                    <Ionicons 
                      name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
                      size={18} 
                      color={isSelected ? "#fff" : "#0077cc"} 
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{cause}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={onUpdate}>
              <Text style={styles.saveBtnText}>Save Preferences</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { height: '60%', backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  instruction: { fontSize: 14, color: '#64748b', lineHeight: 22, marginBottom: 25 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#e0f2fe' },
  chipSelected: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  chipText: { fontSize: 14, fontWeight: '700', color: '#0077cc' },
  chipTextSelected: { color: '#fff' },
  saveBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 20, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
