import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MaterialRequestCardProps {
  request: any;
}

export const MaterialRequestCard: React.FC<MaterialRequestCardProps> = ({ request }) => {
  return (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{request.type?.toUpperCase()}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          request.status === 'pending' ? styles.statusPendingBg : 
          request.status === 'approved' ? styles.statusApprovedBg : 
          styles.statusFulfilledBg
        ]}>
          <Text style={styles.statusBadgeText}>{request.status?.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.reqTitle}>{request.description}</Text>
      <View style={styles.reqDetailRow}>
        <Ionicons name="cube-outline" size={14} color="#64748b" />
        <Text style={styles.reqDetailText}>{request.units} {request.unitType}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusPendingBg: { backgroundColor: '#f59e0b' },
  statusApprovedBg: { backgroundColor: '#10b981' },
  statusFulfilledBg: { backgroundColor: '#3b82f6' },
  reqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  reqDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reqDetailText: {
    fontSize: 13,
    color: '#64748b',
  },
});
