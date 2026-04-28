import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface DonationsTabProps {
  donations: any[];
}

export const DonationsTab: React.FC<DonationsTabProps> = ({ donations }) => {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Audit Log: Aid Distribution</Text>
      {donations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cash-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No donation records yet.</Text>
        </View>
      ) : (
        donations.map((d) => (
          <View key={d._id} style={styles.donationCard}>
            <View style={styles.donationHeader}>
              <Text style={styles.donationAmt}>{d.units || 0} {d.requestId?.unitType || 'Units'}</Text>
              <Text style={styles.donationDate}>{new Date(d.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.donationUsers}>
              <View style={styles.userBox}>
                <Text style={styles.userLabel}>DONOR</Text>
                <Text style={styles.userNameSmall}>{d.donorId?.name || 'Anonymous'}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#cbd5e1" />
              <View style={styles.userBox}>
                <Text style={styles.userLabel}>RECIPIENT</Text>
                <Text style={styles.userNameSmall}>{d.recipientId?.name || d.recipientName || 'Unknown'}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};
