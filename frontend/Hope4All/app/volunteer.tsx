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
import BackButton from './components/BackButton';

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
      const token = user.token || '';
      const [tasksData, statsData] = await Promise.all([
        fetchVolunteerTasks(user.id, token),
        fetchVolunteerStats(user.id, token)
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.log('Error loading volunteer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatusApi(taskId, newStatus, user?.token || '');
      Alert.alert('Success', `Task marked as ${newStatus.replace('_', ' ')}`);
      loadDashboardData();
    } catch (err) {
      Alert.alert('Error', 'Could not update task status');
    }
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'high' ? '#ff4444' : '#ffbb33' }]}>
          <Text style={styles.priorityText}>{item.priority?.toUpperCase()}</Text>
        </View>
        <Text style={styles.taskStatus}>{item.status?.replace('_', ' ').toUpperCase()}</Text>
      </View>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDesc}>{item.description}</Text>
      <View style={styles.taskFooter}>
        <Ionicons name="location-outline" size={14} color="#666" />
        <Text style={styles.taskLocation}>{item.orphanageId?.name || 'Central Office'}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.taskDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.btnRow}>
        {item.status === 'assigned' && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.progressBtn]} 
            onPress={() => handleUpdateStatus(item._id, 'in_progress')}
          >
            <Text style={styles.actionBtnText}>Start Task</Text>
          </TouchableOpacity>
        )}
        {item.status === 'in_progress' && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.completeBtn]} 
            onPress={() => handleUpdateStatus(item._id, 'completed')}
          >
            <Text style={styles.actionBtnText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={styles.loadingText}>Fetching assigned tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerIcon} 
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: logout }
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.headerIcon, { right: 80 }]} 
          onPress={() => router.push('/messages')}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.welcome}>Hello,</Text>
        <Text style={styles.name}>{user?.username || 'Volunteer'}</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => {
              setRefreshing(true);
              loadDashboardData().then(() => setRefreshing(false));
            }} 
          />
        }
      >
        {stats && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.activeTasks}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.completedTasks}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Success</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>My Assignments</Text>
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No tasks assigned yet.</Text>
            <Text style={styles.emptySub}>Check back later or contact admin.</Text>
          </View>
        ) : (
          tasks.map(task => renderTaskItem({ item: task }))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 25,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerIcon: {
    position: 'absolute',
    right: 25,
    top: 50,
    padding: 10,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
  },
  welcome: {
    fontSize: 16,
    color: '#777',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: 11,
    color: '#999',
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  taskDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f5f7fa',
  },
  taskLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressBtn: {
    backgroundColor: '#0077cc',
  },
  completeBtn: {
    backgroundColor: '#33cc99',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  emptySub: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  }
});

