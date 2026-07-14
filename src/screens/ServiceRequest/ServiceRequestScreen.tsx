import React from 'react';
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
import useTranslation from '../../hooks/useTranslation';

export default function ServiceRequestScreen({ navigation }: any) {
  const { t } = useTranslation();
  const categories: {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  estimatedTime: string;
}[] = [
  {
    id: 'towels',
    title: t('towels'),
    description: t('extraTowelsBathLinen'),
    icon: 'water',
    color: '#4D8BFF',
    estimatedTime: t('tenMinutes'),
  },
  {
    id: 'water',
    title: t('water'),
    description: t('drinkingWaterBeverages'),
    icon: 'cafe',
    color: '#35C759',
    estimatedTime: t('eightMinutes'),
  },
  {
    id: 'cleaning',
    title: t('roomCleaning'),
    description: t('housekeepingTidying'),
    icon: 'sparkles',
    color: '#5B4BDB',
    estimatedTime: t('twentyMinutes'),
  },
  {
    id: 'food',
    title: t('food'),
    description: t('inRoomDiningSnacks'),
    icon: 'restaurant',
    color: '#FFB648',
    estimatedTime: t('twentyFiveMinutes'),
  },
  {
    id: 'wakeupcall',
    title: t('wakeUpCall'),
    description: t('scheduleMorningCall'),
    icon: 'alarm',
    color: '#FF6B6B',
    estimatedTime: t('scheduled'),
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
          <Text style={styles.headerTitle}>{t('serviceRequest')}</Text>
          <Text style={styles.headerSubtitle}>{t('whatDoYouNeed')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t('selectCategory')}</Text>
        <Text style={styles.sectionSubtitle}>{t('chooseServiceDescription')}</Text>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ServiceRequestDetails', { category: cat })}
          >
            <View style={[styles.iconBox, { backgroundColor: cat.color + '18' }]}>
              <Ionicons name={cat.icon} size={34} color={cat.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <Text style={styles.categoryDesc}>{cat.description}</Text>
              <View style={styles.etaRow}>
                <Ionicons name="time-outline" size={13} color="#888" />
                <Text style={styles.etaText}>{t('eta')}: {cat.estimatedTime}</Text>
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
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A4E', marginBottom: 6 },
  sectionSubtitle: { fontSize: 14, color: '#888', marginBottom: 24, lineHeight: 20 },
  categoryCard: {
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
  categoryInfo: { flex: 1 },
  categoryTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 3 },
  categoryDesc: { fontSize: 13, color: '#888', marginBottom: 6 },
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
    borderColor: '#5B4BDB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { color: '#5B4BDB', fontWeight: '700', fontSize: 15 },
});
