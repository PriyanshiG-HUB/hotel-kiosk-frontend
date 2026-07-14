import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooking } from '../../context/BookingContext';

const hardwareStatus = [
  { label: 'Internet', icon: 'wifi', status: 'Connected', color: '#35C759' },
  { label: 'Printer', icon: 'print', status: 'Online', color: '#35C759' },
  { label: 'Card Reader', icon: 'card', status: 'Online', color: '#35C759' },
  { label: 'ID Scanner', icon: 'scan', status: 'Online', color: '#35C759' },
];

const navItems = [
  { key: 'Dashboard', icon: 'grid', label: 'Dashboard' },
  { key: 'Bookings', icon: 'calendar', label: 'Bookings' },
  { key: 'Guests', icon: 'people', label: 'Guests' },
  { key: 'Reports', icon: 'bar-chart', label: 'Reports' },
  { key: 'Settings', icon: 'settings', label: 'Settings' },
  { key: 'Logout', icon: 'log-out', label: 'Logout' },
];

export default function DashboardScreen({ navigation }: any) {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const { bookings } = useBooking();
  const totalBookings = bookings.length;
  const now = new Date();
  const lastSync = now.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>KIOSK STATUS</Text>
        <Text style={styles.headerSub}>System Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hardware Status Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Hardware Status</Text>
          <View style={styles.hardwareGrid}>
            {hardwareStatus.map((item) => (
              <View key={item.label} style={styles.hardwareItem}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
                <Text style={styles.hwLabel}>{item.label}</Text>
                <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                <Text style={[styles.hwStatus, { color: item.color }]}>{item.status}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalBookings}</Text>
            <Text style={styles.statLabel}>Active Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>KSK-01</Text>
            <Text style={styles.statLabel}>Kiosk ID</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{lastSync}</Text>
            <Text style={styles.statLabel}>Last Sync</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.navBar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => {
              if (item.key === 'Logout') navigation.navigate('Home');
              else setActiveNav(item.key);
            }}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color={activeNav === item.key ? '#5B4BDB' : '#aaa'}
            />
            <Text style={[styles.navLabel, activeNav === item.key && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  header: {
    backgroundColor: '#1A1A4E',
    paddingHorizontal: 20, paddingVertical: 16, alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 18, letterSpacing: 1 },
  headerSub: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },
  sectionCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, elevation: 3,
    borderWidth: 1, borderColor: '#E0E0EC', marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 16 },
  hardwareGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  hardwareItem: { alignItems: 'center', flex: 1 },
  hwLabel: { fontSize: 11, color: '#666', marginTop: 6, textAlign: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  hwStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    padding: 16, alignItems: 'center',
    elevation: 3, borderWidth: 1, borderColor: '#E0E0EC',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#1A1A4E', textAlign: 'center' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center' },
  navBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E8E8F0',
    paddingVertical: 8,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 10, color: '#aaa', marginTop: 3 },
  navLabelActive: { color: '#5B4BDB', fontWeight: '700' },
});
