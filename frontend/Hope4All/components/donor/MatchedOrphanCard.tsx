import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MatchedOrphanCardProps {
  orphan: any;
  onViewProfile: (orphan: any) => void;
  onMessage: (orphan: any) => void;
  isVertical?: boolean;
}

export const MatchedOrphanCard: React.FC<MatchedOrphanCardProps> = ({ orphan, onViewProfile, onMessage, isVertical }) => {
  if (isVertical) {
    return (
      <TouchableOpacity 
        style={styles.verticalCard} 
        onPress={() => onViewProfile(orphan)}
        activeOpacity={0.7}
      >
        <View style={styles.verticalAvatar}>
          <Text style={styles.verticalAvatarText}>{(orphan.name?.charAt(0) || 'O').toUpperCase()}</Text>
        </View>
        <View style={styles.verticalInfo}>
          <Text style={styles.verticalName}>{orphan.name}</Text>
          <Text style={styles.verticalLocation}>
             <Ionicons name="location-sharp" size={12} color="#64748b" /> {orphan.location}
          </Text>
          <View style={styles.verticalBadgeRow}>
            <View style={styles.tag}><Text style={styles.tagText}>{orphan.age} yrs</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>{orphan.gender}</Text></View>
          </View>
        </View>
        <TouchableOpacity style={styles.verticalMessageBtn} onPress={() => onMessage(orphan)}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#0077cc" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.orphanPortrait}>
      <View style={styles.orphanInitialBox}>
        <Text style={styles.orphanInitialText}>{(orphan.name?.charAt(0) || 'O').toUpperCase()}</Text>
      </View>
      <Text style={styles.orphanName}>{orphan.name}</Text>
      <Text style={styles.orphanLocation}>{orphan.location}</Text>
      
      <TouchableOpacity 
        style={styles.orphanMessageBtn}
        onPress={() => onViewProfile(orphan)}
      >
        <Ionicons name="person-outline" size={16} color="#4da6ff" />
        <Text style={styles.orphanMessageText}>View Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.orphanMessageBtn, { marginTop: 8, borderColor: '#e2e8f0' }]}
        onPress={() => onMessage(orphan)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={16} color="#666" />
        <Text style={[styles.orphanMessageText, { color: '#666' }]}>Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  orphanPortrait: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  verticalCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  verticalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0077cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  verticalInfo: {
    flex: 1,
    marginLeft: 15,
  },
  verticalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  verticalLocation: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  verticalBadgeRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  tagText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  verticalMessageBtn: {
    padding: 10,
  },
  orphanInitialBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4da6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  orphanInitialText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  orphanName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  orphanLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  orphanMessageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e6f4ff',
    borderRadius: 12,
  },
  orphanMessageText: {
    fontSize: 12,
    color: '#0077cc',
    fontWeight: '600',
    marginLeft: 4,
  },
});
