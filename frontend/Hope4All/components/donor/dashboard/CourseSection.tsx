import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CourseSectionProps {
  donorCourses: any[];
  onOpenAddCourse: () => void;
}

export const CourseSection: React.FC<CourseSectionProps> = ({ donorCourses, onOpenAddCourse }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Your Mentorship</Text>
          <Text style={styles.subtitle}>Courses you've shared with the community</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onOpenAddCourse}>
          <Ionicons name="cloud-upload" size={24} color="#0077cc" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroller}>
        {donorCourses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Share your knowledge with a course!</Text>
          </View>
        ) : (
          donorCourses.map((c) => (
            <TouchableOpacity key={c._id} style={styles.card} onPress={() => Linking.openURL(c.link)}>
              <View style={styles.cardHeader}>
                <View style={styles.catBadge}>
                  <Text style={styles.catText}>{c.category?.toUpperCase()}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  c.status === 'approved' ? styles.statusApproved : styles.statusPending
                ]}>
                   <Text style={styles.statusText}>{c.status?.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.courseTitle} numberOfLines={1}>{c.title}</Text>
              <Text style={styles.courseDesc} numberOfLines={2}>{c.description}</Text>
              <View style={styles.linkRow}>
                 <Ionicons name="link-outline" size={14} color="#0077cc" />
                 <Text style={styles.linkText}>View Resource</Text>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b' },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center' },
  scroller: { paddingVertical: 10 },
  emptyCard: { width: 300, padding: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 28, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' },
  card: { width: 220, backgroundColor: '#fff', borderRadius: 28, padding: 20, marginRight: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  catBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 9, fontWeight: '800', color: '#0077cc' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  statusApproved: { backgroundColor: '#f0fdf4' },
  statusPending: { backgroundColor: '#fff7ed' },
  statusText: { fontSize: 8, fontWeight: '800', color: '#475569' },
  courseTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  courseDesc: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 15 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linkText: { fontSize: 12, fontWeight: '700', color: '#0077cc' },
});
