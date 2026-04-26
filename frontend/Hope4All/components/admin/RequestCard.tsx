import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RequestCardProps {
  request: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onApprove, onReject }) => {
  return (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.reqTypeBadge}>
          <Text style={styles.badgeText}>{request.type?.toUpperCase()}</Text>
        </View>
        <Text style={styles.statusLabel}>{request.status?.toUpperCase()}</Text>
      </View>
      <Text style={styles.reqTitle}>{request.description}</Text>
      <Text style={styles.reqDetail}>Orphan: {request.orphanId?.name || 'Unknown'}</Text>
      <Text style={styles.reqDetail}>Quantity: {request.units} {request.unitType}</Text>
      
      {request.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.approveBtn} 
            onPress={() => onApprove(request._id)}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.rejectBtn} 
            onPress={() => onReject(request._id)}
          >
            <Ionicons name="close" size={18} color="#fff" />
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reqTypeBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  reqDetail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
