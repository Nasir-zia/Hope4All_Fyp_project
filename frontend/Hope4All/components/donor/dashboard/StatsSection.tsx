import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatsSectionProps {
  totalDonated: number;
  orphansCount: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ totalDonated, orphansCount }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
         <View style={[styles.iconBox, { backgroundColor: '#3b82f6' }]}>
           <Ionicons name="heart" size={20} color="#fff" />
         </View>
         <Text style={styles.statNumber}>{totalDonated}</Text>
         <Text style={styles.statLabel}>Total Units</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: '#fdf2f8' }]}>
         <View style={[styles.iconBox, { backgroundColor: '#ec4899' }]}>
           <Ionicons name="people" size={20} color="#fff" />
         </View>
         <Text style={styles.statNumber}>{orphansCount}</Text>
         <Text style={styles.statLabel}>Lives Touched</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
});
