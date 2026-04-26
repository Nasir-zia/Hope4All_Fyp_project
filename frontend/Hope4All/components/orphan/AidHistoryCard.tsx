import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AidHistoryCardProps {
  aid: any;
  onThanks: (id: string) => void;
}

export const AidHistoryCard: React.FC<AidHistoryCardProps> = ({ aid, onThanks }) => {
  return (
    <View style={styles.aidCard}>
      <View style={styles.donorHeader}>
        <View style={styles.donorAvatar}>
          <Text style={styles.donorInitial}>{(aid.donorId?.name?.charAt(0) || 'D').toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.donorName}>{aid.donorId?.name || 'Kind Donor'}</Text>
          <Text style={styles.aidTime}>{new Date(aid.donatedAt).toLocaleDateString()}</Text>
        </View>
      </View>
      
      <View style={styles.aidDetail}>
        <Text style={styles.aidType}>{aid.type?.toUpperCase()}</Text>
        <Text style={styles.aidQty}>{aid.units} {aid.unitType || 'Units'}</Text>
      </View>

      {!aid.thanked && (
        <TouchableOpacity 
          style={styles.thanksBtn}
          onPress={() => onThanks(aid._id)}
        >
          <Ionicons name="heart" size={16} color="#0077cc" />
          <Text style={styles.thanksBtnText}>Send Thanks</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  aidCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginRight: 15,
    width: 220,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#33cc99',
  },
  donorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  donorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  donorInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  donorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  aidTime: {
    fontSize: 11,
    color: '#999',
  },
  aidDetail: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  aidType: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
    letterSpacing: 0.5,
  },
  aidQty: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  thanksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#e6f4ff',
  },
  thanksBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0077cc',
    marginLeft: 6,
  },
});
