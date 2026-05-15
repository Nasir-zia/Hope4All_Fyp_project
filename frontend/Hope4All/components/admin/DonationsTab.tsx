import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { getDownloadableUrl } from '../../utils/cloudinaryUtils';

import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface DonationsTabProps {
  donations: any[];
  onUpdateStatus: (donationId: string, status: string) => void;
  onForward: (donationId: string) => void;
  onComplete: (donationId: string) => void;
}

export const DonationsTab: React.FC<DonationsTabProps> = ({ donations, onUpdateStatus, onForward, onComplete }) => {
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
              <View>
                <Text style={styles.donationAmt}>{d.units || 0} {d.requestId?.unitType || 'Units'}</Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>{d.itemName || d.type}</Text>
              </View>
              <Text style={styles.donationDate}>{new Date(d.createdAt).toLocaleDateString()}</Text>
            </View>
            
            <View style={styles.donationUsers}>
              <View style={styles.userBox}>
                <Text style={styles.userLabel}>DONOR ({d.city || 'Anywhere'})</Text>
                <Text style={styles.userNameSmall}>{d.donorId?.name || 'Anonymous'}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#cbd5e1" />
              <View style={styles.userBox}>
                <Text style={styles.userLabel}>RECIPIENT</Text>
                <Text style={styles.userNameSmall}>{d.recipientId?.name || d.recipientName || 'Unknown'}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              {d.donorImage && (
                <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', padding: 5, backgroundColor: '#f1f5f9' }}>DONOR PROOF</Text>
                  <Image source={{ uri: d.donorImage }} style={{ width: '100%', height: 120, resizeMode: 'cover' }} />
                  <TouchableOpacity 
                    style={{ position: 'absolute', top: 25, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 20 }}
                    onPress={() => Linking.openURL(getDownloadableUrl(d.donorImage))}
                  >
                    <Ionicons name="eye" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              {d.receivedImage && (
                <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bcf0da' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', padding: 5, backgroundColor: '#dcfce7', color: '#166534' }}>RECEIPT PROOF</Text>
                  <Image source={{ uri: d.receivedImage }} style={{ width: '100%', height: 120, resizeMode: 'cover' }} />
                  <TouchableOpacity 
                    style={{ position: 'absolute', top: 25, right: 5, backgroundColor: 'rgba(22,101,52,0.5)', padding: 4, borderRadius: 20 }}
                    onPress={() => Linking.openURL(getDownloadableUrl(d.receivedImage))}
                  >
                    <Ionicons name="eye" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: getStatusColor(d.status).bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: getStatusColor(d.status).text }}>
                    {d.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
                  </Text>
                </View>
                
                {d.status === 'pending-approval' && (
                  <TouchableOpacity 
                    style={{ backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    onPress={() => onUpdateStatus(d._id, 'approved')}
                  >
                    <Ionicons name="checkmark-circle" size={12} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Approve</Text>
                  </TouchableOpacity>
                )}

                {d.status === 'approved' && (
                  <TouchableOpacity 
                    style={{ backgroundColor: '#0ea5e9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    onPress={() => onForward(d._id)}
                  >
                    <Ionicons name="send" size={12} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Mark In Transit</Text>
                  </TouchableOpacity>
                )}

                {d.status === 'received' && (
                   <TouchableOpacity 
                    style={{ backgroundColor: '#6366f1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    onPress={() => onComplete(d._id)}
                  >
                    <Ionicons name="flag" size={12} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Archive/Complete</Text>
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
    case 'received':
    case 'completed': return { bg: '#f0fdf4', text: '#16a34a' };
    case 'in-transit': return { bg: '#eff6ff', text: '#3b82f6' };
    case 'approved': return { bg: '#f5f3ff', text: '#8b5cf6' };
    case 'pending-approval': return { bg: '#fffbeb', text: '#d97706' };
    case 'rejected': return { bg: '#fef2f2', text: '#ef4444' };
    default: return { bg: '#f8fafc', text: '#64748b' };
  }
};

