import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooking } from '../../context/BookingContext';
import useTranslation from '../../hooks/useTranslation';
const paymentMethods: {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'credit', label: 'creditCard', icon: 'card' },
  { id: 'debit', label: 'debitCard', icon: 'card-outline' },
  { id: 'upi', label: 'upiQr', icon: 'qr-code' },
  { id: 'netbanking', label: 'netBanking', icon: 'globe' },
  { id: 'wallet', label: 'wallet', icon: 'wallet' },
  { id: 'later', label: 'payLater', icon: 'time' },
];

export default function PaymentScreen({ navigation }: any) {
  const { booking, setBooking } = useBooking();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState(
    booking.payment.method || 'credit'
  );

  const totalAmount = booking.payment.amount || booking.roomPrice || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('payment')}</Text>
          <Text style={styles.headerStep}>{t('step5Of8')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>{t('totalAmount')}</Text>
          <Text style={styles.amountValue}>₹{totalAmount.toFixed(2)}</Text>
          <Text style={styles.roomInfo}>
            {booking.roomType || t('room')} • {t('room')} {booking.roomNo || '--'}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>{t('selectPaymentMethod')}</Text>

        <View style={styles.methodGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
              onPress={() => {
                setSelectedMethod(method.id);
                setBooking({
                  ...booking,
                  payment: { ...booking.payment, method: method.id },
                });
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={method.icon}
                size={26}
                color={selectedMethod === method.id ? '#5B4BDB' : '#888'}
              />
              <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelActive]}>
                {t(method.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => {
            setBooking({
              ...booking,
              payment: {
                amount: totalAmount,
                method: selectedMethod,
                status: true,
              },
            });
            navigation.navigate('RoomAssigned');
          }}
        >
          <Text style={styles.payButtonText}>{t('payNow')}</Text>
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
  amountCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 24, alignItems: 'center',
    elevation: 3, marginBottom: 24,
    borderWidth: 1, borderColor: '#E0E0EC',
  },
  amountLabel: { fontSize: 16, color: '#666', marginBottom: 8 },
  amountValue: { fontSize: 42, fontWeight: '800', color: '#1A1A4E' },
  roomInfo: { marginTop: 8, fontSize: 14, color: '#666', fontWeight: '500' },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 16 },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  methodCard: {
    width: '30%', flexGrow: 1,
    backgroundColor: '#fff', borderRadius: 14,
    paddingVertical: 18, alignItems: 'center',
    borderWidth: 2, borderColor: '#E0E0EC', elevation: 2,
  },
  methodCardActive: { borderColor: '#5B4BDB', backgroundColor: '#F0EEFF' },
  methodLabel: { fontSize: 12, color: '#888', marginTop: 8, fontWeight: '500', textAlign: 'center' },
  methodLabelActive: { color: '#5B4BDB', fontWeight: '700' },
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
  payButton: {
    flex: 2, height: 50, borderRadius: 10,
    backgroundColor: '#5B4BDB', justifyContent: 'center', alignItems: 'center',
  },
  payButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
