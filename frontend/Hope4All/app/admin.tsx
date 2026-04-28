import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchAdminStats,
  fetchAllRequests,
  updateRequestStatus,
  fetchAllVolunteers,
  createTaskApi,
  fetchAllUsers,
  updateUserStatusApi,
  fetchAllDonations,
  fetchPendingCourses,
  updateCourseStatusApi,
  addCourseApi
} from '@/constants/api';

// Modular Components
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CourseModal } from '@/components/donor/CourseModal';
import { StatsTab } from '@/components/admin/StatsTab';
import { RequestsTab } from '@/components/admin/RequestsTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { DonationsTab } from '@/components/admin/DonationsTab';
import { CoursesTab } from '@/components/admin/CoursesTab';
import { TaskModal } from '@/components/admin/TaskModal';

// Styles
import { adminStyles as styles } from '@/components/admin/AdminStyles';

type TabType = 'stats' | 'requests' | 'donations' | 'users' | 'courses';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Task Creation States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [submittingTask, setSubmittingTask] = useState(false);

  // Course Creation States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [courseCategory, setCourseCategory] = useState('Academic');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsD, reqsD, volD, usersD, dontD, coursesD] = await Promise.all([
        fetchAdminStats(), fetchAllRequests(), fetchAllVolunteers(), fetchAllUsers(), fetchAllDonations(), fetchPendingCourses()
      ]);
      setStats(statsD); setRequests(reqsD); setVolunteers(volD); setUsersList(usersD); setDonations(dontD); setPendingCourses(coursesD);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const onRefresh = async () => { setRefreshing(true); await loadAllData(); setRefreshing(false); };

  const handleApproveRequest = async (id: string) => {
    try { await updateRequestStatus(id, 'approved', user?.token || ''); Alert.alert("Success", "Approved!"); loadAllData(); } catch (err: any) { Alert.alert("Error", err.message); }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !taskDesc || !selectedVolunteer) return Alert.alert("Error", "Fill all fields");
    setSubmittingTask(true);
    try {
      await createTaskApi({ title: taskTitle, description: taskDesc, volunteerId: selectedVolunteer, date: new Date().toISOString(), assignedBy: user?.id });
      Alert.alert("Success", "Task assigned!"); setShowTaskModal(false); loadAllData();
    } catch (err: any) { Alert.alert("Error", err.message); } finally { setSubmittingTask(false); }
  };

  const handleUpdateUserStatus = async (id: string, status: string) => {
    const next = status === 'verified' ? 'suspended' : 'verified';
    try { await updateUserStatusApi(id, next, user?.token || ''); loadAllData(); } catch (err: any) { Alert.alert("Error", err.message); }
  };

  const handleUpdateCourseStatus = async (id: string, s: string) => {
    try { await updateCourseStatusApi(id, s); loadAllData(); } catch (err: any) { Alert.alert("Error", err.message); }
  };

  const handleAdminCourseSubmit = async () => {
    setSubmittingCourse(true);
    try {
      await addCourseApi({ title: courseTitle, description: courseDesc, link: courseLink, category: courseCategory, instructorId: user!.id });
      Alert.alert('Success', 'Course added!'); setShowCourseModal(false); loadAllData();
    } catch (err: any) { Alert.alert('Error', err.message); } finally { setSubmittingCourse(false); }
  };

  if (loading && !refreshing) return <View style={styles.centered}><ActivityIndicator size="large" color="#0f172a" /><Text style={styles.loadingText}>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <AdminHeader onLogout={logout} />
      <View style={styles.tabBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
          {[
            { id: 'stats', icon: 'pie-chart', label: 'Stats' },
            { id: 'requests', icon: 'list', label: 'Requests' },
            { id: 'donations', icon: 'cash', label: 'Donations' },
            { id: 'users', icon: 'people', label: 'Users' },
            { id: 'courses', icon: 'school', label: 'LMS' }
          ].map(t => (
            <TouchableOpacity key={t.id} style={[styles.tabItem, activeTab === t.id && styles.tabActive]} onPress={() => setActiveTab(t.id as TabType)}>
              <Ionicons name={t.icon as any} size={18} color={activeTab === t.id ? '#fff' : '#64748b'} />
              <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {activeTab === 'stats' && <StatsTab usersCount={usersList.length} donationsCount={donations.length} pendingRequestsCount={requests.filter(r => r.status === 'pending').length} volunteersCount={volunteers.length} stats={stats} />}
        {activeTab === 'requests' && <RequestsTab requests={requests} onApprove={handleApproveRequest} />}
        {activeTab === 'donations' && <DonationsTab donations={donations} />}
        {activeTab === 'users' && <UsersTab users={usersList} onUpdateStatus={handleUpdateUserStatus} />}
        {activeTab === 'courses' && <CoursesTab pendingCourses={pendingCourses} onAddPress={() => setShowCourseModal(true)} onUpdateStatus={handleUpdateCourseStatus} />}
      </ScrollView>
      <CourseModal visible={showCourseModal} onClose={() => setShowCourseModal(false)} onSubmit={handleAdminCourseSubmit} loading={submittingCourse} title={courseTitle} setTitle={setCourseTitle} desc={courseDesc} setDesc={setCourseDesc} link={courseLink} setLink={setCourseLink} category={courseCategory} setCategory={setCourseCategory} />
      <TaskModal visible={showTaskModal} onClose={() => setShowTaskModal(false)} onConfirm={handleCreateTask} submitting={submittingTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskDesc={taskDesc} setTaskDesc={setTaskDesc} volunteers={volunteers} selectedVolunteer={selectedVolunteer} setSelectedVolunteer={setSelectedVolunteer} />
    </View>
  );
}
