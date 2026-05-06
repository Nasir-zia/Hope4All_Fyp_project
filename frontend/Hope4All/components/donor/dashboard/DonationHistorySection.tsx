import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DonationHistorySectionProps {
  myDonations: any[];
  onDeleteDonation: (id: string) => void;
  onOpenAddDonation: () => void;
  onUploadPhoto: (id: string) => void;
}

export const DonationHistorySection: React.FC<DonationHistorySectionProps> = ({
  myDonations, onDeleteDonation, onOpenAddDonation, onUploadPhoto
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Impact History</Text>
          <Text style={styles.subtitle}>Your generous contributions</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onOpenAddDonation}>
          <Ionicons name="add-circle" size={24} color="#0077cc" />
          <Text style={styles.addBtnText}>Log New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {myDonations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>You haven't logged any donations yet.</Text>
          </View>
        ) : (
          myDonations.map((item) => (
            <View key={item._id} style={styles.historyCard}>
              <View style={styles.cardInfo}>
                <View style={styles.typeRow}>
                  <Text style={styles.historyType}>{item.type?.toUpperCase() || 'GENERAL'}</Text>
                  <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.historyOrphan}>{item.recipientName || 'Community Support'}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.historyUnits}>{item.units} {item.unitType || 'Units'}</Text>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: 
                      item.status === 'completed' ? '#ecfdf5' : 
                      item.status === 'received' ? '#ecfdf5' :
                      item.status === 'sent' ? '#f0f9ff' : 
                      item.status === 'under-review' ? '#fffbeb' : 
                      '#fef2f2' // pending-delivery
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: 
                        item.status === 'completed' ? '#10b981' : 
                        item.status === 'received' ? '#10b981' :
                        item.status === 'sent' ? '#0077cc' : 
                        item.status === 'under-review' ? '#f59e0b' : 
                        '#ef4444' // pending-delivery
                    }]}>
                      {item.status?.toUpperCase() || 'PENDING-DELIVERY'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.actionRow}>
                {item.status === 'pending-delivery' && (
                  <TouchableOpacity style={styles.uploadBtn} onPress={() => onUploadPhoto(item._id)}>
                    <Ionicons name="camera" size={18} color="#0077cc" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.deleteBtn} onPress={() => onDeleteDonation(item._id)}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0f9ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e0f2fe' },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#0077cc' },
  listContainer: { gap: 12 },
  emptyCard: { padding: 40, alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', gap: 12 },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' },
  historyCard: { backgroundColor: '#fff', padding: 18, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  cardInfo: { flex: 1 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingRight: 20 },
  historyType: { fontSize: 10, fontWeight: '800', color: '#0077cc' },
  historyDate: { fontSize: 10, color: '#94a3b8' },
  historyOrphan: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  historyUnits: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 8 },
  uploadBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0f2fe' },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center' },
});
