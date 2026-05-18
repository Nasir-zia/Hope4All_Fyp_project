import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
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
                 {course.thumbnail ? (
                   <Image source={{ uri: course.thumbnail }} style={styles.thumbnailImg} resizeMode="cover" />
                 ) : (
                   <Ionicons name="school" size={40} color="#0077cc" />
                 )}
                 <View style={styles.playBadge}>
                    <Ionicons name="play" size={16} color="#fff" />
                 </View>
              </View>
              <View style={styles.courseInfo}>
                <View style={styles.categoryRow}>
                  <Text style={styles.courseCategory}>{course.category.toUpperCase()}</Text>
                  {course.duration && course.duration !== 'N/A' && (
                    <Text style={styles.courseDuration}>{course.duration}</Text>
                  )}
                </View>
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
  iconBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff7ed', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 5 },
  emptyCard: { width: 300, height: 180, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic' },
  courseCard: { width: 260, backgroundColor: '#fff', borderRadius: 32, marginRight: 18, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 15, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden' },
  courseImage: { height: 140, backgroundColor: '#fff7ed', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  thumbnailImg: { width: '100%', height: '100%' },
  playBadge: { position: 'absolute', width: 48, height: 48, borderRadius: 24, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', bottom: -24, right: 25, borderWidth: 4, borderColor: '#fff', elevation: 4, shadowColor: '#FF6B35', shadowOpacity: 0.3, shadowRadius: 10 },
  courseInfo: { padding: 22, paddingTop: 30 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  courseCategory: { fontSize: 10, fontWeight: '900', color: '#FF6B35', letterSpacing: 1 },
  courseDuration: { fontSize: 10, fontWeight: '700', color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  courseTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  courseDesc: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 18 },
  instructorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  instructorAvatar: { width: 28, height: 28, borderRadius: 10, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  instructorInitial: { fontSize: 11, fontWeight: '800', color: '#FF6B35' },
  instructorName: { fontSize: 13, fontWeight: '700', color: '#475569' },
});
