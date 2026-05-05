import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface UsersTabProps {
  users: any[];
  onUpdateStatus: (id: string, currentStatus: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ users, onUpdateStatus }) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Community Directory</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{users.length} Active</Text>
        </View>
      </View>
      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No users registered yet.</Text>
        </View>
      ) : (
        users.map((u) => (
          <View key={u._id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userMain}>
                {u.profilePic ? (
                  <Image source={{ uri: u.profilePic }} style={styles.userAvatar} />
                ) : (
                  <View style={[styles.userAvatar, { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="person" size={24} color="#94a3b8" />
                  </View>
                )}
                <View>
                  <Text style={styles.userName}>{u.name || u.username}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: u.role === 'orphan' ? '#eff6ff' : u.role === 'donor' ? '#fdf2f8' : '#f0fdf4' }]}>
                    <Text style={[styles.roleText, { color: u.role === 'orphan' ? '#2563eb' : u.role === 'donor' ? '#db2777' : '#16a34a' }]}>
                      {u.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.userActionBtn, u.status === 'suspended' && { backgroundColor: '#fee2e2' }]}
                onPress={() => onUpdateStatus(u._id, u.status)}
              >
                <Text style={[styles.userActionText, u.status === 'suspended' && { color: '#dc2626' }]}>
                  {u.status === 'verified' ? 'Suspend' : 'Verify'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>{u.email}</Text>
              </View>
              {u.location && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color="#64748b" />
                  <Text style={styles.detailText}>
                    {typeof u.location === 'object' 
                      ? `${u.location.address || ''}, ${u.location.city || ''}` 
                      : u.location}
                  </Text>
                </View>
              )}
              {u.role === 'orphan' && (
                <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text style={{ fontWeight: '700' }}>Age:</Text> {u.age}</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}><Text style={{ fontWeight: '700' }}>Phone:</Text> {u.phone || 'N/A'}</Text>
                  </View>
                  {u.bio && (
                    <Text style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', marginBottom: 12 }}>"{u.bio}"</Text>
                  )}
                  {u.supportingDocs && (
                    <View style={{ gap: 8 }}>
                      {u.supportingDocs.match(/\.(jpg|jpeg|png|webp|gif)$|cloudinary/i) && !u.supportingDocs.toLowerCase().endsWith('.pdf') ? (
                        <Image 
                          source={{ uri: u.supportingDocs }} 
                          style={{ width: '100%', height: 120, borderRadius: 12, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' }} 
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ width: '100%', height: 80, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                          <Ionicons name="document-text-outline" size={32} color="#0077cc" />
                          <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>PDF / Verification Document</Text>
                        </View>
                      )}
                      
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity 
                          style={{ 
                            flex: 1,
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 6, 
                            backgroundColor: '#f0f9ff', 
                            padding: 12, 
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#bae6fd'
                          }}
                          onPress={() => {
                            if (Platform.OS === 'web') {
                              window.open(u.supportingDocs, '_blank');
                            } else {
                              Linking.openURL(u.supportingDocs).catch(() => {
                                Alert.alert("Error", "Could not open document link.");
                              });
                            }
                          }}
                        >
                          <Ionicons name="eye-outline" size={18} color="#0077cc" />
                          <Text style={{ fontSize: 13, color: '#0077cc', fontWeight: '700' }}>View</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={{ 
                            flex: 1,
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 6, 
                            backgroundColor: '#f0fdf4', 
                            padding: 12, 
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#bbf7d0'
                          }}
                          onPress={() => {
                            // Cloudinary download transformation: insert fl_attachment
                            const downloadUrl = u.supportingDocs.replace('/upload/', '/upload/fl_attachment/');
                            if (Platform.OS === 'web') {
                              window.open(downloadUrl, '_blank');
                            } else {
                              Linking.openURL(downloadUrl).catch(() => {
                                Alert.alert("Error", "Could not trigger download.");
                              });
                            }
                          }}
                        >
                          <Ionicons name="download-outline" size={18} color="#16a34a" />
                          <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: '700' }}>Download</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );
};
