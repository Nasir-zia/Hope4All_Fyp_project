import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles as styles } from './AdminStyles';

interface CoursesTabProps {
  pendingCourses: any[];
  approvedCourses: any[];
  onAddPress: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ 
  pendingCourses, 
  approvedCourses = [],
  onAddPress, 
  onUpdateStatus 
}) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Academy Control</Text>
        <TouchableOpacity
          style={[styles.addTaskBtn, { backgroundColor: '#059669' }]}
          onPress={onAddPress}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subText}>Moderating platform learning resources.</Text>

      <Text style={[styles.sectionTitle, { marginTop: 20, fontSize: 16 }]}>Pending Verification</Text>
      {pendingCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>All pending courses are up to date.</Text>
        </View>
      ) : (
        pendingCourses.map((course) => (
          <View key={course._id} style={styles.courseCard}>
            <View style={styles.cardHeader}>
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>{course.category}</Text>
              </View>
              <Text style={styles.pendingLabel}>REVIEW REQUIRED</Text>
            </View>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>

            <View style={styles.courseMeta}>
              <Text style={styles.instructorText}>By {course.instructorName}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(course.link)}>
                <Text style={styles.linkText}>View Source</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.approveBtn} onPress={() => onUpdateStatus(course._id, 'approved')}>
                <Text style={styles.btnText}>Publish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => onUpdateStatus(course._id, 'rejected')}>
                <Text style={styles.btnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <Text style={[styles.sectionTitle, { marginTop: 25, fontSize: 16 }]}>Active Academy Courses</Text>
      {approvedCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No active courses available.</Text>
        </View>
      ) : (
        approvedCourses.map((course) => (
          <View key={course._id} style={styles.courseCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.courseBadge, { backgroundColor: '#e0f2fe' }]}>
                <Text style={[styles.courseBadgeText, { color: '#0369a1' }]}>{course.category}</Text>
              </View>
              <Text style={[styles.pendingLabel, { color: '#059669', backgroundColor: '#d1fae5' }]}>ACTIVE</Text>
            </View>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>

            <View style={styles.courseMeta}>
              <Text style={styles.instructorText}>By {course.instructorName}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(course.link)}>
                <Text style={styles.linkText}>View Source</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
};
