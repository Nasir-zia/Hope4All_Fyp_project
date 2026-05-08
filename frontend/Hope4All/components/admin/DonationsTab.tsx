import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface DonationsTabProps {
  donations: any[];
  onForward: (donationId: string) => void;
  onComplete: (donationId: string) => void;
}

export const DonationsTab: React.FC<DonationsTabProps> = ({ donations, onForward, onComplete }) => {
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

            {d.donationPhoto && (
              <View style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
                <Image 
                  source={{ uri: d.donationPhoto }} 
                  style={{ width: '100%', height: 200, resizeMode: 'cover' }} 
                />
                <TouchableOpacity 
                  style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20 }}
                  onPress={() => Linking.openURL(d.donationPhoto)}
                >
                  <Ionicons name="expand" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: getStatusColor(d.status).bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: getStatusColor(d.status).text }}>
                    {d.status?.toUpperCase() || 'PENDING'}
                  </Text>
                </View>
                
                {d.status === 'under-review' && (
                  <TouchableOpacity 
                    style={{ backgroundColor: '#0ea5e9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    onPress={() => onForward(d._id)}
                  >
                    <Ionicons name="send" size={12} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Verify & Forward</Text>
                  </TouchableOpacity>
                )}

                {d.status === 'sent' && (
                  <TouchableOpacity 
                    style={{ backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    onPress={() => onComplete(d._id)}
                  >
                    <Ionicons name="checkmark-circle" size={12} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Mark as Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
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

