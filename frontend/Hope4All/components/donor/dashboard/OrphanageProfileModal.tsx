import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrphanageProfileModalProps {
  visible: boolean;
  onClose: () => void;
  orphanage: any;
}

export const OrphanageProfileModal: React.FC<OrphanageProfileModalProps> = ({ visible, onClose, orphanage }) => {
  if (!orphanage) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatarLarge}>
               <Ionicons name="business" size={40} color="#fff" />
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <Text style={styles.name}>{orphanage.name}</Text>
            <View style={styles.regBadge}>
              <Text style={styles.regText}>REG ID: {orphanage.registrationNumber}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color="#0077cc" />
                <Text style={styles.infoText}>{orphanage.contactInfo?.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={18} color="#0077cc" />
                <Text style={styles.infoText}>{orphanage.contactInfo?.email}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#0077cc" />
                <Text style={styles.infoText}>
                  {orphanage.location?.address}, {orphanage.location?.city}, {orphanage.location?.state} {orphanage.location?.zipCode}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Institutional Capacity</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                   <Text style={styles.statVal}>{orphanage.capacity?.current}</Text>
                   <Text style={styles.statLabel}>Current Children</Text>
                </View>
                <View style={styles.statBox}>
                   <Text style={styles.statVal}>{orphanage.capacity?.max}</Text>
                   <Text style={styles.statLabel}>Max Capacity</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => Linking.openURL(`tel:${orphanage.contactInfo?.phone}`)}
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.actionText}>Contact Orphanage</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  content: { backgroundColor: '#fff', borderRadius: 32, padding: 25, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  avatarLarge: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#0077cc', justifyContent: 'center', alignItems: 'center' },
  closeBtn: { padding: 5 },
  body: { marginBottom: 20 },
  name: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  regBadge: { alignSelf: 'flex-start', backgroundColor: '#f0f9ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 25 },
  regText: { fontSize: 12, fontWeight: '700', color: '#0077cc' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { fontSize: 15, color: '#475569', flex: 1, lineHeight: 22 },
  statsRow: { flexDirection: 'row', gap: 15 },
  statBox: { flex: 1, backgroundColor: '#f8fafc', padding: 15, borderRadius: 20, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '800', color: '#0077cc' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 4 },
  actionBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
