import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProgressSectionProps {
  reports: any[];
  onAddProgress: () => void;
  onDeleteProgress: (id: string) => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  reports, onAddProgress, onDeleteProgress
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>Showcase your growth and milestones</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAddProgress}>
          <Ionicons name="medal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.reportList}>
        {reports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>No achievements recorded yet.</Text>
          </View>
        ) : (
          reports.map((prog, idx) => (
            <View key={idx} style={styles.progCard}>
               <View style={styles.progImageContainer}>
                  {prog.achievementImage ? (
                    <Image source={{ uri: prog.achievementImage }} style={styles.progImage} />
                  ) : (
                    <View style={styles.progIconPlaceholder}>
                       <Ionicons name={getCategoryIcon(prog.category)} size={30} color="#0077cc" />
                    </View>
                  )}
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{prog.category}</Text>
                  </View>
               </View>
               <View style={styles.progContent}>
                  <View style={styles.progTopRow}>
                    <Text style={styles.progTitle}>{prog.title}</Text>
                    <TouchableOpacity onPress={() => onDeleteProgress(prog._id)}>
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.progScore}>Score: {prog.score}</Text>
                  <Text style={styles.progRemarks} numberOfLines={2}>{prog.remarks}</Text>
                  <Text style={styles.progDate}>{new Date(prog.createdAt).toLocaleDateString()}</Text>
               </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const getCategoryIcon = (cat: string) => {
  switch(cat) {
    case 'Academic': return 'school';
    case 'Sports': return 'fitness';
    case 'Behavioral': return 'heart';
    case 'Health': return 'medkit';
    default: return 'star';
  }
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleGroup: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#0077cc', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  reportList: { gap: 15 },
  emptyCard: { padding: 40, alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', gap: 10 },
  emptyText: { color: '#94a3b8', fontStyle: 'italic' },
  progCard: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  progImageContainer: { height: 160, backgroundColor: '#f1f5f9', position: 'relative' },
  progImage: { width: '100%', height: '100%' },
  progIconPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  categoryBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  categoryText: { fontSize: 10, fontWeight: '800', color: '#1e293b' },
  progContent: { padding: 18 },
  progTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  progScore: { fontSize: 14, fontWeight: '700', color: '#0077cc', marginBottom: 8 },
  progRemarks: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 12 },
  progDate: { fontSize: 11, color: '#94a3b8' },
});
