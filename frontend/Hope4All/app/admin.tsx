import React, { useState, useEffect } from 'react';
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
  Linking
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
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
import { AdminHeader } from '@/components/admin/AdminHeader';
import BackButton from '@/components/BackButton';
import { CourseModal } from '@/components/donor/CourseModal';

type TabType = 'stats' | 'requests' | 'tasks' | 'donations' | 'users' | 'courses';

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

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, reqsData, volData, usersData, dontData, coursesData] = await Promise.all([
        fetchAdminStats(),
        fetchAllRequests(),
        fetchAllVolunteers(),
        fetchAllUsers(),
        fetchAllDonations(),
        fetchPendingCourses()
      ]);
      setStats(statsData);
      setRequests(reqsData);
      setVolunteers(volData);
      setUsersList(usersData);
      setDonations(dontData);
      setPendingCourses(coursesData);
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
      await createTaskApi({
        title: taskTitle,
        description: taskDesc,
        volunteerId: selectedVolunteer,
        priority: taskPriority,
        date: new Date().toISOString(),
        assignedBy: user?.id,
      });
      Alert.alert("✅ Success", "Task assigned to volunteer successfully!");
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      setSelectedVolunteer('');
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

  const handleUpdateCourseStatus = async (courseId: string, status: string) => {
    try {
      await updateCourseStatusApi(courseId, status);
      Alert.alert("Success", `Course has been ${status}`);
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update course");
    }
  };

  const handleAdminCourseSubmit = async () => {
    if (!courseTitle || !courseDesc || !courseLink) {
      Alert.alert('Error', 'Please fill in all course details.');
      return;
    }

    setSubmittingCourse(true);
    try {
      await addCourseApi({
        title: courseTitle,
        description: courseDesc,
        link: courseLink,
        category: courseCategory,
        instructorId: user!.id
      });
      Alert.alert('Success', 'Course added successfully!');
      setShowCourseModal(false);
      setCourseTitle('');
      setCourseDesc('');
      setCourseLink('');
      setCourseCategory('Academic');
      loadAllData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not add course.');
    } finally {
      setSubmittingCourse(false);
    }
  };

  const renderStats = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#4da6ff20' }]}>
          <Ionicons name="people" size={32} color="#0077cc" />
          <Text style={styles.statVal}>{usersList.length || stats?.totalUsers || 0}</Text>
          <Text style={styles.statLab}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#33cc9920' }]}>
          <FontAwesome5 name="hand-holding-heart" size={28} color="#27ae60" />
          <Text style={styles.statVal}>{donations.length}</Text>
          <Text style={styles.statLab}>Total Donations</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ffbb3320' }]}>
          <Ionicons name="list" size={32} color="#f39c12" />
          <Text style={styles.statVal}>{requests.filter(r => r.status === 'pending').length}</Text>
          <Text style={styles.statLab}>Pending Reqs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ff444420' }]}>
          <MaterialIcons name="assignment" size={32} color="#c0392b" />
          <Text style={styles.statVal}>{stats?.activeVolunteers || volunteers.length || 0}</Text>
          <Text style={styles.statLab}>Active Tasks</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Platform Summary</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Donors</Text>
          <Text style={styles.infoVal}>{stats?.activeDonors || 0}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Orphans</Text>
          <Text style={styles.infoVal}>{stats?.totalOrphans || 0}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Active Orphanages</Text>
          <Text style={styles.infoVal}>{stats?.totalOrphanages || 0}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pending Verification</Text>
          <Text style={[styles.infoVal, {color: '#f59e0b'}]}>{usersList.filter(u => u.status === 'pending').length}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Database Status</Text>
          <Text style={[styles.infoVal, { color: '#27ae60' }]}>Connected ✓</Text>
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
    // Get volunteers from usersList (role === volunteer) as fallback
    const volunteerUsers = usersList.filter(u => u.role === 'volunteer');
    const allVolunteers = volunteers.length > 0 ? volunteers : volunteerUsers;

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
              <View key={v._id || v.userId} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Ionicons name="person" size={18} color="#16a34a" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: '#1e293b', fontSize: 14 }}>{v.username || v.name}</Text>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{v.email}</Text>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#0077cc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                  onPress={() => { setSelectedVolunteer(v._id || v.userId?._id); setShowTaskModal(true); }}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Assign Task</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
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

  const renderCoursesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Learning Management</Text>
        <TouchableOpacity 
          style={[styles.addTaskBtn, { backgroundColor: '#10b981' }]} 
          onPress={() => setShowCourseModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subText}>Manage platform courses. Admin courses are auto-approved.</Text>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Pending Approvals</Text>
      {pendingCourses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="school-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>No pending courses to review.</Text>
        </View>
      ) : (
        pendingCourses.map((course) => (
          <View key={course._id} style={styles.requestCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.reqTypeBadge, { backgroundColor: '#dcfce7' }]}>
                <Text style={[styles.badgeText, { color: '#166534' }]}>{course.category.toUpperCase()}</Text>
              </View>
              <Text style={styles.statusLabel}>PENDING APPROVAL</Text>
            </View>
            <Text style={styles.reqTitle}>{course.title}</Text>
            <Text style={styles.reqDetail}>{course.description}</Text>
            <Text style={[styles.reqDetail, { color: '#0077cc', marginTop: 5 }]} onPress={() => Linking.openURL(course.link)}>
              <Ionicons name="link" size={14} /> {course.link}
            </Text>
            <Text style={[styles.reqDetail, { marginTop: 10 }]}>Instructor: {course.instructorName}</Text>
            
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.approveBtn, { backgroundColor: '#10b981' }]} 
                onPress={() => handleUpdateCourseStatus(course._id, 'approved')}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.rejectBtn, { backgroundColor: '#ef4444' }]} 
                onPress={() => handleUpdateCourseStatus(course._id, 'rejected')}
              >
                <Ionicons name="close" size={20} color="#fff" />
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
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
      <AdminHeader onLogout={logout} />

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'stats' && styles.tabActive]} onPress={() => setActiveTab('stats')}>
          <Ionicons name="pie-chart" size={20} color={activeTab === 'stats' ? '#0077cc' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'requests' && styles.tabActive]} onPress={() => setActiveTab('requests')}>
          <Ionicons name="list" size={20} color={activeTab === 'requests' ? '#0077cc' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>Reqs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'donations' && styles.tabActive]} onPress={() => setActiveTab('donations')}>
          <Ionicons name="cash" size={20} color={activeTab === 'donations' ? '#0077cc' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'donations' && styles.tabTextActive]}>Aid</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'users' && styles.tabActive]} onPress={() => setActiveTab('users')}>
          <Ionicons name="people" size={20} color={activeTab === 'users' ? '#0077cc' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'courses' && styles.tabActive]} onPress={() => setActiveTab('courses')}>
          <Ionicons name="school" size={20} color={activeTab === 'courses' ? '#0077cc' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'courses' && styles.tabTextActive]}>LMS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'donations' && renderDonations()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'courses' && renderCoursesTab()}
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
      />

      {/* Task Modal */}
      <Modal visible={showTaskModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Task</Text>
            <TextInput style={styles.input} placeholder="Task Title" value={taskTitle} onChangeText={setTaskTitle} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Description" multiline value={taskDesc} onChangeText={setTaskDesc} />
            
            <Text style={styles.label}>Select Volunteer</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.volSelect}>
              {volunteers.map(v => (
                <TouchableOpacity 
                  key={v._id} 
                  style={[styles.volChip, selectedVolunteer === v.userId?._id && styles.volChipActive]}
                  onPress={() => setSelectedVolunteer(v.userId?._id)}
                >
                  <Text style={[styles.volChipText, selectedVolunteer === v.userId?._id && styles.volChipTextActive]}>
                    {v.name}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  tabBar: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginHorizontal: 20, marginTop: -25, borderRadius: 15, elevation: 4 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#0077cc' },
  tabText: { color: '#64748b', fontWeight: '600', fontSize: 12 },
  tabTextActive: { color: '#0077cc', fontWeight: 'bold' },
  tabContent: { padding: 25 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { color: '#64748b' },
  infoVal: { fontWeight: 'bold', color: '#1e293b' },
  requestCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statusLabel: { fontSize: 10, fontWeight: 'bold', color: '#f59e0b' },
  reqTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  reqDetail: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addTaskBtn: { backgroundColor: '#0077cc', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  subText: { color: '#64748b', marginBottom: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30 },
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
});
