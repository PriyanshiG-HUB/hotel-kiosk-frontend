import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
import { useVisitor } from '../../context/VisitorContext';

export default function VisitorCheckoutScreen({
  navigation,
}: any) {
  const {
    findVisitorById,
    checkOutVisitor,
  } = useVisitor();
const { t } = useTranslation();
  const [visitorId, setVisitorId] = useState('');
  const [visitor, setVisitor] = useState<any>(null);

  const handleSearch = () => {
    const result = findVisitorById(visitorId);

    if (!result) {
      Alert.alert(
        t('notFound'),
        t('visitorRecordNotFound')
      );
      return;
    }

    setVisitor(result);
  };

  const handleCheckout = () => {
  if (!visitor) return;

  const updatedVisitor = {
    ...visitor,
    status: 'Checked Out',
    checkOutTime: new Date().toLocaleTimeString(),
  };

  checkOutVisitor(visitor.visitorId);

  setVisitor(updatedVisitor);

  Alert.alert(
    t('success'),
    t('visitorCheckedOutSuccessfully'),
    [
      {
        text: t('ok'),
        onPress: () => navigation.goBack(),
      },
    ]
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#1A1A4E"
        barStyle="light-content"
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {t('visitorCheckout')}
          </Text>
          <Text style={styles.headerStep}>
            {t('completeVisit')}
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>
          {t('visitorId')}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={t('enterVisitorId')}
          value={visitorId}
          onChangeText={setVisitorId}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>
            {t('searchVisitor')}
          </Text>
        </TouchableOpacity>

        {visitor && (
          <View style={styles.card}>
            <Text style={styles.name}>
              {visitor.fullName}
            </Text>

            <Text style={styles.info}>
              {t('visitorId')}: {visitor.visitorId}
            </Text>

            <Text style={styles.info}>
              {t('roomNumber')}: {visitor.hostRoom}
            </Text>

            <Text style={styles.info}>
              {t('host')}: {visitor.hostGuest}
            </Text>

            <Text style={styles.info}>
              {t('mobileNumber')}: {visitor.mobile}
            </Text>

            <View
              style={[
                styles.statusBadge,
                visitor.status === 'Checked In'
                  ? styles.inBadge
                  : styles.outBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  visitor.status === 'Checked In'
                    ? styles.inText
                    : styles.outText,
                ]}
              >
                {
  visitor.status === 'Checked In'
    ? t('checkedIn')
    : t('checkedOut')
}
              </Text>
            </View>

            {visitor.status === 'Checked In' && (
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text
                  style={styles.checkoutButtonText}
                >
                  {t('checkOutVisitor')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            {t('back')}
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

  backBtn: {
    width: 40,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  headerStep: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 2,
  },

  headerRight: {
    width: 40,
  },

  content: {
    flex: 1,
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 14,
    height: 52,
  },

  searchButton: {
    marginTop: 16,
    backgroundColor: '#5B4BDB',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#fff',
    marginTop: 24,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E4EF',
  },

  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A4E',
    marginBottom: 14,
  },

  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  inBadge: {
    backgroundColor: '#DFF7E5',
  },

  outBadge: {
    backgroundColor: '#FFE3E3',
  },

  inText: {
    color: '#2E9E50',
    fontWeight: '700',
  },

  outText: {
    color: '#D94A4A',
    fontWeight: '700',
  },

  statusText: {
    fontSize: 12,
  },

  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#FF6B6B',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkoutButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
  },

  backButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5B4BDB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    color: '#5B4BDB',
    fontWeight: '700',
  },
});