import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { fetchVolunteerTasks, fetchVolunteerStats, updateTaskStatusApi } from '@/constants/api';
import { VolunteerHeader } from '@/components/volunteer/VolunteerHeader';
import { VolunteerTaskCard } from '@/components/volunteer/VolunteerTaskCard';

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        fetchVolunteerTasks(user.id),
        fetchVolunteerStats(user.id)
      ]);
      setTasks(tasksData || []);
      setStats(statsData);
    } catch (err) {
      console.log('Error loading volunteer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      Alert.alert('Success', `Task marked as ${newStatus.replace('_', ' ')}`);
      loadDashboardData();
    } catch (err) {
      Alert.alert('Error', 'Could not update task status');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={styles.loadingText}>Syncing Missions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VolunteerHeader 
        name={user?.username || 'Volunteer'} 
        onLogout={logout} 
        onMessages={() => router.push('/messages')} 
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{stats?.completedTasks || 0}</Text>
            <Text style={styles.statLab}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{stats?.pendingTasks || 0}</Text>
            <Text style={styles.statLab}>Pending</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Missions</Text>
        {tasks.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="clipboard-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No tasks assigned to you yet.</Text>
          </View>
        ) : (
          tasks.map(task => (
            <VolunteerTaskCard 
              key={task._id} 
              task={task} 
              onUpdateStatus={handleUpdateStatus} 
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#0077cc',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  statLab: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  emptyBox: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  }
});

