import React from 'react';
import { useBooking } from '../../context/BookingContext';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';


export default function RoomConfirmationScreen({ navigation }: any) {
  const { booking, addBooking} = useBooking();
  const { t } = useTranslation();

  const paymentMethodNames: Record<string, string> = {
    credit: t('creditCard'),
    debit: t('debitCard'),
    upi: t('upiQr'),
    wallet: t('wallet'),
    netbanking: t('netBanking'),
    later: t('payLater'),
  };
  const details = [
    {
    key: 'bookingId',
    label: t('bookingId'),
    value: booking.bookingId || t('notAvailable'),
  },
  {
  key: 'guestName',
  label: t('guestName'),
  value: booking.guest.fullName || t('notAvailable'),
},
{
  key: 'roomNumber',
  label: t('roomNumber'),
  value: booking.roomNo || t('notAvailable'),
},
{
  key: 'roomType',
  label: t('roomType'),
  value: booking.roomType || t('notAvailable'),
},
{
  key: 'checkIn',
  label: t('checkIn'),
  value: booking.stay.checkIn || t('notAvailable'),
},
{
  key: 'checkOut',
  label: t('checkOut'),
  value: booking.stay.checkOut || t('notAvailable'),
},
{
  key: 'paymentMethod',
  label: t('paymentMethod'),
  value:
    paymentMethodNames[booking.payment.method] ??
    t('notAvailable'),
},
  {
    key: 'paymentStatus',
    label: t('paymentStatus'),
    value: booking.payment.status ? t('paid') : t('pending'),
  },
   {
  key: 'totalAmount',
  label: t('totalAmount'),
  value: `$${(
    booking.payment.amount ||
    booking.roomPrice ||
    0
  ).toFixed(2)}`,
},
];

const handlePrintKeyCard = () => {
  if (!booking.bookingId) {
    Alert.alert(
      t('error'),
      t('noBookingInformationAvailable')
    );
    return;
  }
  addBooking(booking);

  navigation.navigate('ThankYou', {
    title: t('keyCardPrinted'),
    message: t('keyCardPrintedMessage'),
    icon: 'key',
    iconColor: '#5B4BDB',
    bookingId: booking.bookingId,
    guestName: booking.guest.fullName,
    roomNumber: booking.roomNo,
    showRating: true,
    clearBooking: false,
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
          <Text style={styles.headerTitle}>{t('roomConfirmation')}</Text>
          <Text style={styles.headerStep}>{t('step8Of8')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={60} color="#fff" />
          </View>
          <Text style={styles.successTitle}>{t('yourRoomIsConfirmed')}</Text>
          {!!booking.bookingId && (
            <Text style={styles.bookingNumber}> {t('bookingNumber', { id: booking.bookingId })}</Text>
          )}
        </View>

        <View style={styles.detailsCard}>
          {details.map((item, index) => (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    item.key === 'totalAmount' && styles.totalAmount,
                    item.key === 'paymentStatus' && booking.payment.status && styles.paidStatus,
                  ]}
                >
                  {item.value}
                </Text>
              </View>
              {index < details.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keyButton} onPress={handlePrintKeyCard}>
          <Ionicons name="key" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.keyButtonText}>{t('printKeyCard')}</Text>
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
  content: { padding: 20, alignItems: 'center' },
  successSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#35C759', justifyContent: 'center', alignItems: 'center',
    elevation: 6, marginBottom: 16,
  },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A4E', textAlign: 'center' },
  bookingNumber: { marginTop: 8, color: '#666', fontSize: 15, textAlign: 'center' },
  detailsCard: {
    width: '100%', backgroundColor: '#fff',
    borderRadius: 16, padding: 20,
    elevation: 3, borderWidth: 1, borderColor: '#E0E0EC',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: { flex: 1, fontSize: 14, color: '#777' },
  detailValue: { flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '600', color: '#222' },
  totalAmount: { color: '#5B4BDB', fontSize: 16, fontWeight: '800' },
  paidStatus: { color: '#35C759', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F0F8' },
  footer: {
    flexDirection: 'row', padding: 16,
    backgroundColor: '#fff', borderTopWidth: 1,
    borderTopColor: '#E8E8F0', gap: 12,
  },
  backButton: {
    flex: 1, height: 50, borderRadius: 10,
    borderWidth: 2, borderColor: '#5B4BDB',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#5B4BDB', fontWeight: '700', fontSize: 15 },
  keyButton: {
    flex: 2, height: 50, borderRadius: 10,
    backgroundColor: '#5B4BDB', flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  keyButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
