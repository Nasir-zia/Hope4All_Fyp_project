import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useOrphanDashboard } from '@/hooks/useOrphanDashboard';
import { getDownloadableUrl } from '../utils/cloudinaryUtils';


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
    fees, feeTitle, setFeeTitle, feeAmount, setFeeAmount, feeDate, setFeeDate, feePaymentNumber, setFeePaymentNumber, loadingFees, submittingFee,
    materialRequests, progressReports, aidFeed, availableCourses, showRequestModal, setShowRequestModal, submittingMaterial,
    reqType, setReqType, reqDesc, setReqDesc, reqUnits, setReqUnits, reqSchool, setReqSchool,
    isUrgent, setIsUrgent,
    regName, setRegName, regAge, setRegAge, regGender, setRegGender, regLocation, setRegLocation, regPhone, setRegPhone,
    profilePicUri, docUri, docName, submittingProfile,
    showEditModal, setShowEditModal, editName, setEditName, editAge, setEditAge, editLocation, setEditLocation,
    editPhone, setEditPhone, editGender, setEditGender, newProfilePicUri, updatingProfile,
    showProgressModal, setShowProgressModal, progTitle, setProgTitle, progCategory, setProgCategory,
    progScore, setProgScore, progRemarks, setProgRemarks, progImgUri, submittingProg,
    handleAddFee, handleDeleteFee, handleAddMaterialRequest, openSettings, handleUpdateProfile, handleAddProgress, handleDeleteProgress,
    pickImage, pickDocument, pickBForm, handleProfileSubmit, handleConfirmReceipt, handleReportIssue,
    receiptPhoto, handlePickReceiptPhoto, confirmingReceipt,
    bFormUri, bFormName
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
        bFormUri={bFormUri} bFormName={bFormName} onPickBForm={pickBForm}
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
    <SafeAreaView style={styles.safeContainer} edges={['right', 'bottom', 'left']}>
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
          aidCount={aidFeed.length}
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
          onReport={handleReportIssue}
          onPickPhoto={handlePickReceiptPhoto}
          receiptPhoto={receiptPhoto}
          confirmingId={confirmingReceipt}
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
          onReport={handleReportIssue}
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
          feePaymentNumber={feePaymentNumber} setFeePaymentNumber={setFeePaymentNumber}
          onAddFee={handleAddFee}
          onDeleteFee={handleDeleteFee}
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
          isSubmitting={submittingMaterial}
        />

        {/* Supporting Documents Section */}
        {orphanProfile?.supportingDocs && (
          <View style={{ marginHorizontal: 20, marginTop: 25, backgroundColor: '#fff', padding: 20, borderRadius: 24, elevation: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 15 }}>Verification Documents</Text>
            <View style={{ gap: 12 }}>
              {orphanProfile.supportingDocs.match(/\\.(jpg|jpeg|png|webp|gif)$|cloudinary/i) && !orphanProfile.supportingDocs.toLowerCase().endsWith('.pdf') ? (
                <Image 
                  source={{ uri: orphanProfile.supportingDocs }} 
                  style={{ width: '100%', height: 200, borderRadius: 16, backgroundColor: '#f1f5f9' }} 
                  resizeMode="cover"
                />
              ) : (
                <View style={{ padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' }}>
                  <Ionicons name="document-text" size={40} color="#0077cc" />
                  <Text style={{ marginTop: 8, color: '#64748b' }}>PDF Document Uploaded</Text>
                </View>
              )}
              
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity 
                  style={{ 
                    flex: 1,
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 8, 
                    backgroundColor: '#f0f9ff', 
                    padding: 16, 
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#bae6fd'
                  }}
                  onPress={async () => {
                    try {
                      if (orphanProfile.supportingDocs) await Linking.openURL(orphanProfile.supportingDocs);
                    } catch (e) {
                      Alert.alert('Error', 'Could not open document viewer.');
                    }
                  }}
                >
                  <Ionicons name="eye-outline" size={20} color="#0077cc" />
                  <Text style={{ color: '#0077cc', fontWeight: '700' }}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ 
                    flex: 1,
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 8, 
                    backgroundColor: '#f0fdf4', 
                    padding: 16, 
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#bbf7d0'
                  }}
                  onPress={async () => {
                    try {
                      const url = getDownloadableUrl(orphanProfile.supportingDocs);
                      if (url) await Linking.openURL(url);
                    } catch (e) {
                      Alert.alert('Error', 'Could not download document.');
                    }
                  }}
                >
                  <Ionicons name="download-outline" size={20} color="#16a34a" />
                  <Text style={{ color: '#16a34a', fontWeight: '700' }}>Download</Text>
                </TouchableOpacity>
              </View>


            </View>
          </View>
        )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
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
