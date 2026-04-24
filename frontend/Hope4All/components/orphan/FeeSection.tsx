import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

export const FeeSection: React.FC = () => {
  const { fees, loadingFees } = useOrphan();

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Fee Management</Text>
      <Text style={styles.sectionSub}>Active school fees and funding requests.</Text>
      
      {loadingFees ? (
        <ActivityIndicator size="small" color="#0077cc" style={{ marginVertical: 20 }} />
      ) : (
        <>
          {fees.length === 0 && <Text style={styles.emptyText}>No fees added yet.</Text>}
          {fees.map((fee, index) => (
            <View key={index} style={styles.feeItem}>
              <View style={styles.feeInfo}>
                <Text style={styles.feeTitle}>{fee.title}</Text>
                <Text style={styles.feeDate}>Due: {new Date(fee.dueDate).toLocaleDateString()}</Text>
              </View>
              <View style={styles.feeRight}>
                <Text style={styles.feeAmount}>${fee.amount}</Text>
                <Text style={[
                  styles.feeStatus, 
                  fee.status === 'pending' ? styles.statusPending : styles.statusPaid
                ]}>
                  {fee.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};
