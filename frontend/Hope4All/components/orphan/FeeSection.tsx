import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeeSectionProps {
  fees: any[];
  feeTitle: string;
  setFeeTitle: (val: string) => void;
  feeAmount: string;
  setFeeAmount: (val: string) => void;
  feeDate: string;
  setFeeDate: (val: string) => void;
  onAddFee: () => void;
  loading: boolean;
  submitting: boolean;
}

export const FeeSection: React.FC<FeeSectionProps> = ({
  fees, feeTitle, setFeeTitle, feeAmount, setFeeAmount, feeDate, setFeeDate,
  onAddFee, loading, submitting
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Fee Management</Text>
          <Text style={styles.subtitle}>Track and request your educational fees</Text>
        </View>
        <View style={styles.iconBadge}>
          <Ionicons name="wallet-outline" size={20} color="#0077cc" />
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formLabel}>Request New Fee Payment</Text>
        <View style={styles.inputGroup}>
          <Ionicons name="text-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Fee Title (e.g. Term 1 Exam)" 
            value={feeTitle}
            onChangeText={setFeeTitle}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <View style={styles.row}>
           <View style={[styles.inputGroup, { flex: 1 }]}>
             <Ionicons name="cash-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
             <TextInput 
               style={styles.input} 
               placeholder="Amount" 
               value={feeAmount}
               onChangeText={setFeeAmount}
               keyboardType="numeric"
               placeholderTextColor="#94a3b8"
             />
           </View>
           <View style={[styles.inputGroup, { flex: 1 }]}>
             <Ionicons name="calendar-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
             <TextInput 
               style={styles.input} 
               placeholder="YYYY-MM-DD" 
               value={feeDate}
               onChangeText={setFeeDate}
               placeholderTextColor="#94a3b8"
             />
           </View>
        </View>
        <TouchableOpacity 
          style={[styles.submitBtn, submitting && styles.disabledBtn]} 
          onPress={onAddFee} 
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Submit Request</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>My Fee Requests</Text>
        {loading ? <ActivityIndicator size="small" color="#0077cc" style={{ marginVertical: 20 }} /> : (
          fees.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No fee requests yet.</Text>
            </View>
          ) : (
            fees.map((fee, idx) => (
              <View key={idx} style={styles.feeCard}>
                <View style={styles.feeInfo}>
                  <Text style={styles.feeCardTitle}>{fee.title}</Text>
                  <Text style={styles.feeCardDate}>Due: {new Date(fee.dueDate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.feeStatusGroup}>
                   <Text style={styles.feeCardAmount}>${fee.amount}</Text>
                   <View style={[
                     styles.statusBadge,
                     fee.status === 'pending' ? styles.pendingBadge : 
                     fee.status === 'pledged' ? styles.pledgedBadge : styles.paidBadge
                   ]}>
                      <Text style={[
                        styles.statusText,
                        fee.status === 'pending' ? styles.pendingText : 
                        fee.status === 'pledged' ? styles.pledgedText : styles.paidText
                      ]}>
                        {fee.status.toUpperCase()}
                      </Text>
                   </View>
                </View>
              </View>
            ))
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleGroup: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  iconBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  formLabel: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 15 },
  inputGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    marginBottom: 12,
    paddingHorizontal: 12 
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#1e293b' },
  row: { flexDirection: 'row', gap: 10 },
  submitBtn: { 
    backgroundColor: '#0077cc', 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    marginTop: 8
  },
  disabledBtn: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  historySection: { marginTop: 25 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  emptyCard: { padding: 30, alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic' },
  feeCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 1
  },
  feeInfo: { flex: 1 },
  feeCardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  feeCardDate: { fontSize: 12, color: '#64748b', marginTop: 4 },
  feeStatusGroup: { alignItems: 'flex-end' },
  feeCardAmount: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pendingBadge: { backgroundColor: '#fff7ed' },
  pledgedBadge: { backgroundColor: '#f0f9ff' },
  paidBadge: { backgroundColor: '#f0fdf4' },
  statusText: { fontSize: 10, fontWeight: '800' },
  pendingText: { color: '#ea580c' },
  pledgedText: { color: '#0284c7' },
  paidText: { color: '#16a34a' },
});
