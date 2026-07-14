import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTranslation from '../../hooks/useTranslation';
import { useBooking } from '../../context/BookingContext';

const ReservationLookupScreen = ({
  navigation,
}: any) => {
  const { t } = useTranslation();
  const [bookingNumber, setBookingNumber] =
    useState('');

const { bookings, findBooking } = useBooking();
const handleSearch = () => {
  const booking = findBooking(
    bookingNumber.trim()
  );

  if (booking) {
    navigation.navigate(
      'ReservationReview',
      {
        bookingId: booking.bookingId,
      }
    );
  } else {
    navigation.navigate(
      'ReservationNotFound'
    );
  }
};

  return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          {t('reservationLookupHeader')}
        </Text>

        <Text style={styles.headerStep}>
          {t('step1Of8')}
        </Text>
      </View>
    </View>

    <View style={styles.container}>
      <Text style={styles.title}>
        {t('reservationLookupTitle')}
      </Text>
      <Text style={styles.subtitle}>
        {t('reservationLookupSubtitle')}
      </Text>

      <TextInput
  style={styles.input}
  placeholder={t('reservationLookupPlaceholder')}
  value={bookingNumber}
  onChangeText={setBookingNumber}
  autoCapitalize="none"
  autoCorrect={false}
/>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSearch}
      >
        <Text style={styles.buttonText}>
          {t('reservationLookupSearch')}
        </Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
};

export default ReservationLookupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F6F7FB',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#5B4BDB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#1A1A4E',
    paddingVertical: 14,
    alignItems: 'center',
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },

  headerStep: {
    color: '#B8B8D8',
    fontSize: 12,
    marginTop: 2,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 30,
  },
});