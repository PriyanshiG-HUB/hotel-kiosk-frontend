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
import { useNeedHelp } from '../../context/NeedHelpContext';
import useTranslation from '../../hooks/useTranslation';
export default function HelpConfirmationScreen({ navigation }: any) {
  const { helpRequest } = useNeedHelp();
  const { t } = useTranslation();
  const handleDone = () => {
  navigation.navigate('ThankYou', {
    title: t('requestSent'),
    message: t('staffWillAssistShortly'),
    icon: 'headset',
    iconColor: '#5B4BDB',
    bookingId: helpRequest.requestId,
    guestName: helpRequest.guestName,
    roomNumber: helpRequest.roomNumber,
    showRating: false,
    clearBooking: false,
  });
};

  const infoRows: {
  label: string;
  value?: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    label: t('requestId'),
    value: helpRequest.requestId,
    icon: 'receipt-outline',
  },
  {
    label: t('service'),
    value: helpRequest.service,
    icon: 'help-circle-outline',
  },
  {
    label: t('guestName'),
    value: helpRequest.guestName,
    icon: 'person-outline',
  },
  {
    label: t('roomNumber'),
    value: helpRequest.roomNumber,
    icon: 'bed-outline',
  },
  {
    label: t('requestedAt'),
    value: helpRequest.requestedAt,
    icon: 'time-outline',
  },
  {
    label: t('estimatedResponse'),
    value: helpRequest.estimatedTime,
    icon: 'timer-outline',
  },
];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('requestConfirmed')}</Text>
          <Text style={styles.headerSubtitle}>{t('helpIsOnTheWay')}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={64} color="#fff" />
          </View>
          <Text style={styles.successTitle}>{t('requestConfirmedTitle')}</Text>
          <Text style={styles.successMessage}>{t('staffAlertedRemainInRoom')}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{t('requestDetails')}</Text>
          {infoRows.map((row, idx) => (
            <View key={row.label}>
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name={row.icon} size={18} color="#5B4BDB" />
                  <Text style={styles.infoLabel}>{row.label}</Text>
                </View>
                <Text style={styles.infoValue}>{row.value || t('notAvailable')}</Text>
              </View>
              {idx < infoRows.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{t('teamNotified')}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Ionicons name="home" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.doneButtonText}>{t('done')}</Text>
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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  headerSubtitle: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: { padding: 20 },
  successSection: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#35C759',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    marginBottom: 16,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A4E', marginBottom: 8 },
  successMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E8F0',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: 14, color: '#666' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#222', maxWidth: '55%', textAlign: 'right' },
  rowDivider: { height: 1, backgroundColor: '#F0F0F8' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EE',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#B2EBC7',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#35C759',
  },
  statusText: { fontSize: 14, color: '#2D8A50', fontWeight: '600' },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
  },
  doneButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#5B4BDB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
