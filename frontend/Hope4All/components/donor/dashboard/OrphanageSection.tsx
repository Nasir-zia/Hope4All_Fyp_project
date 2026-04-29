import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrphanageSectionProps {
  orphanages: any[];
  onSelect: (o: any) => void;
}

export const OrphanageSection: React.FC<OrphanageSectionProps> = ({ orphanages, onSelect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Partner Orphanages</Text>
          <Text style={styles.subtitle}>Verified institutions you support</Text>
        </View>
        <View style={styles.iconBox}>
          <Ionicons name="business-outline" size={20} color="#0077cc" />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {orphanages.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No partner orphanages found yet.</Text>
          </View>
        ) : (
          orphanages.map((o) => (
            <TouchableOpacity key={o._id} style={styles.card} onPress={() => onSelect(o)}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="business" size={30} color="#fff" />
                </View>
              </View>
              <Text style={styles.name} numberOfLines={1}>{o.name}</Text>
              <Text style={styles.location}>{o.location?.city}</Text>
              <View style={styles.capacityBadge}>
                <Text style={styles.capacityText}>{o.capacity?.current}/{o.capacity?.max} Children</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 10 },
  emptyCard: { width: 300, padding: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' },
  card: { width: 150, backgroundColor: '#fff', borderRadius: 28, padding: 15, marginRight: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center' },
  avatarContainer: { width: 60, height: 60, borderRadius: 20, overflow: 'hidden', marginBottom: 12, backgroundColor: '#0077cc' },
  avatarPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '800', color: '#1e293b', marginBottom: 2, textAlign: 'center' },
  location: { fontSize: 11, color: '#64748b', fontWeight: '500', marginBottom: 8 },
  capacityBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  capacityText: { fontSize: 10, fontWeight: '700', color: '#16a34a' },
});
