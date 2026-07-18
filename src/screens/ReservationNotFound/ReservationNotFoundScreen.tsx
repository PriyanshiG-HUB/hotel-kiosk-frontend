import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import useTranslation from '../../hooks/useTranslation';

const ReservationNotFoundScreen = ({
  navigation,
}: any) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('reservationNotFoundTitle')}
      </Text>

      <Text style={styles.message}>
        {t('reservationNotFoundMessage')}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('ReservationLookup')
        }
      >
        <Text style={styles.buttonText}>
          {t('reservationNotFoundTryAgain')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.helpButton}
        onPress={() =>
          navigation.navigate('NeedHelp')
        }
      >
        <Text style={styles.helpButtonText}>
          {t('reservationNotFoundNeedHelp')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReservationNotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },

  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#1A1A4E',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  helpButton: {
    marginTop: 15,
  },

  helpButtonText: {
    color: '#1A1A4E',
    fontSize: 16,
    fontWeight: '600',
  },
});