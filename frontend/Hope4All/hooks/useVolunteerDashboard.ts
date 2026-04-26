import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { fetchVolunteerTasks, fetchVolunteerStats, updateTaskStatusApi } from '../constants/api';
import { useAuth } from './useAuth';

export function useVolunteerDashboard() {
  const { user, logout } = useAuth();
  const token = user?.token;
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (showIndicator = true) => {
    if (!user?.id) return;
    if (showIndicator) setLoading(true);
    
    try {
      const authToken = token || '';
      const [tasksData, statsData] = await Promise.all([
        fetchVolunteerTasks(user.id, authToken),
        fetchVolunteerStats(user.id, authToken)
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading volunteer dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatusApi(taskId, newStatus, token || undefined);
      Alert.alert('Success', `Task marked as ${newStatus.replace('_', ' ')}`);
      loadData(false);
    } catch (err) {
      Alert.alert('Error', 'Could not update task status');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(false);
  }, [loadData]);

  return {
    logout,
    tasks,
    stats,
    loading,
    refreshing,
    handleUpdateStatus,
    onRefresh
  };
}
