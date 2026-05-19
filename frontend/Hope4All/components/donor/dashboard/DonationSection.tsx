import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DonationSectionProps {
  requests: any[];
  selectedRequest: any;
  setSelectedRequest: (req: any) => void;
  units: string;
  setUnits: (u: string) => void;
  requestPhoto: string | null;
  onPickPhoto: () => void;
  handleDonate: () => void;
  handleApproveRequest: (id: string) => void;
  handleRejectRequest: (id: string) => void;
  onOpenPreferences: () => void;
  onMessage: (orphan: any) => void;
  onViewOrphan: (orphan: any) => void;
  submitting?: boolean;
}

export const DonationSection: React.FC<DonationSectionProps> = ({
  requests, selectedRequest, setSelectedRequest, units, setUnits, requestPhoto, onPickPhoto,
  handleDonate, handleApproveRequest, handleRejectRequest, onOpenPreferences, onMessage, onViewOrphan,
  submitting
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Urgent Needs</Text>
          <Text style={styles.subtitle}>Help children with their daily essentials</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={onOpenPreferences}>
           <Ionicons name="options-outline" size={20} color="#0077cc" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {requests.length === 0 ? (
           <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No matching needs found.</Text>
           </View>
        ) : (
          requests.map((req) => (
            <TouchableOpacity 
              key={req._id} 
              style={[styles.card, selectedRequest?._id === req._id && styles.selectedCard]}
              onPress={() => setSelectedRequest(req)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.typeBadge, req.isInstitutional && { backgroundColor: '#f5f3ff' }]}>
                  <Text style={[styles.typeText, req.isInstitutional && { color: '#9333ea' }]}>
                    {req.isInstitutional ? 'INSTITUTION' : req.type.toUpperCase()}
                  </Text>
                </View>
                {req.isUrgent && (
                  <View style={styles.urgentBadge}>
                    <Ionicons name="flash" size={10} color="#fff" />
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
                <Text style={styles.unitText}>{req.units} {req.unitType}</Text>
              </View>
              <Text style={styles.orphanName}>
                {req.isInstitutional ? (req.orphanageId?.name || 'Orphanage') : (req.orphanId?.name || 'Child')}
              </Text>
              <Text style={styles.schoolText} numberOfLines={1}>
                {req.isInstitutional ? 'Institutional Need' : req.school}
              </Text>
              <Text style={styles.descText} numberOfLines={2}>{req.description}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {selectedRequest && (
        <View style={styles.actionCard}>
           <View style={styles.actionHeader}>
              <TouchableOpacity 
                style={styles.childInfoBtn}
                onPress={() => onViewOrphan(selectedRequest.isInstitutional ? selectedRequest.orphanageId : selectedRequest.orphanId)}
              >
                <Text style={styles.actionLabel}>
                  Donate to {selectedRequest.isInstitutional ? selectedRequest.orphanageId?.name : selectedRequest.orphanId?.name}
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionChatBtn}
                onPress={() => onMessage(selectedRequest.isInstitutional ? selectedRequest.orphanageId : selectedRequest.orphanId)}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0077cc" />
              </TouchableOpacity>
            </View>
           
           {selectedRequest.isUrgent && (
             <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#ef4444', marginBottom: 8 }}>PHOTO REQUIRED FOR URGENT NEED:</Text>
                <TouchableOpacity 
                  style={{ 
                    height: 120, 
                    backgroundColor: '#fef2f2', 
                    borderRadius: 14, 
                    borderStyle: 'dashed', 
                    borderWidth: 1, 
                    borderColor: '#fecaca',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={onPickPhoto}
                >
                  {requestPhoto ? (
                    <Image source={{ uri: requestPhoto }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <View style={{ alignItems: 'center', gap: 5 }}>
                      <Ionicons name="camera" size={24} color="#ef4444" />
                      <Text style={{ fontSize: 11, color: '#ef4444', fontWeight: '600' }}>Upload Item Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
             </View>
           )}

           <View style={styles.inputRow}>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Units" 
                  value={units} 
                  onChangeText={setUnits} 
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity 
                style={[styles.donateBtn, submitting && { opacity: 0.7 }]} 
                onPress={handleDonate}
                disabled={submitting}
              >
                <Text style={styles.donateBtnText}>
                  {submitting ? 'Submitting...' : 'Confirm Donation'}
                </Text>
              </TouchableOpacity>
           </View>

           <View style={styles.addressInfoCard}>
              <Ionicons name="information-circle" size={24} color="#0284c7" />
              <View style={{ flex: 1 }}>
                <Text style={styles.addressInfoTitle}>Shipping Address</Text>
                <Text style={styles.addressInfoDetails}>Main Head Office, Faisalabad D Ground, Office #12</Text>
                <Text style={styles.addressInfoNote}>Please send your donation packages here and include your Donation ID.</Text>
              </View>
           </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  filterBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0f2fe' },
  scroller: { paddingVertical: 10 },
  emptyCard: { width: 280, height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic' },
  card: { width: 200, backgroundColor: '#fff', borderRadius: 24, padding: 20, marginRight: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  selectedCard: { borderColor: '#0077cc', backgroundColor: '#f0f9ff', elevation: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  unitText: { fontSize: 12, fontWeight: '700', color: '#0077cc' },
  orphanName: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  schoolText: { fontSize: 12, color: '#64748b', marginBottom: 8 },
  descText: { fontSize: 12, color: '#94a3b8', lineHeight: 18 },
  actionCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginTop: 10, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  actionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  childInfoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionChatBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 14, fontWeight: '800', color: '#1e293b' },
  inputRow: { flexDirection: 'row', gap: 10 },
  inputBox: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 15 },
  input: { height: 48, fontSize: 16, color: '#1e293b', fontWeight: '600' },
  donateBtn: { flex: 2, backgroundColor: '#0077cc', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  donateBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  urgentText: { fontSize: 8, fontWeight: '900', color: '#fff' },
  addressInfoCard: { flexDirection: 'row', backgroundColor: '#f0f9ff', padding: 16, borderRadius: 16, marginTop: 15, gap: 12, borderWidth: 1, borderColor: '#bae6fd', alignItems: 'flex-start' },
  addressInfoTitle: { fontSize: 14, fontWeight: '800', color: '#0369a1', marginBottom: 4 },
  addressInfoDetails: { fontSize: 13, fontWeight: '700', color: '#0284c7', marginBottom: 6 },
  addressInfoNote: { fontSize: 12, color: '#0c4a6e', lineHeight: 18 },
});
