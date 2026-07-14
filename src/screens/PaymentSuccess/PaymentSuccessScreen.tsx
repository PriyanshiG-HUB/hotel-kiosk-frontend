import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooking } from '../../context/BookingContext';
import useTranslation from '../../hooks/useTranslation';


export default function PaymentSuccessScreen({ navigation }: any) {
  const { booking, bookings, addBooking } = useBooking();
  const { t } = useTranslation();

const paymentMethodNames: Record<string, string> = {
  credit: t('creditCard'),
  debit: t('debitCard'),
  upi: t('upiQr'),
  wallet: t('wallet'),
  netbanking: t('netBanking'),
  later: t('payLater'),
};
  const transactionId = booking.bookingId
    ? `TXN-${booking.bookingId}`
    : 'TXN-000000';

  useEffect(() => {
    if (!booking.bookingId) return;
    const alreadyExists = bookings.some(item => item.bookingId === booking.bookingId);
    if (!alreadyExists) {
      addBooking(booking);
    }
  }, []);

  const handlePrintReceipt = () => {
    Alert.alert(t('receipt'), t('receiptPrintedSuccessfully'));
  };

  const handleEmailReceipt = () => {
    Alert.alert(t('receipt'), t('receiptEmailedSuccessfully'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('paymentSuccess')}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.successCard}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={70} color="#fff" />
          </View>
          <Text style={styles.successTitle}>{t('paymentSuccessful')}</Text>
          <Text style={styles.transactionId}>{t('transactionId')}: {transactionId}</Text>
          <Text style={styles.successMessage}>
            {t('paymentProcessedSuccessfully')}
          </Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>{t('paidAmount')}</Text>
          <Text style={styles.amountValue}>₹{Number(booking.payment.amount || 0).toFixed(2)}</Text>
        </View>

        <View style={styles.infoCard}>
          {!!booking.bookingId && (
            <Text style={styles.infoText}>{t('bookingId')}: {booking.bookingId}</Text>
          )}
          {!!booking.roomNo && (
            <Text style={styles.infoText}>{t('roomNumber')}: {booking.roomNo}</Text>
          )}
          {!!booking.payment.method && (
            <Text style={styles.infoText}>
              {t('paymentMethod')}: {paymentMethodNames[booking.payment.method] ?? '--'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handlePrintReceipt}>
          <Ionicons name="print" size={20} color="#5B4BDB" />
          <Text style={styles.actionBtnText}>{t('printReceipt')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleEmailReceipt}>
          <Ionicons name="mail" size={20} color="#5B4BDB" />
          <Text style={styles.actionBtnText}>{t('emailReceipt')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() =>
            navigation.navigate('RoomAssigned', {
              title: t('paymentSuccessful'),
              message: t('paymentProcessedSuccessfully'),
              icon: 'checkmark-circle',
              iconColor: '#35C759',
              bookingId: booking.bookingId,
              guestName: booking.guest.fullName,
              roomNumber: booking.roomNo,
              showRating: true,
              clearBooking: false,
            })
          }
        >
          <Text style={styles.doneButtonText}>{t('done')}</Text>
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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  successCard: { alignItems: 'center', marginBottom: 24 },
  successCircle: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: '#35C759', justifyContent: 'center', alignItems: 'center',
    elevation: 8, marginBottom: 20,
    shadowColor: '#35C759', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#35C759', textAlign: 'center' },
  transactionId: { fontSize: 13, color: '#888', marginTop: 8 },
  successMessage: { marginTop: 10, fontSize: 15, color: '#666', textAlign: 'center' },
  amountCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, width: '100%',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 3, borderWidth: 1, borderColor: '#E0E0EC',
  },
  amountLabel: { fontSize: 16, color: '#666', fontWeight: '500' },
  amountValue: { fontSize: 28, fontWeight: '800', color: '#1A1A4E' },
  infoCard: {
    marginTop: 20, width: '100%',
    backgroundColor: '#fff', borderRadius: 14,
    padding: 18, borderWidth: 1, borderColor: '#E0E0EC',
  },
  infoText: { fontSize: 15, color: '#555', marginBottom: 6 },
  actionRow: {
    flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 8,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    height: 50, borderRadius: 10,
    borderWidth: 2, borderColor: '#5B4BDB',
    backgroundColor: '#fff', elevation: 2,
  },
  actionBtnText: { color: '#5B4BDB', fontWeight: '700', fontSize: 13 },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E8E8F0' },
  doneButton: {
    height: 54, borderRadius: 10,
    backgroundColor: '#5B4BDB', justifyContent: 'center', alignItems: 'center',
  },
  doneButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
