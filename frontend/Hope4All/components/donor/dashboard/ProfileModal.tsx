import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileModalProps {
  visible: boolean;
  orphan: any;
  onClose: () => void;
  onViewDoc: (url: string) => void;
  onMessage: (orphan: any) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible, orphan, onClose, onViewDoc, onMessage
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Orphan Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {orphan && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
              <View style={styles.hero}>
                <View style={styles.avatarBorder}>
                  {orphan.profilePic ? (
                    <Image source={{ uri: orphan.profilePic }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.initials}>{orphan.name?.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.name}>{orphan.name}</Text>
                <View style={styles.locRow}>
                  <Ionicons name="location" size={14} color="#0077cc" />
                  <Text style={styles.location}>{orphan.location}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Age</Text>
                  <Text style={styles.statValue}>{orphan.age} Years</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Gender</Text>
                  <Text style={styles.statValue}>{orphan.gender || 'Not specified'}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.eduRow}>
                  <View style={styles.eduItem}>
                    <Text style={styles.eduLabel}>School</Text>
                    <Text style={styles.eduValue} numberOfLines={1}>{orphan.school || 'Not specified'}</Text>
                  </View>
                  <View style={styles.eduItem}>
                    <Text style={styles.eduLabel}>Class</Text>
                    <Text style={styles.eduValue}>{orphan.classLevel || 'Not specified'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Biography</Text>
                <Text style={styles.bio}>
                  {orphan.bio || `Meet ${orphan.name}, a promising child from ${orphan.location} who is currently seeking support for their education and wellbeing.`}
                </Text>
              </View>

              <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.docBtn} onPress={() => onViewDoc(orphan.supportingDocs)}>
                  <Ionicons name="shield-checkmark" size={20} color="#fff" />
                  <Text style={styles.btnText}>Verified Documents</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.msgBtn} onPress={() => onMessage(orphan)}>
                  <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  <Text style={styles.btnText}>Send Message</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { height: '85%', backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 30 },
  avatarBorder: { width: 110, height: 110, borderRadius: 40, padding: 4, borderWidth: 2, borderColor: '#0077cc', marginBottom: 15 },
  avatar: { width: '100%', height: '100%', borderRadius: 36 },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 36, backgroundColor: '#0077cc', justifyContent: 'center', alignItems: 'center' },
  initials: { fontSize: 40, fontWeight: '800', color: '#fff' },
  name: { fontSize: 26, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  location: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  statsRow: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 24, padding: 20, marginBottom: 30, alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  divider: { width: 1, height: 30, backgroundColor: '#e2e8f0' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 10 },
  bio: { fontSize: 15, color: '#475569', lineHeight: 24 },
  actionGroup: { gap: 12 },
  docBtn: { flexDirection: 'row', backgroundColor: '#0077cc', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 10 },
  msgBtn: { flexDirection: 'row', backgroundColor: '#ec4899', padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  eduRow: { flexDirection: 'row', gap: 15, backgroundColor: '#f0f9ff', padding: 15, borderRadius: 20 },
  eduItem: { flex: 1 },
  eduLabel: { fontSize: 10, color: '#0077cc', fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  eduValue: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
});
