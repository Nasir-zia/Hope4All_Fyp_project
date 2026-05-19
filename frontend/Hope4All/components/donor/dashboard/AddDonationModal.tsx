import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddDonationModalProps {
  visible: boolean;
  onClose: () => void;
  manualType: string;
  setManualType: (v: string) => void;
  manualUnits: string;
  setManualUnits: (v: string) => void;
  manualDesc: string;
  setManualDesc: (v: string) => void;
  manualPhoto: string | null;
  onPickPhoto: () => void;
  onSubmit: () => void;
  recipientName?: string;
  submitting?: boolean;
}

export const AddDonationModal: React.FC<AddDonationModalProps> = ({
  visible, onClose, manualType, setManualType, manualUnits, setManualUnits, manualDesc, setManualDesc, manualPhoto, onPickPhoto, onSubmit, recipientName,
  submitting
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{recipientName ? `Donate to ${recipientName}` : 'Log Manual Donation'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <Text style={styles.instruction}>
              {recipientName 
                ? `Specify details of the donation package you are sending directly to support ${recipientName}.` 
                : 'Already made a contribution? Log it here to keep track of your impact.'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Donation Type</Text>
              <TextInput style={styles.input} value={manualType} onChangeText={setManualType} placeholder="e.g. Winter Clothes, Books" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Units / Quantity</Text>
              <TextInput style={styles.input} value={manualUnits} onChangeText={setManualUnits} keyboardType="numeric" placeholder="e.g. 5" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput 
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                value={manualDesc} 
                onChangeText={setManualDesc} 
                placeholder="Where or how was this donated?" 
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Photo (Required for Stationery)</Text>
              <TouchableOpacity style={styles.photoPicker} onPress={onPickPhoto}>
                {manualPhoto ? (
                  <Image source={{ uri: manualPhoto }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera-outline" size={32} color="#94a3b8" />
                    <Text style={styles.photoPlaceholderText}>Capture/Upload Item Image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, submitting && { opacity: 0.7 }]} 
              onPress={onSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? 'Submitting...' : (recipientName ? 'Confirm Donation' : 'Save Record')}
              </Text>
            </TouchableOpacity>

            <View style={styles.addressInfoCard}>
              <Ionicons name="information-circle" size={24} color="#0284c7" />
              <View style={{ flex: 1 }}>
                <Text style={styles.addressInfoTitle}>Shipping Address</Text>
                <Text style={styles.addressInfoDetails}>Main Head Office, Faisalabad D Ground, Office #12</Text>
                <Text style={styles.addressInfoNote}>Please send your donation packages here and include your Donation ID.</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { height: '80%', backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  instruction: { fontSize: 14, color: '#64748b', lineHeight: 22, marginBottom: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', color: '#1e293b', fontSize: 15 },
  submitBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  photoPicker: { height: 180, backgroundColor: '#f8fafc', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#e2e8f0', overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  photoPlaceholderText: { fontSize: 13, color: '#94a3b8', fontWeight: '600' },
  addressInfoCard: { flexDirection: 'row', backgroundColor: '#f0f9ff', padding: 16, borderRadius: 16, marginTop: 20, gap: 12, borderWidth: 1, borderColor: '#bae6fd', alignItems: 'flex-start' },
  addressInfoTitle: { fontSize: 14, fontWeight: '800', color: '#0369a1', marginBottom: 4 },
  addressInfoDetails: { fontSize: 13, fontWeight: '700', color: '#0284c7', marginBottom: 6 },
  addressInfoNote: { fontSize: 12, color: '#0c4a6e', lineHeight: 18 },
});
