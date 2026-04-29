import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RequirementModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const RequirementModal: React.FC<RequirementModalProps> = ({ visible, onClose, onSubmit, loading }) => {
  const [type, setType] = useState('other');
  const [units, setUnits] = useState('');
  const [unitType, setUnitType] = useState('');
  const [description, setDescription] = useState('');

  const types = ['school_fees', 'stationery', 'uniforms', 'books', 'other'];

  const handleSubmit = () => {
    onSubmit({ type, units: parseInt(units), unitType, description });
    setType('other'); setUnits(''); setUnitType(''); setDescription('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Institution Need</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.label}>Need Category</Text>
            <View style={styles.typeRow}>
              {types.map(t => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.typeChip, type === t && styles.typeChipActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>
                    {t.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe what you need and why..."
              multiline numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 50"
                  keyboardType="numeric"
                  value={units}
                  onChangeText={setUnits}
                />
              </View>
              <View style={{ width: 15 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Unit Type</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Items, Packs"
                  value={unitType}
                  onChangeText={setUnitType}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Requirement</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 25, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  textArea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  typeChipActive: { backgroundColor: '#9333ea', borderColor: '#9333ea' },
  typeChipText: { fontSize: 12, color: '#64748b', fontWeight: '700' },
  typeChipTextActive: { color: '#fff' },
  submitBtn: { backgroundColor: '#9333ea', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
