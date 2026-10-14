import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
import IDCameraCapture, { CapturedDocument } from '../../components/IDCameraCapture';
import {
  createVerificationSession,
  uploadIdDocument,
  processIdVerification,
  correctExtractedFields,
  staffReviewVerification,
  cancelVerificationSession,
  VerificationSessionResponse,
} from '../../api/idVerificationApi';

const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳',
  'United States': '🇺🇸',
  USA: '🇺🇸',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  UK: '🇬🇧',
  'United Kingdom': '🇬🇧',
  Germany: '🇩🇪',
  France: '🇫🇷',
  Japan: '🇯🇵',
  China: '🇨🇳',
  Singapore: '🇸🇬',
  UAE: '🇦🇪',
};

const getCountryFlag = (country: string) => COUNTRY_FLAGS[country] ?? '🌍';

export default function IDVerificationScreen({ navigation, route }: any) {
  const { t } = useTranslation();

  const bookingData = route?.params?.bookingData;
  let guestData = route?.params?.guestData;
  let roomData = route?.params?.roomData;

  if (bookingData && !guestData) {
    guestData = {
      full_name: bookingData.guest?.fullName,
      mobile: bookingData.guest?.mobile,
      email: bookingData.guest?.email,
      nationality: bookingData.guest?.nationality,
      id_type: bookingData.guest?.idType,
      id_number: bookingData.guest?.idNumber,
    };
    roomData = {
      roomType: bookingData.roomType,
      roomNo: bookingData.roomNo,
      roomPrice: bookingData.roomPrice,
      nights: bookingData.stay?.nights,
      checkIn: bookingData.stay?.checkIn,
      checkOut: bookingData.stay?.checkOut,
    };
  }

  if (!guestData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('notAvailable') || 'No booking data found'}</Text>
      </View>
    );
  }

  const guestNationality = guestData.nationality || 'United States';
  const [selectedCountry, setSelectedCountry] = useState(guestNationality);

  // Document options per jurisdiction
  const ID_OPTIONS: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; requiresBack: boolean }[]> = {
    India: [
      { label: t('aadhaar') || 'Aadhaar', icon: 'card', requiresBack: true },
      { label: t('passport') || 'Passport', icon: 'book', requiresBack: false },
      { label: t('panCard') || 'PAN Card', icon: 'card', requiresBack: false },
      { label: t('drivingLicense') || 'Driving License', icon: 'car', requiresBack: true },
    ],
    'United States': [
      { label: t('passport') || 'Passport', icon: 'book', requiresBack: false },
      { label: t('drivingLicense') || 'Driving License', icon: 'car', requiresBack: true },
      { label: t('stateId') || 'State ID', icon: 'card', requiresBack: true },
    ],
    Canada: [
      { label: t('passport') || 'Passport', icon: 'book', requiresBack: false },
      { label: t('drivingLicense') || 'Driving License', icon: 'car', requiresBack: true },
      { label: t('healthCard') || 'Health Card', icon: 'medkit', requiresBack: true },
    ],
    Australia: [
      { label: t('passport') || 'Passport', icon: 'book', requiresBack: false },
      { label: t('drivingLicense') || 'Driving License', icon: 'car', requiresBack: true },
    ],
    'United Kingdom': [
      { label: t('passport') || 'Passport', icon: 'book', requiresBack: false },
      { label: t('drivingLicense') || 'Driving License', icon: 'car', requiresBack: true },
    ],
  };

  const availableOptions = ID_OPTIONS[selectedCountry] ?? ID_OPTIONS['United States'];
  const [selectedId, setSelectedId] = useState(availableOptions[0]?.label || 'Passport');

  // Privacy Notice & Consent
  const [hasConsented, setHasConsented] = useState(false);

  // Document Captures (Front & optional Back)
  const [frontDoc, setFrontDoc] = useState<CapturedDocument | null>(null);
  const [backDoc, setBackDoc] = useState<CapturedDocument | null>(null);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  // Backend Verification State
  const [session, setSession] = useState<VerificationSessionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field Correction Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editDocNumber, setEditDocNumber] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editExpiry, setEditExpiry] = useState('');

  // Staff Review Modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffIdInput, setStaffIdInput] = useState('');
  const [staffPinInput, setStaffPinInput] = useState('');
  const [staffNotesInput, setStaffNotesInput] = useState('');
  const [isSubmittingStaffReview, setIsSubmittingStaffReview] = useState(false);

  const selectedOptionConfig = availableOptions.find((o) => o.label === selectedId) || availableOptions[0];
  const requiresBackSide = selectedOptionConfig?.requiresBack ?? false;

  // Handler: Start verification session and process document
  const handleProcessVerification = async () => {
    if (!hasConsented) {
      Alert.alert(t('privacyNoticeTitle') || 'Consent Required', t('pleaseGiveConsent') || 'Please provide consent to proceed.');
      return;
    }

    if (!frontDoc) {
      Alert.alert(t('captureDocument') || 'Capture Required', t('captureDocumentPrompt') || 'Please capture the front of your document.');
      return;
    }

    if (requiresBackSide && !backDoc) {
      Alert.alert(t('backSide') || 'Back Side Required', 'Please also capture the back side of this ID card.');
      setActiveSide('back');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Create Session
      setProcessingStep('Creating secure verification session...');
      const newSession = await createVerificationSession({
        bookingId: bookingData?.booking_id || bookingData?.bookingId,
        guestId: guestData?.guest_id,
        guestName: guestData?.full_name,
        selectedIdType: selectedId,
        issuingCountry: selectedCountry,
        consentGiven: true,
      });

      // 2. Upload Document Files
      setProcessingStep('Uploading encrypted document images...');
      await uploadIdDocument(
        newSession.sessionId,
        frontDoc.blob || { uri: frontDoc.uri, name: frontDoc.name, type: frontDoc.type },
        backDoc ? (backDoc.blob || { uri: backDoc.uri, name: backDoc.name, type: backDoc.type }) : undefined
      );

      // 3. Process OCR and Authenticity Checks
      setProcessingStep(t('verifyingWithBackend') || 'Running real OCR & document authenticity checks...');
      const processedSession = await processIdVerification(newSession.sessionId);

      setSession(processedSession);

      // Populate editable fields
      if (processedSession.extractedFields) {
        setEditFullName(processedSession.extractedFields.fullName);
        setEditDocNumber(processedSession.extractedFields.documentNumberMasked);
        setEditDob(processedSession.extractedFields.dateOfBirth || '');
        setEditExpiry(processedSession.extractedFields.expirationDate || '');
      }
    } catch (err: any) {
      console.error('Verification workflow error:', err);
      const apiError = err.response?.data?.message || err.message || 'Verification failed. Please try again or request staff help.';
      setErrorMessage(apiError);

      if (err.response?.data?.code === 'already_checked_in') {
        Alert.alert(
          t('duplicateCheckinTitle') || 'Duplicate Check-In',
          t('duplicateCheckinDesc') || 'This reservation has already been checked in.'
        );
      }
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Handler: Save corrected fields
  const handleSaveCorrections = async () => {
    if (!session?.sessionId) return;
    try {
      const updated = await correctExtractedFields(session.sessionId, {
        fullName: editFullName.trim(),
        documentNumberMasked: editDocNumber.trim(),
        dateOfBirth: editDob.trim() || undefined,
        expirationDate: editExpiry.trim() || undefined,
      });
      setSession(updated);
      setShowEditModal(false);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to update fields. Please try again.');
    }
  };

  // Handler: Authorized Staff Review Decision
  const handleStaffDecision = async (decision: 'approved' | 'rejected') => {
    if (!session?.sessionId) return;
    if (!staffIdInput.trim() || !staffPinInput.trim()) {
      Alert.alert('Required Fields', 'Staff ID and PIN are required for authorization.');
      return;
    }

    setIsSubmittingStaffReview(true);
    try {
      const updated = await staffReviewVerification(session.sessionId, {
        staffId: staffIdInput.trim(),
        staffPin: staffPinInput.trim(),
        decision,
        notes: staffNotesInput.trim() || undefined,
      });

      setSession(updated);
      setShowStaffModal(false);
      setStaffPinInput('');

      if (decision === 'approved') {
        Alert.alert('Staff Approved', 'Physical document inspection approved. You may now continue to booking details.');
      } else {
        Alert.alert('Document Rejected', 'ID verification was rejected by staff. Check-in cannot proceed.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Staff verification failed. Check credentials.';
      Alert.alert('Staff Authorization Failed', msg);
    } finally {
      setIsSubmittingStaffReview(false);
    }
  };

  // Strict Security Gating: Only allow continuing if authenticity is verified and outcome is proceed.
  // Documents pending staff review CANNOT proceed without approved staff review.
  const canContinue = Boolean(
    session &&
      session.status === 'authenticity_verified' &&
      session.overallOutcome === 'proceed'
  );

  const handleBack = async () => {
    if (session?.sessionId && session.status !== 'authenticity_verified') {
      try {
        await cancelVerificationSession(session.sessionId);
      } catch (_) {}
    }
    navigation.goBack();
  };

  const handleNext = () => {
    if (!canContinue) {
      Alert.alert('Verification Incomplete', 'Please complete ID verification before continuing.');
      return;
    }

    // Preserve and forward context to BookingInformation
    navigation.navigate('BookingInformation', {
      guestData: {
        ...guestData,
        full_name: session?.extractedFields?.fullName || guestData.full_name,
        id_type: selectedId,
        id_number: session?.extractedFields?.documentNumberMasked || guestData.id_number,
      },
      roomData,
      bookingData,
      verifiedIdType: selectedId,
      sessionId: session?.sessionId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('idVerification') || 'ID VERIFICATION'}</Text>
          <Text style={styles.headerStep}>{t('step3Of8') || 'Step 3 of 8'}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowStaffModal(true)} style={styles.helpBtn}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Document & Jurisdiction Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text style={styles.cardSectionTitle}>{t('selectIdType') || 'Select ID Type & Jurisdiction'}</Text>
          </View>

          {/* Country Flag & Jurisdiction Indicator */}
          <View style={styles.jurisdictionRow}>
            <View style={styles.flagPill}>
              <Text style={styles.flagEmoji}>{getCountryFlag(selectedCountry)}</Text>
              <Text style={styles.countryName}>{selectedCountry}</Text>
            </View>
          </View>

          {/* Document Type Buttons */}
          <View style={styles.idTypeRow}>
            {availableOptions.map((type) => (
              <TouchableOpacity
                key={type.label}
                disabled={isProcessing || Boolean(session)}
                style={[
                  styles.idTypeBtn,
                  selectedId === type.label && styles.idTypeBtnActive,
                  (isProcessing || Boolean(session)) && { opacity: 0.6 },
                ]}
                onPress={() => {
                  setSelectedId(type.label);
                  setFrontDoc(null);
                  setBackDoc(null);
                  setSession(null);
                }}
              >
                <Ionicons
                  name={type.icon as any}
                  size={18}
                  color={selectedId === type.label ? '#1A1A4E' : '#777'}
                />
                <Text style={[styles.idTypeText, selectedId === type.label && styles.idTypeTextActive]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2: Privacy Notice & Explicit Consent */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <Text style={styles.cardSectionTitle}>{t('privacyNoticeTitle') || 'Data Privacy & Consent'}</Text>
          </View>

          <View style={styles.privacyBox}>
            <Ionicons name="shield-checkmark" size={20} color="#1A1A4E" style={{ marginTop: 2 }} />
            <Text style={styles.privacyBodyText}>
              {t('privacyNoticeBody') ||
                'Your document is processed securely on our server for reservation validation and safety compliance. Image captures are automatically destroyed post-verification.'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.consentCheckboxRow}
            onPress={() => setHasConsented(!hasConsented)}
            disabled={isProcessing || Boolean(session)}
          >
            <View style={[styles.checkbox, hasConsented && styles.checkboxActive]}>
              {hasConsented && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.consentText}>
              {t('consentAgreement') || 'I consent to the collection and verification of my ID document for hotel check-in.'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step 3: Real Camera Capture & Image Upload */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <Text style={styles.cardSectionTitle}>{t('captureDocument') || 'Capture Document'}</Text>
          </View>

          {/* Side Tabs for Card IDs */}
          {requiresBackSide && (
            <View style={styles.sideTabRow}>
              <TouchableOpacity
                style={[styles.sideTab, activeSide === 'front' && styles.sideTabActive]}
                onPress={() => setActiveSide('front')}
              >
                <Text style={[styles.sideTabText, activeSide === 'front' && styles.sideTabTextActive]}>
                  {t('frontSide') || 'Front Side'} {frontDoc ? '✓' : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sideTab, activeSide === 'back' && styles.sideTabActive]}
                onPress={() => setActiveSide('back')}
              >
                <Text style={[styles.sideTabText, activeSide === 'back' && styles.sideTabTextActive]}>
                  {t('backSide') || 'Back Side'} {backDoc ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Real Capture Component */}
          <IDCameraCapture
            documentType={selectedId}
            side={activeSide}
            capturedDoc={activeSide === 'front' ? frontDoc : backDoc}
            onCapture={(doc) => {
              if (activeSide === 'front') {
                setFrontDoc(doc);
                if (requiresBackSide && !backDoc) {
                  setActiveSide('back');
                }
              } else {
                setBackDoc(doc);
              }
            }}
            onRetake={() => {
              if (activeSide === 'front') setFrontDoc(null);
              else setBackDoc(null);
              setSession(null);
            }}
            disabled={isProcessing || !hasConsented}
          />

          {!hasConsented && (
            <Text style={styles.consentNoticeWarning}>
              * {t('pleaseGiveConsent') || 'Please tick the consent checkbox in Step 2 to enable document capture.'}
            </Text>
          )}

          {/* Verification Trigger Button */}
          {!session && (
            <TouchableOpacity
              style={[
                styles.processBtn,
                (!frontDoc || !hasConsented || isProcessing) && { opacity: 0.5 },
              ]}
              onPress={handleProcessVerification}
              disabled={!frontDoc || !hasConsented || isProcessing}
            >
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.processBtnText}>{processingStep || 'Processing Document...'}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="scan" size={20} color="#fff" />
                  <Text style={styles.processBtnText}>{t('scanId') || 'Verify ID Document'}</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#D32F2F" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}
        </View>

        {/* Step 4: Extracted Fields Review & Authenticity Card */}
        {session && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.stepBadge, { backgroundColor: '#35C759' }]}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
              <Text style={styles.cardSectionTitle}>{t('reviewExtractedFields') || 'Extracted Document Data'}</Text>
            </View>

            {/* Authenticity Status Card */}
            <View
              style={[
                styles.authenticityBanner,
                session.status === 'authenticity_verified'
                  ? styles.authSuccess
                  : session.status === 'pending_manual_review'
                  ? styles.authWarning
                  : styles.authFailed,
              ]}
            >
              <Ionicons
                name={
                  session.status === 'authenticity_verified'
                    ? 'shield-checkmark'
                    : session.status === 'pending_manual_review'
                    ? 'hourglass'
                    : 'warning'
                }
                size={22}
                color={
                  session.status === 'authenticity_verified'
                    ? '#2E7D32'
                    : session.status === 'pending_manual_review'
                    ? '#E65100'
                    : '#C62828'
                }
              />
              <View style={styles.authTextCol}>
                <Text style={styles.authTitle}>
                  {session.status === 'authenticity_verified'
                    ? t('authenticityVerified') || 'Authenticity Verified'
                    : session.status === 'pending_manual_review'
                    ? t('pendingManualReview') || 'Pending Staff Physical Check'
                    : session.status === 'expired_document'
                    ? t('documentExpiredAlert') || 'Document Expired'
                    : t('authenticityFailed') || 'Authenticity Check Failed'}
                </Text>
                <Text style={styles.authDesc}>
                  {session.authenticity?.details ||
                    (session.status === 'pending_manual_review'
                      ? 'Automated cryptographic check pending; hotel kiosk staff must visually confirm physical ID.'
                      : 'Verification outcome reported by server.')}
                </Text>
                {session.status === 'pending_manual_review' && (
                  <TouchableOpacity
                    style={styles.staffAuthBtn}
                    onPress={() => setShowStaffModal(true)}
                  >
                    <Ionicons name="key-outline" size={16} color="#fff" />
                    <Text style={styles.staffAuthBtnText}>Staff Physical ID Approval</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Extracted Fields Table */}
            {session.extractedFields && (
              <View style={styles.extractedTable}>
                <View style={styles.extractedRow}>
                  <Text style={styles.fieldLabel}>{t('extractedFullName') || 'Full Name'}:</Text>
                  <Text style={styles.fieldValue}>{session.extractedFields.fullName || t('notAvailable')}</Text>
                </View>

                <View style={styles.extractedRow}>
                  <Text style={styles.fieldLabel}>{t('extractedDocNumber') || 'Document Number'}:</Text>
                  <Text style={styles.fieldValue}>{session.extractedFields.documentNumberMasked || t('notAvailable')}</Text>
                </View>

                {session.extractedFields.dateOfBirth && (
                  <View style={styles.extractedRow}>
                    <Text style={styles.fieldLabel}>{t('extractedDob') || 'Date of Birth'}:</Text>
                    <Text style={styles.fieldValue}>{session.extractedFields.dateOfBirth}</Text>
                  </View>
                )}

                {session.extractedFields.expirationDate && (
                  <View style={styles.extractedRow}>
                    <Text style={styles.fieldLabel}>{t('extractedExpiry') || 'Expiry Date'}:</Text>
                    <Text
                      style={[
                        styles.fieldValue,
                        session.extractedFields.isExpired && { color: '#D32F2F', fontWeight: '700' },
                      ]}
                    >
                      {session.extractedFields.expirationDate} {session.extractedFields.isExpired ? '(EXPIRED)' : ''}
                    </Text>
                  </View>
                )}

                <View style={styles.extractedRow}>
                  <Text style={styles.fieldLabel}>{t('extractedConfidence') || 'Extraction Quality'}:</Text>
                  <Text style={styles.fieldValue}>
                    {Math.round((session.extractedFields.confidence || 0.8) * 100)}%
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.editRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditModal(true)}>
                <Ionicons name="create-outline" size={16} color="#1A1A4E" />
                <Text style={styles.editBtnText}>{t('editDetails') || 'Correct Details'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Controls */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{t('back') || 'BACK'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, !canContinue && { opacity: 0.5 }]}
          disabled={!canContinue}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>{t('next') || 'CONTINUE'}</Text>
        </TouchableOpacity>
      </View>

      {/* Correction Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('editDetails') || 'Correct Extracted Details'}</Text>
            <Text style={styles.modalSubtitle}>
              Please correct any characters misread during automated extraction.
            </Text>

            <Text style={styles.inputLabel}>{t('extractedFullName') || 'Full Name'}</Text>
            <TextInput
              style={styles.modalInput}
              value={editFullName}
              onChangeText={setEditFullName}
              placeholder="Full Name as on ID"
            />

            <Text style={styles.inputLabel}>{t('extractedDocNumber') || 'Document Number'}</Text>
            <TextInput
              style={styles.modalInput}
              value={editDocNumber}
              onChangeText={setEditDocNumber}
              placeholder="Document Number (Masked)"
            />

            <Text style={styles.inputLabel}>{t('extractedDob') || 'Date of Birth (YYYY-MM-DD)'}</Text>
            <TextInput
              style={styles.modalInput}
              value={editDob}
              onChangeText={setEditDob}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.inputLabel}>{t('extractedExpiry') || 'Expiry Date (YYYY-MM-DD)'}</Text>
            <TextInput
              style={styles.modalInput}
              value={editExpiry}
              onChangeText={setEditExpiry}
              placeholder="YYYY-MM-DD"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalCancelText}>{t('cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveCorrections}>
                <Text style={styles.modalSaveText}>{t('saveChanges') || 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Authorized Staff Physical Inspection & Approval Modal */}
      <Modal visible={showStaffModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="shield-checkmark" size={40} color="#1A1A4E" style={{ alignSelf: 'center', marginBottom: 8 }} />
            <Text style={styles.modalTitle}>Staff Physical Document Inspection</Text>
            <Text style={styles.modalSubtitle}>
              An authorized staff member must physically inspect the original document before approving check-in continuation.
            </Text>

            <Text style={styles.inputLabel}>Staff ID *</Text>
            <TextInput
              style={styles.modalInput}
              value={staffIdInput}
              onChangeText={setStaffIdInput}
              placeholder="e.g. STAFF-101"
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>Staff Security PIN *</Text>
            <TextInput
              style={styles.modalInput}
              value={staffPinInput}
              onChangeText={setStaffPinInput}
              placeholder="Enter authorization PIN"
              secureTextEntry
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Inspection Notes</Text>
            <TextInput
              style={styles.modalInput}
              value={staffNotesInput}
              onChangeText={setStaffNotesInput}
              placeholder="e.g. Original physical ID inspected under UV light"
            />

            {isSubmittingStaffReview ? (
              <ActivityIndicator size="small" color="#1A1A4E" style={{ marginVertical: 12 }} />
            ) : (
              <View style={styles.staffModalActions}>
                <TouchableOpacity
                  style={styles.staffRejectBtn}
                  onPress={() => handleStaffDecision('rejected')}
                >
                  <Text style={styles.staffRejectText}>Reject ID</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.staffApproveBtn}
                  onPress={() => handleStaffDecision('approved')}
                >
                  <Text style={styles.staffApproveText}>Approve Physical ID</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.modalCancelBtn, { marginTop: 10, alignSelf: 'center', width: '100%', alignItems: 'center' }]}
              onPress={() => setShowStaffModal(false)}
            >
              <Text style={styles.modalCancelText}>{t('cancel') || 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  header: {
    backgroundColor: '#1A1A4E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40 },
  helpBtn: { width: 40, alignItems: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  headerStep: { color: '#aaa', fontSize: 12, marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E4F0',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1A1A4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  cardSectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A4E' },
  jurisdictionRow: { flexDirection: 'row', marginBottom: 12 },
  flagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF0FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  flagEmoji: { fontSize: 16 },
  countryName: { fontSize: 12, fontWeight: '700', color: '#1A1A4E' },
  idTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  idTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0EC',
    backgroundColor: '#fff',
  },
  idTypeBtnActive: { borderColor: '#1A1A4E', backgroundColor: '#F0EEFF' },
  idTypeText: { fontSize: 13, color: '#777', fontWeight: '500' },
  idTypeTextActive: { color: '#1A1A4E', fontWeight: '700' },
  privacyBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F8F9FE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E8F5',
  },
  privacyBodyText: { fontSize: 12, color: '#555', flex: 1, lineHeight: 18 },
  consentCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1A1A4E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxActive: { backgroundColor: '#1A1A4E' },
  consentText: { fontSize: 12, color: '#222', flex: 1, fontWeight: '600' },
  consentNoticeWarning: { color: '#D32F2F', fontSize: 11, marginTop: 8 },
  sideTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F8',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  sideTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  sideTabActive: { backgroundColor: '#fff', elevation: 1 },
  sideTabText: { fontSize: 12, color: '#777', fontWeight: '600' },
  sideTabTextActive: { color: '#1A1A4E', fontWeight: '700' },
  processBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A4E',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  processBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  errorBannerText: { color: '#D32F2F', fontSize: 12, flex: 1 },
  authenticityBanner: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  authSuccess: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#C8E6C9' },
  authWarning: { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FFE0B2' },
  authFailed: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#FFCDD2' },
  authTextCol: { flex: 1 },
  authTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A4E', marginBottom: 2 },
  authDesc: { fontSize: 12, color: '#444', lineHeight: 16 },
  extractedTable: {
    backgroundColor: '#F9F9FC',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  extractedRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fieldLabel: { fontSize: 12, color: '#777', fontWeight: '500' },
  fieldValue: { fontSize: 13, color: '#111', fontWeight: '700' },
  editRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  editBtnText: { color: '#1A1A4E', fontSize: 12, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { color: '#1A1A4E', fontWeight: '700', fontSize: 14 },
  nextButton: {
    flex: 1.5,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A4E', marginBottom: 4 },
  modalSubtitle: { fontSize: 12, color: '#666', marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 4 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D0D2E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#FAFBFD',
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
  },
  modalCancelText: { color: '#555', fontWeight: '700' },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#1A1A4E',
  },
  modalSaveText: { color: '#fff', fontWeight: '700' },
  staffAuthBtn: {
    marginTop: 8,
    backgroundColor: '#E65100',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  staffAuthBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  staffModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  staffRejectBtn: {
    flex: 1,
    backgroundColor: '#FDEDED',
    borderWidth: 1,
    borderColor: '#D32F2F',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  staffRejectText: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 13,
  },
  staffApproveBtn: {
    flex: 1.4,
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  staffApproveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

