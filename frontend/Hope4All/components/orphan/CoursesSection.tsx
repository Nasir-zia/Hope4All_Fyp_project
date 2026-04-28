import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CoursesSectionProps {
  courses: any[];
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Recommended Courses</Text>
          <Text style={styles.subtitle}>Unlock your potential with specialized learning</Text>
        </View>
        <View style={styles.iconBadge}>
          <Ionicons name="library-outline" size={20} color="#0077cc" />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {courses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>New courses are on the way!</Text>
          </View>
        ) : (
          courses.map((course) => (
            <TouchableOpacity 
              key={course._id} 
              style={styles.courseCard}
              onPress={() => Linking.openURL(course.link)}
            >
              <View style={styles.courseImage}>
                 <Ionicons name="school" size={40} color="#0077cc" />
                 <View style={styles.playBadge}>
                    <Ionicons name="play" size={16} color="#fff" />
                 </View>
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseCategory}>{course.category.toUpperCase()}</Text>
                <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
                <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>
                <View style={styles.instructorRow}>
                  <View style={styles.instructorAvatar}>
                    <Text style={styles.instructorInitial}>{(course.instructorName?.charAt(0) || 'I').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.instructorName}>{course.instructorName || 'Verified Mentor'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleGroup: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  iconBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 5 },
  emptyCard: { width: 300, height: 180, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic' },
  courseCard: { width: 240, backgroundColor: '#fff', borderRadius: 28, marginRight: 18, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden' },
  courseImage: { height: 120, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  playBadge: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#0077cc', justifyContent: 'center', alignItems: 'center', bottom: -22, right: 20, borderWidth: 4, borderColor: '#fff' },
  courseInfo: { padding: 20, paddingTop: 25 },
  courseCategory: { fontSize: 10, fontWeight: '800', color: '#0077cc', marginBottom: 6 },
  courseTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 6 },
  courseDesc: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 15 },
  instructorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  instructorAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  instructorInitial: { fontSize: 10, fontWeight: '800', color: '#64748b' },
  instructorName: { fontSize: 12, fontWeight: '600', color: '#475569' },
});
