import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';
import { getDownloadableUrl } from '../../utils/cloudinaryUtils';


interface OrphanagesTabProps {
  orphanages: any[];
  onUpdateStatus: (id: string, currentStatus: string, reason?: string) => void;
  onDelete: (id: string) => void;
}

export const OrphanagesTab: React.FC<OrphanagesTabProps> = ({ orphanages, onUpdateStatus, onDelete }) => {
  const [reasons, setReasons] = React.useState<{[key: string]: string}>({});

  const handleReasonChange = (id: string, text: string) => {
    setReasons(prev => ({ ...prev, [id]: text }));
  };
  return (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Registered Orphanages</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{orphanages.length} Total</Text>
        </View>
      </View>

      {orphanages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No orphanages found.</Text>
        </View>
      ) : (
        orphanages.map((o) => (
          <View key={o._id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userMain}>
                {o.profilePic ? (
                  <Image source={{ uri: o.profilePic }} style={styles.userAvatar} />
                ) : (
                  <View style={[styles.userAvatar, { backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="business" size={24} color="#0077cc" />
                  </View>
                )}
                <View>
                  <Text style={styles.userName}>{o.name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: '#f0fdf4' }]}>
                    <Text style={[styles.roleText, { color: '#16a34a' }]}>{o.registrationNumber}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: o.status === 'approved' ? '#dcfce7' : '#fef3c7' }]}>
                <Text style={[styles.statusLabel, { color: o.status === 'approved' ? '#16a34a' : '#d97706' }]}>
                  {o.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>{o.location?.address}, {o.location?.city}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>{o.contactInfo?.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>Capacity: {o.capacity?.current}/{o.capacity?.max}</Text>
              </View>

              {/* Documents Section */}
              {(o.documents?.registrationCert || (o.documents?.buildingImages && o.documents.buildingImages.length > 0)) && (
                <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>Verification Documents</Text>
                  
                  {o.documents.registrationCert && (
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Registration Certificate:</Text>
                      {o.documents.registrationCert.match(/\.(jpg|jpeg|png|webp|gif)$|cloudinary/i) && !o.documents.registrationCert.toLowerCase().endsWith('.pdf') ? (
                        <Image 
                          source={{ uri: o.documents.registrationCert }} 
                          style={{ width: '100%', height: 150, borderRadius: 12, backgroundColor: '#f1f5f9' }} 
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <TouchableOpacity
                            style={styles.adminDocActionBtn}
                            onPress={async () => {
                              try {
                                if (o.documents.registrationCert) await Linking.openURL(o.documents.registrationCert);
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
                                const url = getDownloadableUrl(o.documents.registrationCert);
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


                      )}
                    </View>
                  )}

                  {o.documents.buildingImages && o.documents.buildingImages.length > 0 && (
                    <View>
                      <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Building Images:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                        {o.documents.buildingImages.map((img: string, index: number) => (
                          <TouchableOpacity key={index} onPress={() => Linking.openURL(img)}>
                            <Image 
                              source={{ uri: img }} 
                              style={{ width: 120, height: 80, borderRadius: 10, backgroundColor: '#f1f5f9' }} 
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            </View>

            {o.status === 'pending' ? (
              <View style={[styles.actionRow, { gap: 10 }]}>
                <TouchableOpacity 
                  style={[styles.approveBtn, { flex: 1 }]} 
                  onPress={() => onUpdateStatus(o.userId, 'verified')}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.rejectBtn || { backgroundColor: '#ef4444', padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 5 }]} 
                  onPress={() => onUpdateStatus(o.userId, 'rejected')}
                >
                  <Ionicons name="close-circle" size={18} color="#fff" />
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}
                  onPress={() => onDelete(o.userId)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                <View style={[styles.actionRow, { gap: 10 }]}>
                  <TouchableOpacity 
                    style={[styles.approveBtn, { flex: 1, backgroundColor: o.status === 'suspended' ? '#f0fdf4' : '#fef2f2' }]} 
                    onPress={() => onUpdateStatus(o.userId, o.status === 'verified' ? 'suspended' : 'verified', reasons[o.userId])}
                  >
                    <Ionicons name={o.status === 'verified' ? "ban-outline" : "checkmark-circle-outline"} size={18} color={o.status === 'verified' ? "#ef4444" : "#16a34a"} />
                    <Text style={[styles.btnText, { color: o.status === 'verified' ? "#ef4444" : "#16a34a" }]}>
                      {o.status === 'verified' ? 'Suspend' : 'Verify'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ backgroundColor: '#f8fafc', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}
                    onPress={() => onDelete(o.userId)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                
                {o.status === 'verified' && (
                  <View style={{ paddingHorizontal: 5 }}>
                    <TextInput
                      style={{ 
                        backgroundColor: '#f8fafc', 
                        borderWidth: 1, 
                        borderColor: '#e2e8f0', 
                        borderRadius: 10, 
                        padding: 10, 
                        fontSize: 13,
                        color: '#475569'
                      }}
                      placeholder="Reason for suspension (feedback)..."
                      value={reasons[o.userId] || ''}
                      onChangeText={(text) => handleReasonChange(o.userId, text)}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
};
