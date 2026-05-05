import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PreferenceModalProps {
  visible: boolean;
  onClose: () => void;
  causeOptions: string[];
  areaOptions: string[];
  levelOptions: string[];
  tempCauses: string[];
  tempAreas: string[];
  tempLevels: string[];
  toggleTempItem: (list: string[], setter: (val: string[]) => void, item: string) => void;
  setTempCauses: (val: string[]) => void;
  setTempAreas: (val: string[]) => void;
  setTempLevels: (val: string[]) => void;
  urgentOnly: boolean;
  setUrgentOnly: (val: boolean) => void;
  onUpdate: () => void;
}

export const PreferenceModal: React.FC<PreferenceModalProps> = ({
  visible, onClose, causeOptions, areaOptions, levelOptions, 
  tempCauses, tempAreas, tempLevels, toggleTempItem,
  setTempCauses, setTempAreas, setTempLevels,
  urgentOnly, setUrgentOnly, onUpdate
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
            <Text style={styles.instruction}>Personalize your dashboard by selecting the areas, age groups, and causes you support.</Text>
            
            <Text style={styles.groupLabel}>Preferred Areas</Text>
            <View style={styles.chipGrid}>
              {areaOptions.map((area) => {
                const isSelected = tempAreas.includes(area);
                return (
                  <TouchableOpacity 
                    key={area} 
                    style={[styles.chip, isSelected && styles.chipSelected]} 
                    onPress={() => toggleTempItem(tempAreas, setTempAreas, area)}
                  >
                    <Ionicons 
                      name={isSelected ? "location" : "location-outline"} 
                      size={16} 
                      color={isSelected ? "#fff" : "#0077cc"} 
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{area}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.groupLabel}>School Level / Age Group</Text>
            <View style={styles.chipGrid}>
              {levelOptions.map((level) => {
                const isSelected = tempLevels.includes(level);
                return (
                  <TouchableOpacity 
                    key={level} 
                    style={[styles.chip, isSelected && styles.chipSelected]} 
                    onPress={() => toggleTempItem(tempLevels, setTempLevels, level)}
                  >
                    <Ionicons 
                      name={isSelected ? "school" : "school-outline"} 
                      size={16} 
                      color={isSelected ? "#fff" : "#0077cc"} 
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{level}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.groupLabel}>Cause Categories</Text>
            <View style={styles.chipGrid}>
              {causeOptions.map((cause) => {
                const isSelected = tempCauses.includes(cause);
                return (
                  <TouchableOpacity 
                    key={cause} 
                    style={[styles.chip, isSelected && styles.chipSelected]} 
                    onPress={() => toggleTempItem(tempCauses, setTempCauses, cause)}
                  >
                    <Ionicons 
                      name={isSelected ? "heart" : "heart-outline"} 
                      size={16} 
                      color={isSelected ? "#fff" : "#0077cc"} 
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{cause.replace('_', ' ')}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.urgentRow}>
              <View style={styles.urgentLabelGroup}>
                <Text style={styles.urgentTitle}>Urgent Only</Text>
                <Text style={styles.urgentSubtitle}>Prioritize critical needs first</Text>
              </View>
              <TouchableOpacity 
                style={[styles.toggleBase, urgentOnly && styles.toggleActive]}
                onPress={() => setUrgentOnly(!urgentOnly)}
              >
                <View style={[styles.toggleCircle, urgentOnly && styles.toggleCircleActive]} />
              </TouchableOpacity>
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
  container: { height: '85%', backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  instruction: { fontSize: 13, color: '#64748b', lineHeight: 20, marginBottom: 20 },
  groupLabel: { fontSize: 15, fontWeight: '800', color: '#475569', marginBottom: 12, marginTop: 5 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: '#f0f9ff', borderWidth: 1, borderColor: '#e0f2fe' },
  chipSelected: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#0077cc' },
  chipTextSelected: { color: '#fff' },
  saveBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 20, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  urgentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 4 },
  urgentLabelGroup: { flex: 1 },
  urgentTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  urgentSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  toggleBase: { width: 50, height: 28, borderRadius: 14, backgroundColor: '#e2e8f0', padding: 3 },
  toggleActive: { backgroundColor: '#ef4444' },
  toggleCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  toggleCircleActive: { alignSelf: 'flex-end' },
});
