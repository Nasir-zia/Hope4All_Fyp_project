import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrphan } from '@/contexts/OrphanContext';
import { deleteProgressApi } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { orphanStyles as styles } from '@/styles/orphanStyles';

interface FullProgressViewProps {
  onBack: () => void;
  onAddNew: () => void;
}

export const FullProgressView: React.FC<FullProgressViewProps> = ({ onBack, onAddNew }) => {
  const { progressReports, loadExtras } = useOrphan();
  const { user } = useAuth();

  const handleDeleteProgress = (id: string) => {
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProgressApi(id, user?.token || '');
            loadExtras();
          } catch (err) {
            Alert.alert('Error', 'Could not delete record');
          }
        }
      }
    ]);
  };

  return (
    <View style={[styles.container, { paddingHorizontal: 20 }]}>
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={onBack} style={styles.viewBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.viewBackText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addFullBtn} onPress={onAddNew}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addFullBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.viewTitle}>My Achievements</Text>
      <Text style={styles.viewSub}>A complete history of your milestones.</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        {progressReports.length === 0 ? (
          <View style={styles.emptyView}>
            <Ionicons name="medal-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyViewText}>No achievements yet.</Text>
          </View>
        ) : (
          progressReports.map((report, idx) => (
            <View key={idx} style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {report.achievementImage ? (
                  <Image source={{ uri: report.achievementImage }} style={styles.progThumbLarge} />
                ) : (
                  <View style={[styles.progThumbLarge, styles.progThumbPlaceholder]}>
                    <Ionicons name="medal-outline" size={24} color="#999" />
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.feeTitle}>{report.title}</Text>
                  <Text style={styles.feeDate}>{report.category} • {new Date(report.date).toLocaleDateString()}</Text>
                  {report.remarks && <Text style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{report.remarks}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' }}>{report.score}</Text>
                  <TouchableOpacity onPress={() => handleDeleteProgress(report._id)} style={styles.deleteCircleLarge}>
                    <Ionicons name="trash-outline" size={16} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
