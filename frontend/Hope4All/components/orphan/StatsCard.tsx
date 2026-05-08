import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatsCardProps {
  coursesCount: number;
  aidCount: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ coursesCount, aidCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Activity</Text>
      <View style={styles.row}>
        <View style={[styles.statBox, { backgroundColor: '#f0f9ff' }]}>
           <View style={[styles.iconCircle, { backgroundColor: '#0ea5e9' }]}>
             <Ionicons name="book" size={20} color="#fff" />
           </View>
           <Text style={styles.statNumber}>{coursesCount}</Text>
           <Text style={styles.statLabel}>Courses</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#f0fdf4' }]}>
           <View style={[styles.iconCircle, { backgroundColor: '#10b981' }]}>
             <Ionicons name="gift" size={20} color="#fff" />
           </View>
           <Text style={styles.statNumber}>{aidCount}</Text>
           <Text style={styles.statLabel}>Aid Received</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 22,
    backgroundColor: '#fff',
    borderRadius: 32,
    marginHorizontal: 20,
    marginTop: -25, // Overlap with the header for a modern look
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  statBox: {
    flex: 1,
    padding: 18,
    borderRadius: 24,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 4,
  },
});
