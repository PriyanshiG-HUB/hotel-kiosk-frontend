import { useBooking } from '../../context/BookingContext';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';


export default function RoomSelectionScreen({ navigation }: any) {
  const [selected, setSelected] = useState<number | null>(null);
  const { booking,setBooking } = useBooking();
  const { t } = useTranslation();
  const rooms = [
  {
    id: 1,
    name: t('deluxeRoom'),
    price: 120,
    available: t('roomsAvailable', { count: 12 }),
    roomNo: '101',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80',
  },
  {
    id: 2,
    name: t('premiumRoom'),
    price: 160,
    available: t('roomsAvailable', { count: 8 }),
    roomNo: '208',
    image:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&q=80',
  },
  {
    id: 3,
    name: t('suiteRoom'),
    price: 220,
    available: t('roomsAvailable', { count: 5 }),
    roomNo: '305',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&q=80',
  },
];
  const handleNext = () => {
    if (selected === null) return;

    const room = rooms.find(r => r.id === selected);
    if (!room) return;

    const bookingId = 'BK' + Math.floor(100000 + Math.random() * 900000);

    const nights = booking.stay?.nights || 1;

const checkInDate = new Date();

const checkOutDate = new Date(checkInDate);
checkOutDate.setDate(checkOutDate.getDate() + nights);

const checkIn = checkInDate.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const checkOut = checkOutDate.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

    setBooking(prev => ({
      ...prev,
      bookingId,
      roomType: room.name,
      roomNo: room.roomNo,
      roomPrice: room.price,
      stay: {
        checkIn,
        checkOut,
        nights,
},
      payment: {
        amount: room.price * nights,
        method: prev.payment?.method || '',
        status: false,
      },
    }));

    navigation.navigate('GuestInformation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('roomSelection')}</Text>
          <Text style={styles.headerStep}>{t('step1Of8')} </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t('chooseYourRoomType')}</Text>

        <View style={styles.roomRow}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={[styles.roomCard, selected === room.id && styles.roomCardSelected]}
              onPress={() => setSelected(room.id)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: room.image }} style={styles.roomImage} />
              {selected === room.id && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#5B4BDB" />
                </View>
              )}
              <View style={styles.roomInfo}>
  <Text
    style={[
      styles.roomName,
      selected === room.id &&
        styles.roomNameSelected,
    ]}
  >
    {room.name}
  </Text>

  <Text style={styles.feature}>
    🛏 {t('twoGuests')}
  </Text>

  <Text style={styles.feature}>
    📶 {t('freeWiFi')}
  </Text>

  <Text style={styles.feature}>
    🍳 {t('breakfastIncluded')}
  </Text>

  <Text style={styles.roomPrice}>
    ${room.price} / {t('night')}
  </Text>

  <Text style={styles.roomAvail}>
    {room.available}
  </Text>
</View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, selected === null && styles.disabledButton]}
          onPress={handleNext}
          disabled={selected === null}
        >
          <Text style={styles.nextButtonText}>{t('next')}</Text>
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
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  headerStep: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 20 },
  roomRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  roomCard: {
  width: '31%',
  minHeight: 280,
  backgroundColor: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: '#E5E7EB',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.15,
  shadowRadius: 6,

  elevation: 6,
},
  roomCardSelected: {
  borderColor: '#5B4BDB',
  borderWidth: 3,
  backgroundColor: '#F8F6FF',
},
  roomImage: { width: '100%', height: 170 },
  checkBadge: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 4,
  elevation: 4,
},
  roomInfo: { padding: 10 },
  roomName: { fontSize: 18, fontWeight: '700', color: '#222' },
  roomNameSelected: { color: '#5B4BDB' },
  roomPrice: { fontSize: 18, color: '#5B4BDB', fontWeight: '800', marginTop: 8 },
  roomAvail: { fontSize: 11, color: '#888', marginTop: 2 },
  feature: {
  fontSize: 13,
  color: '#666',
  marginTop: 3,
},
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
    gap: 12,
  },
  backButton: {
    flex: 1, height: 50, borderRadius: 10,
    borderWidth: 2, borderColor: '#5B4BDB',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#5B4BDB', fontWeight: '700', fontSize: 15 },
  nextButton: {
    flex: 2, height: 50, borderRadius: 10,
    backgroundColor: '#5B4BDB',
    justifyContent: 'center', alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabledButton: { opacity: 0.5 },
});
