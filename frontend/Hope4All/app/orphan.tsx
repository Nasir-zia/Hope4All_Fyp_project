import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { useOrphanDashboard } from '@/hooks/useOrphanDashboard';

// Modular Components
import { OrphanHeader } from '@/components/orphan/OrphanHeader';
import { StatsCard } from '@/components/orphan/StatsCard';
import { FeeSection } from '@/components/orphan/FeeSection';
import { MaterialRequestSection } from '@/components/orphan/MaterialRequestSection';
import { ProgressSection } from '@/components/orphan/ProgressSection';
import { CoursesSection } from '@/components/orphan/CoursesSection';
import { AidFeedSection } from '@/components/orphan/AidFeedSection';
import { AidHistorySection } from '@/components/orphan/AidHistorySection';
import { ProfileModal } from '@/components/orphan/ProfileModal';
import { ProgressModal } from '@/components/orphan/ProgressModal';
import { RegistrationForm } from '@/components/orphan/RegistrationForm';
import { PendingVerification } from '@/components/orphan/PendingVerification';
import { SuspendedScreen } from '@/components/SuspendedScreen';
import BackButton from '@/components/BackButton';

export default function OrphanDashboard() {
  const {
    user, logout, orphanProfile, isRegistering, loadingExtras,
    fees, feeTitle, setFeeTitle, feeAmount, setFeeAmount, feeDate, setFeeDate, loadingFees, submittingFee,
    materialRequests, progressReports, aidFeed, availableCourses, showRequestModal, setShowRequestModal,
    reqType, setReqType, reqDesc, setReqDesc, reqUnits, setReqUnits, reqSchool, setReqSchool,
    isUrgent, setIsUrgent,
    regName, setRegName, regAge, setRegAge, regGender, setRegGender, regLocation, setRegLocation, regPhone, setRegPhone,
    profilePicUri, docUri, docName, submittingProfile,
    showEditModal, setShowEditModal, editName, setEditName, editAge, setEditAge, editLocation, setEditLocation,
    editPhone, setEditPhone, editGender, setEditGender, newProfilePicUri, updatingProfile,
    showProgressModal, setShowProgressModal, progTitle, setProgTitle, progCategory, setProgCategory,
    progScore, setProgScore, progRemarks, setProgRemarks, progImgUri, submittingProg,
    handleAddFee, handleAddMaterialRequest, openSettings, handleUpdateProfile, handleAddProgress, handleDeleteProgress,
    pickImage, pickDocument, handleProfileSubmit, handleConfirmReceipt
  } = useOrphanDashboard();

  if (user?.status === 'suspended') {
    return <SuspendedScreen reason={user.suspensionReason} onLogout={logout} />;
  }

  if (isRegistering) {
    return (
      <RegistrationForm
        name={regName} setName={setRegName}
        age={regAge} setAge={setRegAge}
        location={regLocation} setLocation={setRegLocation}
        phone={regPhone} setPhone={setRegPhone}
        gender={regGender} setGender={setRegGender}
        profilePicUri={profilePicUri} onPickImage={() => pickImage()}
        docUri={docUri} docName={docName} onPickDocument={pickDocument}
        onSubmit={handleProfileSubmit}
        onLogout={logout}
        submitting={submittingProfile}
      />
    );
  }

  if (user?.status === 'pending') {
    return <PendingVerification onLogout={logout} />;
  }

  if (loadingExtras && !orphanProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <OrphanHeader
          name={orphanProfile?.name}
          profilePic={orphanProfile?.profilePic}
          onOpenSettings={openSettings}
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
        />

        <StatsCard
          coursesCount={availableCourses.length}
        />

        <AidFeedSection
          aidItems={aidFeed.filter(item => item.status !== 'completed')}
          onThanks={(donor) => {
            const targetUserId = donor?.userId?._id || donor?.userId || donor?._id;
            if (!targetUserId) return;
            router.push({
              pathname: '/messages',
              params: { userId: String(targetUserId), username: donor?.name }
            });
          }}
          onConfirm={handleConfirmReceipt}
        />

        <AidHistorySection 
          aidHistory={aidFeed} 
          onThanks={(donor) => {
            const targetUserId = donor?.userId?._id || donor?.userId || donor?._id;
            if (!targetUserId) return;
            router.push({
              pathname: '/messages',
              params: { userId: String(targetUserId), username: donor?.name }
            });
          }}
          onConfirm={handleConfirmReceipt}
        />

        <CoursesSection courses={availableCourses} />

        <ProgressSection
          reports={progressReports}
          onAddProgress={() => setShowProgressModal(true)}
          onDeleteProgress={handleDeleteProgress}
        />

        <FeeSection
          fees={fees}
          feeTitle={feeTitle} setFeeTitle={setFeeTitle}
          feeAmount={feeAmount} setFeeAmount={setFeeAmount}
          feeDate={feeDate} setFeeDate={setFeeDate}
          onAddFee={handleAddFee}
          loading={loadingFees}
          submitting={submittingFee}
        />

        <MaterialRequestSection
          requests={materialRequests}
          reqType={reqType} setReqType={setReqType}
          reqDesc={reqDesc} setReqDesc={setReqDesc}
          reqUnits={reqUnits} setReqUnits={setReqUnits}
          reqSchool={reqSchool} setReqSchool={setReqSchool}
          onAddRequest={handleAddMaterialRequest}
          showModal={showRequestModal}
          setShowModal={setShowRequestModal}
          isUrgent={isUrgent}
          setIsUrgent={setIsUrgent}
        />
      </ScrollView>

      {/* Modals */}
      <ProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        name={editName} setName={setEditName}
        age={editAge} setAge={setEditAge}
        location={editLocation} setLocation={setEditLocation}
        phone={editPhone} setPhone={setEditPhone}
        gender={editGender as any} setGender={setEditGender as any}
        profilePic={orphanProfile?.profilePic}
        newPic={newProfilePicUri}
        onPickImage={() => pickImage(true)}
        onUpdate={handleUpdateProfile}
        loading={updatingProfile}
      />

      <ProgressModal
        visible={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        title={progTitle} setTitle={setProgTitle}
        category={progCategory} setCategory={setProgCategory}
        score={progScore} setScore={setProgScore}
        remarks={progRemarks} setRemarks={setProgRemarks}
        imageUri={progImgUri}
        onPickImage={() => pickImage(false, true)}
        onSave={handleAddProgress}
        loading={submittingProg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
