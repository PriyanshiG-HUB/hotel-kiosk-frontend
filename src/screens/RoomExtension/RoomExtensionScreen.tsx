import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
import { searchBooking } from '../../api/bookingApi';
const NIGHT_OPTIONS = [1, 2, 3, 4, 5];
const TAX_RATE = 0.12;

function addDays(dateStr: string, days: number): string {
  if (!dateStr) return '';
  
  let date: Date;
  
  if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-');
    date = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const parts = dateStr.split(' ');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      date = new Date(Number(year), months[month] ?? 0, Number(day));
    } else {
      date = new Date(dateStr);
    }
  }

  if (isNaN(date.getTime())) {
    date = new Date();
  }

  date.setDate(date.getDate() + days);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

type Step = 'search' | 'extend';

export default function RoomExtensionScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('search');
  const [bookingIdInput, setBookingIdInput] = useState('');
const [foundBooking, setFoundBooking] = useState<any>(null);  
const [selectedNights, setSelectedNights] = useState<number | null>(null);
  const roomPrice = Number(foundBooking?.roomPrice || foundBooking?.total_amount || 0);
  const currentCheckOut = foundBooking?.check_out_date ?? new Date().toLocaleDateString();
  const extraCharge = selectedNights ? selectedNights * roomPrice : 0;
  const taxes = Math.round(extraCharge * TAX_RATE);
  const grandTotal = extraCharge + taxes;
  const newCheckOut = selectedNights ? addDays(currentCheckOut, selectedNights) : currentCheckOut;

const handleSearch = async () => {
  const trimmed = bookingIdInput.trim();

  if (!trimmed) {
    Alert.alert(
      t('reservationLookupPlaceholder') || 'Booking Number',
      t('reservationLookupSubtitle') || 'Enter your booking number to continue'
    );
    return;
  }

  try {
    const result = await searchBooking(trimmed);

    setFoundBooking(result);
    setStep('extend');
  } catch {
    Alert.alert(
      t('notFound'),
      t('bookingNotFound', {
        id: trimmed,
      })
    );
  }
};

  const handleProceed = () => {
    if (!selectedNights) {
      Alert.alert(t('selectNights'), t('selectNightsMessage'));
      return;
    }
    if (!foundBooking) return;

    const extensionId = `EXT-${Date.now().toString().slice(-6)}`;

    const roomExtension = {
      extensionId,
      bookingId: foundBooking.bookingId || foundBooking.booking_id,
      guestName: foundBooking.guest?.fullName || foundBooking.guests?.full_name || '',
      roomNumber: foundBooking.roomNo || foundBooking.rooms?.room_number || '',
      roomType: foundBooking.roomType || foundBooking.rooms?.room_type || '',
      extraNights: selectedNights,
      originalCheckOut: currentCheckOut,
      newCheckOut,
      roomPrice,
      extraRoomCharge: extraCharge,
      taxes,
      grandTotal,
      paymentMethod: '',
      paymentStatus: false,
    };

    navigation.navigate('RoomExtensionSummary', { roomExtension });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'extend') setStep('search');
            else navigation.goBack();
          }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('roomExtension')}</Text>
          <Text style={styles.headerSubtitle}>{step === 'search' ? t('findBooking') : t('extendYourStay')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* STEP 1 — Search */}
        {step === 'search' && (
          <View>
            <View style={styles.illustrationBox}>
              <Ionicons name="time-outline" size={72} color="#1A1A4E" />
              <Text style={styles.illustrationTitle}>{t('extendYourStay')}</Text>
              <Text style={styles.illustrationSub}>{t('extendStayDescription')}</Text>
            </View>

            <View style={styles.searchCard}>
              <Text style={styles.inputLabel}>{t('reservationLookupPlaceholder') || 'Booking Number'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('reservationLookupPlaceholder') || 'Booking Number'}
                placeholderTextColor="#bbb"
                value={bookingIdInput}
                onChangeText={setBookingIdInput}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={[styles.searchButton, !bookingIdInput.trim() && styles.disabledButton]}
                onPress={handleSearch}
                disabled={!bookingIdInput.trim()}
              >
                <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.searchButtonText}>{t('findBooking')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 2 — Extend */}
        {step === 'extend' && foundBooking && (
          <View>
            <View style={styles.bookingCard}>
              <Text style={styles.cardTitle}>{t('currentBooking')}</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="person-outline" size={18} color="#1A1A4E" />
                  <Text style={styles.infoLabel}>{t('guest')}</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{foundBooking.guest?.fullName || '—'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="bed-outline" size={18} color="#1A1A4E" />
                  <Text style={styles.infoLabel}>{t('room')}</Text>
                  <Text style={styles.infoValue}>{foundBooking.roomNo || '—'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="home-outline" size={18} color="#1A1A4E" />
                  <Text style={styles.infoLabel}>{t('roomType')}</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{foundBooking.roomType || '—'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="pricetag-outline" size={18} color="#1A1A4E" />
                  <Text style={styles.infoLabel}>{t('rate')}</Text>
                  <Text style={styles.infoValue}>₹{roomPrice}/{t('perNight')}</Text>
                </View>
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateLabel}>{t('checkInLabel')}</Text>
                  <Text style={styles.dateValue}>{foundBooking.check_in_date || '—'}</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#1A1A4E" />
                <View style={styles.dateBox}>
                  <Text style={styles.dateLabel}>{t('checkOutLabel')}</Text>
                  <Text style={[styles.dateValue, selectedNights ? styles.updatedDate : null]}>
                    {newCheckOut}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('selectExtraNights')}</Text>
            <View style={styles.nightGrid}>
              {NIGHT_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.nightCard, selectedNights === n && styles.nightCardActive]}
                  onPress={() => setSelectedNights(n)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.nightNumber, selectedNights === n && styles.nightNumberActive]}>{n}</Text>
                  <Text style={[styles.nightLabel, selectedNights === n && styles.nightLabelActive]}>
                    {n === 1 ? t('night') : t('nights')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedNights !== null && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>{t('extensionSummary')}</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('extraNights')}</Text>
                  <Text style={styles.summaryValue}>{selectedNights}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('ratePerNight')}</Text>
                  <Text style={styles.summaryValue}>₹{roomPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('roomCharges')}</Text>
                  <Text style={styles.summaryValue}>₹{extraCharge.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('taxes')}</Text>
                  <Text style={styles.summaryValue}>₹{taxes.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>{t('grandTotal')}</Text>
                  <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.newDateRow}>
                  <Ionicons name="calendar" size={16} color="#1A1A4E" />
                  <Text style={styles.newDateText}>
  {t('newCheckOut')}:{' '}
  <Text style={styles.newDateHighlight}>
    {newCheckOut}
  </Text>
</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 'extend') setStep('search');
            else navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>

        {step === 'search' && (
          <TouchableOpacity
            style={[styles.proceedButton, !bookingIdInput.trim() && styles.disabledButton]}
            onPress={handleSearch}
            disabled={!bookingIdInput.trim()}
          >
            <Text style={styles.proceedButtonText}>{t('search')}</Text>
          </TouchableOpacity>
        )}

        {step === 'extend' && (
          <TouchableOpacity
            style={[styles.proceedButton, !selectedNights && styles.disabledButton]}
            onPress={handleProceed}
            disabled={!selectedNights}
          >
            <Text style={styles.proceedButtonText}>{t('proceed')}</Text>
          </TouchableOpacity>
        )}
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
  headerSubtitle: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },

  illustrationBox: {
    alignItems: 'center', backgroundColor: '#fff', borderRadius: 18,
    padding: 32, marginBottom: 20, elevation: 3,
    borderWidth: 1, borderColor: '#E8E8F0',
  },
  illustrationTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A4E', marginTop: 16, marginBottom: 8 },
  illustrationSub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },

  searchCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    elevation: 3, borderWidth: 1, borderColor: '#E8E8F0',
  },
  inputLabel: { fontSize: 13, color: '#666', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#F6F7FB', borderRadius: 10, borderWidth: 1,
    borderColor: '#E0E0EC', paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: '#222', marginBottom: 16,
  },
  searchButton: {
    height: 52, borderRadius: 12, backgroundColor: '#1A1A4E',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  searchButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabledButton: { opacity: 0.5 },

  bookingCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    elevation: 3, borderWidth: 1, borderColor: '#E8E8F0', marginBottom: 24,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 14 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  infoItem: { width: '47%', backgroundColor: '#F6F7FB', borderRadius: 12, padding: 12, gap: 4 },
  infoLabel: { fontSize: 11, color: '#888', marginTop: 4 },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#222' },
  dateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F0EEFF', borderRadius: 12, padding: 14,
  },
  dateBox: { alignItems: 'center', flex: 1 },
  dateLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  dateValue: { fontSize: 14, fontWeight: '700', color: '#222' },
  updatedDate: { color: '#1A1A4E' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#222', marginBottom: 14 },
  nightGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 8 },
  nightCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', borderWidth: 2, borderColor: '#E8E8F0', elevation: 2,
  },
  nightCardActive: { borderColor: '#1A1A4E', backgroundColor: '#F0EEFF' },
  nightNumber: { fontSize: 24, fontWeight: '800', color: '#888' },
  nightNumberActive: { color: '#1A1A4E' },
  nightLabel: { fontSize: 11, color: '#888', marginTop: 4 },
  nightLabelActive: { color: '#1A1A4E' },
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    elevation: 3, borderWidth: 1, borderColor: '#E8E8F0',
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#222' },
  divider: { height: 1, backgroundColor: '#E8E8F0', marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#222' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#1A1A4E' },
  newDateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12,
    backgroundColor: '#F0EEFF', borderRadius: 10, padding: 12,
  },
  newDateText: { fontSize: 14, color: '#444' },
  newDateHighlight: { fontWeight: '700', color: '#1A1A4E' },
  footer: {
    flexDirection: 'row', padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E8E8F0', gap: 12,
  },
  backButton: {
    flex: 1, height: 52, borderRadius: 12, borderWidth: 2, borderColor: '#1A1A4E',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#1A1A4E', fontWeight: '700', fontSize: 15 },
  proceedButton: {
    flex: 2, height: 52, borderRadius: 12, backgroundColor: '#1A1A4E',
    justifyContent: 'center', alignItems: 'center',
  },
  proceedButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
