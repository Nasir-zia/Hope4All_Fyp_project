import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AidHistoryCardProps {
  aid: any;
  onThanks: (id: string) => void;
  onConfirm?: (id: string) => void;
  onReport?: (id: string) => void;
}

export const AidHistoryCard: React.FC<AidHistoryCardProps> = ({ aid, onThanks, onConfirm, onReport }) => {
  const isGeneral = !aid.recipientId;
  const donorName = isGeneral ? 'Community Support' : (aid.donorId?.name || 'Kind Donor');
  const profilePic = aid.donorId?.profilePic;

  return (
    <View style={[styles.aidCard, { borderLeftColor: aid.status === 'completed' ? '#10b981' : '#f59e0b' }]}>
      <View style={styles.donorHeader}>
        <View style={styles.donorAvatar}>
          {profilePic && !isGeneral ? (
            <Image source={{ uri: profilePic }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.donorInitial}>{(donorName.charAt(0)).toUpperCase()}</Text>
          )}
        </View>
        <View>
          <Text style={styles.donorName}>{donorName}</Text>
          <Text style={styles.aidTime}>{new Date(aid.donatedAt || aid.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.aidDetail}>
        <Text style={styles.aidType}>{aid.type?.toUpperCase()}</Text>
        <Text style={styles.aidQty}>{aid.units} {aid.unitType || 'Units'}</Text>
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

        {aid.donationPhoto && (
          <View style={{ marginTop: 10 }}>
            <Image 
              source={{ uri: aid.donationPhoto }} 
              style={{ width: '100%', height: 100, borderRadius: 12, backgroundColor: '#f1f5f9' }} 
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.btnRow}>
        {aid.status === 'sent' && onConfirm && onReport && (
          <View style={{ gap: 8, flex: 1.5 }}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => onConfirm(aid._id)}
            >
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.confirmBtnText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: '#ef4444' }]}
              onPress={() => onReport(aid._id)}
            >
              <Ionicons name="close-circle" size={16} color="#fff" />
              <Text style={styles.confirmBtnText}>Not Received</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.thanksBtn, { flex: 1 }]}
          onPress={() => onThanks(aid.donorId)}
        >
          <Ionicons name="heart" size={16} color="#0077cc" />
          <Text style={styles.thanksBtnText}>Say Thanks</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
  },
  thanksBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0077cc',
    marginLeft: 6,
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 20 },
  confirmBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#10b981',
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 6,
  },
  btnRow: { flexDirection: 'row', gap: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  statusText: { fontSize: 9, fontWeight: '800' },
});
