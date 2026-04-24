import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { createOrphanFee } from '@/constants/api';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

interface AddFeeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddFeeModal: React.FC<AddFeeModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { orphanProfile, loadFees } = useOrphan();

  const [feeTitle, setFeeTitle] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeDate, setFeeDate] = useState('');
  const [submittingFee, setSubmittingFee] = useState(false);

  const handleAddFee = async () => {
    if (!feeTitle || !feeAmount || !feeDate) {
      Alert.alert("Missing Fields", "Please enter title, amount, and due date (YYYY-MM-DD).");
      return;
    }
    
    setSubmittingFee(true);
    try {
      await createOrphanFee({
        orphanId: orphanProfile._id,
        title: feeTitle,
        amount: Number(feeAmount),
        dueDate: feeDate
      }, user?.token || '');
      
      Alert.alert("Success", "Fee request added successfully!");
      setFeeTitle('');
      setFeeAmount('');
      setFeeDate('');
      loadFees();
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not add fee");
    } finally {
      setSubmittingFee(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.editModalContainer, { height: 'auto', paddingBottom: 40 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Request Fee Support</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fee Title</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. School Term 1 Fee" 
              value={feeTitle}
              onChangeText={setFeeTitle}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount ($)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 50" 
              value={feeAmount}
              onChangeText={setFeeAmount}
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TextInput 
              style={styles.input} 
              placeholder="YYYY-MM-DD" 
              value={feeDate}
              onChangeText={setFeeDate}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity 
            style={[styles.primarySubmitBtn, submittingFee && styles.btnDisabled]} 
            onPress={handleAddFee} 
            disabled={submittingFee}
          >
            {submittingFee ? <ActivityIndicator color="#fff" /> : <Text style={styles.primarySubmitBtnText}>Submit Request</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
