import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AidFeedSectionProps {
  aidItems: any[];
  onThanks: (donor: any) => void;
  onConfirm: (donationId: string) => void;
  onReport: (donationId: string) => void;
  onPickPhoto: () => void;
  receiptPhoto: string | null;
  confirmingId: string | null;
}

export const AidFeedSection: React.FC<AidFeedSectionProps> = ({ 
  aidItems, onThanks, onConfirm, onReport, onPickPhoto, receiptPhoto, confirmingId 
}) => {
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
                  <Text style={styles.aidType}>Sent: {aid.itemName || aid.type || 'SUPPLIES'}</Text>
                  <Text style={styles.aidQty}>{aid.units} {aid.unitType || 'Units'} provided</Text>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: 
                      aid.status === 'received' ? '#ecfdf5' :
                      aid.status === 'in-transit' ? '#f0f9ff' : 
                      aid.status === 'approved' ? '#f5f3ff' : 
                      '#fffbeb' // pending-approval
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: 
                        aid.status === 'received' ? '#10b981' :
                        aid.status === 'in-transit' ? '#0077cc' : 
                        aid.status === 'approved' ? '#8b5cf6' : 
                        '#f59e0b' // pending-approval
                    }]}>
                      {aid.status?.replace('-', ' ').toUpperCase() || 'PENDING'}
                    </Text>
                  </View>
                  
                  {(aid.donorImage || aid.donationPhoto) && (
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#64748b', marginBottom: 4 }}>DONOR PROOF:</Text>
                      <Image 
                        source={{ uri: aid.donorImage || aid.donationPhoto }} 
                        style={{ width: '100%', height: 100, borderRadius: 12, backgroundColor: '#f1f5f9' }} 
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  {aid.receivedImage && (
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#16a34a', marginBottom: 4 }}>YOUR RECEIPT PROOF:</Text>
                      <Image 
                        source={{ uri: aid.receivedImage }} 
                        style={{ width: '100%', height: 100, borderRadius: 12, backgroundColor: '#f0fdf4' }} 
                        resizeMode="cover"
                      />
                    </View>
                  )}
               </View>
               
               <View style={styles.btnRow}>
                {aid.status === 'in-transit' && (
                  <View style={{ gap: 8, flex: 1 }}>
                    {receiptPhoto ? (
                      <View style={{ position: 'relative' }}>
                        <Image source={{ uri: receiptPhoto }} style={{ width: '100%', height: 60, borderRadius: 10, marginBottom: 5 }} />
                        <TouchableOpacity style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#ef4444', borderRadius: 10 }} onPress={onPickPhoto}>
                           <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.thanksBtn, { paddingVertical: 8, borderStyle: 'dashed' }]}
                        onPress={onPickPhoto}
                      >
                        <Ionicons name="camera-outline" size={14} color="#0077cc" />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#0077cc' }}>Attach Proof (Optional)</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                      style={[styles.confirmBtn, confirmingId === aid._id && { opacity: 0.7 }]}
                      onPress={() => onConfirm(aid._id)}
                      disabled={confirmingId === aid._id}
                    >
                      <Ionicons name="checkmark-circle-outline" size={14} color="#fff" />
                      <Text style={styles.confirmBtnText}>{confirmingId === aid._id ? 'Confirming...' : 'I Received This'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.reportBtn}
                      onPress={() => onReport(aid._id)}
                    >
                      <Ionicons name="close-circle-outline" size={16} color="#ef4444" />
                      <Text style={styles.reportBtnText}>Not Received</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {aid.status === 'received' && (
                   <View style={{ padding: 10, backgroundColor: '#f0fdf4', borderRadius: 12, alignItems: 'center' }}>
                      <Ionicons name="happy-outline" size={20} color="#16a34a" />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#16a34a', marginTop: 4 }}>Successfully Received!</Text>
                   </View>
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
  aidCard: { 
    width: 260, 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    marginRight: 18, 
    padding: 22, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, 
    shadowRadius: 15, 
    borderWidth: 1, 
    borderColor: '#f1f5f9' 
  },
  donorHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  donorAvatar: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  donorInitial: { fontSize: 18, fontWeight: '800', color: '#0077cc' },
  donorName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  aidTime: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 18 },
  aidDetail: { marginBottom: 18 },
  aidType: { fontSize: 11, fontWeight: '800', color: '#0077cc', marginBottom: 6, letterSpacing: 0.5 },
  aidQty: { fontSize: 14, fontWeight: '600', color: '#475569' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  btnRow: { flexDirection: 'column', gap: 10 },
  thanksBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#f0f9ff', paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#e0f2fe' },
  thanksBtnText: { fontSize: 13, fontWeight: '700', color: '#0077cc' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#10b981', paddingVertical: 12, borderRadius: 16, shadowColor: '#10b981', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  confirmBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#fecaca' },
  reportBtnText: { fontSize: 13, fontWeight: '700', color: '#ef4444' },
});
