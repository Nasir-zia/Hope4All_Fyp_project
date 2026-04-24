import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';
import { createProgressApi } from '@/constants/api';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

interface AddProgressModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddProgressModal: React.FC<AddProgressModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { orphanProfile, loadExtras } = useOrphan();

  const [progTitle, setProgTitle] = useState('');
  const [progCategory, setProgCategory] = useState<'Academic' | 'Sports' | 'Behavioral' | 'Health'>('Academic');
  const [progScore, setProgScore] = useState('');
  const [progRemarks, setProgRemarks] = useState('');
  const [progImgUri, setProgImgUri] = useState<string | null>(null);
  const [submittingProg, setSubmittingProg] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProgImgUri(result.assets[0].uri);
    }
  };

  const handleAddProgress = async () => {
    if (!progTitle || !progScore) {
      Alert.alert("Missing Fields", "Please enter at least a title and score/grade.");
      return;
    }

    setSubmittingProg(true);
    try {
      const formData = new FormData();
      formData.append('orphanId', orphanProfile._id);
      formData.append('title', progTitle);
      formData.append('category', progCategory);
      formData.append('score', progScore);
      formData.append('remarks', progRemarks);

      if (progImgUri) {
        const picName = progImgUri.split('/').pop() || 'achievement.jpg';
        formData.append('achievementImage', {
          uri: progImgUri,
          name: picName,
          type: 'image/jpeg',
        } as any);
      }

      await createProgressApi(formData, user?.token || '');
      Alert.alert("Success", "Achievement saved successfully!");
      
      // Reset form
      setProgTitle('');
      setProgScore('');
      setProgRemarks('');
      setProgImgUri(null);
      
      loadExtras();
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not save achievement");
    } finally {
      setSubmittingProg(false);
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
        <View style={[styles.editModalContainer, { maxHeight: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Achievement</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Achievement Title</Text>
              <TextInput 
                style={styles.input} 
                value={progTitle} 
                onChangeText={setProgTitle} 
                placeholder="e.g. Matric Exam, Web Dev Course" 
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grade / Score</Text>
              <TextInput 
                style={styles.input} 
                value={progScore} 
                onChangeText={setProgScore} 
                placeholder="e.g. A+, 85%, Distinction" 
                placeholderTextColor="#94a3b8"
              />
            </View>

            <Text style={styles.label}>Category</Text>
            <View style={[styles.typeSelector, { marginBottom: 20 }]}>
              {(['Academic', 'Sports', 'Behavioral', 'Health'] as const).map(cat => (
                <TouchableOpacity 
                  key={cat}
                  style={[styles.typeBtn, progCategory === cat && styles.typeBtnSelected]}
                  onPress={() => setProgCategory(cat)}
                >
                  <Text style={[styles.typeBtnText, progCategory === cat && styles.typeBtnTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Remarks / Description</Text>
              <TextInput 
                style={[styles.input, { height: 100 }]} 
                value={progRemarks} 
                onChangeText={setProgRemarks} 
                placeholder="Describe your achievement..." 
                placeholderTextColor="#94a3b8"
                multiline
              />
            </View>

            <Text style={styles.label}>Certificate / Photo (Optional)</Text>
            <TouchableOpacity 
              style={[styles.pickerBtn, progImgUri && styles.pickerBtnActive]} 
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={22} color={progImgUri ? "#fff" : "#0077cc"} />
              <Text style={[styles.pickerBtnText, progImgUri && styles.pickerBtnTextActive]}>
                {progImgUri ? "Photo Selected" : "Upload Achievement Photo"}
              </Text>
              {progImgUri && <Ionicons name="checkmark-circle" size={18} color="#fff" style={{marginLeft: 'auto'}} />}
            </TouchableOpacity>

            {progImgUri && (
              <Image source={{ uri: progImgUri }} style={styles.progPreview} />
            )}

            <TouchableOpacity 
              style={[styles.primarySubmitBtn, submittingProg && styles.btnDisabled]} 
              onPress={handleAddProgress}
              disabled={submittingProg}
            >
              {submittingProg ? <ActivityIndicator color="#fff" /> : <Text style={styles.primarySubmitBtnText}>Save Achievement</Text>}
            </TouchableOpacity>
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
