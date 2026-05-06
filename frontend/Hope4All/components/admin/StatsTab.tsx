import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface StatsTabProps {
  usersCount: number;
  donationsCount: number;
  pendingRequestsCount: number;
  volunteersCount: number;
  stats: any;
}

export const StatsTab: React.FC<StatsTabProps> = ({ 
  usersCount, 
  donationsCount, 
  pendingRequestsCount, 
  volunteersCount,
  stats 
}) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
          <View style={[styles.iconBox, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="heart" size={24} color="#2563eb" />
          </View>
          <Text style={styles.statVal}>{stats?.stats?.totalDonors || 0}</Text>
          <Text style={styles.statLab}>Donors</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
          <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
            <FontAwesome5 name="child" size={20} color="#16a34a" />
          </View>
          <Text style={styles.statVal}>{stats?.stats?.totalOrphans || 0}</Text>
          <Text style={styles.statLab}>Orphans</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fffbeb' }]}>
          <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="business" size={24} color="#d97706" />
          </View>
          <Text style={styles.statVal}>{stats?.stats?.totalOrphanages || 0}</Text>
          <Text style={styles.statLab}>Orphanages</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
          <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
            <MaterialIcons name="people" size={24} color="#dc2626" />
          </View>
          <Text style={styles.statVal}>{stats?.stats?.totalVolunteers || 0}</Text>
          <Text style={styles.statLab}>Volunteers</Text>
        </View>
      </View>

    </View>
  );
};
