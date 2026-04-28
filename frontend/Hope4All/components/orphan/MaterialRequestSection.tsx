import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MaterialRequestSectionProps {
  requests: any[];
  reqType: 'stationery' | 'uniforms' | 'books' | 'other';
  setReqType: (val: 'stationery' | 'uniforms' | 'books' | 'other') => void;
  reqDesc: string;
  setReqDesc: (val: string) => void;
  reqUnits: string;
  setReqUnits: (val: string) => void;
  reqSchool: string;
  setReqSchool: (val: string) => void;
  onAddRequest: () => void;
  showModal: boolean;
  setShowModal: (val: boolean) => void;
}

export const MaterialRequestSection: React.FC<MaterialRequestSectionProps> = ({
  requests, reqType, setReqType, reqDesc, setReqDesc, reqUnits, setReqUnits, reqSchool, setReqSchool,
  onAddRequest, showModal, setShowModal
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Material Requests</Text>
          <Text style={styles.subtitle}>Request school supplies and essentials</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroller}>
        {requests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cube-outline" size={28} color="#cbd5e1" />
            <Text style={styles.emptyText}>No requests made yet.</Text>
          </View>
        ) : (
          requests.map((req, idx) => (
            <View key={idx} style={styles.reqCard}>
              <View style={styles.reqHeader}>
                <View style={[styles.typeIcon, { backgroundColor: getTypeColor(req.type) }]}>
                  <Ionicons name={getTypeIcon(req.type)} size={18} color="#fff" />
                </View>
                <View style={[
                  styles.statusBadge,
                  req.status === 'approved' ? styles.statusApproved :
                  req.status === 'pledged' ? styles.statusPledged : styles.statusPending
                ]}>
                  <Text style={styles.statusText}>{req.status?.toUpperCase() || 'PENDING'}</Text>
                </View>
              </View>
              <Text style={styles.reqTitle}>{req.type.charAt(0).toUpperCase() + req.type.slice(1)}</Text>
              <Text style={styles.reqUnits}>{req.units} {req.unitType || 'Units'}</Text>
              <Text style={styles.reqDate}>{new Date(req.createdAt).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Request Modal - proper Modal component to avoid overlay issues */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>New Material Request</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Request Type</Text>
            <View style={styles.typeSelector}>
              {(['stationery', 'uniforms', 'books', 'other'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, reqType === t && styles.typeChipActive]}
                  onPress={() => setReqType(t)}
                >
                  <Ionicons
                    name={getTypeIcon(t)}
                    size={14}
                    color={reqType === t ? '#fff' : '#475569'}
                  />
                  <Text style={[styles.typeChipText, reqType === t && styles.typeChipTextActive]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>School / Institution</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Government Primary School"
                value={reqSchool}
                onChangeText={setReqSchool}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Details</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Blue ballpoint pens"
                value={reqDesc}
                onChangeText={setReqDesc}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity (Units)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5"
                value={reqUnits}
                onChangeText={setReqUnits}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={onAddRequest}>
              <Text style={styles.submitBtnText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const getTypeIcon = (type: string): any => {
  switch (type) {
    case 'stationery': return 'pencil';
    case 'uniforms': return 'shirt';
    case 'books': return 'book';
    default: return 'cube';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'stationery': return '#3b82f6';
    case 'uniforms': return '#f59e0b';
    case 'books': return '#10b981';
    default: return '#6366f1';
  }
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  titleGroup: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#0077cc', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  historyScroller: { paddingVertical: 5 },
  emptyCard: {
    width: 280, height: 120, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f8fafc', borderRadius: 24, borderStyle: 'dashed',
    borderWidth: 1, borderColor: '#cbd5e1', gap: 8,
  },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', fontSize: 13 },
  reqCard: {
    width: 165, backgroundColor: '#fff', padding: 16, borderRadius: 24,
    marginRight: 15, borderWidth: 1, borderColor: '#f1f5f9', elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
  },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  typeIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  statusPending: { backgroundColor: '#fff7ed' },
  statusApproved: { backgroundColor: '#f0fdf4' },
  statusPledged: { backgroundColor: '#eff6ff' },
  statusText: { fontSize: 8, fontWeight: '800', color: '#64748b' },
  reqTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  reqUnits: { fontSize: 13, color: '#64748b', marginTop: 4 },
  reqDate: { fontSize: 11, color: '#94a3b8', marginTop: 8 },

  // Modal styles (no overlay issues)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 28,
    paddingBottom: 40,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  formTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 12 },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  typeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14,
    backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0',
  },
  typeChipActive: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  typeChipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  typeChipTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: '#f8fafc', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#e2e8f0', color: '#1e293b', fontSize: 15,
  },
  submitBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
