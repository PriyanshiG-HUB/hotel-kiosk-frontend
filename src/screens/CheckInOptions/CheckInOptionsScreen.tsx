import React from 'react';
import useTranslation from '../../hooks/useTranslation';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CheckInOptionsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('checkIn')}
      </Text>

      <Text style={styles.subtitle}>
        {t('howWouldYouLikeToProceed')}
      </Text>

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
    </View>
  );
};

export default CheckInOptionsScreen;

const styles = StyleSheet.create({
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
    backgroundColor: '#5B4BDB',
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