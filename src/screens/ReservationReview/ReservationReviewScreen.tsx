import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTranslation from '../../hooks/useTranslation';
import React, {
  useEffect,
  useState,
} from 'react';

import {
  getBookingById,
} from '../../api/bookingApi';

const ReservationReviewScreen = ({
  navigation,
  route,
}: any) => {
  const { t } = useTranslation();

  const { bookingId } = route.params;
  const [reservationData, setReservationData] =
  useState<any>(null);

const [loading, setLoading] =
  useState(true);


  const handleContinue = () => {
  navigation.navigate('IDVerification', {
    bookingData: reservationData,
  });
};

const loadBooking = async () => {
  try {
    const data =
      await getBookingById(
        bookingId
      );

    setReservationData(data);
  } catch (error) {
  console.log('Booking Load Error:', error);
  navigation.replace('ReservationNotFound');
} finally {
    setLoading(false);
  }
};
useEffect(() => {
  loadBooking();
}, [bookingId]);


if (loading) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Loading...</Text>
    </SafeAreaView>
  );
}

if (!reservationData) {
  return null;
}
  return (
  <SafeAreaView style={styles.container}>
    <StatusBar
      backgroundColor="#1A1A4E"
      barStyle="light-content"
    />

    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color="#fff"
        />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          {t('reservationReview')}
        </Text>

        <Text style={styles.headerStep}>
          {t('step2Of8')}
        </Text>
      </View>

      <View style={{ width: 40 }} />
    </View>

    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Banner */}
      <View style={styles.successCard}>
        <Ionicons
  name="checkmark-circle"
  size={70}
  color="#1A1A4E"
/>

        <Text style={styles.successTitle}>
          {t('reservationConfirmed')}
        </Text>

        <Text style={styles.successSubtitle}>
          {t('reviewReservationDetails')}
        </Text>
      </View>

      {/* Reservation Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {t('reservationDetails')}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            {t('bookingId')}
          </Text>

          <Text style={styles.value}>
            {reservationData.booking_id}
          </Text>
        </View>
      </View>

      {/* Guest Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {t('guestInformation')}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>{t('name')}</Text>
          <Text style={styles.value}>
            {reservationData.guests?.full_name}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('email')}</Text>
          <Text style={styles.value}>
            {reservationData.guests?.email}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('mobile')}</Text>
          <Text style={styles.value}>
            {reservationData.guests?.mobile}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('nationality')}</Text>
          <Text style={styles.value}>
            {reservationData.guests?.nationality || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Stay Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {t('stayInformation')}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>{t('checkIn')}</Text>
          <Text style={styles.value}>
            {reservationData.check_in_date}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('checkOut')}</Text>
          <Text style={styles.value}>
            {reservationData.check_out_date}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('nights')}</Text>
          <Text style={styles.value}>
            {reservationData.stay?.nights || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Room Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {t('roomInformation')}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>{t('roomType')}</Text>
          <Text style={styles.value}>
            {reservationData.rooms?.room_type}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('roomNumber')}</Text>
          <Text style={styles.value}>
            {reservationData.rooms?.room_number}
          </Text>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>
          {t('totalAmount')}
        </Text>

        <Text style={styles.amountValue}>
          ₹{reservationData.total_amount || 0}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          {t('continue')}
        </Text>

        <Ionicons
          name="arrow-forward"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
  );
};

export default ReservationReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
  backgroundColor: '#1A1A4E',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 14,
},

backBtn: {
  width: 40,
},

headerCenter: {
  flex: 1,
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  successCard: {
    backgroundColor: '#EEF0FF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A4E',
    marginTop: 12,
  },

  successSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 22,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    color: '#6B7280',
    fontSize: 15,
  },

  value: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },

  amountCard: {
    backgroundColor: '#1A1A4E',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },

  amountLabel: {
    color: '#E0E7FF',
    fontSize: 15,
  },

  amountValue: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '700',
    marginTop: 8,
  },

  button: {
    backgroundColor: '#1A1A4E',
    height: 60,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});