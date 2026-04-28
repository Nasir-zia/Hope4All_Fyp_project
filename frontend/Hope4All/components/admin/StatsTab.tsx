import React from 'react';
import { View, Text } from 'react-native';
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
            <Ionicons name="people" size={24} color="#2563eb" />
          </View>
          <Text style={styles.statVal}>{usersCount || stats?.totalUsers || 0}</Text>
          <Text style={styles.statLab}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
          <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
            <FontAwesome5 name="hand-holding-heart" size={20} color="#16a34a" />
          </View>
          <Text style={styles.statVal}>{donationsCount}</Text>
          <Text style={styles.statLab}>Donations</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fffbeb' }]}>
          <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="list" size={24} color="#d97706" />
          </View>
          <Text style={styles.statVal}>{pendingRequestsCount}</Text>
          <Text style={styles.statLab}>Pending Reqs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
          <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
            <MaterialIcons name="assignment" size={24} color="#dc2626" />
          </View>
          <Text style={styles.statVal}>{stats?.activeVolunteers || volunteersCount || 0}</Text>
          <Text style={styles.statLab}>Active Tasks</Text>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Total Donors</Text>
              <Text style={styles.infoVal}>{stats?.activeDonors || 0}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Total Orphans</Text>
              <Text style={styles.infoVal}>{stats?.totalOrphans || 0}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Active Orphanages</Text>
              <Text style={styles.infoVal}>{stats?.totalOrphanages || 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
