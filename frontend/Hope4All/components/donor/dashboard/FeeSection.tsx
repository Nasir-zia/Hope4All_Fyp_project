import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeeSectionProps {
  availableFees: any[];
  pledgingFee: string | null;
  handlePledgeFee: (id: string) => void;
  onViewOrphan: (orphan: any) => void;
  onMessage: (orphan: any) => void;
}

export const FeeSection: React.FC<FeeSectionProps> = ({
  availableFees, pledgingFee, handlePledgeFee, onViewOrphan, onMessage
}) => {
  const [showPaymentFor, setShowPaymentFor] = React.useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Education Fees</Text>
          <Text style={styles.subtitle}>Sponsor school and exam fees</Text>
        </View>
        <View style={styles.iconBox}>
           <Ionicons name="school-outline" size={20} color="#0077cc" />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {availableFees.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>All fees are currently covered. Thank you!</Text>
          </View>
        ) : (
          availableFees.map((fee) => (
            <View key={fee._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <TouchableOpacity onPress={() => onViewOrphan(fee.orphanId)}>
                  <Text style={styles.orphanName}>{fee.orphanId?.name || 'Child'}</Text>
                </TouchableOpacity>
                <View style={styles.amountBadge}>
                  <Text style={styles.amountText}>${fee.amount}</Text>
                </View>
              </View>
              <Text style={styles.feeTitle} numberOfLines={1}>{fee.title}</Text>
              <Text style={styles.dueDate}>Due: {new Date(fee.dueDate).toLocaleDateString()}</Text>
              
              {fee.paymentNumber ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.paymentInfoRow}
                    onPress={() => setShowPaymentFor(showPaymentFor === fee._id ? null : fee._id)}
                  >
                    <Ionicons 
                      name={showPaymentFor === fee._id ? "eye-off-outline" : "eye-outline"} 
                      size={16} 
                      color="#0077cc" 
                    />
                    <Text style={styles.paymentInfoText}>
                      {showPaymentFor === fee._id ? `${fee.paymentNumber}` : "Payment No"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.chatIconBtn}
                    onPress={() => onMessage(fee.orphanId)}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0077cc" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionRow, styles.chatIconBtnOnly]}
                  onPress={() => onMessage(fee.orphanId)}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0077cc" />
                  <Text style={styles.paymentInfoText}>Message Orphan</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.pledgeBtn, pledgingFee === fee._id && styles.disabledBtn]}
                onPress={() => handlePledgeFee(fee._id)}
                disabled={!!pledgingFee}
              >
                {pledgingFee === fee._id ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.pledgeBtnText}>Pledge to Pay</Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 10 },
  emptyCard: { width: 300, padding: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' },
  card: { width: 220, backgroundColor: '#fff', borderRadius: 24, padding: 20, marginRight: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15, borderWidth: 1, borderColor: '#f1f5f9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  orphanName: { fontSize: 16, fontWeight: '800', color: '#1e293b', textDecorationLine: 'underline' },
  amountBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  amountText: { fontSize: 14, fontWeight: '800', color: '#16a34a' },
  feeTitle: { fontSize: 14, color: '#475569', fontWeight: '600', marginBottom: 4 },
  dueDate: { fontSize: 11, color: '#94a3b8', marginBottom: 15 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  paymentInfoRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0f9ff', padding: 8, borderRadius: 10 },
  chatIconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0f2fe' },
  chatIconBtnOnly: { backgroundColor: '#f0f9ff', padding: 8, borderRadius: 10, alignSelf: 'flex-start', paddingHorizontal: 12 },
  paymentInfoText: { fontSize: 12, color: '#0077cc', fontWeight: '700' },
  pledgeBtn: { backgroundColor: '#0077cc', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  disabledBtn: { opacity: 0.6 },
  pledgeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
