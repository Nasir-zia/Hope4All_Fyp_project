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
import { submitMaterialRequest } from '@/constants/api';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

interface MaterialRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MaterialRequestModal: React.FC<MaterialRequestModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { orphanProfile, loadExtras } = useOrphan();

  const [reqType, setReqType] = useState<'stationery' | 'uniforms' | 'books' | 'other'>('stationery');
  const [reqDesc, setReqDesc] = useState('');
  const [reqUnits, setReqUnits] = useState('1');
  const [reqSchool, setReqSchool] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddMaterialRequest = async () => {
    if (!reqDesc || !reqSchool || !reqUnits) {
      Alert.alert("Missing Fields", "Please enter description, school, and units.");
      return;
    }

    setSubmitting(true);
    try {
      await submitMaterialRequest({
        orphanId: orphanProfile._id,
        orphanageId: orphanProfile.orphanageId || "650000000000000000000001", 
        type: reqType,
        units: Number(reqUnits),
        unitType: reqType === 'stationery' ? 'items' : 'sets',
        description: reqDesc,
        school: reqSchool
      }, user?.token || '');

      Alert.alert("Success", "Material request submitted!");
      setReqDesc('');
      setReqSchool('');
      setReqUnits('1');
      
      loadExtras();
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not submit request");
    } finally {
      setSubmitting(false);
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
            <Text style={styles.modalTitle}>Request Supplies</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.typeSelector}>
            {(['stationery', 'uniforms', 'books', 'other'] as const).map(t => (
              <TouchableOpacity 
                key={t}
                style={[styles.typeBtn, reqType === t && styles.typeBtnSelected]}
                onPress={() => setReqType(t)}
              >
                <Text style={[styles.typeBtnText, reqType === t && styles.typeBtnTextSelected]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>School / Academy Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Where do you study?" 
              value={reqSchool}
              onChangeText={setReqSchool}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 5 notebooks, 2 pens, 1 school bag" 
              value={reqDesc}
              onChangeText={setReqDesc}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Units / Sets</Text>
            <TextInput 
              style={styles.input} 
              placeholder="1" 
              value={reqUnits}
              onChangeText={setReqUnits}
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity 
            style={[styles.primarySubmitBtn, submitting && styles.btnDisabled]} 
            onPress={handleAddMaterialRequest}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primarySubmitBtnText}>Submit Request</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
