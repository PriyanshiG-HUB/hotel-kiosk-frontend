import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
const ID_OPTIONS: Record<string, string[]> = {
  India: [
    'Aadhaar',
    'Passport',
    'PAN Card',
    'Driving License',
  ],

  'United States': [
    'Passport',
    'Driving License',
    'State ID',
  ],

  Canada: [
    'Passport',
    'Driving License',
    'Health Card',
  ],

  Australia: [
    'Passport',
    'Driving License',
  ],

  'United Kingdom': [
    'Passport',
    'Driving Licence',
  ],
};

const validateIdNumber = (
  idType: string,
  idNumber: string
) => {
  const value = idNumber.trim();

  switch (idType) {
    case 'Aadhaar':
      return /^\d{12}$/.test(value);

    case 'Passport':
      return /^[A-Z0-9]{6,10}$/.test(value);

    case 'Driving License':
    case 'Driving Licence':
      return /^[A-Za-z0-9-]{10,20}$/.test(value);

    case 'PAN Card':
      return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);

    case 'State ID':
      return /^[A-Za-z0-9-]{5,20}$/.test(value);

    case 'Health Card':
      return /^[A-Za-z0-9-]{5,20}$/.test(value);

    default:
      return value.length >= 5;
  }
};

export default function GuestInformationScreen({
  navigation,route
}: any) {
  const { roomData } = route.params;

  const { t } = useTranslation();
  const nationalityLabels: Record<string, string> = {
  India: t('india'),
  'United States': t('unitedStates'),
  Canada: t('canada'),
  Australia: t('australia'),
  'United Kingdom': t('unitedKingdom'),
};
  const [fullName, setFullName] =
  useState('');

const [mobile, setMobile] =
  useState('');

const [email, setEmail] =
  useState('');
const [nationality, setNationality] =
  useState('India');

const [idType, setIdType] =
  useState('Passport');

const [idNumber, setIdNumber] =
  useState('');
  const nameRegex =
    /^[A-Za-z\s.'-]{2,50}$/;

  const mobileRegex =
  nationality === 'India'
    ? /^[6-9]\d{9}$/
    : /^\d{7,15}$/;

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const idValid =
    idNumber.length === 0 ||
    validateIdNumber(idType, idNumber.trim());

  const isValid =
    nameRegex.test(fullName.trim()) &&
    mobileRegex.test(mobile.trim()) &&
    emailRegex.test(email.trim()) &&
    validateIdNumber(idType, idNumber.trim());

  const availableIds =
    ID_OPTIONS[nationality] ?? ['Passport'];
  const idTypeLabels: Record<string, string> = {
  Passport: t('passport'),
  Aadhaar: t('aadhaar'),
  'PAN Card': t('panCard'),
  'Driving License': t('drivingLicense'),
  'Driving Licence': t('drivingLicence'),
  'State ID': t('stateId'),
  'Health Card': t('healthCard'),
};
const handleNext = () => {
  // ---------- Full Name ----------
  if (!nameRegex.test(fullName.trim())) {
    Alert.alert(
      t('invalidName'),
      t('pleaseEnterValidFullName')
    );
    return;
  }

  // ---------- Mobile ----------
  if (!mobileRegex.test(mobile.trim())) {
    Alert.alert(
  t('invalidMobileNumber'),
  nationality === 'India'
    ? t('enterValidIndianMobile')
    : t('enterValidInternationalMobile')
);
    return;
  }

  // ---------- Email ----------
  if (!emailRegex.test(email.trim())) {
    Alert.alert(
      t('invalidEmail'),
      t('enterValidEmail')
    );
    return;
  }

  // ---------- ID ----------
  if (!validateIdNumber(idType, idNumber.trim())) {
    let message = '';

    switch (idType) {
      case 'Aadhaar':
        message = t('aadhaarValidation');
        break;

      case 'Passport':
        message =
          t('passportValidation');
        break;

      case 'Driving License':
      case 'Driving Licence':
        message =
          t('drivingLicenceValidation');
        break;

      case 'PAN Card':
        message =
          t('panCardValidation');
        break;

      case 'State ID':
        message =
          t('stateIdValidation');
        break;

      case 'Health Card':
        message =
          t('healthCardValidation');
        break;

      default:
        message = t('invalidIdNumber', {
          type: idTypeLabels[idType] ?? idType,
        });
    }

    Alert.alert(t('invalidId'), message);
    return;
  }

  // ---------- Save Guest ----------
const guestData = {
  full_name: fullName.trim(),
  mobile: mobile.trim(),
  email: email.trim().toLowerCase(),
  nationality,
  id_type: idType,
  id_number: idNumber.trim().toUpperCase(),
};

navigation.navigate('IDVerification', {
  guestData,
  roomData,
});

};
return (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor="#1A1A4E" barStyle="light-content" />

    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
  {t('guestInformation')}
</Text>

<Text style={styles.headerStep}>
  {t('step2Of8')}
</Text>
      </View>

      <View style={{ width: 40 }} />
    </View>

    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* Full Name */}

      <Text style={styles.label}>{t('fullName')}</Text>

      <TextInput
        style={styles.input}
        value={fullName}
        placeholder={t('fullName')}
        autoCapitalize="words"
        returnKeyType="next"
        maxLength={50}
        onChangeText={(text) =>
          setFullName(
            text
              .replace(/[^A-Za-z\s.'-]/g, '')
              .trimStart()
              .replace(/\s{2,}/g, ' ')
          )
        }
      />

      {/* Mobile */}

      <Text style={styles.label}>
        {t('mobileNumber')}
      </Text>

      <TextInput
        style={styles.input}
        value={mobile}
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        returnKeyType="next"
        maxLength={ nationality === 'India'? 10: 15}
        placeholder={t('mobileNumber')}
        onChangeText={(text) =>
          setMobile(
            text
              .replace(/\D/g, '')
              .slice(0, nationality === 'India'? 10: 15)
          )
        }
      />

      {/* Email */}

      <Text style={styles.label}>
        {t('emailAddress')}
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        returnKeyType="next"
        maxLength={60}
        placeholder={t('emailAddress')}
        onChangeText={(text) =>
  setEmail(text.trimStart())
}
      />

      {/* Nationality */}

      <Text style={styles.label}>
        {t('nationality')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.field}
      >
        {[
          'India',
          'United States',
          'Canada',
          'Australia',
          'United Kingdom',
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              nationality === item &&
                styles.optionButtonActive,
            ]}
            onPress={() => {
              const defaultId = ID_OPTIONS[item]?.[0] ?? 'Passport';
              setNationality(item);
              setIdType(defaultId);
              setIdNumber('');
              setMobile('');
            }}
          >
            <Text
              style={[
                styles.optionText,
                nationality === item &&
                  styles.optionTextActive,
              ]}
            >
              {nationalityLabels[item] ?? item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ID Type */}

      <Text style={styles.label}>
        {t('idType')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.field}
      >
        {availableIds.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              idType === item &&
                styles.optionButtonActive,
            ]}
            onPress={() => {
              setIdType(item);
              setIdNumber('');
            }}
          >
            <Text
              style={[
                styles.optionText,
                idType === item &&
                  styles.optionTextActive,
              ]}
            >
              {idTypeLabels[item] ?? item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ID Number */}

      <Text style={styles.label}>
        {t('idNumber')}
      </Text>

      <TextInput
        style={[
  styles.input,
  idNumber.length > 0
    ? {
        borderColor: idValid
          ? '#35C759'
          : '#FF3B30',
        borderWidth: 2,
      }
    : null,
]}
        value={idNumber}
        autoCapitalize="characters"
        keyboardType={
          idType === 'Aadhaar'
            ? 'number-pad'
            : 'default'
        }
        placeholder={
  idType === 'Aadhaar'
    ? t('aadhaarPlaceholder')
    : idType === 'PAN Card'
    ? t('panPlaceholder')
    : idType === 'Passport'
    ? t('passportNumber')
    : t('idNumberPlaceholder')
}
        maxLength={
          idType === 'Aadhaar'
            ? 12
            : idType === 'Passport'
            ? 10
            : idType === 'PAN Card'
            ? 10
            : 20
        }
        onChangeText={(text) => {
          if (idType === 'Aadhaar') {
            setIdNumber(
              text
                .replace(/\D/g, '')
                .slice(0, 12)
            );
          } else if (idType === 'PAN Card') {
            setIdNumber(
              text
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
            );
          } else {
            setIdNumber(
    text
        .replace(/\s/g, '')
        .toUpperCase()
);
          }
        }}
      />

      {!idValid &&
        idNumber.length > 0 && (
          <Text
            style={{
              color: '#FF3B30',
              marginTop: 5,
              marginBottom: 10,
              fontSize: 12,
            }}
          >
            {t('invalidIdNumber', {
  type: idTypeLabels[idType] ?? idType,
})}
          </Text>
        )}

    </ScrollView>

    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.goBack()
        }
      >
        <Text style={styles.backButtonText}>
          {t('back')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !isValid && {
            opacity: 0.5,
          },
        ]}
        disabled={!isValid}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>
          {t('next')}
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
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },

  headerStep: {
    color: '#B8B8C8',
    fontSize: 12,
    marginTop: 2,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0EC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#222',
  },

  optionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0EC',
    marginRight: 10,
    marginBottom: 4,
  },

  optionButtonActive: {
    backgroundColor: '#1A1A4E',
    borderColor: '#1A1A4E',
  },

  optionText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 13,
  },

  optionTextActive: {
    color: '#FFFFFF',
  },

  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
    gap: 12,
  },

  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    color: '#1A1A4E',
    fontWeight: '700',
    fontSize: 15,
  },

  nextButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});