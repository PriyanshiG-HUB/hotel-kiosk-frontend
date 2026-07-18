import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
import { extendRoom } from '../../api/roomExtensionApi';
export default function RoomExtensionSummaryScreen({ navigation, route }: any) {
  const { roomExtension } = route.params || {};
  const { t } = useTranslation();
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
  { id: 'later', label: t('payLater'), icon: 'time' },
];
  const [selectedMethod, setSelectedMethod] = useState('credit');


  const summaryRows = [
  { label: t('guest'), value: roomExtension.guestName || '—' },
  { label: t('room'), value: `${roomExtension.roomNumber || '—'} • ${roomExtension.roomType || '—'}` },
  { label: t('extraNights'), value: `${roomExtension.extraNights ?? 0}` },
  { label: t('originalCheckOut'), value: roomExtension.originalCheckOut },
  { label: t('newCheckOut'), value: roomExtension.newCheckOut },
  { label: t('roomCharges'), value: `₹${(roomExtension.extraRoomCharge ?? 0).toFixed(2)}` },
  { label: t('taxes12'), value: `₹${(roomExtension.taxes ?? 0).toFixed(2)}` },
];

  const handlePrintReceipt = () => {
    Alert.alert(t('receipt'), t('receiptPrintedSuccessfully'));
  };

  const handleEmailReceipt = () => {
    Alert.alert(t('receipt'), t('receiptEmailedSuccessfully'));
  };

  const handlePay = async () => {
    // Update the booking in the bookings list if we found it
try {
  await extendRoom({
    booking_id: roomExtension.bookingId,
    new_checkout: roomExtension.newCheckOut,
    additional_nights: roomExtension.extraNights,
    additional_amount: roomExtension.grandTotal,
  });
} catch (error) {
  Alert.alert(
    'Error',
    'Failed to extend booking'
  );
  return;
}

    navigation.navigate('ThankYou', {
      title: t('stayExtended'),
      message: t('stayExtendedMessage', { nights: roomExtension.extraNights, nightLabel: roomExtension.extraNights === 1 ? t('night') : t('nights') }),
      icon: 'moon',
      iconColor: '#1A1A4E',
      bookingId: roomExtension.extensionId,
      guestName: roomExtension.guestName ?? '',
      roomNumber: roomExtension.roomNumber ?? '',
      extraInfo: `${t('newCheckOut')}: ${roomExtension.newCheckOut}`,
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
          <Text style={styles.headerTitle}>{t('extensionSummaryTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('reviewAndPay')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Banner */}
        <View style={styles.amountBanner}>
          <Text style={styles.amountLabel}>{t('totalAmountDue')}</Text>
          <Text style={styles.amountValue}>₹{(roomExtension.grandTotal ?? 0).toFixed(2)}</Text>
          <View style={styles.extIdBadge}>
            <Text style={styles.extIdText}>{t('extensionId')}: {roomExtension.extensionId}</Text>
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>{t('extensionDetails')}</Text>
          {summaryRows.map((row, idx) => (
            <View key={row.label}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
              {idx < summaryRows.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('grandTotal')}</Text>
            <Text style={styles.totalValue}>₹{(roomExtension.grandTotal ?? 0).toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Methods */}
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
                size={24}
                color={selectedMethod === method.id ? '#1A1A4E' : '#888'}
              />
              <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelActive]}>
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Receipt Buttons */}
        <View style={styles.receiptRow}>
          <TouchableOpacity style={styles.receiptBtn} onPress={handlePrintReceipt}>
            <Ionicons name="print" size={18} color="#1A1A4E" />
            <Text style={styles.receiptBtnText}>{t('printReceipt')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.receiptBtn} onPress={handleEmailReceipt}>
            <Ionicons name="mail" size={18} color="#1A1A4E" />
            <Text style={styles.receiptBtnText}>{t('emailReceipt')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.payButtonText}>{t('payAndExtend')}</Text>
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
  headerSubtitle: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },
  amountBanner: {
    backgroundColor: '#1A1A4E', borderRadius: 18, padding: 24,
    alignItems: 'center', marginBottom: 20, elevation: 4,
  },
  amountLabel: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  amountValue: { color: '#fff', fontSize: 42, fontWeight: '800', marginBottom: 12 },
  extIdBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  extIdText: { color: '#ddd', fontSize: 12 },
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    elevation: 3, borderWidth: 1, borderColor: '#E8E8F0', marginBottom: 24,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  summaryLabel: { fontSize: 13, color: '#666' },
  summaryValue: { fontSize: 13, fontWeight: '600', color: '#222', maxWidth: '55%', textAlign: 'right' },
  rowDivider: { height: 1, backgroundColor: '#F0F0F8' },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 14, marginTop: 6,
    borderTopWidth: 2, borderTopColor: '#1A1A4E',
  },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#222' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#1A1A4E' },
  paymentTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 14 },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  methodCard: {
    width: '30%', flexGrow: 1, backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 2, borderColor: '#E0E0EC', elevation: 2,
  },
  methodCardActive: { borderColor: '#1A1A4E', backgroundColor: '#F0EEFF' },
  methodLabel: { fontSize: 11, color: '#888', marginTop: 6, fontWeight: '500', textAlign: 'center' },
  methodLabelActive: { color: '#1A1A4E', fontWeight: '700' },
  receiptRow: {
    flexDirection: 'row', gap: 12, marginBottom: 8,
  },
  receiptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 46, borderRadius: 10,
    borderWidth: 2, borderColor: '#1A1A4E',
    backgroundColor: '#fff', elevation: 2,
  },
  receiptBtnText: { color: '#1A1A4E', fontWeight: '600', fontSize: 13 },
  footer: {
    flexDirection: 'row', padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E8E8F0', gap: 12,
  },
  backButton: {
    flex: 1, height: 52, borderRadius: 12, borderWidth: 2, borderColor: '#1A1A4E',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#1A1A4E', fontWeight: '700', fontSize: 15 },
  payButton: {
    flex: 2, height: 52, borderRadius: 12, backgroundColor: '#1A1A4E',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  payButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
