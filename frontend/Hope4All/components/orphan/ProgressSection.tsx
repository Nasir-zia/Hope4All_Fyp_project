import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Alert } from 'react-native';

import { getDownloadableUrl } from '../../utils/cloudinaryUtils';

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
                  {prog.achievementImage && (
                    <TouchableOpacity 
                      style={{ position: 'absolute', bottom: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, padding: 8 }}
                      onPress={async () => {
                        try {
                          const url = getDownloadableUrl(prog.achievementImage);
                          const supported = await Linking.canOpenURL(url);
                          if (supported) {
                            await Linking.openURL(url);
                          } else {
                            Alert.alert('Error', 'Unable to open link');
                          }
                        } catch (e) {
                          Alert.alert('Error', 'Could not open image.');
                        }
                      }}
                    >
                      <Ionicons name="download-outline" size={20} color="#16a34a" />
                    </TouchableOpacity>
                  )}
               </View>
               <View style={styles.progContent}>
                  <View style={styles.progTopRow}>
                    <Text style={styles.progTitle}>{prog.title}</Text>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                      <TouchableOpacity onPress={() => onDeleteProgress(prog._id)}>
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
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
  addBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#FF6B35', shadowOpacity: 0.3, shadowRadius: 10 },
  reportList: { gap: 18 },
  emptyCard: { padding: 40, alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 32, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', gap: 12 },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', fontSize: 14 },
  progCard: { backgroundColor: '#fff', borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  progImageContainer: { height: 180, backgroundColor: '#fff7ed', position: 'relative' },
  progImage: { width: '100%', height: '100%' },
  progIconPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  categoryBadge: { position: 'absolute', top: 15, left: 15, backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, shadowColor: '#FF6B35', shadowOpacity: 0.2, shadowRadius: 8 },
  categoryText: { fontSize: 10, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  progContent: { padding: 22 },
  progTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progTitle: { fontSize: 18, fontWeight: '900', color: '#1e293b' },
  progScore: { fontSize: 15, fontWeight: '800', color: '#FF6B35', marginBottom: 10 },
  progRemarks: { fontSize: 13, color: '#64748b', lineHeight: 20, marginBottom: 15 },
  progDate: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
});
