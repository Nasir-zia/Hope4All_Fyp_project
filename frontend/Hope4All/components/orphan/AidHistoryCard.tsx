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
    <View style={[styles.aidCard, { borderLeftColor: aid.status === 'received' ? '#10b981' : '#f59e0b' }]}>
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
        <Text style={styles.aidType}>{aid.itemName || aid.type?.toUpperCase()}</Text>
        <Text style={styles.aidQty}>{aid.units} {aid.unitType || 'Units'}</Text>
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
            <Text style={{ fontSize: 8, fontWeight: '700', color: '#64748b', marginBottom: 2 }}>DONOR PROOF</Text>
            <Image 
              source={{ uri: aid.donorImage || aid.donationPhoto }} 
              style={{ width: '100%', height: 80, borderRadius: 12, backgroundColor: '#f1f5f9' }} 
              resizeMode="cover"
            />
          </View>
        )}

        {aid.receivedImage && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 8, fontWeight: '700', color: '#16a34a', marginBottom: 2 }}>RECEIPT PROOF</Text>
            <Image 
              source={{ uri: aid.receivedImage }} 
              style={{ width: '100%', height: 80, borderRadius: 12, backgroundColor: '#f0fdf4' }} 
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.btnRow}>
        {aid.status === 'in-transit' && onConfirm && onReport && (
          <View style={{ gap: 8, flex: 1.5 }}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => onConfirm(aid._id)}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.confirmBtnText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reportBtn}
              onPress={() => onReport(aid._id)}
            >
              <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
              <Text style={styles.reportBtnText}>Not Received</Text>
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
    padding: 20,
    borderRadius: 30,
    marginRight: 18,
    width: 260,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    borderLeftWidth: 6,
  },
  donorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  donorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  donorInitial: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0077cc',
  },
  donorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  aidTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  aidDetail: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  aidType: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 1,
    marginBottom: 4,
  },
  aidQty: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e293b',
  },
  thanksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  thanksBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0077cc',
    marginLeft: 8,
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 15 },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    marginLeft: 8,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  reportBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ef4444',
    marginLeft: 8,
  },
  btnRow: { flexDirection: 'column', gap: 10 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  statusText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
});
