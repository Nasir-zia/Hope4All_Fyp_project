import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking, Alert, Platform, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';
import { getDownloadableUrl } from '../../utils/cloudinaryUtils';


interface UsersTabProps {
  users: any[];
  onUpdateStatus: (id: string, currentStatus: string, reason?: string) => void;
  onDelete: (id: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ users, onUpdateStatus, onDelete }) => {
  const [reasons, setReasons] = React.useState<{ [key: string]: string }>({});

  const handleReasonChange = (id: string, text: string) => {
    setReasons(prev => ({ ...prev, [id]: text }));
  };
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
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {u.status === 'pending' ? (
                  <>
                    <TouchableOpacity
                      style={[styles.userActionBtn, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: 1 }]}
                      onPress={() => onUpdateStatus(u._id, 'verified')}
                    >
                      <Text style={[styles.userActionText, { color: '#16a34a' }]}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.userActionBtn, { backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1 }]}
                      onPress={() => onUpdateStatus(u._id, 'rejected')}
                    >
                      <Text style={[styles.userActionText, { color: '#dc2626' }]}>Reject</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.userActionBtn, u.status === 'suspended' && { backgroundColor: '#fee2e2' }]}
                    onPress={() => onUpdateStatus(u._id, u.status === 'verified' ? 'suspended' : 'verified', reasons[u._id])}
                  >
                    <Text style={[styles.userActionText, u.status === 'suspended' && { color: '#dc2626' }]}>
                      {u.status === 'verified' ? 'Suspend' : 'Verify'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.userActionBtn, { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, paddingHorizontal: 10 }]}
                  onPress={() => onDelete(u._id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>

            {u.status === 'verified' && (
              <View style={{ marginTop: 10, paddingHorizontal: 5 }}>
                <TextInput
                  style={{
                    backgroundColor: '#f8fafc',
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 10,
                    padding: 8,
                    fontSize: 12,
                    color: '#475569'
                  }}
                  placeholder="Enter reason for suspension..."
                  value={reasons[u._id] || ''}
                  onChangeText={(text) => handleReasonChange(u._id, text)}
                />
              </View>
            )}

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
                  {u.supportingDocs ? (
                    <View style={{ gap: 8, marginTop: 10 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b' }}>Supporting Documents</Text>
                      {u.supportingDocs.match(/\\.(jpg|jpeg|png|webp|gif)$|cloudinary/i) && !u.supportingDocs.toLowerCase().endsWith('.pdf') ? (
                        <Image
                          source={{ uri: u.supportingDocs }}
                          style={{ width: '100%', height: 120, borderRadius: 12, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ width: '100%', height: 80, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                          <Ionicons name="document-text-outline" size={32} color="#0077cc" />
                          <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Father Death Certificate</Text>
                        </View>
                      )}

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <TouchableOpacity
                            style={styles.adminDocActionBtn}
                            onPress={async () => {
                              try {
                                if (u.supportingDocs) await Linking.openURL(u.supportingDocs);
                              } catch (e) {
                                console.error('Error opening URL:', e);
                                Alert.alert('Error', 'Could not open document viewer.');
                              }
                            }}
                          >
                            <Ionicons name="eye-outline" size={18} color="#0077cc" />
                            <Text style={styles.adminDocActionText}>View</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.adminDocActionBtn, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}
                            onPress={async () => {
                              try {
                                const url = getDownloadableUrl(u.supportingDocs);
                                if (url) await Linking.openURL(url);
                              } catch (e) {
                                console.error('Error downloading:', e);
                                Alert.alert('Error', 'Could not initiate download.');
                              }
                            }}
                          >
                            <Ionicons name="download-outline" size={18} color="#16a34a" />
                            <Text style={[styles.adminDocActionText, { color: '#16a34a' }]}>Download</Text>
                          </TouchableOpacity>

                        </View>


                      {u.bFormDoc ? (
                        <View style={{ marginTop: 10, gap: 8 }}>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b' }}>B-Form / ID Card</Text>
                          {u.bFormDoc.match(/\\.(jpg|jpeg|png|webp|gif)$|cloudinary/i) && !u.bFormDoc.toLowerCase().endsWith('.pdf') ? (
                            <Image
                              source={{ uri: u.bFormDoc }}
                              style={{ width: '100%', height: 120, borderRadius: 12, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' }}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={{ width: '100%', height: 80, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
                              <Ionicons name="id-card-outline" size={32} color="#0077cc" />
                              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>B-Form / Birth Certificate</Text>
                            </View>
                          )}
                          <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                              style={styles.adminDocActionBtn}
                              onPress={async () => {
                                try {
                                  if (u.bFormDoc) await Linking.openURL(u.bFormDoc);
                                } catch (e) {
                                  Alert.alert('Error', 'Could not open document.');
                                }
                              }}
                            >
                              <Ionicons name="eye-outline" size={18} color="#0077cc" />
                              <Text style={styles.adminDocActionText}>View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.adminDocActionBtn, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}
                              onPress={async () => {
                                try {
                                  const url = getDownloadableUrl(u.bFormDoc);
                                  if (url) await Linking.openURL(url);
                                } catch (e) {
                                  Alert.alert('Error', 'Could not download document.');
                                }
                              }}
                            >
                              <Ionicons name="download-outline" size={18} color="#16a34a" />
                              <Text style={[styles.adminDocActionText, { color: '#16a34a' }]}>Download</Text>
                            </TouchableOpacity>

                          </View>

                        </View>
                      ) : (
                        <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 5 }}>B-Form not uploaded.</Text>
                      )}
                    </View>
                  ) : (
                    <Text style={{ fontSize: 12, color: '#94a3b8' }}>No supporting documents uploaded.</Text>
                  )}
                </View>
              )}

              {u.role === 'orphanage' && u.documents && (
                <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>Orphanage Documents</Text>

                  {u.documents.registrationCert && (
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Registration Certificate:</Text>
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}
                        onPress={() => Linking.openURL(u.documents.registrationCert)}
                      >
                        <Ionicons name="document-attach" size={20} color="#0077cc" />
                        <Text style={{ color: '#0077cc', fontSize: 13, fontWeight: '600' }}>View Certificate</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {u.documents.buildingImages && u.documents.buildingImages.length > 0 && (
                    <View>
                      <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Building Images:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {u.documents.buildingImages.map((img: string, idx: number) => (
                          <TouchableOpacity key={idx} onPress={() => Linking.openURL(img)}>
                            <Image source={{ uri: img }} style={{ width: 100, height: 70, borderRadius: 8, backgroundColor: '#f1f5f9' }} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
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
