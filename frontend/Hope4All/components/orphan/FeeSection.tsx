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
  feePaymentNumber: string;
  setFeePaymentNumber: (val: string) => void;
  onAddFee: () => void;
  onDeleteFee: (feeId: string) => void;
  loading: boolean;
  submitting: boolean;
}

export const FeeSection: React.FC<FeeSectionProps> = ({
  fees, feeTitle, setFeeTitle, feeAmount, setFeeAmount, feeDate, setFeeDate, feePaymentNumber, setFeePaymentNumber,
  onAddFee, onDeleteFee, loading, submitting
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
        <View style={styles.inputGroup}>
          <Ionicons name="call-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="EasyPaisa / JazzCash Number" 
            value={feePaymentNumber}
            onChangeText={setFeePaymentNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#94a3b8"
          />
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
                  {fee.paymentNumber && (
                    <Text style={styles.feeCardPayment}>P: {fee.paymentNumber}</Text>
                  )}
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
                   {fee.status === 'pending' && (
                     <TouchableOpacity 
                       onPress={() => onDeleteFee(fee._id)}
                       style={styles.deleteBtn}
                     >
                       <Ionicons name="trash-outline" size={14} color="#ef4444" />
                     </TouchableOpacity>
                   )}
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
  iconBadge: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0f2fe' },
  formCard: { backgroundColor: '#fff', padding: 25, borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 15 },
  formLabel: { fontSize: 15, fontWeight: '800', color: '#1e293b', marginBottom: 18 },
  inputGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    marginBottom: 15,
    paddingHorizontal: 15 
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#1e293b', fontWeight: '600' },
  row: { flexDirection: 'row', gap: 12 },
  submitBtn: { 
    backgroundColor: '#FF6B35', 
    flexDirection: 'row', 
    padding: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10,
    marginTop: 10,
    elevation: 6,
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  disabledBtn: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  historySection: { marginTop: 30 },
  historyTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 15 },
  emptyCard: { padding: 35, alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', fontSize: 14 },
  feeCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 28, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  feeInfo: { flex: 1 },
  feeCardTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  feeCardDate: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: '600' },
  feeCardPayment: { fontSize: 11, color: '#00C2E0', marginTop: 2, fontWeight: '700' },
  feeStatusGroup: { alignItems: 'flex-end' },
  feeCardAmount: { fontSize: 18, fontWeight: '900', color: '#1e293b', marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pendingBadge: { backgroundColor: '#fff7ed' },
  pledgedBadge: { backgroundColor: '#f0f9ff' },
  paidBadge: { backgroundColor: '#f0fdf4' },
  statusText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  deleteBtn: { marginTop: 8, padding: 4, alignSelf: 'flex-end' },
  pendingText: { color: '#ea580c' },
  pledgedText: { color: '#0284c7' },
  paidText: { color: '#16a34a' },
});
