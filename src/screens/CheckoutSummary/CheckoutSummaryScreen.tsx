import React, { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooking, Booking } from '../../context/BookingContext';

const TAX_RATE = 0.12;





type Step = 'search' | 'details' | 'payment';

export default function CheckoutSummaryScreen({ navigation }: any) {
  const { findBooking, updateBooking } = useBooking();
  const { t } = useTranslation();
  const paymentMethodNames: Record<string, string> = {
  credit: t('creditCard'),
  debit: t('debitCard'),
  upi: t('upiQr'),
  wallet: t('wallet'),
  netbanking: t('netBanking'),
  cash: t('cash'),
};
const paymentMethods: {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'credit', label: t('creditCard'), icon: 'card' },
  { id: 'debit', label: t('debitCard'), icon: 'card-outline' },
  { id: 'upi', label: t('upiQr'), icon: 'qr-code' },
  { id: 'netbanking', label: t('netBanking'), icon: 'globe' },
  { id: 'wallet', label: t('wallet'), icon: 'wallet' },
  { id: 'cash', label: t('cash'), icon: 'cash' },
];
  const [step, setStep] = useState<Step>('search');
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('credit');

  // Bill calculation
  const nights = foundBooking?.stay?.nights ?? 1;
  const roomPrice = foundBooking?.roomPrice ?? 0;
  const roomCharges = nights * roomPrice;
  const taxes = Math.round(roomCharges * TAX_RATE);
  const grandTotal = roomCharges + taxes;

  const handleSearch = () => {
  const trimmed = bookingIdInput.trim();

  if (!trimmed) {
    Alert.alert(
      t('enterBookingId'),
      t('enterBookingIdMessage')
    );
    return;
  }

  const result = findBooking(trimmed);

  if (!result) {
    Alert.alert(
      t('notFound'),
      t('bookingNotFound', { id: trimmed })
    );
    return;
  }

  if (result.checkedOut) {
    Alert.alert(
      t('error'),
      t('checkoutAlreadyCompleted')
    );
    return;
  }

  setFoundBooking(result);
  setStep('details');
};

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleCheckout = () => {
    if (!foundBooking) return;

    // Update booking with payment info
    const updatedBooking: Booking = {
      ...foundBooking,
      payment: {
        ...foundBooking.payment,
        amount: grandTotal,
        method: selectedMethod,
        status: true,
      },
      checkedOut: true,
    };
    updateBooking(updatedBooking);

    navigation.navigate('ThankYou', {
      title: t('checkoutComplete'),
      message: t('thankYouForStaying'),
      icon: 'checkmark-circle',
      iconColor: '#35C759',
      bookingId: foundBooking.bookingId,
      guestName: foundBooking.guest.fullName,
      roomNumber: foundBooking.roomNo,
      showRating: true,
      clearBooking: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (step === 'details') setStep('search');
          else if (step === 'payment') setStep('details');
          else navigation.goBack();
        }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('checkOut')}</Text>
          <Text style={styles.headerStep}>
            {step === 'search' ? t('reservationLookupSearch') : step === 'details' ? t('reviewStay') : t('payment')}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* STEP 1 — Search */}
        {step === 'search' && (
          <View>
            <View style={styles.illustrationBox}>
              <Ionicons name="log-out-outline" size={72} color="#5B4BDB" />
              <Text style={styles.illustrationTitle}>{t('readyToCheckOut')}</Text>
              <Text style={styles.illustrationSub}>
                {t('enterBookingIdToCheckout')}
              </Text>
            </View>

            <View style={styles.searchCard}>
              <Text style={styles.inputLabel}>{t('bookingId')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('bookingIdPlaceholder')}
                placeholderTextColor="#bbb"
                value={bookingIdInput}
                onChangeText={setBookingIdInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.searchButton, !bookingIdInput.trim() && styles.disabledButton]}
                onPress={handleSearch}
                disabled={!bookingIdInput.trim()}
              >
                <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.searchButtonText}>{t('reservationLookupSearch')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 2 — Details */}
        {step === 'details' && foundBooking && (
          <View>
            {/* Guest Card */}
            <View style={styles.guestCard}>
              <View style={styles.guestIconRow}>
                <View style={styles.guestIconBox}>
                  <Ionicons name="person" size={36} color="#5B4BDB" />
                </View>
                <View style={styles.guestInfo}>
                  <Text style={styles.guestName}>{foundBooking.guest.fullName || '—'}</Text>
                  <Text style={styles.guestSub}>{foundBooking.guest.email || '—'}</Text>
                  <Text style={styles.guestSub}>{foundBooking.guest.mobile || '—'}</Text>
                </View>
              </View>
            </View>

            {/* Room Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>{t('roomInformation')}</Text>
              <DetailRow label={t('bookingId')} value={foundBooking.bookingId} />
              <DetailRow label={t('roomNumber')} value={foundBooking.roomNo} />
              <DetailRow label={t('roomType')} value={foundBooking.roomType} />
              <DetailRow label={t('checkInLabel')} value={foundBooking.stay.checkIn} />
              <DetailRow label={t('checkOutLabel')} value={foundBooking.stay.checkOut} />
              <DetailRow label={t('nights')} value={`${nights}`} />
            </View>

            {/* Bill Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>{t('billSummary')}</Text>
              <DetailRow label={t('roomCharges', { nights, roomPrice })} value={`₹${roomCharges.toFixed(2)}`} />
              <DetailRow label={t('taxes', { taxRate: 0.12 })} value={`₹${taxes.toFixed(2)}`} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('grandTotal')}</Text>
                <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* STEP 3 — Payment */}
        {step === 'payment' && foundBooking && (
          <View>
            <View style={styles.amountBanner}>
              <Text style={styles.bannerLabel}>{t('totalAmountDue')}</Text>
              <Text style={styles.bannerAmount}>₹{grandTotal.toFixed(2)}</Text>
              <Text style={styles.bannerSub}>
  {t('bookingNumber', {
    id: foundBooking.bookingId,
  })}
</Text>
            </View>

            <Text style={styles.paymentTitle}>{t('selectPaymentMethod')}</Text>
            <View style={styles.methodGrid}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
                  onPress={() => setSelectedMethod(method.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={method.icon}
                    size={26}
                    color={selectedMethod === method.id ? '#5B4BDB' : '#888'}
                  />
                  <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelActive]}>
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.selectedMethodBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#5B4BDB" />
              <Text style={styles.selectedMethodText}>
                {t('payingWith')} {paymentMethodNames[selectedMethod] ?? selectedMethod}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 'details') setStep('search');
            else if (step === 'payment') setStep('details');
            else navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>

        {step === 'search' && (
          <TouchableOpacity
            style={[styles.nextButton, !bookingIdInput.trim() && styles.disabledButton]}
            onPress={handleSearch}
            disabled={!bookingIdInput.trim()}
          >
            <Text style={styles.nextButtonText}>{t('search')}</Text>
          </TouchableOpacity>
        )}

        {step === 'details' && (
          <TouchableOpacity style={styles.nextButton} onPress={handleProceedToPayment}>
            <Text style={styles.nextButtonText}>{t('proceedToPayment')}</Text>
          </TouchableOpacity>
        )}

        {step === 'payment' && (
          <TouchableOpacity style={styles.nextButton} onPress={handleCheckout}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.nextButtonText}>{t('confirmCheckout')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
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

  illustrationBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 32,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E8F0',
  },
  illustrationTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A4E', marginTop: 16, marginBottom: 8 },
  illustrationSub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },

  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E8F0',
  },
  inputLabel: { fontSize: 13, color: '#666', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#F6F7FB',
    borderRadius: 10, borderWidth: 1,
    borderColor: '#E0E0EC',
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: '#222', marginBottom: 16,
  },
  searchButton: {
    height: 52, borderRadius: 12,
    backgroundColor: '#5B4BDB',
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  searchButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabledButton: { opacity: 0.5 },

  guestCard: {
    backgroundColor: '#fff',
    borderRadius: 16, padding: 18,
    elevation: 3, borderWidth: 1,
    borderColor: '#E8E8F0', marginBottom: 16,
  },
  guestIconRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  guestIconBox: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center', alignItems: 'center',
  },
  guestInfo: { flex: 1 },
  guestName: { fontSize: 18, fontWeight: '800', color: '#1A1A4E', marginBottom: 4 },
  guestSub: { fontSize: 13, color: '#888', marginBottom: 2 },

  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16, padding: 18,
    elevation: 3, borderWidth: 1,
    borderColor: '#E8E8F0', marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 14 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F8',
  },
  detailLabel: { fontSize: 13, color: '#666' },
  detailValue: { fontSize: 13, fontWeight: '700', color: '#222', maxWidth: '55%', textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: '#5B4BDB',
  },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#222' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#5B4BDB' },

  amountBanner: {
    backgroundColor: '#1A1A4E',
    borderRadius: 18, padding: 28,
    alignItems: 'center', marginBottom: 20, elevation: 4,
  },
  bannerLabel: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  bannerAmount: { color: '#fff', fontSize: 44, fontWeight: '800', marginBottom: 8 },
  bannerSub: { color: '#ddd', fontSize: 13 },

  paymentTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 14 },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  methodCard: {
    width: '30%', flexGrow: 1,
    backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 2, borderColor: '#E0E0EC', elevation: 2,
  },
  methodCardActive: { borderColor: '#5B4BDB', backgroundColor: '#F0EEFF' },
  methodLabel: { fontSize: 11, color: '#888', marginTop: 6, fontWeight: '500', textAlign: 'center' },
  methodLabelActive: { color: '#5B4BDB', fontWeight: '700' },
  selectedMethodBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F0EEFF', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#5B4BDB',
  },
  selectedMethodText: { fontSize: 14, color: '#5B4BDB', fontWeight: '600' },

  footer: {
    flexDirection: 'row', padding: 16,
    backgroundColor: '#fff', borderTopWidth: 1,
    borderTopColor: '#E8E8F0', gap: 12,
  },
  backButton: {
    flex: 1, height: 52, borderRadius: 12,
    borderWidth: 2, borderColor: '#5B4BDB',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#5B4BDB', fontWeight: '700', fontSize: 15 },
  nextButton: {
    flex: 2, height: 52, borderRadius: 12,
    backgroundColor: '#5B4BDB',
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
