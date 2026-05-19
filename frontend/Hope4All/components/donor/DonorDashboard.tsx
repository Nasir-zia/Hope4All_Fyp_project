import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { OrphanageSection } from './dashboard/OrphanageSection';
import { OrphanageProfileModal } from './dashboard/OrphanageProfileModal';
import { CourseSection } from './dashboard/CourseSection';
import { ProfileModal } from './dashboard/ProfileModal';
import { PreferenceModal } from './dashboard/PreferenceModal';
import { AddDonationModal } from './dashboard/AddDonationModal';
import { RegistrationForm } from './dashboard/RegistrationForm';
import { SuspendedScreen } from '@/components/SuspendedScreen';

export default function DonorDashboard() {
  const {
    user, logout, donorProfile, loading, saving,
    filteredRequests, filteredOrphans,
    availableFees, donorCourses, myDonations, pledgingFee,
    selectedOrphanForProfile, 
    showProfileModal, setShowProfileModal,
    selectedOrphanage, setSelectedOrphanage,
    showOrphanageModal, setShowOrphanageModal,
    showPreferenceModal, setShowPreferenceModal,
    showAddDonationModal, setShowAddDonationModal,
    name, setName, phone, setPhone, city, setCity,
    selectedRequest, setSelectedRequest, units, setUnits,
    manualType, setManualType, manualUnits, setManualUnits, manualDesc, setManualDesc,
    showCourseModal, setShowCourseModal,
    courseTitle, setCourseTitle, courseDesc, setCourseDesc, courseLink, setCourseLink, courseCategory, setCourseCategory,
    submittingCourse,
    causeOptions, areaOptions, levelOptions, toggleTempCause,
    tempCauses, setTempCauses, tempAreas, setTempAreas, tempLevels, setTempLevels, toggleTempItem,
    tempUrgentOnly, setTempUrgentOnly,
    handleRegister, handleDonate, handlePledgeFee,
    handleCourseSubmit, handleOpenDoc, handleUpdatePreferences, handleManualDonation, handleDeleteDonation,
    handleOpenPreferenceModal, handleMessage, handleUploadDonationPhoto, handlePickDonationPhoto, manualPhoto, handlePickRequestPhoto, requestPhoto,
    handleViewOrphanProfile, orphanProgress, loadingOrphanData,
    orphanages,
    directRecipient, setDirectRecipient, handleOpenDirectDonation, handleToggleMatchOrphan
  } = useDonorDashboard();

  if (user?.status === 'suspended') {
    return <SuspendedScreen reason={user.suspensionReason} onLogout={logout} />;
  }

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
      <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
        <View style={styles.container}>
        <DonorHeader
          name={donorProfile.name}
          points={donorProfile.totalDonated || 0}
          onLogout={() => {
            if (Platform.OS === 'web') {
              if (window.confirm('Are you sure you want to log out?')) {
                logout();
              }
            } else {
              Alert.alert('Logout', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout }
              ]);
            }
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

          {/* Elegant Office Address Banner */}
          <View style={styles.addressCard}>
            <View style={styles.addressIconCircle}>
              <Ionicons name="location" size={28} color="#2563eb" />
            </View>
            <View style={styles.addressTextContent}>
              <Text style={styles.addressTitle}>Main Head Office</Text>
              <Text style={styles.addressDetails}>Faisalabad D Ground, Office #12</Text>
              <Text style={styles.addressNote}>Send donation packages here with your Donation ID.</Text>
            </View>
          </View>

          <DonationSection
            requests={filteredRequests}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
            units={units}
            setUnits={setUnits}
            requestPhoto={requestPhoto}
            onPickPhoto={handlePickRequestPhoto}
            handleDonate={handleDonate}
            handleApproveRequest={() => { }}
            handleRejectRequest={() => { }}
            onOpenPreferences={handleOpenPreferenceModal}
            onMessage={handleMessage}
            onViewOrphan={handleViewOrphanProfile}
            submitting={saving}
          />

          <FeeSection
            availableFees={availableFees}
            pledgingFee={pledgingFee}
            handlePledgeFee={handlePledgeFee}
            onViewOrphan={handleViewOrphanProfile}
            onMessage={handleMessage}
          />

          <DonationHistorySection
            myDonations={myDonations}
            onDeleteDonation={handleDeleteDonation}
            onOpenAddDonation={() => setShowAddDonationModal(true)}
            onUploadPhoto={handleUploadDonationPhoto}
          />

          <OrphanSection
            orphans={filteredOrphans}
            matchedOrphanIds={donorProfile?.matchedOrphans || []}
            onViewOrphan={handleViewOrphanProfile}
            onMessage={handleMessage}
            onDonate={handleOpenDirectDonation}
            onToggleMatch={handleToggleMatchOrphan}
          />

          <OrphanageSection
            orphanages={orphanages}
            onSelect={(o) => { setSelectedOrphanage(o); setShowOrphanageModal(true); }}
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
          achievements={orphanProgress}
          loadingAchievements={loadingOrphanData}
          onClose={() => setShowProfileModal(false)}
          onViewDoc={handleOpenDoc}
          onMessage={handleMessage}
        />

        <OrphanageProfileModal
          visible={showOrphanageModal}
          orphanage={selectedOrphanage}
          onClose={() => setShowOrphanageModal(false)}
        />

        <PreferenceModal
          visible={showPreferenceModal}
          onClose={() => setShowPreferenceModal(false)}
          causeOptions={causeOptions}
          areaOptions={areaOptions}
          levelOptions={levelOptions}
          tempCauses={tempCauses}
          tempAreas={tempAreas}
          tempLevels={tempLevels}
          toggleTempItem={toggleTempItem}
          setTempCauses={setTempCauses}
          setTempAreas={setTempAreas}
          setTempLevels={setTempLevels}
          urgentOnly={tempUrgentOnly}
          setUrgentOnly={setTempUrgentOnly}
          onUpdate={handleUpdatePreferences}
        />

        <AddDonationModal
          visible={showAddDonationModal}
          onClose={() => { setShowAddDonationModal(false); setDirectRecipient(null); }}
          manualType={manualType} setManualType={setManualType}
          manualUnits={manualUnits} setManualUnits={setManualUnits}
          manualDesc={manualDesc} setManualDesc={setManualDesc}
          manualPhoto={manualPhoto}
          onPickPhoto={handlePickDonationPhoto}
          onSubmit={handleManualDonation}
          recipientName={directRecipient?.name}
          submitting={saving}
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
    </SafeAreaView>
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
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
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

  // Pending Approval Screen
  pendingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 24,
  },
  pendingCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  pendingIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: '#fffbeb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#fef3c7',
  },
  pendingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 6,
  },
  pendingSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077cc',
    marginBottom: 16,
  },
  pendingDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  pendingInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    marginBottom: 28,
  },
  pendingInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  pendingLogoutBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  pendingLogoutText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 15,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 8,
    shadowColor: '#0077cc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  addressIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextContent: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 6,
  },
  addressNote: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 18,
  },
});
