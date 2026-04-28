import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useDonorDashboard } from '@/hooks/useDonorDashboard';
import { DonorHeader } from '@/components/donor/DonorHeader';
import { CourseModal } from '@/components/donor/CourseModal';

import { StatsSection } from './dashboard/StatsSection';
import { DonationSection } from './dashboard/DonationSection';
import { FeeSection } from './dashboard/FeeSection';
import { DonationHistorySection } from './dashboard/DonationHistorySection';
import { OrphanSection } from './dashboard/OrphanSection';
import { CourseSection } from './dashboard/CourseSection';
import { ProfileModal } from './dashboard/ProfileModal';
import { PreferenceModal } from './dashboard/PreferenceModal';
import { AddDonationModal } from './dashboard/AddDonationModal';
import { RegistrationForm } from './dashboard/RegistrationForm';

export default function DonorDashboard() {
  const {
    logout, donorProfile, loading, saving,
    requests, orphans, filteredRequests, filteredOrphans,
    availableFees, donorCourses, myDonations, pledgingFee,
    selectedOrphanForProfile, setSelectedOrphanForProfile,
    showProfileModal, setShowProfileModal,
    showPreferenceModal, setShowPreferenceModal,
    showAddDonationModal, setShowAddDonationModal,
    name, setName, phone, setPhone, city, setCity,
    tempCauses,
    selectedRequest, setSelectedRequest, units, setUnits,
    manualType, setManualType, manualUnits, setManualUnits, manualDesc, setManualDesc,
    showCourseModal, setShowCourseModal,
    courseTitle, setCourseTitle, courseDesc, setCourseDesc, courseLink, setCourseLink, courseCategory, setCourseCategory,
    submittingCourse,
    causeOptions, toggleTempCause,
    handleRegister, handleDonate, handlePledgeFee,
    handleCourseSubmit, handleOpenDoc, handleUpdatePreferences, handleManualDonation, handleDeleteDonation,
    handleOpenPreferenceModal, handleMessage
  } = useDonorDashboard();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text style={styles.loadingText}>Preparing your dashboard...</Text>
      </View>
    );
  }

  if (donorProfile) {
    return (
      <View style={styles.container}>
        <DonorHeader 
          name={donorProfile.name} 
          points={donorProfile.totalDonated || 0}
          onLogout={() => {
            Alert.alert('Logout', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: logout }
            ]);
          }}
          onMessages={() => router.push('/messages')}
        />

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.dashboardScroll}
          contentContainerStyle={styles.scrollContent}
        >
          <StatsSection 
            totalDonated={donorProfile.totalDonated || 0} 
            orphansCount={filteredOrphans.length} 
          />

          <DonationSection 
            requests={filteredRequests}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
            units={units}
            setUnits={setUnits}
            handleDonate={handleDonate}
            handleApproveRequest={() => {}}
            handleRejectRequest={() => {}}
            onOpenPreferences={handleOpenPreferenceModal}
          />

          <FeeSection 
            availableFees={availableFees}
            pledgingFee={pledgingFee}
            handlePledgeFee={handlePledgeFee}
            onViewOrphan={(o) => { setSelectedOrphanForProfile(o); setShowProfileModal(true); }}
          />

          <DonationHistorySection 
            myDonations={myDonations}
            onDeleteDonation={handleDeleteDonation}
            onOpenAddDonation={() => setShowAddDonationModal(true)}
          />

          <OrphanSection 
            orphans={filteredOrphans}
            onViewOrphan={(o) => { setSelectedOrphanForProfile(o); setShowProfileModal(true); }}
            onMessage={handleMessage}
          />

          <CourseSection 
            donorCourses={donorCourses}
            onOpenAddCourse={() => setShowCourseModal(true)}
          />
        </ScrollView>

        {/* Modals */}
        <ProfileModal 
          visible={showProfileModal}
          orphan={selectedOrphanForProfile}
          onClose={() => setShowProfileModal(false)}
          onViewDoc={handleOpenDoc}
          onMessage={handleMessage}
        />

        <PreferenceModal 
          visible={showPreferenceModal}
          onClose={() => setShowPreferenceModal(false)}
          causeOptions={causeOptions}
          tempCauses={tempCauses}
          toggleTempCause={toggleTempCause}
          onUpdate={handleUpdatePreferences}
        />

        <AddDonationModal 
          visible={showAddDonationModal}
          onClose={() => setShowAddDonationModal(false)}
          manualType={manualType} setManualType={setManualType}
          manualUnits={manualUnits} setManualUnits={setManualUnits}
          manualDesc={manualDesc} setManualDesc={setManualDesc}
          onSubmit={handleManualDonation}
        />

        <CourseModal 
          visible={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          title={courseTitle} setTitle={setCourseTitle}
          desc={courseDesc} setDesc={setCourseDesc}
          link={courseLink} setLink={setCourseLink}
          category={courseCategory} setCategory={setCourseCategory}
          onSubmit={handleCourseSubmit}
          loading={submittingCourse}
        />
      </View>
    );
  }

  return (
    <RegistrationForm 
      name={name} setName={setName}
      phone={phone} setPhone={setPhone}
      city={city} setCity={setCity}
      onSubmit={handleRegister}
      onLogout={logout}
      saving={saving}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  dashboardScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
