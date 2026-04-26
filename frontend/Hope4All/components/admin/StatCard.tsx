import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  return (
    <View style={[styles.statCard, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLab}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statVal: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#1e293b',
  },
  statLab: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});
