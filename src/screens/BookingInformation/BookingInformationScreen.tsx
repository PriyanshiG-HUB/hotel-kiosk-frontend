import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
export default function BookingInformationScreen({ navigation,route, }: any) {
  const { guestData,roomData, bookingData, verifiedIdType } = route.params;

const guest = guestData;
  const { t } = useTranslation();
  const [activeTab, setActiveTab] =useState<'bookingId' | 'mobile' | 'email'>('bookingId');

  const tabs: {
  key: 'bookingId' | 'mobile' | 'email';
  label: string;
}[] = [
  { key: 'bookingId', label: t('bookingId') },
  { key: 'mobile', label: t('mobile') },
  { key: 'email', label: t('email') },
];

  const handleNext = () => {
  navigation.navigate('Payment', {
    guestData,
    roomData,
    bookingData,
    verifiedIdType,
  });
};
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('bookingInformation')}</Text>
          <Text style={styles.headerStep}>{t('step4Of8')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
  {activeTab === 'bookingId'
  ? t('bookingId')
  : activeTab === 'mobile'
  ? t('mobile')
  : t('email')}
</Text>
          <TextInput
  style={styles.input}
  editable={false}
  selectTextOnFocus={false}
  value={
    activeTab === 'bookingId'
      ? 'WALK-IN'
      : activeTab === 'mobile'
      ? guest.mobile || t('notAvailable')
: guest.email || t('notAvailable')
  }
  placeholderTextColor="#aaa"
/>
        </View>

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>{t('orScanBookingQrCode')}</Text>
          <View style={styles.divider} />
        </View>

        {/* QR Code Area */}
        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
  <Ionicons
    name="qr-code"
    size={100}
    color="#1A1A4E"
  />


    <Text
      style={{
        marginTop: 10,
        fontWeight: '700',
        color: '#1A1A4E',
        fontSize: 16,
      }}
    >
      WALK-IN
    </Text>
  
</View>
          <Text style={styles.qrHint}>
  {t('scanBookingQrCode')}
</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>{t('next')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  header: {
    backgroundColor: '#1A1A4E',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  headerStep: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0EC',
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 2,
  },
  tab: {
    flex: 1, paddingVertical: 13,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#1A1A4E' },
  tabText: { color: '#888', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  inputSection: { marginBottom: 24 },
  inputLabel: { fontSize: 13, color: '#666', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10, borderWidth: 1,
    borderColor: '#E0E0EC',
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: '#222', elevation: 1,
  },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 12, color: '#888', fontSize: 13 },
  qrContainer: { alignItems: 'center', paddingVertical: 20 },
  qrBox: {
    width: 160, height: 160,
    backgroundColor: '#fff', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, borderWidth: 2, borderColor: '#E0E0EC',
  },
  qrHint: { marginTop: 14, color: '#888', fontSize: 13, textAlign: 'center' },
  footer: {
    flexDirection: 'row', padding: 16,
    backgroundColor: '#fff', borderTopWidth: 1,
    borderTopColor: '#E8E8F0', gap: 12,
  },
  backButton: {
    flex: 1, height: 50, borderRadius: 10,
    borderWidth: 2, borderColor: '#1A1A4E',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#1A1A4E', fontWeight: '700', fontSize: 15 },
  nextButton: {
    flex: 2, height: 50, borderRadius: 10,
    backgroundColor: '#1A1A4E', justifyContent: 'center', alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
