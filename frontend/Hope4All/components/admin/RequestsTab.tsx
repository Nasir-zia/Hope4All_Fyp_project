import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface RequestsTabProps {
  requests: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({ requests, onApprove, onReject }) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Review Queue</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{requests.length} Total</Text>
        </View>
      </View>
      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No pending requests to review.</Text>
        </View>
      ) : (
        requests.map((req) => (
          <View key={req._id} style={styles.requestCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.reqTypeBadge, { backgroundColor: req.isInstitutional ? '#f5f3ff' : '#f1f5f9' }]}>
                <Text style={[styles.badgeText, req.isInstitutional && { color: '#9333ea' }]}>
                  {req.isInstitutional ? 'INSTITUTION' : req.type.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: req.status === 'pending' ? '#fef3c7' : '#dcfce7' }]}>
                <Text style={[styles.statusLabel, { color: req.status === 'pending' ? '#d97706' : '#16a34a' }]}>
                  {req.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.reqTitle}>{req.description}</Text>
            <View style={styles.reqMeta}>
              <Ionicons name="person-outline" size={14} color="#64748b" />
              <Text style={styles.reqDetail}>{req.orphanId?.name || 'Unknown Orphan'}</Text>
              <View style={styles.dot} />
              <Ionicons name="business-outline" size={14} color="#64748b" />
              <Text style={styles.reqDetail}>{req.orphanageId?.name || 'Direct'}</Text>
            </View>

            {req.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => onApprove(req._id)}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(req._id)}>
                  <Ionicons name="close-circle" size={18} color="#fff" />
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
};
