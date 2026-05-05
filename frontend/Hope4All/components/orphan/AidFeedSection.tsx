import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AidFeedSectionProps {
  aidItems: any[];
  onThanks: (donor: any) => void;
  onConfirm: (donationId: string) => void;
}

export const AidFeedSection: React.FC<AidFeedSectionProps> = ({ aidItems, onThanks, onConfirm }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Your Supporters</Text>
          <Text style={styles.subtitle}>Kind people helping you reach your goals</Text>
        </View>
        <View style={styles.iconBadge}>
          <Ionicons name="heart-outline" size={20} color="#0077cc" />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {aidItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Help is on the way! Your community is reviewing your requests.</Text>
          </View>
        ) : (
          aidItems.map((aid, idx) => (
            <View key={idx} style={styles.aidCard}>
               <View style={styles.donorHeader}>
                  <View style={styles.donorAvatar}>
                    <Text style={styles.donorInitial}>{(aid.donorId?.name?.charAt(0) || 'D').toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.donorName}>
                      {aid.recipientId ? (aid.donorId?.name || 'Anonymous Donor') : 'Community Support'}
                    </Text>
                    <Text style={styles.aidTime}>{new Date(aid.createdAt).toLocaleDateString()}</Text>
                  </View>
               </View>
               
               <View style={styles.divider} />
               
               <View style={styles.aidDetail}>
                  <Text style={styles.aidType}>Sent: {aid.requestId?.type?.toUpperCase() || 'SUPPLIES'}</Text>
                  <Text style={styles.aidQty}>{aid.units} {aid.requestId?.unitType || 'Units'} provided</Text>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: 
                      aid.status === 'completed' ? '#ecfdf5' : 
                      aid.status === 'sent' ? '#f0f9ff' : 
                      aid.status === 'under-review' ? '#fffbeb' : 
                      '#fef2f2' // pending-delivery
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: 
                        aid.status === 'completed' ? '#10b981' : 
                        aid.status === 'sent' ? '#0077cc' : 
                        aid.status === 'under-review' ? '#f59e0b' : 
                        '#ef4444' // pending-delivery
                    }]}>
                      {aid.status?.toUpperCase() || 'PENDING-DELIVERY'}
                    </Text>
                  </View>
               </View>
               
               <View style={styles.btnRow}>
                {aid.status === 'sent' && (
                  <TouchableOpacity 
                    style={styles.confirmBtn}
                    onPress={() => onConfirm(aid._id)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={14} color="#fff" />
                    <Text style={styles.confirmBtnText}>Received</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.thanksBtn, { flex: 1 }]}
                  onPress={() => onThanks(aid.donorId)}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0077cc" />
                  <Text style={styles.thanksBtnText}>Say Thanks</Text>
                </TouchableOpacity>
               </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleGroup: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  iconBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fdf2f8', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 5 },
  emptyCard: { width: 300, padding: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', lineHeight: 20 },
  aidCard: { width: 220, backgroundColor: '#fff', borderRadius: 28, marginRight: 15, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  donorHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  donorAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  donorInitial: { fontSize: 16, fontWeight: '800', color: '#0077cc' },
  donorName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  aidTime: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  aidDetail: { marginBottom: 15 },
  aidType: { fontSize: 10, fontWeight: '800', color: '#0077cc', marginBottom: 4 },
  aidQty: { fontSize: 13, fontWeight: '600', color: '#475569' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 6 },
  statusText: { fontSize: 8, fontWeight: '800' },
  btnRow: { flexDirection: 'row', gap: 8 },
  thanksBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#f0f9ff', paddingVertical: 10, borderRadius: 12 },
  thanksBtnText: { fontSize: 12, fontWeight: '700', color: '#0077cc' },
  confirmBtn: { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#10b981', paddingVertical: 10, borderRadius: 12 },
  confirmBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
