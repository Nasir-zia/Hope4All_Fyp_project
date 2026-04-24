import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

interface ActionCardsProps {
  onOpenMaterialRequest: () => void;
  onViewProgress: () => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({ onOpenMaterialRequest, onViewProgress }) => {
  const { materialRequests, progressReports } = useOrphan();

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>Main Actions</Text>
      
      <TouchableOpacity
        style={[localStyles.actionCard, localStyles.blueCard]}
        onPress={onOpenMaterialRequest}
      >
        <View style={[localStyles.iconCircle, { backgroundColor: '#e0f2fe' }]}>
          <Ionicons name="school-outline" size={24} color="#0369a1" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={localStyles.actionTitle}>Request Materials</Text>
          <Text style={localStyles.actionDesc}>Books, stationery & supplies</Text>
        </View>
        {materialRequests.length > 0 && (
          <View style={localStyles.badge}>
            <Text style={localStyles.badgeText}>{materialRequests.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={localStyles.actionCard}
        onPress={() => router.push('/messages')}
      >
        <View style={[localStyles.iconCircle, { backgroundColor: '#fef2f2' }]}>
          <Ionicons name="chatbubble-outline" size={24} color="#b91c1c" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={localStyles.actionTitle}>Ask for Help</Text>
          <Text style={localStyles.actionDesc}>Connect with donors & volunteers</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={localStyles.actionCard}
        onPress={onViewProgress}
      >
        <View style={[localStyles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
          <Ionicons name="document-outline" size={24} color="#15803d" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={localStyles.actionTitle}>Progress History</Text>
          <Text style={localStyles.actionDesc}>Detailed achievements ({progressReports.length})</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  blueCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#0077cc',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  actionDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#0077cc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
});
