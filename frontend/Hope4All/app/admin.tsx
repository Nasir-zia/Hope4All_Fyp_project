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
  RefreshControl
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
  updateUserStatusApi
} from '@/constants/api';
import BackButton from './components/BackButton';

type TabType = 'stats' | 'requests' | 'tasks' | 'users';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  
  // Data States
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Task Creation States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [submittingTask, setSubmittingTask] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, reqsData, volData, usersData] = await Promise.all([
        fetchAdminStats(),
        fetchAllRequests(),
        fetchAllVolunteers(),
        fetchAllUsers()
      ]);
      setStats(statsData);
      setRequests(reqsData);
      setVolunteers(volData);
      setUsersList(usersData);
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
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setSubmittingTask(true);
    try {
      await createTaskApi({
        title: taskTitle,
        description: taskDesc,
        volunteerId: selectedVolunteer,
        priority: taskPriority,
        date: new Date().toISOString()
      });
      Alert.alert("Success", "Task assigned to volunteer.");
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not assign task");
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleUpdateUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await updateUserStatusApi(userId, newStatus, user?.token || '');
      Alert.alert("Success", `User is now ${newStatus}`);
      loadAllData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update user");
    }
  };

  const renderStats = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#4da6ff20' }]}>
          <Ionicons name="people" size={32} color="#0077cc" />
          <Text style={styles.statVal}>{stats?.totalUsers || 0}</Text>
          <Text style={styles.statLab}>Total Users</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#33cc9920' }]}>
          <FontAwesome5 name="hand-holding-heart" size={28} color="#27ae60" />
          <Text style={styles.statVal}>{stats?.totalDonations || 0}</Text>
          <Text style={styles.statLab}>Donations</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ffbb3320' }]}>
          <Ionicons name="list" size={32} color="#f39c12" />
          <Text style={styles.statVal}>{requests.filter(r => r.status === 'pending').length}</Text>
          <Text style={styles.statLab}>Pending Reqs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ff444420' }]}>
          <MaterialIcons name="assignment" size={32} color="#c0392b" />
          <Text style={styles.statVal}>{stats?.activeTasks || 0}</Text>
          <Text style={styles.statLab}>Active Tasks</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>System Health</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Database Status</Text>
          <Text style={[styles.infoVal, { color: '#27ae60' }]}>Connected</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Active Orphanages</Text>
          <Text style={styles.infoVal}>{stats?.totalOrphanages || 0}</Text>
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

  const renderTaskTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Volunteer Assignments</Text>
        <TouchableOpacity style={styles.addTaskBtn} onPress={() => setShowTaskModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subText}>Assign logistics and verification tasks to registered volunteers.</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Active Volunteers</Text>
        <Text style={styles.infoVal}>{volunteers.length}</Text>
      </View>
    </View>
  );

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>User Directory</Text>
      {usersList.length === 0 ? (
        <Text style={styles.emptyText}>No users found.</Text>
      ) : (
        usersList.map((u) => (
          <View key={u._id} style={styles.requestCard}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.reqTitle}>{u.username}</Text>
                <Text style={styles.reqDetail}>{u.email}</Text>
                <View style={[styles.reqTypeBadge, { backgroundColor: u.role === 'orphan' ? '#4da6ff20' : u.role === 'donor' ? '#ff66b220' : '#33cc9920' }]}>
                  <Text style={[styles.badgeText, { color: u.role === 'orphan' ? '#0077cc' : u.role === 'donor' ? '#ff66b2' : '#27ae60' }]}>
                    {u.role.toUpperCase()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.statusToggle, u.status === 'blocked' && styles.statusToggleBlocked]}
                onPress={() => handleUpdateUserStatus(u._id, u.status)}
              >
                <Text style={styles.statusToggleText}>
                  {u.status === 'active' ? 'BLOCK' : 'VERIFY/ACTIVATE'}
                </Text>
              </TouchableOpacity>
            </View>
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
        <BackButton />
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.adminTag}>ADMIN PORTAL</Text>
        <Text style={styles.welcome}>Central Command</Text>
      </View>

      <View style={styles.tabBar}>
        {(['stats', 'requests', 'tasks', 'users'] as TabType[]).map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'tasks' && renderTaskTab()}
        {activeTab === 'users' && renderUsers()}
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
  header: {
    paddingTop: 70,
    backgroundColor: '#0f172a',
    paddingHorizontal: 25,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoutBtn: { position: 'absolute', right: 25, top: 60, padding: 8, backgroundColor: '#334155', borderRadius: 10 },
  adminTag: { color: '#38bdf8', fontWeight: 'bold', fontSize: 12, letterSpacing: 2 },
  welcome: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginTop: 5 },
  tabBar: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginHorizontal: 20, marginTop: -25, borderRadius: 15, elevation: 4 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#0077cc' },
  tabText: { color: '#64748b', fontWeight: '600' },
  tabTextActive: { color: '#0077cc', fontWeight: 'bold' },
  tabContent: { padding: 25 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', padding: 20, borderRadius: 20, marginBottom: 15, alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: 'bold', marginVertical: 8, color: '#1e293b' },
  statLab: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { color: '#64748b' },
  infoVal: { fontWeight: 'bold', color: '#1e293b' },
  requestCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  reqTypeBadge: { backgroundColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#475569' },
  statusLabel: { fontSize: 10, fontWeight: 'bold', color: '#f59e0b' },
  reqTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  reqDetail: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  actionRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  approveBtn: { flex: 1, backgroundColor: '#059669', flexDirection: 'row', padding: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 5 },
  rejectBtn: { flex: 1, backgroundColor: '#dc2626', flexDirection: 'row', padding: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
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
  emptyText: { textAlign: 'center', color: '#64748b', marginVertical: 30 },
  statusToggle: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#fecaca' },
  statusToggleBlocked: { backgroundColor: '#dcfce7' },
  statusToggleText: { fontSize: 10, fontWeight: 'bold', color: '#1a1a1a' }
});
