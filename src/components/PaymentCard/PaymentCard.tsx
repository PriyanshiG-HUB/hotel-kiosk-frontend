import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentCardProps {
  method: {
    id: string;
    label: string;
    icon: string;
  };
  selected: boolean;
  onPress: () => void;
  t: (key: string) => string;
}

export default function PaymentCard({ method, selected, onPress, t }: PaymentCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={method.icon as any}
        size={26}
        color={selected ? '#1A1A4E' : '#888'}
      />
      <Text style={[styles.label, selected && styles.labelActive]}>
        {t(method.label)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0EC',
    elevation: 2,
  },
  cardActive: {
    borderColor: '#1A1A4E',
    backgroundColor: '#F0EEFF',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  labelActive: {
    color: '#1A1A4E',
    fontWeight: '700',
  },
});
