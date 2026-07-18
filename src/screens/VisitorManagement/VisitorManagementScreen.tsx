import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';

export default function VisitorManagementScreen({ navigation }: any) {
  const { t } = useTranslation();
  const options: {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  screen: string | null;
}[] = [
  {
    id: 'new',
    title: t('newVisitor'),
    subtitle: t('registerNewVisitor'),
    icon: 'person-add',
    color: '#1A1A4E',
    screen: 'VisitorRegistration',
  },
  {
    id: 'pass',
    title: t('visitorPass'),
    subtitle: t('viewPrintPass'),
    icon: 'card',
    color: '#35C759',
    screen: 'VisitorPass',
  },
  {
    id: 'history',
    title: t('visitorHistory'),
    subtitle: t('recentVisitors'),
    icon: 'people',
    color: '#4D8BFF',
    screen: 'VisitorHistory',
  },
  {
    id: 'checkout',
    title: t('visitorCheckOut'),
    subtitle: t('completeVisit'),
    icon: 'log-out',
    color: '#FF6B6B',
    screen: 'VisitorCheckout',
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
          <Text style={styles.headerTitle}>{t('visitorManagement')}</Text>
          <Text style={styles.headerStep}>{t('manageVisitorOperations')}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
  <Ionicons
    name="people-circle"
    size={60}
    color="#1A1A4E"
  />

  <Text style={styles.welcomeTitle}>
    {t('visitorManagement')}
  </Text>

  <Text style={styles.welcomeSubtitle}>{t('visitorManagementDescription')}</Text>
</View>
        <Text style={styles.sectionTitle}>{t('quickActions')}</Text>

        <View style={styles.grid}>
          {options.map((item) => (
            <TouchableOpacity
  key={item.id}
  style={[
    styles.optionCard,
    !item.screen && styles.disabledCard,
  ]}
  activeOpacity={item.screen ? 0.9 : 1}
  disabled={!item.screen}
  onPress={() => {
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  }}
>
              <View style={[styles.iconBg, { backgroundColor: item.color + '20' }]}>
                <Ionicons  name={item.icon} size={42} color={item.color} />
              </View>
              <Text style={styles.optionTitle}>{item.title}</Text>
              <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              {!item.screen && (
  <View style={styles.comingSoon}>
    <Text style={styles.comingSoonText}>
      {t('comingSoon')}
    </Text>
  </View>
)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  header: {
    backgroundColor: '#1A1A4E',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  headerStep: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  optionCard: {
    width: '48%', backgroundColor: '#fff',
    minHeight: 185,
  justifyContent: 'center',
    borderRadius: 16, padding: 20,
    alignItems: 'center', elevation: 3,
    borderWidth: 1, borderColor: '#E0E0EC',
  },
  iconBg: {
    width: 70, height: 70, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  optionTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#1A1A4E',
  textAlign: 'center',
  marginTop: 6,
},
  optionSubtitle: {
  fontSize: 13,
  color: '#777',
  marginTop: 6,
  textAlign: 'center',
},
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E8E8F0' },
  backButton: {
    height: 50, borderRadius: 10,
    borderWidth: 2, borderColor: '#1A1A4E',
    justifyContent: 'center', alignItems: 'center',
  },
  backButtonText: { color: '#1A1A4E', fontWeight: '700', fontSize: 15 },
  welcomeCard: {
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 24,
  alignItems: 'center',
  marginBottom: 24,
  borderWidth: 1,
  borderColor: '#E0E0EC',
  elevation: 3,
},

welcomeTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#1A1A4E',
  marginTop: 12,
},

welcomeSubtitle: {
  marginTop: 8,
  textAlign: 'center',
  color: '#666',
  fontSize: 14,
  lineHeight: 22,
},
disabledCard: {
  opacity: 0.55,
  elevation: 1,
},
comingSoon: {
  marginTop: 10,
  backgroundColor: '#FFE9A8',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
},
comingSoonText: {
  fontSize: 10,
  fontWeight: '700',
  color: '#8A6A00',
},
headerRight: {
  width: 40,
},
});
