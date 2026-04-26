import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CourseApprovalCardProps {
  course: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const CourseApprovalCard: React.FC<CourseApprovalCardProps> = ({ course, onApprove, onReject }) => {
  return (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.reqTypeBadge, { backgroundColor: '#dcfce7' }]}>
          <Text style={[styles.badgeText, { color: '#166534' }]}>{course.category.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.reqTitle}>{course.title}</Text>
      <Text style={styles.reqDetail} numberOfLines={2}>{course.description}</Text>
      <Text style={[styles.reqDetail, { marginTop: 5 }]}>By: {course.instructorName}</Text>
      
      <TouchableOpacity 
        style={styles.linkRow} 
        onPress={() => Linking.openURL(course.link)}
      >
        <Ionicons name="link" size={14} color="#0077cc" />
        <Text style={styles.linkText}>View Content</Text>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.approveBtn} 
          onPress={() => onApprove(course._id)}
        >
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.rejectBtn} 
          onPress={() => onReject(course._id)}
        >
          <Ionicons name="close-circle" size={18} color="#fff" />
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reqTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  reqDetail: {
    fontSize: 13,
    color: '#64748b',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  linkText: {
    color: '#0077cc',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
