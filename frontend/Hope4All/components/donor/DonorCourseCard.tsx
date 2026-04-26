import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DonorCourseCardProps {
  course: any;
}

export const DonorCourseCard: React.FC<DonorCourseCardProps> = ({ course }) => {
  return (
    <View style={styles.courseCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusMiniBadge, 
          course.status === 'pending' ? {backgroundColor: '#f59e0b'} : 
          course.status === 'approved' ? {backgroundColor: '#10b981'} : 
          {backgroundColor: '#ef4444'}
        ]}>
          <Text style={styles.statusMiniBadgeText}>{course.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.courseCardTitle}>{course.title}</Text>
      <Text style={styles.courseCardCategory}>{course.category}</Text>
      <Text style={styles.courseCardDesc} numberOfLines={2}>{course.description}</Text>
      <TouchableOpacity 
        style={styles.viewLinkBtn}
        onPress={() => Linking.openURL(course.link)}
      >
        <Ionicons name="link" size={14} color="#0077cc" />
        <Text style={styles.viewLinkText}>View Content</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 20,
    marginRight: 12,
    width: 240,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusMiniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusMiniBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  courseCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
  },
  courseCardCategory: {
    fontSize: 12,
    color: '#0077cc',
    fontWeight: '600',
    marginTop: 2,
  },
  courseCardDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 18,
  },
  viewLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  viewLinkText: {
    color: '#0077cc',
    fontSize: 13,
    fontWeight: '600',
  },
});
