import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrphan } from '@/contexts/OrphanContext';
import { deleteProgressApi } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { orphanStyles as styles } from '@/styles/orphanStyles';

export const ProgressSection: React.FC<{ onViewAll: () => void }> = ({ onViewAll }) => {
  const { progressReports, loadExtras } = useOrphan();
  const { user } = useAuth();

  const handleDeleteProgress = (id: string) => {
    Alert.alert('Delete Achievement', 'Are you sure you want to remove this record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProgressApi(id, user?.token || '');
            loadExtras();
          } catch (err) {
            Alert.alert('Error', 'Could not delete achievement');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={{ color: '#0077cc', fontWeight: 'bold' }}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {progressReports.length === 0 ? (
        <Text style={styles.emptyText}>No achievements yet. Click Add New to start!</Text>
      ) : (
        progressReports.slice(0, 3).map((report, idx) => (
          <View key={idx} style={styles.feeItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {report.achievementImage ? (
                <Image source={{ uri: report.achievementImage }} style={styles.progThumb} />
              ) : (
                <View style={[styles.progThumb, styles.progThumbPlaceholder]}>
                  <Ionicons name="medal-outline" size={20} color="#94a3b8" />
                </View>
              )}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.feeTitle}>{report.title}</Text>
                <Text style={styles.feeDate}>{report.category} • {new Date(report.date).toLocaleDateString()}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDeleteProgress(report._id)} style={styles.deleteCircle}>
              <Ionicons name="trash-outline" size={14} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};
