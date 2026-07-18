import React, { useEffect, useRef } from 'react';
import useTranslation from '../../hooks/useTranslation';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CheckInOptionsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('checkIn')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>
          {t('checkIn')}
        </Text>

        <Text style={styles.subtitle}>
          {t('howWouldYouLikeToProceed')}
        </Text>

        <Animated.View style={{ width: '100%', transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() =>
              navigation.navigate('RoomSelection')
            }
          >
            <Text style={styles.optionText}>
              {t('walkInGuest')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() =>
              navigation.navigate('ReservationLookup')
            }
          >
            <Text style={styles.optionText}>
              {t('reservation')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default CheckInOptionsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1A1A4E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },

  optionButton: {
    width: '100%',
    backgroundColor: '#1A1A4E',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },

  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
