import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface DonationsTabProps {
  donations: any[];
  onForward: (donationId: string) => void;
}

export const DonationsTab: React.FC<DonationsTabProps> = ({ donations, onForward }) => {
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
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: getStatusColor(d.status).bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: getStatusColor(d.status).text }}>
                    {d.status?.toUpperCase() || 'PENDING'}
                  </Text>
                </View>
                {d.status === 'under-review' && (
                  <TouchableOpacity 
                    style={{ backgroundColor: '#0077cc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    onPress={() => onForward(d._id)}
                  >
                    <Ionicons name="send" size={10} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>Verify & Forward</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {d.donationPhoto && (
                <TouchableOpacity onPress={() => Linking.openURL(d.donationPhoto)}>
                  <Image source={{ uri: d.donationPhoto }} style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#f1f5f9' }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return { bg: '#f0fdf4', text: '#16a34a' };
    case 'sent': return { bg: '#eff6ff', text: '#3b82f6' };
    case 'under-review': return { bg: '#fffbeb', text: '#d97706' };
    default: return { bg: '#f8fafc', text: '#64748b' };
  }
};

