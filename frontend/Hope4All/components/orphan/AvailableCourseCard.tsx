import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvailableCourseCardProps {
  course: any;
}

export const AvailableCourseCard: React.FC<AvailableCourseCardProps> = ({ course }) => {
  return (
    <TouchableOpacity 
      style={styles.courseCard}
      onPress={() => Linking.openURL(course.link)}
    >
      <View style={styles.courseIcon}>
        <Ionicons name="play-circle" size={32} color="#fff" />
      </View>
      <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
      <Text style={styles.courseCategory}>{course.category}</Text>
      <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>
      <View style={styles.instructorRow}>
        <Ionicons name="person-circle-outline" size={14} color="#64748b" />
        <Text style={styles.instructorName}>{course.instructorName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: '#fff',
    width: 200,
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4da6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  courseCategory: {
    fontSize: 12,
    color: '#0077cc',
    fontWeight: '700',
    marginBottom: 8,
  },
  courseDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 10,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  instructorName: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
});
