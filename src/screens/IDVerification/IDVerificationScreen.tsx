import React, { useState ,useRef, useEffect} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar,
} from 'react-native';
import  { Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooking } from '../../context/BookingContext';
import useTranslation from '../../hooks/useTranslation';


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

const getCountryFlag = (country: string) =>
  COUNTRY_FLAGS[country] ?? '🌍';

export default function IDVerificationScreen({ navigation }: any) {
   const rotateAnim = useRef(new Animated.Value(0)).current;
  const { booking, setBooking } = useBooking();
  const { t } = useTranslation();
const ID_OPTIONS: Record<
  string,
  { label: string; icon: keyof typeof Ionicons.glyphMap }[]
> = {
  India: [
    { label: t('aadhaar'), icon: 'card' },
    { label: t('passport'), icon: 'book' },
    { label: t('panCard'), icon: 'card' },
    { label: t('drivingLicense'), icon: 'car' },
  ],

  'United States': [
    { label: t('passport'), icon: 'book' },
    { label: t('drivingLicense'), icon: 'car' },
    { label: t('stateId'), icon: 'card' },
  ],

  Canada: [
    { label: t('passport'), icon: 'book' },
    { label: t('drivingLicense'), icon: 'car' },
    { label: t('healthCard'), icon: 'medkit' },
  ],

  Australia: [
    { label: t('passport'), icon: 'book' },
    { label: t('drivingLicense'), icon: 'car' },
  ],

  'United Kingdom': [
    { label: t('passport'), icon: 'book' },
    { label: t('drivingLicense'), icon: 'car' },
  ],
};
const [selectedId, setSelectedId] = useState(
  booking.guest.idType || 'Passport'
);

const [scanned, setScanned] = useState(false);

const [isScanning, setIsScanning] = useState(false);

const handleScan = () => {
  setScanned(false); 
  setIsScanning(true);

  setTimeout(() => {
    setBooking({
      ...booking,
      guest: {
        ...booking.guest,
        idType: selectedId,
      },
    });

    setScanned(true);
    setIsScanning(false);
  }, 2000);
};

const handleNext = () => {

  navigation.navigate('BookingInformation');
};
useEffect(() => {
  if (isScanning) {
    rotateAnim.setValue(0);

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }
}, [isScanning]);

  const scanYourText = t('scanYour', {
  id: selectedId,
});

const placeYourIdText = t('placeYourId', {
  id: selectedId,
});

const verifiedOnText = t('verifiedOn', {
  date: new Date().toLocaleString(),
});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('idVerification')}</Text>
          <Text style={styles.headerStep}>{t('step3Of8')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{scanYourText}</Text>

        {/* Scan Area */}
        <View style={styles.scanArea}>
          {isScanning ? (

<View style={styles.scanPlaceholder}>
  <Animated.View
  style={{
    transform: [
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  }}
>
  <Ionicons
    name="scan"
    size={90}
    color="#5B4BDB"
  />
</Animated.View>

<Text
    style={{
        marginTop:12,
        color:'#5B4BDB',
        fontWeight:'600',
    }}
>
    {t('readyToScan')}
</Text>

  <Text style={styles.scanText}>
    {t('verifyingDocument')}
  </Text>
</View>

) : scanned ? (
            <View style={styles.scannedCard}>
              <View style={styles.flagRow}>
                <View style={styles.flagBox}>
                  <Text style={styles.flagEmoji}>{getCountryFlag(booking.guest.nationality)}</Text>
                  <Text style={styles.flagText}>{(booking.guest.nationality || 'Unknown').toUpperCase()}</Text></View>
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark-circle" size={34} color="#35C759" />
                </View>
              </View>
              <View style={styles.idDetails}>
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={40} color="#aaa" />
                </View>
                <View style={styles.idInfo}>
  <Text style={styles.idName}>
    {booking.guest.fullName || t('notAvailable')}
  </Text>

  <Text style={styles.idText}>
  {booking.guest.idNumber
    ? booking.guest.idNumber.replace(/.(?=.{4})/g, '*')
    : t('notAvailable')}
</Text>

  <Text style={styles.idText}>
    {booking.guest.nationality || t('notAvailable')}
  </Text>

  <Text style={styles.idText}>
    {selectedId}
  </Text>

  <Text
  style={{
    color: '#35C759',
    fontWeight: '700',
    marginTop: 6,
  }}
>
  {t('identityVerifiedSuccessfully')}
</Text>

<Text style={styles.idText}>
  {verifiedOnText}
</Text>
</View>
              </View>
            </View>
          ) : (
            <View style={styles.scanPlaceholder}>
              <Ionicons name="scan" size={80} color="#5B4BDB" />
              <Text style={styles.scanText}>{placeYourIdText}</Text>
            </View>
          )}
        </View>

        {/* ID Type Tabs */}
        <View style={styles.idTypeRow}>
          {(
  ID_OPTIONS[booking.guest.nationality] ??
  ID_OPTIONS['India']
).map((type) => (
            <TouchableOpacity
            disabled={scanned || isScanning}
              key={type.label}
              style={[
  styles.idTypeBtn,
  selectedId === type.label &&
    styles.idTypeBtnActive,
  scanned && {
    opacity: 0.5,
  },
]}
              onPress={() => {
                setScanned(false);
  setSelectedId(type.label);

  setBooking({
    ...booking,
    guest: {
      ...booking.guest,
      idType: type.label,
    },
  });
}}
            >
              <Ionicons
                name={type.icon as any}
                size={18}
                color={selectedId === type.label ? '#5B4BDB' : '#888'}
              />
              <Text style={[styles.idTypeText, selectedId === type.label && styles.idTypeTextActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[
    styles.scanAgainButton,
    isScanning && { opacity: 0.5 },
  ]}
  disabled={isScanning}
  onPress={handleScan}
>
          <Text style={styles.scanAgainText}>
  {isScanning
              ? t('scanning')
    : scanned
              ? t('scanAgain')
              : t('scanId')}
</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[
    styles.nextButton,
    !scanned && { opacity: 0.5 },
  ]}
  disabled={!scanned}
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
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 20 },
  scanArea: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: '#E0E0EC',
    overflow: 'hidden', elevation: 3, marginBottom: 20,
  },
  scannedCard: { padding: 16 },
  flagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  flagBox: {
    backgroundColor: '#1A1A4E', borderRadius: 6,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6,
  },
  flagEmoji: { fontSize: 16, marginRight: 6 },
  flagText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  successBadge: { backgroundColor: '#fff', borderRadius: 20 },
  idDetails: { flexDirection: 'row', gap: 14 },
  photoPlaceholder: {
    width: 70, height: 80, borderRadius: 8,
    backgroundColor: '#F0F0F8', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#ddd',
  },
  idInfo: { flex: 1 },
  idName: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 4 },
  idText: { fontSize: 12, color: '#555', marginBottom: 2 },
  scanPlaceholder: {
    height: 180, justifyContent: 'center', alignItems: 'center',
  },
  scanText: { color: '#888', fontSize: 14, marginTop: 12, textAlign: 'center' },
  idTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  idTypeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1, borderColor: '#E0E0EC',
    backgroundColor: '#fff',
  },
  idTypeBtnActive: { borderColor: '#5B4BDB', backgroundColor: '#F0EEFF' },
  idTypeText: { fontSize: 13, color: '#888', fontWeight: '500' },
  idTypeTextActive: { color: '#5B4BDB', fontWeight: '700' },
  footer: {
    flexDirection: 'row', padding: 16,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E8E8F0', gap: 8,
  },
  backButton: {
    flex: 1, height: 50, borderRadius: 10,
    borderWidth: 2, borderColor: '#5B4BDB',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#5B4BDB', fontWeight: '700', fontSize: 14 },
  scanAgainButton: {
    flex: 1.5, height: 50, borderRadius: 10,
    borderWidth: 2, borderColor: '#888',
    justifyContent: 'center', alignItems: 'center',
  },
  scanAgainText: { color: '#888', fontWeight: '700', fontSize: 13 },
  nextButton: {
    flex: 1.5, height: 50, borderRadius: 10,
    backgroundColor: '#5B4BDB',
    justifyContent: 'center', alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
