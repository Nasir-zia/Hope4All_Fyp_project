import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Animated, Dimensions } from 'react-native';
import {
  fetchAdminStats,
  fetchAllRequests,
  updateRequestStatus,
  fetchAllVolunteers,
  createTaskApi,
  fetchAllTasks,
  fetchAllUsers,
  updateUserStatusApi,
  fetchAllDonations,
  fetchAllCourses,
  updateCourseStatusApi
} from '../constants/api';
import { useAuth } from './useAuth';

export type TabType = 'stats' | 'requests' | 'tasks' | 'donations' | 'users' | 'learning';

export function useAdminDashboard() {
  const { user, logout } = useAuth();
  const token = user?.token;
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [broadcastToAll, setBroadcastToAll] = useState(false);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [submittingTask, setSubmittingTask] = useState(false);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [courseCategory, setCourseCategory] = useState('Academic');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current;

  const toggleSidebar = useCallback((open: boolean) => {
    if (open) {
      setIsSidebarOpen(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sidebarAnim, {
        toValue: -Dimensions.get('window').width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setIsSidebarOpen(false));
    }
  }, [sidebarAnim]);

  const loadAllData = useCallback(async (showIndicator = true) => {
    if (!token) return;
    if (showIndicator) setLoading(true);

    try {
      const [statsData, reqsData, volData, usersData, dontData, tasksData, coursesData] = await Promise.all([
        fetchAdminStats(token),
        fetchAllRequests(token),
        fetchAllVolunteers(token),
        fetchAllUsers(token),
        fetchAllDonations(token),
        fetchAllTasks(token),
        fetchAllCourses(token)
      ]);
      setStats(statsData);
      setRequests(reqsData);
      setVolunteers(volData);
      setUsersList(usersData);
      setDonations(dontData);
      setAllTasks(tasksData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAllData(false);
  }, [loadAllData]);

  const handleApproveRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, 'approved', token || undefined);
      Alert.alert("Success", "Request approved successfully.");
      loadAllData(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not approve request");
    }
  };

  const handleUpdateUserStatus = async (userId: string, currentStatus: string) => {
    let newStatus = currentStatus === 'verified' ? 'suspended' : 'verified';
    try {
      await updateUserStatusApi(userId, newStatus, token || undefined);
      Alert.alert("Success", `User is now ${newStatus}`);
      loadAllData(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update user");
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !taskDesc || (!selectedVolunteer && !broadcastToAll)) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    setSubmittingTask(true);
    try {
      const vIds = broadcastToAll ? volunteers.map(v => v._id) : selectedVolunteer;
      await createTaskApi({
        title: taskTitle,
        description: taskDesc,
        volunteerId: vIds,
        priority: taskPriority,
        date: new Date().toISOString(),
        assignedBy: user?.id || '',
      }, token || undefined);

      Alert.alert("Success", "Task created successfully!");
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      loadAllData(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not create task");
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleUpdateCourseStatus = async (id: string, status: string) => {
    try {
      await updateCourseStatusApi(id, status);
      Alert.alert("Success", `Course ${status}`);
      loadAllData(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update course");
    }
  };

  return {
    logout,
    activeTab, setActiveTab,
    stats, requests, volunteers, allTasks, courses, usersList, donations,
    loading, refreshing,
    isSidebarOpen, sidebarAnim, toggleSidebar,
    onRefresh,
    handleApproveRequest,
    handleUpdateUserStatus,
    handleUpdateCourseStatus,

    // Task Form
    showTaskModal, setShowTaskModal,
    taskTitle, setTaskTitle,
    taskDesc, setTaskDesc,
    selectedVolunteer, setSelectedVolunteer,
    broadcastToAll, setBroadcastToAll,
    taskPriority, setTaskPriority,
    submittingTask,
    handleCreateTask,

    // Course Form
    showCourseModal, setShowCourseModal,
    courseTitle, setCourseTitle,
    courseDesc, setCourseDesc,
    courseLink, setCourseLink,
    courseCategory, setCourseCategory,
    submittingCourse
  };
}
