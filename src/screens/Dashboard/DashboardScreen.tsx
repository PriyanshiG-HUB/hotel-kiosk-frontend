import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getDashboardStats } from '../../api/dashboardApi';
import DashboardCard from '../../components/DashboardCard/DashboeardCard';
import StatusCard from '../../components/StatusCard/StatusCard';

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
  const [stats, setStats] = useState<any>({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    activeBookings: 0,
    activeVisitors: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const lastSync = now.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>KIOSK STATUS</Text>
          <Text style={styles.headerSub}>System Dashboard</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hardware Status Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Hardware Status</Text>
          <View style={styles.hardwareGrid}>
            {hardwareStatus.map((item: any) => (
              <StatusCard
                key={item.label}
                label={item.label}
                status={item.status}
                icon={item.icon}
                color={item.color}
                style={{ flex: 1, marginHorizontal: 4, paddingVertical: 10, paddingHorizontal: 8 }}
              />
            ))}
          </View>
        </View>

        {/* Stats */}
        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1A1A4E" />
          </View>
        ) : (
          <View style={styles.statsRow}>
            <DashboardCard label="Active Bookings" value={stats.activeBookings} />
            <DashboardCard label="Active Visitors" value={stats.activeVisitors} />
            <DashboardCard label="Available Rooms" value={`${stats.availableRooms}/${stats.totalRooms}`} />
          </View>
        )}
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
              color={activeNav === item.key ? '#1A1A4E' : '#aaa'}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center' },
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
  navLabelActive: { color: '#1A1A4E', fontWeight: '700' },
});
