import React from 'react';
import useTranslation from '../../hooks/useTranslation';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NeedHelpScreen({ navigation }: any) {
  const { t } = useTranslation();
  const services: {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  estimatedTime: string;
}[] = [
  {
  id: 'emergency',
  title: t('emergencyAssistance'),
  subtitle: t('immediateHelpRequired'),
  icon: 'alert-circle',
  color: '#FF4D4F',
  estimatedTime: t('twoMinutes'),
},
{
  id: 'housekeeping',
  title: t('housekeeping'),
  subtitle: t('roomCleaningSupplies'),
  icon: 'sparkles',
  color: '#1A1A4E',
  estimatedTime: t('fifteenMinutes'),
},
{
  id: 'reception',
  title: t('reception'),
  subtitle: t('frontDeskAssistance'),
  icon: 'person-circle',
  color: '#4D8BFF',
  estimatedTime: t('fiveMinutes'),
},
{
  id: 'maintenance',
  title: t('maintenance'),
  subtitle: t('technicalRepairIssues'),
  icon: 'construct',
  color: '#FFB648',
  estimatedTime: t('twentyMinutes'),
},
{
  id: 'concierge',
  title: t('concierge'),
  subtitle: t('bookingsTransportMore'),
  icon: 'briefcase',
  color: '#35C759',
  estimatedTime: t('tenMinutes'),
},
];
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('needHelp')}</Text>
          <Text style={styles.headerSubtitle}>{t('selectServiceBelow')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>{t('howCanWeAssistYou')}</Text>
        <Text style={styles.sectionSubtitle}>
          {t('staffWillBeWithYouShortly')}
        </Text>

        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('SelectService', { service })
            }
          >
            <View style={[styles.iconBox, { backgroundColor: service.color + '18' }]}>
              <Ionicons name={service.icon} size={34} color={service.color} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
              <View style={styles.etaRow}>
                <Ionicons name="time-outline" size={13} color="#888" />
                <Text style={styles.etaText}>{t('eta')}: {service.estimatedTime}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#C0C0D0" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('backToHome')}</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A4E',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    lineHeight: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E8F0',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: { flex: 1 },
  serviceTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 3 },
  serviceSubtitle: { fontSize: 13, color: '#888', marginBottom: 6 },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  etaText: { fontSize: 12, color: '#888' },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
  },
  backButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { color: '#1A1A4E', fontWeight: '700', fontSize: 15 },
});
