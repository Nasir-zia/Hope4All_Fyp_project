import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchApprovedCourses } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { orphanStyles as styles } from '@/styles/orphanStyles';

export const LearningSection = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchApprovedCourses(user?.token);
      setCourses(data);
    } catch (error) {
      console.error('[LearningSection] Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator color="#0077cc" style={{ marginVertical: 20 }} />;
  if (courses.length === 0) return null;

  return (
    <View style={{ marginBottom: 25 }}>
      <Text style={styles.sectionTitle}>Learning Center</Text>
      <Text style={{ color: '#64748b', fontSize: 13, marginBottom: 15 }}>Master new skills with online courses.</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {courses.map((course) => (
          <View 
            key={course._id} 
            style={{ 
              backgroundColor: '#fff', 
              width: 220, 
              borderRadius: 20, 
              marginRight: 15,
              padding: 15,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 5,
            }}
          >
            <View style={{ backgroundColor: '#eff6ff', padding: 10, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 }}>
              <Ionicons name="school" size={20} color="#0077cc" />
            </View>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0077cc', marginBottom: 4 }}>{course.category.toUpperCase()}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 6 }} numberOfLines={1}>{course.title}</Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 15, height: 32 }} numberOfLines={2}>{course.description}</Text>
            
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#0077cc', 
                paddingVertical: 10, 
                borderRadius: 12, 
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              onPress={() => Linking.openURL(course.link)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Start Learning</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
