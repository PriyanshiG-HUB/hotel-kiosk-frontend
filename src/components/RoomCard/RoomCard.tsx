import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    image: string;
    price: number;
    available: string;
  };
  selected: boolean;
  onPress: () => void;
  t: (key: string) => string;
}

export default function RoomCard({ room, selected, onPress, t }: RoomCardProps) {
  return (
    <TouchableOpacity
      style={[styles.roomCard, selected && styles.roomCardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: room.image }} style={styles.roomImage} />
      {selected && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark-circle" size={24} color="#1A1A4E" />
        </View>
      )}
      <View style={styles.roomInfo}>
        <Text style={[styles.roomName, selected && styles.roomNameSelected]}>
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
          ₹{room.price} / {t('night')}
        </Text>
        <Text style={styles.roomAvail}>
          {room.available}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  roomCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E8F0',
    elevation: 3,
    marginBottom: 16,
  },
  roomCardSelected: {
    borderColor: '#1A1A4E',
    backgroundColor: '#F5F3FF',
  },
  roomImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  roomInfo: {
    padding: 14,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  roomNameSelected: {
    color: '#1A1A4E',
  },
  feature: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A4E',
    marginTop: 8,
  },
  roomAvail: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
    fontWeight: '600',
  },
});
