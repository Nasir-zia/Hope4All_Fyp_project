import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AidHistoryCard } from './AidHistoryCard';

interface AidHistorySectionProps {
  aidHistory: any[];
  onThanks: (donor: any) => void;
  onConfirm: (id: string) => void;
  onReport: (id: string) => void;
}

export const AidHistorySection: React.FC<AidHistorySectionProps> = ({ aidHistory, onThanks, onConfirm, onReport }) => {
  // Show both en-route items and history items here if desired, 
  // or keep it for all if that's what user prefers.
  const history = aidHistory; // Showing everything for now as per "Show here" request

  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Impact History</Text>
          <Text style={styles.subtitle}>A record of kindness received</Text>
        </View>
        <View style={styles.iconBox}>
          <Ionicons name="medal-outline" size={20} color="#16a34a" />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {history.map((aid) => (
          <AidHistoryCard 
            key={aid._id} 
            aid={aid} 
            onThanks={() => onThanks(aid.donorId)} 
            onConfirm={onConfirm}
            onReport={onReport}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 10 },
});
