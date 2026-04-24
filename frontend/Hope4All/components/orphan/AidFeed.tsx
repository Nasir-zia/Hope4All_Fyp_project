import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

export const AidFeed: React.FC = () => {
  const { aidFeed } = useOrphan();

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Your Supporters</Text>
      <Text style={styles.sectionSub}>Kind people who are helping you reach your goals.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.aidScroller}>
        {aidFeed.length === 0 ? (
          <View style={styles.emptyAidCard}>
            <Text style={styles.emptyText}>Your requests are being reviewed. Help is on the way!</Text>
          </View>
        ) : (
          aidFeed.map((aid, index) => (
            <View key={index} style={styles.aidCard}>
              <View style={styles.donorHeader}>
                <View style={styles.donorAvatar}>
                  <Text style={styles.donorInitial}>{(aid.donorId?.name?.charAt(0) || 'D').toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.donorName}>{aid.donorId?.name || 'Anonymous Donor'}</Text>
                  <Text style={styles.aidTime}>{new Date(aid.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
              <View style={styles.aidDetail}>
                <Text style={styles.aidType}>{aid.requestId?.type?.toUpperCase() || 'SUPPLIES'}</Text>
                <Text style={styles.aidQty}>{aid.units} {aid.requestId?.unitType || 'units'} sent</Text>
              </View>
              <TouchableOpacity 
                style={styles.thanksBtn}
                onPress={() => router.push({
                  pathname: '/messages',
                  params: { userId: aid.donorId?._id, username: aid.donorId?.name }
                })}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0077cc" />
                <Text style={styles.thanksBtnText}>Say Thanks</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
