import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { OrphanProvider, useOrphan } from '@/contexts/OrphanContext';
import { orphanStyles as styles } from '@/styles/orphanStyles';

// Components
import BackButton from './components/BackButton';
import { OrphanRegistration } from '@/components/orphan/OrphanRegistration';
import { DashboardHeader } from '@/components/orphan/DashboardHeader';
import { EditProfileModal } from '@/components/orphan/EditProfileModal';
import { AddFeeModal } from '@/components/orphan/AddFeeModal';
import { AddProgressModal } from '@/components/orphan/AddProgressModal';
import { MaterialRequestModal } from '@/components/orphan/MaterialRequestModal';
import { AidFeed } from '@/components/orphan/AidFeed';
import { FeeSection } from '@/components/orphan/FeeSection';
import { ProgressSection } from '@/components/orphan/ProgressSection';
import { ActionCards } from '@/components/orphan/ActionCards';
import { FullProgressView } from '@/components/orphan/FullProgressView';
import { LearningSection } from '@/components/orphan/LearningSection';

function OrphanDashboardContent() {
  const { user, logout } = useAuth();
  const { 
    isRegistering, 
    orphanProfile, 
    loadingExtras 
  } = useOrphan();

  // Modal Visibility States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Navigation States
  const [showFullProgressList, setShowFullProgressList] = useState(false);

  // 1. Registration Flow
  if (isRegistering) {
    return <OrphanRegistration />;
  }

  // 2. Verification Flow
  if (user?.status === 'pending') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
        <Ionicons name="time-outline" size={100} color="#f59e0b" />
        <Text style={[styles.nameText, { color: '#333', marginTop: 30, textAlign: 'center' }]}>Verification Pending</Text>
        <Text style={[styles.welcomeText, { textAlign: 'center', color: '#64748b', marginTop: 15, lineHeight: 22 }]}>
          Your account is currently under review by our administration. Once verified, your premium dashboard will be fully unlocked.
        </Text>
        <TouchableOpacity 
          style={[styles.submitButton, { width: '100%', marginTop: 40, backgroundColor: '#f1f5f9' }]} 
          onPress={logout}
        >
          <Text style={[styles.submitButtonText, { color: '#475569' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Loading Initial Profile
  if (!orphanProfile && !isRegistering) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={{ marginTop: 15, color: '#64748b' }}>Loading your profile...</Text>
      </View>
    );
  }

  // 4. Achievement Full History View
  if (showFullProgressList) {
    return (
      <>
        <FullProgressView 
          onBack={() => setShowFullProgressList(false)} 
          onAddNew={() => setShowProgressModal(true)}
        />
        <AddProgressModal 
          visible={showProgressModal} 
          onClose={() => setShowProgressModal(false)} 
        />
      </>
    );
  }

  // 5. Main Premium Dashboard
  return (
    <View style={styles.container}>
      <DashboardHeader onOpenSettings={() => setShowEditModal(true)} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Top Quick Actions */}
          <ActionCards 
            onOpenMaterialRequest={() => setShowRequestModal(true)}
            onViewProgress={() => setShowFullProgressList(true)}
          />

          {/* Learning Hub */}
          <LearningSection />

          {/* Social Proof & Supporters */}
          <AidFeed />

          {/* Progress / Achievements Overview */}
          <ProgressSection onViewAll={() => setShowFullProgressList(true)} />

          {/* Fee & Financials Overview */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={styles.sectionTitle}>Fee History</Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
              onPress={() => setShowFeeModal(true)}
            >
              <Text style={{ color: '#0077cc', fontWeight: 'bold', fontSize: 12 }}>+ Request Funding</Text>
            </TouchableOpacity>
          </View>
          <FeeSection />
          
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      {/* Modals Orchestration */}
      <EditProfileModal 
        visible={showEditModal} 
        onClose={() => setShowEditModal(false)} 
      />
      
      <AddFeeModal 
        visible={showFeeModal} 
        onClose={() => setShowFeeModal(false)} 
      />
      
      <AddProgressModal 
        visible={showProgressModal} 
        onClose={() => setShowProgressModal(false)} 
      />
      
      <MaterialRequestModal 
        visible={showRequestModal} 
        onClose={() => setShowRequestModal(false)} 
      />
    </View>
  );
}

export default function OrphanDashboard() {
  return (
    <OrphanProvider>
      <OrphanDashboardContent />
    </OrphanProvider>
  );
}
