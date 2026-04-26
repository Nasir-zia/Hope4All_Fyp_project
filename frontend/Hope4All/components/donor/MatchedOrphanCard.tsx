import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MatchedOrphanCardProps {
  orphan: any;
  onViewProfile: (orphan: any) => void;
  onMessage: (orphan: any) => void;
}

export const MatchedOrphanCard: React.FC<MatchedOrphanCardProps> = ({ orphan, onViewProfile, onMessage }) => {
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
