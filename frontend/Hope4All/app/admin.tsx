import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchAdminStats,
  fetchAllRequests,
  updateRequestStatus,
  fetchAllVolunteers,
  fetchAllTasks,
  createTaskApi,
  fetchAllUsers,
  updateUserStatusApi,
  suspendUserApi,
  unsuspendUserApi,
  deleteUserApi,
  fetchAllDonations,
  fetchPendingCourses,
  fetchApprovedCourses,
  updateCourseStatusApi,
  addCourseApi,
  fetchOrphanageOptions,
  forwardDonationApi,
  completeDonationApi,
  updateDonationStatusApi,
  updateTaskStatusApi
} from '@/constants/api';

// Modular Components
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CourseModal } from '@/components/donor/CourseModal';
import { StatsTab } from '@/components/admin/StatsTab';
import { RequestsTab } from '@/components/admin/RequestsTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { DonationsTab } from '@/components/admin/DonationsTab';
import { CoursesTab } from '@/components/admin/CoursesTab';
import { OrphanagesTab } from '@/components/admin/OrphanagesTab';
import { TasksTab } from '@/components/admin/TasksTab';
import { TaskModal } from '@/components/admin/TaskModal';

// Styles
import { adminStyles as styles } from '@/components/admin/AdminStyles';

type TabType = 'stats' | 'requests' | 'donations' | 'users' | 'orphanages' | 'courses' | 'tasks';

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
  const [approvedCourses, setApprovedCourses] = useState<any[]>([]);
  const [orphanagesList, setOrphanagesList] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
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
  const [courseDuration, setCourseDuration] = useState('');
  const [assignedOrphan, setAssignedOrphan] = useState('');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsD, reqsD, volD, usersD, dontD, pendingCoursesD, approvedCoursesD, orphanagesD, tasksD] = await Promise.all([
        fetchAdminStats(), 
        fetchAllRequests(), 
        fetchAllVolunteers(), 
        fetchAllUsers(), 
        fetchAllDonations(), 
        fetchPendingCourses(user?.token), 
        fetchApprovedCourses(),
        fetchOrphanageOptions(), 
        fetchAllTasks()
      ]);
      setStats(statsD.stats);
      setRequests(reqsD);
      setVolunteers(volD);
      setUsersList(usersD);
      setDonations(dontD);
      setPendingCourses(pendingCoursesD);
      setApprovedCourses(approvedCoursesD);
      setOrphanagesList(orphanagesD);
      setTasks(tasksD);
      setStats(statsD);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const onRefresh = async () => { setRefreshing(true); await loadAllData(); setRefreshing(false); };

  const handleApproveRequest = async (id: string) => {
    try { await updateRequestStatus(id, 'approved', user?.token || ''); Alert.alert("Success", "Approved!"); loadAllData(); } catch (err: any) { Alert.alert("Error", err.message); }
  };

  const handleRejectRequest = async (id: string) => {
    try { await updateRequestStatus(id, 'rejected', user?.token || ''); Alert.alert("Success", "Rejected!"); loadAllData(); } catch (err: any) { Alert.alert("Error", err.message); }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !taskDesc || !selectedVolunteer) return Alert.alert("Error", "Fill all fields");
    setSubmittingTask(true);
    try {
      await createTaskApi({ title: taskTitle, description: taskDesc, volunteerId: selectedVolunteer, date: new Date().toISOString(), assignedBy: user?.id }, user?.token);
      Alert.alert("Success", "Task assigned!"); setShowTaskModal(false); loadAllData();
    } catch (err: any) { Alert.alert("Error", err.message); } finally { setSubmittingTask(false); }
  };

  const handleUpdateUserStatus = async (id: string, targetStatus: string, reason?: string) => {
    try {
      if (targetStatus === 'suspended') {
        await suspendUserApi(id, reason || "Violation of terms", user?.token || '');
      } else if (targetStatus === 'verified' && usersList.find(u => u._id === id)?.status === 'suspended') {
        await unsuspendUserApi(id, user?.token || '');
      } else {
        await updateUserStatusApi(id, targetStatus, user?.token || '');
      }

      Alert.alert("Success", `User status updated!`);
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirm = Platform.OS === 'web'
      ? window.confirm("Are you sure you want to PERMANENTLY delete this user?")
      : true;

    if (!confirm) return;

    try {
      await deleteUserApi(id, user?.token || '');
      Alert.alert("Deleted", "User has been removed from the system.");
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleUpdateCourseStatus = async (id: string, s: string) => {
    try { await updateCourseStatusApi(id, s); loadAllData(); } catch (err: any) { Alert.alert("Error", err.message); }
  };

  const handleAdminCourseSubmit = async () => {
    if (!courseTitle.trim() || !courseDesc.trim() || !courseLink.trim() || !courseCategory.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Title, Description, Link, and Category)');
      return;
    }

    setSubmittingCourse(true);
    try {
      console.log("[AdminDashboard] Submitting new course details:", {
        title: courseTitle,
        description: courseDesc,
        link: courseLink,
        category: courseCategory,
        instructorId: user!.id,
        duration: courseDuration,
        assignedOrphan
      });

      await addCourseApi(
        { 
          title: courseTitle, 
          description: courseDesc, 
          link: courseLink, 
          category: courseCategory, 
          instructorId: user!.id,
          duration: courseDuration,
          assignedOrphan: assignedOrphan || undefined
        }, 
        user?.token
      );

      Alert.alert('Success', 'Course added successfully!');
      
      // Reset form states
      setCourseTitle('');
      setCourseDesc('');
      setCourseLink('');
      setCourseCategory('Academic');
      setCourseDuration('');
      setAssignedOrphan('');
      
      setShowCourseModal(false);
      loadAllData();
    } catch (err: any) { 
      console.error("[AdminDashboard] Course creation failed:", err);
      Alert.alert('Error', err.message || 'Failed to add course'); 
    } finally { 
      setSubmittingCourse(false); 
    }
  };

  const handleForwardDonation = async (id: string) => {
    try {
      await forwardDonationApi(id, user?.token || '');
      Alert.alert("Success", "Donation verified and forwarded!");
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleUpdateDonationStatus = async (id: string, status: string) => {
    try {
      await updateDonationStatusApi(id, status, user?.token || '');
      Alert.alert("Success", `Donation status updated to ${status}!`);
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleCompleteDonation = async (id: string) => {
    try {
      await completeDonationApi(id, user?.token || '');
      Alert.alert("Success", "Donation marked as completed!");
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTaskStatusApi(taskId, { status: 'completed' }, user?.token);
      Alert.alert("Success", "Task marked as completed!");
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", "Could not complete task");
    }
  };

  if (loading && !refreshing) return <View style={styles.centered}><ActivityIndicator size="large" color="#0f172a" /><Text style={styles.loadingText}>Loading...</Text></View>;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
      <View style={styles.container}>
      <AdminHeader onLogout={logout} />
      <View style={styles.tabBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
          {[
            { id: 'stats', icon: 'pie-chart', label: 'Stats' },
            { id: 'requests', icon: 'list', label: 'Requests' },
            { id: 'donations', icon: 'cash', label: 'Donations' },
            { id: 'users', icon: 'people', label: 'Users' },
            { id: 'orphanages', icon: 'business', label: 'Orphanages' },
            { id: 'courses', icon: 'school', label: 'LMS' },
            { id: 'tasks', icon: 'clipboard', label: 'Tasks' }
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
        {activeTab === 'requests' && <RequestsTab requests={requests} onApprove={handleApproveRequest} onReject={handleRejectRequest} />}
        {activeTab === 'donations' && <DonationsTab donations={donations} onUpdateStatus={handleUpdateDonationStatus} onForward={handleForwardDonation} onComplete={handleCompleteDonation} />}
        {activeTab === 'users' && <UsersTab users={usersList} onUpdateStatus={handleUpdateUserStatus} onDelete={handleDeleteUser} />}
        {activeTab === 'orphanages' && <OrphanagesTab orphanages={orphanagesList} onUpdateStatus={handleUpdateUserStatus} onDelete={handleDeleteUser} />}
        {activeTab === 'courses' && <CoursesTab pendingCourses={pendingCourses} approvedCourses={approvedCourses} onAddPress={() => setShowCourseModal(true)} onUpdateStatus={handleUpdateCourseStatus} />}
        {activeTab === 'tasks' && <TasksTab tasks={tasks} onAssignNew={() => setShowTaskModal(true)} onComplete={handleCompleteTask} />}
      </ScrollView>
      <CourseModal 
        visible={showCourseModal} 
        onClose={() => setShowCourseModal(false)} 
        onSubmit={handleAdminCourseSubmit} 
        loading={submittingCourse} 
        title={courseTitle} 
        setTitle={setCourseTitle} 
        desc={courseDesc} 
        setDesc={setCourseDesc} 
        link={courseLink} 
        setLink={setCourseLink} 
        category={courseCategory} 
        setCategory={setCourseCategory}
        duration={courseDuration}
        setDuration={setCourseDuration}
        assignedOrphan={assignedOrphan}
        setAssignedOrphan={setAssignedOrphan}
        orphans={usersList.filter(u => u.role === 'orphan')}
      />
      <TaskModal visible={showTaskModal} onClose={() => setShowTaskModal(false)} onConfirm={handleCreateTask} submitting={submittingTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} taskDesc={taskDesc} setTaskDesc={setTaskDesc} volunteers={volunteers} selectedVolunteer={selectedVolunteer} setSelectedVolunteer={setSelectedVolunteer} />
      </View>
    </SafeAreaView>
  );
}
