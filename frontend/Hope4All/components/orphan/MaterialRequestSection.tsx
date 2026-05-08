import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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
  isUrgent: boolean;
  setIsUrgent: (val: boolean) => void;
  isSubmitting?: boolean;
}

export const MaterialRequestSection: React.FC<MaterialRequestSectionProps> = ({
  requests, reqType, setReqType, reqDesc, setReqDesc, reqUnits, setReqUnits, reqSchool, setReqSchool,
  onAddRequest, showModal, setShowModal, isUrgent, setIsUrgent, isSubmitting = false
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

            <View style={styles.inputGroup}>
              <TouchableOpacity 
                style={[styles.urgentToggle, isUrgent && styles.urgentToggleActive]}
                onPress={() => setIsUrgent(!isUrgent)}
              >
                <Ionicons 
                  name={isUrgent ? "flash" : "flash-outline"} 
                  size={18} 
                  color={isUrgent ? "#fff" : "#64748b"} 
                />
                <Text style={[styles.urgentToggleText, isUrgent && styles.urgentToggleTextActive]}>
                  Mark as Urgent Need
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} 
              onPress={onAddRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Request</Text>
              )}
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
  addBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#FF6B35', shadowOpacity: 0.3, shadowRadius: 10 },
  historyScroller: { paddingVertical: 10 },
  emptyCard: {
    width: 300, height: 140, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed',
    borderWidth: 1, borderColor: '#cbd5e1', gap: 10,
  },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', fontSize: 14 },
  reqCard: {
    width: 180, backgroundColor: '#fff', padding: 20, borderRadius: 32,
    marginRight: 18, borderWidth: 1, borderColor: '#f1f5f9', elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 15,
  },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  typeIcon: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusPending: { backgroundColor: '#fff7ed' },
  statusApproved: { backgroundColor: '#f0fdf4' },
  statusPledged: { backgroundColor: '#eff6ff' },
  statusText: { fontSize: 8, fontWeight: '900', color: '#64748b', letterSpacing: 0.5 },
  reqTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  reqUnits: { fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: '600' },
  reqDate: { fontSize: 11, color: '#94a3b8', marginTop: 12 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  formTitle: { fontSize: 22, fontWeight: '900', color: '#1e293b', letterSpacing: 0.5 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '800', color: '#475569', marginBottom: 15 },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 },
  typeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16,
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0',
  },
  typeChipActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  typeChipText: { fontSize: 13, color: '#475569', fontWeight: '700' },
  typeChipTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '800', color: '#64748b', marginBottom: 10, marginLeft: 4 },
  input: {
    backgroundColor: '#f8fafc', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: '#e2e8f0', color: '#1e293b', fontSize: 15, fontWeight: '600',
  },
  submitBtn: { backgroundColor: '#FF6B35', padding: 20, borderRadius: 22, alignItems: 'center', marginTop: 10, elevation: 6, shadowColor: '#FF6B35', shadowOpacity: 0.3, shadowRadius: 15, minHeight: 60, justifyContent: 'center' },
  submitBtnDisabled: { backgroundColor: '#cbd5e1', shadowOpacity: 0 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  urgentToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, borderRadius: 18, backgroundColor: '#f8fafc',
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  urgentToggleActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  urgentToggleText: {
    fontSize: 14, fontWeight: '800', color: '#64748b',
  },
  urgentToggleTextActive: {
    color: '#fff',
  },
});
