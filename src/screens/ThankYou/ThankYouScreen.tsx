import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNeedHelp } from '../../context/NeedHelpContext';
import { useServiceRequest } from '../../context/ServiceRequestContext';
import useTranslation from '../../hooks/useTranslation';
const AUTO_RETURN_SECONDS = 12;

interface ThankYouParams {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  bookingId?: string;
  guestName?: string;
  roomNumber?: string;
  extraInfo?: string;
  showRating?: boolean;
  clearBooking?: boolean;

  bookingData?: any;
  verifiedIdType?: string;
  paymentMethod?: string;
  paymentAmount?: number;
  keyType?: string;
}

export default function ThankYouScreen({ navigation, route }: any) {
  const { resetNeedHelp } = useNeedHelp();
  const { resetServiceRequest } = useServiceRequest();
  const { t } = useTranslation();
  const params: ThankYouParams = route?.params ?? {};
  const bookingData = params.bookingData;
const guest = bookingData?.guests || {};
const room = bookingData?.rooms || {};
  // clearBooking=true means this is checkout — wipe current booking state
  // clearBooking=false means check-in/extension — keep bookings[], only optionally reset current
  const clearBooking = params.clearBooking === true;

  const title =
  params.title ?? t('thankYou');
const message =
  params.message ??
  t('sessionCompletedSuccessfully');
  const icon: keyof typeof Ionicons.glyphMap = params.icon ?? 'business';
  const iconColor = params.iconColor ?? '#1A1A4E';
  const showRating = params.showRating !== false;

const displayBookingId =
  params.bookingId ??
  bookingData?.booking_id;

const displayGuestName =
  params.guestName ??
  guest?.full_name;

const displayRoomNumber =
  params.roomNumber ??
  room?.room_number;
  const extraInfo = params.extraInfo;
  const [selectedRating, setSelectedRating] = useState(0);
  const ratingLabels = [
  '',
  t('needsImprovement'),
  t('fair'),
  t('good'),
  t('veryGood'),
  t('excellentExperience'),
];
  const [countdown, setCountdown] = useState(AUTO_RETURN_SECONDS);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1, tension: 50, friction: 6, useNativeDriver: true,
    }).start();

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => { handleHome(); }, AUTO_RETURN_SECONDS * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleHome = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    resetNeedHelp();
    resetServiceRequest();

    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('thankYou')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.iconCircle, { backgroundColor: iconColor + '18', transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.iconInner, { backgroundColor: iconColor }]}>
            <Ionicons name={icon} size={52} color="#fff" />
          </View>
        </Animated.View>

        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>

        {(displayBookingId || displayGuestName || displayRoomNumber || extraInfo) && (
          <View style={styles.infoCard}>
            {!!displayGuestName && (
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#1A1A4E" />
                <Text style={styles.infoText}>{displayGuestName}</Text>
              </View>
            )}
            {!!displayRoomNumber && (
              <View style={styles.infoRow}>
                <Ionicons name="bed-outline" size={16} color="#1A1A4E" />
                <Text style={styles.infoText}>{t('room')}: {displayRoomNumber}</Text>
              </View>
            )}
            {!!displayBookingId && (
              <View style={styles.infoRow}>
                <Ionicons name="receipt-outline" size={16} color="#1A1A4E" />
                <Text style={styles.infoText}>{t('bookingId')}: {displayBookingId}</Text>
              </View>
            )}
            {!!extraInfo && (
              <View style={styles.infoRow}>
                <Ionicons name="information-circle-outline" size={16} color="#1A1A4E" />
                <Text style={styles.infoText}>{extraInfo}</Text>
              </View>
            )}
          </View>
        )}

        {showRating && (
          <View style={styles.ratingSection}>
            <View style={styles.divider} />
            <Text style={styles.ratingPrompt}>{t('howWasYourExperience')}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setSelectedRating(star)} activeOpacity={0.7}>
                  <Ionicons
                    name={star <= selectedRating ? 'star' : 'star-outline'}
                    size={36}
                    color={star <= selectedRating ? '#FFB648' : '#CCC'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {selectedRating > 0 && (
  <Text style={styles.ratingFeedback}>
    {ratingLabels[selectedRating]}
  </Text>
)}
          </View>
        )}

        <View style={styles.countdownBadge}>
          <Ionicons name="time-outline" size={16} color="#888" />
          <Text style={styles.countdownText}>
  {t('returningToHomeIn', { seconds: countdown })}
</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
          <Ionicons name="home" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.homeButtonText}>{t('returnHome')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  header: {
    backgroundColor: '#1A1A4E',
    paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  content: { padding: 24, alignItems: 'center' },
  iconCircle: {
    width: 160, height: 160, borderRadius: 80,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 16, marginBottom: 24,
  },
  iconInner: {
    width: 110, height: 110, borderRadius: 55,
    justifyContent: 'center', alignItems: 'center', elevation: 6,
  },
  titleText: { fontSize: 28, fontWeight: '800', color: '#1A1A4E', textAlign: 'center', marginBottom: 12 },
  messageText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 24, paddingHorizontal: 10 },
  infoCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16,
    padding: 18, elevation: 3, borderWidth: 1, borderColor: '#E8E8F0',
    gap: 12, marginBottom: 20,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 15, color: '#333', fontWeight: '600', flex: 1 },
  ratingSection: { width: '100%', alignItems: 'center' },
  divider: { width: '60%', height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 },
  ratingPrompt: { fontSize: 16, color: '#555', marginBottom: 16 },
  starsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  ratingFeedback: { fontSize: 16, fontWeight: '700', color: '#FFB648' },
  countdownBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 24, backgroundColor: '#F0F0F8', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  countdownText: { fontSize: 13, color: '#888' },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E8E8F0' },
  homeButton: {
    height: 56, borderRadius: 14, backgroundColor: '#1A1A4E',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3,
  },
  homeButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
