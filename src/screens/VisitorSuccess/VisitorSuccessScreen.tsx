import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useVisitor } from '../../context/VisitorContext';
import useTranslation from '../../hooks/useTranslation';

export default function VisitorSuccessScreen({
  navigation,
}: any) {
  const { visitor } = useVisitor();
const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#1A1A4E"
        barStyle="light-content"
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={90}
            color="#35C759"
          />
        </View>

        <Text style={styles.title}>
          {t('visitorRegistered')}
        </Text>

        <Text style={styles.subtitle}>
          {t('visitorDetailsSavedSuccessfully')}
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            {t('visitorId')}
          </Text>

          <Text style={styles.visitorId}>
            {visitor?.visitorId}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.info}>
            {t('name')}: {visitor?.fullName}
          </Text>

          <Text style={styles.info}>
            {t('host')}: {visitor?.hostGuest}
          </Text>

          <Text style={styles.info}>
            {t('roomNumber')}: {visitor?.hostRoom}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.secondaryText}>
            {t('home')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('VisitorPass')
          }
        >
          <Text style={styles.primaryText}>
            {t('viewPass')}
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

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A4E',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  visitorId: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5B4BDB',
    textAlign: 'center',
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 20,
  },

  info: {
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
  },

  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
  },

  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5B4BDB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryText: {
    color: '#5B4BDB',
    fontWeight: '700',
  },

  primaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#5B4BDB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});