import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RequirementsSectionProps {
  requirements: any[];
  onAdd: () => void;
}

export const RequirementsSection: React.FC<RequirementsSectionProps> = ({ requirements, onAdd }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Institution Requirements</Text>
          <Text style={styles.subtitle}>Manage what your orphanage needs</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Ionicons name="add-circle" size={24} color="#9333ea" />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {requirements.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No requirements added yet.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={onAdd}>
              <Text style={styles.emptyBtnText}>Add Your First Need</Text>
            </TouchableOpacity>
          </View>
        ) : (
          requirements.map((req) => (
            <View key={req._id} style={styles.card}>
              <View style={styles.cardMain}>
                <View style={[styles.typeBadge, { backgroundColor: '#f5f3ff' }]}>
                  <Text style={styles.typeText}>{req.type.toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: req.status === 'pending' ? '#fef3c7' : '#dcfce7' }]}>
                  <Text style={[styles.statusText, { color: req.status === 'pending' ? '#d97706' : '#16a34a' }]}>
                    {req.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.desc}>{req.description}</Text>
              <View style={styles.footer}>
                <Ionicons name="layers-outline" size={14} color="#64748b" />
                <Text style={styles.footerText}>{req.units} {req.unitType}</Text>
                <View style={styles.dot} />
                <Text style={styles.footerText}>{new Date(req.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f5f3ff', justifyContent: 'center', alignItems: 'center' },
  list: { gap: 15 },
  emptyCard: { padding: 40, backgroundColor: '#f8fafc', borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  emptyText: { color: '#64748b', marginBottom: 15, fontStyle: 'italic' },
  emptyBtn: { backgroundColor: '#9333ea', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 24, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  cardMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '800', color: '#9333ea' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },
  desc: { fontSize: 15, color: '#1e293b', fontWeight: '600', marginBottom: 15, lineHeight: 22 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerText: { fontSize: 12, color: '#64748b' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1' },
});
