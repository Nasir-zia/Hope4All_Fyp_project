import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface FeePledgeCardProps {
  fee: any;
  isPledging: boolean;
  onPledge: (id: string) => void;
  onViewProfile: (orphan: any) => void;
}

export const FeePledgeCard: React.FC<FeePledgeCardProps> = ({ fee, isPledging, onPledge, onViewProfile }) => {
  return (
    <View style={styles.feeCard}>
      <Text style={styles.feeCardTitle}>{fee.title}</Text>
      <Text style={styles.feeCardOrphan}>For: {fee.orphanId?.name || 'Child'}</Text>
      <Text style={styles.feeCardAmount}>${fee.amount}</Text>
      <Text style={styles.feeCardDate}>Due: {new Date(fee.dueDate).toLocaleDateString()}</Text>

      <TouchableOpacity
        style={styles.pledgeBtn}
        onPress={() => onPledge(fee._id)}
        disabled={isPledging}
      >
        {isPledging ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.pledgeBtnText}>Pledge to Pay</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.profileLink}
        onPress={() => onViewProfile(fee.orphanId)}
      >
        <Text style={styles.profileLinkText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  feeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    width: 200,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: 4,
    borderTopColor: '#f1c40f',
  },
  feeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  feeCardOrphan: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  feeCardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#33cc99',
    marginVertical: 5,
  },
  feeCardDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
  },
  pledgeBtn: {
    backgroundColor: '#0077cc',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  pledgeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileLink: {
    marginTop: 8,
    alignItems: 'center',
  },
  profileLinkText: {
    fontSize: 12,
    color: '#0077cc',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
