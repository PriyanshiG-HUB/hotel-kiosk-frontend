import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusCardProps {
  status: string;
  label: string;
  icon?: string;
  color?: string;
  style?: ViewStyle;
}

export default function StatusCard({ status, label, icon, color, style }: StatusCardProps) {
  const isOk = status.toLowerCase() === 'checked in' || status.toLowerCase() === 'active' || status.toLowerCase() === 'connected' || status.toLowerCase() === 'online';
  const resolvedColor = color || (isOk ? '#35C759' : '#FF3B30');

  return (
    <View style={[styles.card, style]}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={24}
          color={resolvedColor}
          style={styles.icon}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.status, { color: resolvedColor }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 2,
  },
  status: {
    fontSize: 15,
    fontWeight: '700',
  },
});
