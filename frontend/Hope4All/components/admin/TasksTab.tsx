import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../../constants/Config';

interface TasksTabProps {
  tasks: any[];
  onAssignNew: () => void;
  onComplete: (id: string) => void;
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

export const TasksTab: React.FC<TasksTabProps> = ({ tasks, onAssignNew, onComplete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Volunteer Missions</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAssignNew}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Assign New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.taskList}>
        {tasks.map((task) => (
          <View key={task._id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{task.type?.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, task.status === 'completed' ? styles.statusCompleted : styles.statusPending]}>
                <Text style={styles.statusText}>{task.status?.toUpperCase()}</Text>
              </View>
            </View>
            
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDesc} numberOfLines={2}>{task.description}</Text>
            
            {task.proofImage && (
              <View style={styles.proofContainer}>
                <Text style={styles.proofLabel}>Submission Proof:</Text>
                <Image 
                  source={{ uri: getProofImageUri(task.proofImage) }} 
                  style={styles.proofImage} 
                  resizeMode="cover"
                />
              </View>
            )}
            
            <View style={styles.footer}>
              <View style={styles.volInfo}>
                <Ionicons name="person-circle-outline" size={16} color="#64748b" />
                <Text style={styles.volName}>{task.volunteerId?.username || 'Unknown'}</Text>
              </View>
              <View style={styles.priorityRow}>
                <View style={[styles.priorityDot, { backgroundColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981' }]} />
                <Text style={styles.priorityText}>{task.priority}</Text>
              </View>
            </View>

            {task.status !== 'completed' && (
              <TouchableOpacity 
                style={styles.adminCompleteBtn} 
                onPress={() => onComplete(task._id)}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
                <Text style={styles.adminCompleteText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {tasks.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={50} color="#cbd5e1" />
            <Text style={styles.emptyText}>No tasks assigned yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  addBtn: { flexDirection: 'row', backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignItems: 'center', gap: 4 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  taskList: { marginBottom: 20 },
  taskCard: { backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '800', color: '#64748b' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusPending: { backgroundColor: '#fff7ed' },
  statusCompleted: { backgroundColor: '#f0fdf4' },
  statusText: { fontSize: 9, fontWeight: '800' },
  taskTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  taskDesc: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f8fafc', paddingTop: 10 },
  volInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  volName: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: 12, fontWeight: '700', color: '#475569', textTransform: 'capitalize' },
  adminCompleteBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f0fdf4', 
    paddingVertical: 10, 
    borderRadius: 12, 
    marginTop: 15, 
    borderWidth: 1, 
    borderColor: '#dcfce7',
    gap: 8
  },
  adminCompleteText: { color: '#10b981', fontSize: 13, fontWeight: '800' },
  proofContainer: { marginTop: 10, marginBottom: 15 },
  proofLabel: { fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 5 },
  proofImage: { width: '100%', height: 120, borderRadius: 12, backgroundColor: '#f1f5f9' },
  empty: { alignItems: 'center', marginTop: 40, opacity: 0.5 },
  emptyText: { marginTop: 10, fontSize: 14, color: '#64748b', fontWeight: '600' },
});
