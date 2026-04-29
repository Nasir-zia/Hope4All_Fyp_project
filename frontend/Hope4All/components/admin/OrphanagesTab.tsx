import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface OrphanagesTabProps {
  orphanages: any[];
  onUpdateStatus: (id: string, currentStatus: string) => void;
}

export const OrphanagesTab: React.FC<OrphanagesTabProps> = ({ orphanages, onUpdateStatus }) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Registered Orphanages</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{orphanages.length} Total</Text>
        </View>
      </View>

      {orphanages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No orphanages found.</Text>
        </View>
      ) : (
        orphanages.map((o) => (
          <View key={o._id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userMain}>
                <View style={[styles.userAvatar, { backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="business" size={24} color="#0077cc" />
                </View>
                <View>
                  <Text style={styles.userName}>{o.name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: '#f0fdf4' }]}>
                    <Text style={[styles.roleText, { color: '#16a34a' }]}>{o.registrationNumber}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: o.status === 'approved' ? '#dcfce7' : '#fef3c7' }]}>
                <Text style={[styles.statusLabel, { color: o.status === 'approved' ? '#16a34a' : '#d97706' }]}>
                  {o.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>{o.location?.address}, {o.location?.city}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>{o.contactInfo?.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>Capacity: {o.capacity?.current}/{o.capacity?.max}</Text>
              </View>
            </View>

            {o.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => onUpdateStatus(o.userId, 'verified')}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.btnText}>Verify</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
};
