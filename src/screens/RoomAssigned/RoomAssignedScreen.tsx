import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooking } from '../../context/BookingContext';
import useTranslation from '../../hooks/useTranslation';
export default function RoomAssignedScreen({
  navigation,
}: any) {
  const { booking } = useBooking();
  const { t } = useTranslation();

  const roomNumber = booking.roomNo || '512';
  const roomType =
  booking.roomType || t('notAvailable');

const guestName =
  booking.guest.fullName || t('guest');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#1A1A4E"
        barStyle="light-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
  {t('roomAssigned')}
</Text>

<Text style={styles.headerStep}>
  {t('step6Of8')}
</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Section */}
        <View style={styles.successCard}>
          <View style={styles.successCircle}>
            <Ionicons
              name="bed"
              size={45}
              color="#fff"
            />
          </View>

          <Text style={styles.successTitle}>
  {t('checkInSuccessful')}
</Text>

          <Text style={styles.successMessage}>
            {t('welcomeGuest').replace('{{name}}', guestName)}
          </Text>
        </View>

        {/* Room Card */}
        <View style={styles.roomCard}>
          <Text style={styles.roomLabel}>
            {t('yourRoom')}
          </Text>

          <Text style={styles.roomNumber}>
            {roomNumber}
          </Text>

          <Text style={styles.roomType}>
            {roomType}
          </Text>
        </View>

        {/* Stay Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            {t('stayInformation')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('checkIn')}
            </Text>

            <Text style={styles.infoValue}>
              {booking.stay.checkIn || t('notAvailable')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('checkOut')}
            </Text>

            <Text style={styles.infoValue}>
              {booking.stay.checkOut || t('notAvailable')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('nights')}
            </Text>

            <Text style={styles.infoValue}>
              {booking.stay.nights || t('notAvailable')}
            </Text>
          </View>
        </View>

        {/* Note Card */}
        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle"
            size={30}
            color="#5B4BDB"
          />

          <Text style={styles.noteTitle}>
            {t('roomReady')}
          </Text>

          <Text style={styles.noteText}>
            {t('roomReadyMessage')}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate('KeyDelivery')
          }
        >
          <Text style={styles.continueButtonText}>
            {t('getRoomKey')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  header: {
    backgroundColor: '#1A1A4E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  headerStep: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },

  successCard: {
    alignItems: 'center',
    marginBottom: 24,
  },

  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#35C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,

    elevation: 8,
    shadowColor: '#35C759',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#35C759',
    textAlign: 'center',
  },

  successMessage: {
    marginTop: 6,
    fontSize: 16,
    color: '#666',
  },

  roomCard: {
    backgroundColor: '#5B4BDB',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },

  roomLabel: {
    color: '#DCD6FF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },

  roomNumber: {
    color: '#fff',
    fontSize: 52,
    fontWeight: '800',
    marginVertical: 8,
  },

  roomType: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0E0EC',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A4E',
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  infoLabel: {
    color: '#666',
    fontSize: 15,
  },

  infoValue: {
    color: '#1A1A4E',
    fontWeight: '600',
    fontSize: 15,
  },

  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0EC',
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A4E',
    marginTop: 8,
    marginBottom: 8,
  },

  noteText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },

  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
  },

  continueButton: {
    height: 54,
    borderRadius: 10,
    backgroundColor: '#5B4BDB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});