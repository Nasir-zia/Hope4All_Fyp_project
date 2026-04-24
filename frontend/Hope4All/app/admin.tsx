import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Image,
  Linking,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
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
  createCourseApi,
  updateCourseStatusApi
} from '@/constants/api';
import BackButton from './components/BackButton';

type TabType = 'stats' | 'requests' | 'tasks' | 'donations' | 'users' | 'learning';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
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

  // Derived data
  const allVolunteers = volunteers.length > 0 ? volunteers : usersList.filter(u => u.role === 'volunteer');

  // Task Creation States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [broadcastToAll, setBroadcastToAll] = useState(false);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [submittingTask, setSubmittingTask] = useState(false);

  // Course States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [courseCategory, setCourseCategory] = useState('Academic');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current;

  const toggleSidebar = (open: boolean) => {
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
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const token = user?.token || '';
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
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await updateRequestStatus(requestId, 'approved', user?.token || '');
      Alert.alert("Success", "Request approved and visible to donors.");
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not approve request");
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !taskDesc || !selectedVolunteer) {
      Alert.alert("Error", "Please fill title, description and select a volunteer");
      return;
    }
    setSubmittingTask(true);
    try {
      const vIds = broadcastToAll ? allVolunteers.map(v => v._id) : selectedVolunteer;
      
      await createTaskApi({
        title: taskTitle,
        description: taskDesc,
        volunteerId: vIds,
        priority: taskPriority,
        date: new Date().toISOString(),
        assignedBy: user?.id,
      }, user?.token || '');
      Alert.alert("✅ Success", broadcastToAll ? "Task broadcasted to all volunteers!" : "Task assigned successfully!");
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      setSelectedVolunteer('');
      setBroadcastToAll(false);
      setTaskPriority('medium');
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not assign task");
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleUpdateUserStatus = async (userId: string, currentStatus: string) => {
    let newStatus = 'verified';
    if (currentStatus === 'verified') newStatus = 'suspended';
    else if (currentStatus === 'suspended') newStatus = 'verified';
    
    try {
      await updateUserStatusApi(userId, newStatus, user?.token || '');
      Alert.alert("Success", `User is now ${newStatus}`);
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update user");
    }
  };

  const handleCreateCourse = async () => {
    if (!courseTitle || !courseDesc || !courseLink) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setSubmittingCourse(true);
    try {
      await createCourseApi({
        title: courseTitle,
        description: courseDesc,
        link: courseLink,
        category: courseCategory,
        addedBy: user?.id,
        addedByRole: 'admin'
      }, user?.token || '');
      Alert.alert("✅ Success", "Course added successfully!");
      setShowCourseModal(false);
      setCourseTitle('');
      setCourseDesc('');
      setCourseLink('');
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not add course");
    } finally {
      setSubmittingCourse(false);
    }
  };

  const handleUpdateCourseStatus = async (id: string, status: string) => {
    console.log(`[Admin] Updating course ${id} to ${status}`);
    try {
      const result = await updateCourseStatusApi(id, status, user?.token || '');
      console.log('[Admin] Course update result:', result);
      Alert.alert("Success", `Course ${status}`);
      loadAllData();
    } catch (err: any) {
      console.error('[Admin] Course update error:', err);
      Alert.alert("Error", err.message || "Could not update course");
    }
  };

  const renderStats = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#eff6ff', shadowColor: '#3b82f6' }]}>
          <Ionicons name="people" size={32} color="#3b82f6" />
          <Text style={styles.statVal}>{usersList.length || stats?.totalUsers || 0}</Text>
          <Text style={styles.statLab}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#f0fdf4', shadowColor: '#22c55e' }]}>
          <FontAwesome5 name="hand-holding-heart" size={28} color="#22c55e" />
          <Text style={styles.statVal}>{donations.length}</Text>
          <Text style={styles.statLab}>Donations</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fff7ed', shadowColor: '#f97316' }]}>
          <Ionicons name="list" size={32} color="#f97316" />
          <Text style={styles.statVal}>{requests.filter((r: any) => r.status === 'pending').length}</Text>
          <Text style={styles.statLab}>Pending Reqs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fef2f2', shadowColor: '#ef4444' }]}>
          <MaterialIcons name="assignment" size={32} color="#ef4444" />
          <Text style={styles.statVal}>{stats?.totalTasks || allTasks.length || 0}</Text>
          <Text style={styles.statLab}>Total Tasks</Text>
        </View>
      </View>
    </View>
  );

  const renderRequests = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Material Request Queue</Text>
      {requests.length === 0 ? (
        <Text style={styles.emptyText}>No requests to review.</Text>
      ) : (
        requests.map((req) => (
          <View key={req._id} style={styles.requestCard}>
            <View style={styles.cardHeader}>
              <View style={styles.reqTypeBadge}>
                <Text style={styles.badgeText}>{req.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.statusLabel}>{req.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.reqTitle}>{req.description}</Text>
            <Text style={styles.reqDetail}>Orphan: {req.orphanId?.name || 'Unknown'}</Text>
            <Text style={styles.reqDetail}>Orphanage: {req.orphanageId?.name || 'Direct'}</Text>
            
            {req.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproveRequest(req._id)}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn}>
                  <Ionicons name="close" size={20} color="#fff" />
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderTaskTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Volunteer Tasks</Text>
          <TouchableOpacity style={styles.addTaskBtn} onPress={() => setShowTaskModal(true)}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subText}>Assign field tasks to registered volunteers. Active volunteers: {allVolunteers.length}</Text>

        {allVolunteers.length === 0 && (
          <View style={[styles.infoCard, { alignItems: 'center', paddingVertical: 20 }]}>
            <Ionicons name="people-outline" size={40} color="#94a3b8" />
            <Text style={[styles.emptyText, { marginTop: 8 }]}>No volunteers registered yet.</Text>
          </View>
        )}

        {allVolunteers.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, { marginBottom: 10 }]}>Registered Volunteers</Text>
            {allVolunteers.map((v: any) => (
              <View key={v._id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Ionicons name="person" size={18} color="#16a34a" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: '#1e293b', fontSize: 14 }}>{v.username}</Text>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{v.email}</Text>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#0077cc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                  onPress={() => { setSelectedVolunteer(v._id); setShowTaskModal(true); }}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Assign Task</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Assigned Tasks History</Text>
        {allTasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks assigned yet.</Text>
        ) : (
          allTasks.map((task) => (
            <View key={task._id} style={styles.requestCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.reqTypeBadge, { backgroundColor: task.priority === 'high' ? '#fee2e2' : '#fef3c7' }]}>
                  <Text style={[styles.badgeText, { color: task.priority === 'high' ? '#dc2626' : '#d97706' }]}>{task.priority.toUpperCase()}</Text>
                </View>
                <Text style={styles.statusLabel}>{task.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.reqTitle}>{task.title}</Text>
              <Text style={styles.reqDetail}><Text style={{ fontWeight: 'bold' }}>To:</Text> {task.volunteerId?.username || 'Unknown'}</Text>
              <Text style={styles.reqDetail}>{task.description}</Text>
              <Text style={[styles.reqDetail, { marginTop: 8, fontSize: 11 }]}>Assigned: {new Date(task.createdAt).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>
    );
  };

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>User Directory ({usersList.length})</Text>
      {usersList.length === 0 ? (
        <Text style={styles.emptyText}>No users found.</Text>
      ) : (
        usersList.map((u) => (
          <View key={u._id} style={[styles.requestCard, u.status === 'pending' && { borderColor: '#f59e0b', borderWidth: 2 }]}>
            {/* Header Row: Avatar + Name + Role Badge + Status Toggle */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {/* Profile Picture */}
                {u.profilePic ? (
                  <Image 
                    source={{ uri: u.profilePic }} 
                    style={{ width: 56, height: 56, borderRadius: 28, marginRight: 12, backgroundColor: '#e2e8f0' }} 
                  />
                ) : (
                  <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: u.role === 'orphan' ? '#dbeafe' : u.role === 'donor' ? '#fce7f3' : '#dcfce7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Ionicons name="person" size={28} color={u.role === 'orphan' ? '#0077cc' : u.role === 'donor' ? '#ec4899' : '#16a34a'} />
                  </View>
                )}
                {/* Name & Username */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={[styles.reqTitle, { marginRight: 6 }]}>{u.name || u.username}</Text>
                    {u.status === 'pending' && (
                      <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 }}>
                        <Text style={{color: '#d97706', fontSize: 9, fontWeight: 'bold'}}>PENDING</Text>
                      </View>
                    )}
                    {u.status === 'suspended' && (
                      <View style={{ backgroundColor: '#fee2e2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 }}>
                        <Text style={{color: '#dc2626', fontSize: 9, fontWeight: 'bold'}}>SUSPENDED</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.reqTypeBadge, { backgroundColor: u.role === 'orphan' ? '#4da6ff20' : u.role === 'donor' ? '#ff66b220' : '#33cc9920', marginTop: 2 }]}>
                    <Text style={[styles.badgeText, { color: u.role === 'orphan' ? '#0077cc' : u.role === 'donor' ? '#ec4899' : '#16a34a' }]}>
                      {u.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Verify / Suspend Button */}
              <TouchableOpacity 
                style={[
                  styles.statusToggle, 
                  u.status === 'suspended' && styles.statusToggleBlocked,
                  u.status === 'pending' && { backgroundColor: '#10b981' }
                ]}
                onPress={() => handleUpdateUserStatus(u._id, u.status)}
              >
                <Text style={styles.statusToggleText}>
                  {u.status === 'verified' ? 'SUSPEND' : 'VERIFY'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Details Section */}
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
              {u.email && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="mail-outline" size={13} color="#64748b" style={{ marginRight: 6 }} />
                  <Text style={[styles.reqDetail, { color: '#475569' }]}>{u.email}</Text>
                </View>
              )}
              {u.phone && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="call-outline" size={13} color="#64748b" style={{ marginRight: 6 }} />
                  <Text style={[styles.reqDetail, { color: '#475569' }]}>{u.phone}</Text>
                </View>
              )}
              {(u.location || u.city) && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="location-outline" size={13} color="#64748b" style={{ marginRight: 6 }} />
                  <Text style={[styles.reqDetail, { color: '#475569' }]}>{u.location || u.city}</Text>
                </View>
              )}
              {u.age && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="calendar-outline" size={13} color="#64748b" style={{ marginRight: 6 }} />
                  <Text style={[styles.reqDetail, { color: '#475569' }]}>Age: {u.age} {u.gender ? `• ${u.gender}` : ''}</Text>
                </View>
              )}
              {u.totalDonated !== undefined && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <FontAwesome5 name="hand-holding-heart" size={12} color="#64748b" style={{ marginRight: 6 }} />
                  <Text style={[styles.reqDetail, { color: '#475569' }]}>Total Donated: {u.totalDonated} • Children Helped: {u.childrenHelped || 0}</Text>
                </View>
              )}
              {/* Supporting Documents for Orphans */}
              {u.role === 'orphan' && u.supportingDocs && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(u.supportingDocs)}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe', alignSelf: 'flex-start' }}
                >
                  <Ionicons name="document-text-outline" size={15} color="#2563eb" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#2563eb', fontSize: 12, fontWeight: '600' }}>View Supporting Document</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderDonations = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Donations List</Text>
      {donations.length === 0 ? (
        <Text style={styles.emptyText}>No donations recorded yet.</Text>
      ) : (
        donations.map((d) => (
          <View key={d._id} style={styles.requestCard}>
             <View style={styles.cardHeader}>
               <Text style={styles.reqTitle}>{d.units || 0} {d.requestId?.unitType || 'Units'} Donated</Text>
               <Text style={styles.reqDetail}>{new Date(d.createdAt).toLocaleDateString()}</Text>
             </View>
             <Text style={styles.reqDetail}><Text style={{fontWeight: 'bold'}}>From Donor:</Text> {d.donorId?.name || 'Anonymous'}</Text>
             <Text style={styles.reqDetail}><Text style={{fontWeight: 'bold'}}>To Orphan:</Text> {d.recipientId?.name || d.recipientName || 'Unknown'}</Text>
             <Text style={styles.reqDetail}><Text style={{fontWeight: 'bold'}}>Request Type:</Text> {d.requestId?.type?.toUpperCase() || 'GENERAL'}</Text>
          </View>
        ))
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={styles.loadingText}>Loading Command Center...</Text>
      </View>
    );
  }

    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => toggleSidebar(true)}>
          <Ionicons name="menu-outline" size={28} color="#0f172a" />
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.adminTag}>Hope4All</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.sidebarOverlay} 
          onPress={() => toggleSidebar(false)}
        >
          <Animated.View 
            style={[
              styles.sidebar, 
              { transform: [{ translateX: sidebarAnim }] }
            ]}
          >
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Hope4All</Text>
              <Text style={styles.sidebarSub}>Admin Management Center</Text>
            </View>
            
            <View style={styles.sidebarMenu}>
              {(['stats', 'requests', 'tasks', 'donations', 'users', 'learning'] as TabType[]).map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.sidebarItem, activeTab === tab && styles.sidebarItemActive]}
                  onPress={() => {
                    setActiveTab(tab);
                    toggleSidebar(false);
                  }}
                >
                  <Ionicons 
                    name={
                      tab === 'stats' ? 'bar-chart' : 
                      tab === 'requests' ? 'list' : 
                      tab === 'tasks' ? 'checkbox' : 
                      tab === 'donations' ? 'heart' : 
                      tab === 'users' ? 'people' : 'school'
                    } 
                    size={20} 
                    color={activeTab === tab ? '#fff' : '#64748b'} 
                  />
                  <Text style={[styles.sidebarText, activeTab === tab && styles.sidebarTextActive]}>
                    {tab === 'learning' ? 'Learning (LMS)' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.sidebarFooter} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={{ color: '#ef4444', marginLeft: 10, fontWeight: 'bold' }}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'tasks' && renderTaskTab()}
        {activeTab === 'donations' && renderDonations()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'learning' && (
          <View style={styles.tabContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Learning Management</Text>
              <TouchableOpacity style={styles.addTaskBtn} onPress={() => setShowCourseModal(true)}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subText}>Manage educational courses for orphans.</Text>

            {courses.length === 0 ? (
              <Text style={styles.emptyText}>No courses found.</Text>
            ) : (
              courses.map((course) => (
                <View key={course._id} style={[styles.requestCard, course.status === 'pending' && { borderColor: '#f59e0b', borderWidth: 2 }]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.reqTypeBadge}>
                      <Text style={styles.badgeText}>{course.category.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.statusLabel, course.status === 'pending' && {color: '#f59e0b'}]}>{course.status.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.reqTitle}>{course.title}</Text>
                  <Text style={styles.reqDetail}>{course.description}</Text>
                  <Text style={[styles.reqDetail, { color: '#0077cc' }]} onPress={() => Linking.openURL(course.link)}>🔗 {course.link}</Text>
                  <Text style={[styles.reqDetail, { marginTop: 5 }]}>By: {course.addedBy?.username || 'Admin'} ({course.addedByRole})</Text>
                  
                  {course.status === 'pending' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.approveBtn} onPress={() => handleUpdateCourseStatus(course._id, 'approved')}>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                        <Text style={styles.btnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleUpdateCourseStatus(course._id, 'rejected')}>
                        <Ionicons name="close" size={20} color="#fff" />
                        <Text style={styles.btnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Task Modal */}
      <Modal visible={showTaskModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Volunteer Task</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Task Title" 
              value={taskTitle} 
              onChangeText={setTaskTitle} 
            />
            <TextInput 
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
              placeholder="Mission Description" 
              multiline 
              value={taskDesc} 
              onChangeText={setTaskDesc} 
            />
            
            <Text style={styles.label}>Select Volunteer</Text>
            <ScrollView horizontal style={styles.volSelect} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                 style={[styles.volChip, broadcastToAll && styles.volChipActive, { backgroundColor: broadcastToAll ? '#0077cc' : '#fef3c7', borderColor: '#f59e0b' }]}
                 onPress={() => { setBroadcastToAll(!broadcastToAll); setSelectedVolunteer(''); }}
              >
                 <Text style={[styles.volChipText, broadcastToAll && styles.volChipTextActive]}>
                   📣 ALL VOLUNTEERS
                 </Text>
              </TouchableOpacity>

              {allVolunteers.map(v => (
                <TouchableOpacity 
                   key={v._id} 
                   style={[styles.volChip, selectedVolunteer === v._id && styles.volChipActive]}
                   onPress={() => { setSelectedVolunteer(v._id); setBroadcastToAll(false); }}
                   disabled={broadcastToAll}
                >
                   <Text style={[styles.volChipText, selectedVolunteer === v._id && styles.volChipTextActive, broadcastToAll && { opacity: 0.5 }]}>
                     {v.username}
                   </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.submitBtn, submittingTask && styles.btnDisabled]} 
              onPress={handleCreateTask}
              disabled={submittingTask}
            >
              {submittingTask ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextLarge}>Confirm Assignment</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowTaskModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Course Modal */}
      <Modal visible={showCourseModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Educational Course</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Course Title" 
              value={courseTitle} 
              onChangeText={setCourseTitle} 
            />
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              placeholder="Short Description" 
              multiline 
              value={courseDesc} 
              onChangeText={setCourseDesc} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Course URL (YouTube/Website)" 
              value={courseLink} 
              onChangeText={setCourseLink} 
              autoCapitalize="none"
            />
            
            <Text style={styles.label}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {['Academic', 'Skills', 'Tech', 'Language', 'Other'].map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.volChip, courseCategory === cat && styles.volChipActive]}
                  onPress={() => setCourseCategory(cat)}
                >
                  <Text style={[styles.volChipText, courseCategory === cat && styles.volChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, submittingCourse && styles.btnDisabled]} 
              onPress={handleCreateCourse}
              disabled={submittingCourse}
            >
              {submittingCourse ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextLarge}>Add Course</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCourseModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    backgroundColor: 'transparent', // Made transparent
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  menuBtn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 15,
  },
  logoutBtn: { 
    padding: 10, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    borderRadius: 15,
  },
  adminTag: { 
    color: '#0f172a', // Changed to dark for transparent header
    fontWeight: '900', 
    fontSize: 24, 
    letterSpacing: 1,
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    zIndex: 1000,
  },
  sidebar: {
    width: '70%',
    height: '85%',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    borderTopRightRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  sidebarHeader: {
    paddingHorizontal: 30,
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sidebarTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  sidebarSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
    fontWeight: '600',
  },
  sidebarMenu: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sidebarItemActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  sidebarText: {
    marginLeft: 15,
    fontSize: 17,
    color: '#475569',
    fontWeight: '600',
  },
  sidebarTextActive: {
    color: '#1d4ed8',
    fontWeight: 'bold',
  },
  sidebarFooter: {
    padding: 30,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  tabContent: { 
    padding: 18,
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
  },
  statCard: { 
    width: '48%', 
    padding: 22, 
    borderRadius: 28, 
    marginBottom: 18, 
    alignItems: 'center',
    borderWidth: 0, // Removed black border
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statVal: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginVertical: 10, 
    color: '#0f172a' 
  },
  statLab: { 
    fontSize: 14, 
    color: '#64748b', 
    fontWeight: '700',
    textAlign: 'center'
  },
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#0f172a', 
    marginBottom: 18,
    marginTop: 10,
  },
  infoCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 24, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  infoLabel: { 
    fontSize: 14, 
    color: '#64748b', 
    fontWeight: '500' 
  },
  infoVal: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  requestCard: { 
    backgroundColor: '#fff', 
    padding: 22, 
    borderRadius: 28, 
    marginBottom: 18, 
    borderWidth: 0, // Removed black border
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 15,
    alignItems: 'center'
  },
  reqTypeBadge: { 
    backgroundColor: '#f1f5f9', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10 
  },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#475569', letterSpacing: 0.5 },
  statusLabel: { fontSize: 11, fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase' },
  reqTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  reqDetail: { fontSize: 14, color: '#64748b', marginBottom: 6, lineHeight: 20 },
  actionRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
  approveBtn: { 
    flex: 1, 
    backgroundColor: '#10b981', 
    flexDirection: 'row', 
    padding: 14, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8,
    elevation: 3,
  },
  rejectBtn: { 
    flex: 1, 
    backgroundColor: '#ef4444', 
    flexDirection: 'row', 
    padding: 14, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8,
    elevation: 3,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addTaskBtn: { 
    backgroundColor: '#3b82f6', 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  subText: { color: '#64748b', marginBottom: 25, fontSize: 14, lineHeight: 22 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    padding: 30,
    maxHeight: '90%'
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  volSelect: { flexDirection: 'row', marginBottom: 20 },
  volChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  volChipActive: { backgroundColor: '#0077cc', borderColor: '#0077cc' },
  volChipText: { color: '#64748b' },
  volChipTextActive: { color: '#fff', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#0077cc', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnTextLarge: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { padding: 15, alignItems: 'center' },
  cancelText: { color: '#64748b' },
  btnDisabled: { opacity: 0.6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, color: '#64748b' },
  emptyText: { textAlign: 'center', color: '#64748b', marginVertical: 30 },
  statusToggle: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#fecaca' },
  statusToggleBlocked: { backgroundColor: '#dcfce7' },
  statusToggleText: { fontSize: 10, fontWeight: 'bold', color: '#1a1a1a' }
});
