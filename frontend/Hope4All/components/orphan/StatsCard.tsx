import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatsCardProps {
  coursesCount: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ coursesCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Learning Journey</Text>
      <View style={styles.row}>
        <View style={[styles.statBox, { backgroundColor: '#eff6ff' }]}>
           <View style={[styles.iconCircle, { backgroundColor: '#3b82f6' }]}>
             <Ionicons name="book" size={20} color="#fff" />
           </View>
           <Text style={styles.statNumber}>{coursesCount}</Text>
           <Text style={styles.statLabel}>Available Courses</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 10, // Adjusted from -20 to 10 to avoid overlap
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
  },
  iconCircle: {
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
