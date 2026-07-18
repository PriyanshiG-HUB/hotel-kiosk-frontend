import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useServiceRequest } from '../../context/ServiceRequestContext';
import useTranslation from '../../hooks/useTranslation';
import { createServiceRequest } from '../../api/serviceApi';
import { getBookingByRoom } from '../../api/bookingApi';

export default function ServiceRequestDetailsScreen({ navigation, route }: any) {
  const { category, bookingData, roomNo, guestName: paramGuestName } = route.params || {};
  const { setServiceRequest } = useServiceRequest();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [roomNumber, setRoomNumber] = useState(bookingData?.roomNo || roomNo || '');
  const [guestName, setGuestName] = useState(bookingData?.guest?.fullName || paramGuestName || '');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleRoomNumberBlur = async () => {
    if (roomNumber.trim() && !guestName.trim()) {
      try {
        const b = await getBookingByRoom(roomNumber.trim());
        if (b && b.guest?.fullName) {
          setGuestName(b.guest.fullName);
        }
      } catch (e) {
        console.log('Error fetching booking for room:', e);
      }
    }
  };

  const handleSubmit = async () => {
    if (!roomNumber.trim() || !guestName.trim()) {
      Alert.alert(t('missingDetails'), t('enterRoomAndName'));
      return;
    }

    setLoading(true);
    try {
      let activeBooking;
      try {
        activeBooking = await getBookingByRoom(roomNumber.trim());
      } catch (e) {
        setLoading(false);
        Alert.alert(
          t('notFound') || 'Not Found',
          'No active booking found for this room number.'
        );
        return;
      }

      if (!activeBooking || !activeBooking.guest?.fullName) {
        setLoading(false);
        Alert.alert(
          t('notFound') || 'Not Found',
          'No active booking found for this room number.'
        );
        return;
      }

      const dbGuestName = activeBooking.guest.fullName.toLowerCase().trim();
      const inputGuestName = guestName.toLowerCase().trim();
      if (!dbGuestName.includes(inputGuestName) && !inputGuestName.includes(dbGuestName)) {
        setLoading(false);
        Alert.alert(
          t('error') || 'Error',
          'Guest name does not match the registered guest for this room.'
        );
        return;
      }

      const resolvedGuestName = activeBooking.guest.fullName;

      await createServiceRequest({
        room_number: roomNumber.trim(),
        guest_name: resolvedGuestName,
        service_type: category.title,
        description: notes.trim(),
        quantity: quantity,
      });

      const requestId = `SRV-${Date.now().toString().slice(-6)}`;
      const now = new Date();
      const requestedAt = now.toLocaleString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      setServiceRequest({
        requestId,
        category: category.title,
        categoryIcon: category.icon,
        notes: notes.trim(),
        roomNumber: roomNumber.trim(),
        guestName: resolvedGuestName,
        requestedAt,
        estimatedTime: category.estimatedTime,
        status: 'confirmed',
      });

      setLoading(false);
      navigation.navigate('ServiceConfirmation');
    } catch (err: any) {
      console.log('Service request error:', err);
      setLoading(false);
      Alert.alert(
        t('error') || 'Error',
        err.message || t('failedToSubmitRequest') || 'Failed to submit request'
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
          <Text style={styles.headerTitle}>{t('selectService')}</Text>
          <Text style={styles.headerSubtitle}>{t('confirmYourRequest')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category Banner */}
        <View style={[styles.categoryBanner, { borderColor: category.color }]}>
          <View style={[styles.bannerIcon, { backgroundColor: category.color + '18' }]}>
            <Ionicons name={category.icon} size={44} color={category.color} />
          </View>
          <Text style={[styles.bannerTitle, { color: category.color }]}>{category.title}</Text>
          <Text style={styles.bannerDesc}>{category.description}</Text>
          <View style={styles.etaBadge}>
            <Ionicons name="time-outline" size={14} color="#fff" />
            <Text style={styles.etaText}> {t('eta')}: {category.estimatedTime}</Text>
          </View>
        </View>

        {/* Quantity Selector (not for wake-up call) */}
        {category.id !== 'wakeupcall' && (
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>{t('quantity')}</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={22} color="#1A1A4E" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => setQuantity(q => Math.min(10, q + 1))}
              >
                <Ionicons name="add" size={22} color="#1A1A4E" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>{t('yourDetails')}</Text>

          <Text style={styles.label}>{t('fullName')} *</Text>
          <TextInput
            style={styles.input}
            placeholder={t('enterFullName')}
            placeholderTextColor="#bbb"
            value={guestName}
            onChangeText={setGuestName}
          />

          <Text style={styles.label}>{t('roomNumber')} *</Text>
          <TextInput
            style={styles.input}
            placeholder={t('enterRoomNumber')}
            placeholderTextColor="#bbb"
            value={roomNumber}
            onChangeText={setRoomNumber}
            onBlur={handleRoomNumberBlur}
          />

          <Text style={styles.label}>{t('additionalNotesOptional')}</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder={
              category.id === 'wakeupcall'
                ? t('scheduleMorningCall')
                : t('describeRequestInDetail')
            }
            placeholderTextColor="#bbb"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
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
          style={[
            styles.submitButton,
            (!roomNumber.trim() || !guestName.trim() || loading) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!roomNumber.trim() || !guestName.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{t('confirmRequest')}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  headerSubtitle: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },
  categoryBanner: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    borderWidth: 2,
  },
  bannerIcon: {
    width: 84,
    height: 84,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  bannerTitle: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  bannerDesc: { fontSize: 14, color: '#888', marginBottom: 14 },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A4E',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  etaText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E8F0',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 14 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A4E',
  },
  qtyValue: { fontSize: 28, fontWeight: '800', color: '#1A1A4E', minWidth: 40, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#F6F7FB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0EC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },
  notesInput: { height: 90, paddingTop: 12 },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { color: '#1A1A4E', fontWeight: '700', fontSize: 15 },
  submitButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabledButton: { opacity: 0.5 },
});
