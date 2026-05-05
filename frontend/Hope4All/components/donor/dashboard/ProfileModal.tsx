import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileModalProps {
  visible: boolean;
  orphan: any;
  achievements?: any[];
  loadingAchievements?: boolean;
  onClose: () => void;
  onViewDoc: (url: string) => void;
  onMessage: (orphan: any) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible, orphan, achievements, loadingAchievements, onClose, onViewDoc, onMessage
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
                <Text style={styles.sectionTitle}>Context & Contact</Text>
                <View style={[styles.eduRow, { backgroundColor: '#fdf2f8' }]}>
                  <View style={styles.eduItem}>
                    <Text style={[styles.eduLabel, { color: '#ec4899' }]}>Orphanage</Text>
                    <Text style={styles.eduValue} numberOfLines={1}>
                      {orphan.orphanageId?.name || 'Independent'}
                    </Text>
                  </View>
                  <View style={styles.eduItem}>
                    <Text style={[styles.eduLabel, { color: '#ec4899' }]}>Phone</Text>
                    <Text style={styles.eduValue}>{orphan.phone || 'Not Shared'}</Text>
                  </View>
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

              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Achievements</Text>
                  {loadingAchievements && <ActivityIndicator size="small" color="#0077cc" />}
                </View>
                
                {achievements && achievements.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementScroller}>
                    {achievements.map((item) => (
                      <View key={item._id} style={styles.achievementCard}>
                        <View style={styles.achievementHeader}>
                          <View style={styles.catBadge}>
                            <Text style={styles.catText}>{item.category?.toUpperCase()}</Text>
                          </View>
                          <Text style={styles.scoreText}>{item.score}</Text>
                        </View>
                        <Text style={styles.achievementTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.remarksText} numberOfLines={2}>{item.remarks}</Text>
                        {item.image && (
                           <Image source={{ uri: item.image }} style={styles.achievementImg} />
                        )}
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="medal-outline" size={30} color="#cbd5e1" />
                    <Text style={styles.emptyText}>No achievements recorded yet.</Text>
                  </View>
                )}
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
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  achievementScroller: { paddingVertical: 5 },
  achievementCard: { width: 220, backgroundColor: '#f8fafc', padding: 15, borderRadius: 24, marginRight: 15, borderWidth: 1, borderColor: '#f1f5f9' },
  achievementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  catBadge: { backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 9, fontWeight: '800', color: '#0077cc' },
  scoreText: { fontSize: 14, fontWeight: '800', color: '#0077cc' },
  achievementTitle: { fontSize: 14, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  remarksText: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 10 },
  achievementImg: { width: '100%', height: 80, borderRadius: 12, marginTop: 5 },
  emptyState: { backgroundColor: '#f8fafc', padding: 30, borderRadius: 24, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { marginTop: 10, fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
});
