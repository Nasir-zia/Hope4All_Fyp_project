import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OrphanSectionProps {
  orphans: any[];
  matchedOrphanIds: string[];
  onViewOrphan: (o: any) => void;
  onMessage: (o: any) => void;
  onDonate?: (o: any) => void;
  onToggleMatch?: (o: any) => void;
}

export const OrphanSection: React.FC<OrphanSectionProps> = ({ 
  orphans, 
  matchedOrphanIds = [],
  onViewOrphan, 
  onMessage, 
  onDonate,
  onToggleMatch 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Your Matched Children</Text>
          <Text style={styles.subtitle}>Directly supporting these lives</Text>
        </View>
        <View style={styles.iconBox}>
          <Ionicons name="people-outline" size={20} color="#ec4899" />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {orphans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Make your first donation to see matches!</Text>
          </View>
        ) : (
          orphans.map((o) => {
            const isMatched = matchedOrphanIds.some((id: any) => {
              if (!id) return false;
              const idStr = typeof id === 'object' ? (id._id || id).toString() : id.toString();
              return idStr === o._id.toString();
            });
            return (
              <View key={o._id} style={styles.card}>
                <TouchableOpacity 
                  style={styles.favoriteHeartBtn} 
                  onPress={() => onToggleMatch && onToggleMatch(o)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={isMatched ? "heart" : "heart-outline"} size={18} color="#ec4899" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onViewOrphan(o)} style={styles.profileBox}>
                   <View style={styles.avatarContainer}>
                      {o.profilePic ? (
                        <Image source={{ uri: o.profilePic }} style={styles.avatar} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                           <Text style={styles.initials}>{o.name?.charAt(0).toUpperCase()}</Text>
                        </View>
                      )}
                   </View>
                   <Text style={styles.name}>{o.name}</Text>
                   <Text style={styles.age}>{o.age} years • {o.location}</Text>
                </TouchableOpacity>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => onMessage(o)}>
                     <Ionicons name="chatbubble-ellipses-outline" size={13} color="#0077cc" />
                     <Text style={styles.actionBtnText}>Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionBtn, styles.donateBtnAccent]} onPress={() => onDonate && onDonate(o)}>
                     <Ionicons name="gift-outline" size={13} color="#ec4899" />
                     <Text style={[styles.actionBtnText, { color: '#ec4899' }]}>Donate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fdf2f8', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 10 },
  emptyCard: { width: 300, padding: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' },
  card: { width: 180, backgroundColor: '#fff', borderRadius: 28, padding: 15, marginRight: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center', position: 'relative' },
  favoriteHeartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileBox: { alignItems: 'center', marginBottom: 15 },
  avatarContainer: { width: 70, height: 70, borderRadius: 24, overflow: 'hidden', marginBottom: 12, backgroundColor: '#f1f5f9' },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: { flex: 1, backgroundColor: '#ec4899', justifyContent: 'center', alignItems: 'center' },
  initials: { color: '#fff', fontSize: 24, fontWeight: '800' },
  name: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  age: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 6, width: '100%', justifyContent: 'center' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#f0f9ff', paddingVertical: 8, borderRadius: 12 },
  actionBtnText: { fontSize: 11, fontWeight: '700', color: '#0077cc' },
  donateBtnAccent: { backgroundColor: '#fdf2f8' },
});
