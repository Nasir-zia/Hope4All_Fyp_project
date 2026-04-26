import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VolunteerTaskCardProps {
  task: any;
  onUpdateStatus: (id: string, status: string) => void;
}

export const VolunteerTaskCard: React.FC<VolunteerTaskCardProps> = ({ task, onUpdateStatus }) => {
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
            style={[styles.actionBtn, styles.completeBtn]} 
            onPress={() => onUpdateStatus(task._id, 'completed')}
          >
            <Text style={styles.actionBtnText}>Complete</Text>
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
  completeBtn: {
    backgroundColor: '#10b981',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
