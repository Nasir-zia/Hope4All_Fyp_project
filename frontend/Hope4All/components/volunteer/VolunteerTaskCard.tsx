import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../constants/Config';

interface VolunteerTaskCardProps {
  task: any;
  onUpdateStatus: (id: string, status: string) => void;
  onSubmitProof: (id: string) => void;
}

const getProofImageUri = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.replace(/\\/g, '/');
  const baseUrl = CONFIG.API_BASE_URL.replace('/api', '');
  return `${baseUrl}/${normalizedPath}`;
};

export const VolunteerTaskCard: React.FC<VolunteerTaskCardProps> = ({ task, onUpdateStatus, onSubmitProof }) => {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: task.priority === 'high' ? '#ff4444' : '#ffbb33' }]}>
          <Text style={styles.priorityText}>{task.priority?.toUpperCase()}</Text>
        </View>
        <Text style={styles.taskStatus}>{task.status?.replace('_', ' ').toUpperCase()}</Text>
      </View>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDesc}>{task.description}</Text>
      
      {task.proofImage && (
        <View style={styles.proofContainer}>
          <Text style={styles.proofLabel}>Submitted Proof:</Text>
          <Image 
            source={{ uri: getProofImageUri(task.proofImage) }} 
            style={styles.proofImage} 
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.taskFooter}>
        <Ionicons name="location-outline" size={14} color="#666" />
        <Text style={styles.taskLocation}>{task.orphanageId?.name || 'Central Office'}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.taskDate}>{new Date(task.date).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.btnRow}>
        {task.status === 'assigned' && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.progressBtn]} 
            onPress={() => onUpdateStatus(task._id, 'in_progress')}
          >
            <Text style={styles.actionBtnText}>Start Task</Text>
          </TouchableOpacity>
        )}
        {task.status === 'in_progress' && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.proofBtn]} 
            onPress={() => onSubmitProof(task._id)}
          >
            <Ionicons name="camera" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Submit Proof</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  taskDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  taskLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressBtn: {
    backgroundColor: '#0077cc',
  },
  proofBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    gap: 8,
  },
  completeBtn: {
    backgroundColor: '#10b981',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  proofContainer: {
    marginTop: 5,
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 15,
  },
  proofLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
  },
  proofImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
});
