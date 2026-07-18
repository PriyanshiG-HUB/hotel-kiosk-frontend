import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
import { createGuest } from '../../api/guestApi';
import { getRooms, createBooking, getBookingById } from '../../api/bookingApi';
import { createPayment } from '../../api/paymentApi';
import PaymentCard from '../../components/PaymentCard/PaymentCard';
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

export default function PaymentScreen({ navigation, route }: any) {
const { guestData, roomData, bookingData, verifiedIdType } = route.params;
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState('credit');
  const [loading, setLoading] = useState(false);

  const totalAmount =  roomData.roomPrice * roomData.nights;

  const handlePay = async () => {
    if (bookingData) {
      navigation.navigate('RoomAssigned', {
        bookingData,
        verifiedIdType,
        paymentMethod: selectedMethod,
        paymentAmount: totalAmount,
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Create guest
      const guestResponse = await createGuest({
        full_name: guestData.full_name,
        mobile: guestData.mobile,
        email: guestData.email,
        nationality: guestData.nationality,
        id_type: guestData.id_type,
        id_number: guestData.id_number,
      });
      const guest_id = guestResponse[0]?.guest_id || guestResponse.guest_id;
      if (!guest_id) {
        throw new Error('Failed to resolve Guest ID');
      }

      // 2. Fetch rooms to match room type and availability
      const roomsList = await getRooms();
      const targetType = roomData.dbRoomType || 'Standard';
      
      const selectedRoom = roomsList.find((r: any) => 
        r.status === 'available' && 
        r.room_type.toLowerCase() === targetType.toLowerCase()
      );
      
      if (!selectedRoom) {
        throw new Error(`No available rooms of type "${roomData.roomType}" found`);
      }
      const room_id = selectedRoom.room_id;

      // 3. Create booking
      const createdBooking = await createBooking({
        guest_id,
        room_id,
        check_in: roomData.checkIn,
        check_out: roomData.checkOut,
        nights: roomData.nights,
        total_amount: totalAmount,
      });
      if (!createdBooking?.bookingId) {
        throw new Error('Failed to create booking in database');
      }

      // Fetch the full populated booking with guests and rooms relations
      const bookingResponse = await getBookingById(createdBooking.bookingId);

      // 4. Create payment
      await createPayment({
        booking_id: bookingResponse.bookingId,
        amount: totalAmount,
        payment_method: selectedMethod === 'later' ? 'Later' : selectedMethod.toUpperCase(),
        payment_status: selectedMethod === 'later' ? 'Pending' : 'Paid',
        transaction_id: 'TXN-' + Date.now().toString(),
      });

      setLoading(false);
      navigation.navigate('RoomAssigned', {
        bookingData: bookingResponse,
        verifiedIdType,
        paymentMethod: selectedMethod,
        paymentAmount: totalAmount,
      });
    } catch (err: any) {
      console.log('Check-in error:', err);
      setLoading(false);
      Alert.alert(
        t('error') || 'Error',
        err.message || t('failedToProcessPayment') || 'Failed to process payment'
      );
    }
  };

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
            {roomData.roomType}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>{t('selectPaymentMethod')}</Text>

        <View style={styles.methodGrid}>
          {paymentMethods.map((method: any) => (
            <PaymentCard
              key={method.id}
              method={method}
              selected={selectedMethod === method.id}
              onPress={() => setSelectedMethod(method.id)}
              t={t}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.backButton, loading && styles.disabledButton]} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>{t('payNow')}</Text>
          )}
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
  methodCardActive: { borderColor: '#1A1A4E', backgroundColor: '#F0EEFF' },
  methodLabel: { fontSize: 12, color: '#888', marginTop: 8, fontWeight: '500', textAlign: 'center' },
  methodLabelActive: { color: '#1A1A4E', fontWeight: '700' },
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
  payButton: {
    flex: 2, height: 50, borderRadius: 10,
    backgroundColor: '#1A1A4E', justifyContent: 'center', alignItems: 'center',
  },
  payButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabledButton: { opacity: 0.5 },
});
