import React, { useState } from 'react';
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
import useTranslation from '../../hooks/useTranslation';

export default function KeyDeliveryScreen({
  navigation,
  route
}: any) {
  const { t } = useTranslation();
  const {
  bookingData,
  verifiedIdType,
  paymentMethod,
  paymentAmount,
} = route.params || {};

const room = bookingData?.rooms || {};
  const [selectedOption, setSelectedOption] =
    useState<string | null>(null);

  const options = [
  {
    id: 'digital',
    icon: 'phone-portrait',
    title: t('digitalKey'),
    description: t('digitalKeyDescription'),
  },
  {
    id: 'physical',
    icon: 'card',
    title: t('physicalKeyCard'),
    description: t('physicalKeyCardDescription'),
  },
  {
    id: 'print',
    icon: 'print',
    title: t('accessSlip'),
    description: t('accessSlipDescription'),
  },
];

  const handleContinue = () => {
    if (!selectedOption) return;

    navigation.navigate('RoomConfirmation',{
  bookingData,
  verifiedIdType,
  paymentMethod,
  paymentAmount,
  keyType: selectedOption,
});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#1A1A4E"
        barStyle="light-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {t('keyDelivery')}
          </Text>
          <Text style={styles.headerStep}>
            {t('step7Of8')}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroCircle}>
            <Ionicons
              name="key"
              size={50}
              color="#fff"
            />
          </View>

          <Text style={styles.heroTitle}>
            {t('chooseYourRoomKey')}
          </Text>

          <Text style={styles.heroSubtitle}>
            {t('room')} {room.room_number || t('notAvailable')}
          </Text>
        </View>

        {/* Options */}
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.8}
            style={[
              styles.optionCard,
              selectedOption === option.id &&
                styles.selectedCard,
            ]}
            onPress={() =>
              setSelectedOption(option.id)
            }
          >
            <View style={styles.optionRow}>
              <Ionicons
                name={option.icon as any}
                size={28}
                color={
                  selectedOption === option.id
                    ? '#1A1A4E'
                    : '#666'
                }
              />

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>
                  {option.title}
                </Text>

                <Text
                  style={
                    styles.optionDescription
                  }
                >
                  {option.description}
                </Text>
              </View>

              {selectedOption === option.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#35C759"
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedOption &&
              styles.disabledButton,
          ]}
          disabled={!selectedOption}
          onPress={handleContinue}
        >
          <Text
            style={styles.continueButtonText}
          >
            {t('continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  header: {
    backgroundColor: '#1A1A4E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  headerStep: { color: '#aaa', fontSize: 12, marginTop: 2 },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },

  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  heroCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A4E',
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },

  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  selectedCard: {
    borderColor: '#1A1A4E',
    backgroundColor: '#F7F5FF',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionContent: {
    flex: 1,
    marginLeft: 16,
  },

  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  optionDescription: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },

  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
  },

  continueButton: {
    height: 54,
    borderRadius: 10,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  continueButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});