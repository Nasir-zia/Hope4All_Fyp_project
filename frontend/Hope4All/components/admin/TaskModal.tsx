import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  taskTitle: string;
  setTaskTitle: (text: string) => void;
  taskDesc: string;
  setTaskDesc: (text: string) => void;
  volunteers: any[];
  selectedVolunteer: string;
  setSelectedVolunteer: (id: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onConfirm,
  submitting,
  taskTitle,
  setTaskTitle,
  taskDesc,
  setTaskDesc,
  volunteers,
  selectedVolunteer,
  setSelectedVolunteer
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Assign Mission</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TextInput 
            style={styles.input} 
            placeholder="Task Title" 
            value={taskTitle} 
            onChangeText={setTaskTitle} 
          />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Detailed instructions..."
            multiline
            value={taskDesc}
            onChangeText={setTaskDesc}
          />

          <Text style={styles.label}>Assign to Volunteer</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.volSelect}>
            <TouchableOpacity
              style={[styles.volChip, selectedVolunteer === 'all' && { backgroundColor: '#0077cc', borderColor: '#0077cc' }]}
              onPress={() => setSelectedVolunteer('all')}
            >
              <Ionicons name="people" size={14} color={selectedVolunteer === 'all' ? '#fff' : '#64748b'} style={{ marginRight: 4 }} />
              <Text style={[styles.volChipText, selectedVolunteer === 'all' && { color: '#fff' }]}>
                Everyone
              </Text>
            </TouchableOpacity>

            {volunteers.map(v => (
              <TouchableOpacity
                key={v._id}
                style={[styles.volChip, selectedVolunteer === v._id && styles.volChipActive]}
                onPress={() => setSelectedVolunteer(v._id)}
              >
                <Text style={[styles.volChipText, selectedVolunteer === v._id && styles.volChipTextActive]}>
                  {v.username || v.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.btnDisabled]}
            onPress={onConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnTextLarge}>Confirm Assignment</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
