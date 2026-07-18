//import { KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';

import { registerVisitor } from '../../api/visitorApi';
import { getBookingByRoom, getBookingByGuestName } from '../../api/bookingApi';
import { ActivityIndicator } from 'react-native';
export default function VisitorRegistrationScreen({ navigation ,route}: any) {
const { t } = useTranslation();
const [loading, setLoading] = useState(false);


  const [visitorName, setVisitorName] = useState('');
const [mobile, setMobile] = useState('');
const [idType, setIdType] = useState('Aadhar');
const [idNumber, setIdNumber] = useState('');
const [purpose, setPurpose] = useState('');
const [searchType, setSearchType] = useState<'room' | 'guest'>('room');

const [searchText, setSearchText] = useState('');

const [selectedBooking, setSelectedBooking] = useState<any>(null);
const visitDate = new Date().toLocaleDateString();

const visitTime = new Date().toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
});

const handleSearchHost = async () => {
  if (!searchText.trim()) {
  Alert.alert(
    t('required'),
    searchType === 'room'
      ? t('pleaseEnterRoomNumber')
      : t('pleaseEnterGuestName')
  );
  return;
}
  let booking = null;

  try {
    if (searchType === 'room') {
      booking = await getBookingByRoom(searchText.trim());
    } else {
      booking = await getBookingByGuestName(searchText.trim());
    }
  } catch (error: any) {
    setSelectedBooking(null);
    const msg = error.response?.data?.message || error.message || t('noMatchingGuest');
    Alert.alert(
      t('notFound'),
      msg
    );
    return;
  }

  if (!booking) {
    setSelectedBooking(null);
    Alert.alert(
      t('notFound'),
      t('noMatchingGuest')
    );
    return;
  }

  setSelectedBooking(booking);
};
const nameRegex =
  /^[A-Za-z\s.'-]{2,50}$/;

const mobileRegex =
  /^[6-9]\d{9}$/;
const validateVisitorId = (
  idType: string,
  idNumber: string
) => {
  const value = idNumber.trim();

  switch (idType) {
    case 'Aadhar':
      return /^\d{12}$/.test(value);

    case 'Passport':
      return /^[A-Z0-9]{6,10}$/i.test(value);

    case 'Driving License':
      return /^[A-Za-z0-9-]{10,20}$/.test(value);

    default:
      return value.length >= 5;
  }
};
const canGenerate =
  !!selectedBooking &&
  nameRegex.test(visitorName.trim()) &&
  mobileRegex.test(mobile.trim()) &&
  validateVisitorId(idType, idNumber) &&
  purpose.trim().length >= 3;
  const handleSave = async () => {
  if (!selectedBooking) {
  Alert.alert(
    t('guestRequired'),
    t('pleaseSearchAndSelectGuest')
  );
  return;
}

if (!nameRegex.test(visitorName.trim())) {
  Alert.alert(
    t('invalidVisitorName'),
    t('enterValidVisitorName')
  );
  return;
}

if (!mobileRegex.test(mobile.trim())) {
  Alert.alert(
    t('invalidMobileNumber'),
    t('enterValidMobileNumber')
  );
  return;
}

if (!validateVisitorId(idType, idNumber)) {
  Alert.alert(
    t('invalidId'),
    t('pleaseEnterValidId')
  );
  return;
}

if (purpose.trim().length < 3) {
  Alert.alert(
    t('invalidPurpose'),
    t('purposeMustContainAtLeast3Characters')
  );
  return;
}

  setLoading(true);
  try {
    const apiResponse = await registerVisitor({
      full_name: visitorName.trim(),
      mobile: mobile.trim(),
      purpose: purpose.trim(),
      host_room: selectedBooking.roomNo,
      host_guest: selectedBooking.guest.fullName,
      id_type: idType,
      id_number: idNumber.trim(),
    });

    setLoading(false);
    navigation.navigate('VisitorSuccess', { visitor: apiResponse });
  } catch (err: any) {
    console.log(err);
    setLoading(false);
    Alert.alert(
      t('error') || 'Error',
      err.message || t('failedToRegisterVisitor') || 'Failed to register visitor'
    );
  }
};
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#1A1A4E"
        barStyle="light-content"
      />

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {t('visitorRegistration')}

          </Text>

          <Text style={styles.headerStep}>
            {t('registerVisitor')}
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {/* Visitor Name */}

<Text style={styles.label}>
  {t('searchGuest')}
</Text>

<View style={styles.idRow}>
  <TouchableOpacity
    style={[
      styles.idButton,
      searchType === 'room' &&
        styles.idButtonActive,
    ]}
    onPress={() => setSearchType('room')}
  >
    <Text
      style={[
        styles.idText,
        searchType === 'room' &&
          styles.idTextActive,
      ]}
    >
      {t('roomNumber')}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.idButton,
      searchType === 'guest' &&
        styles.idButtonActive,
    ]}
    onPress={() => setSearchType('guest')}
  >
    <Text
      style={[
        styles.idText,
        searchType === 'guest' &&
          styles.idTextActive,
      ]}
    >
      {t('guestName')}
    </Text>
  </TouchableOpacity>
</View>

<TextInput
  style={styles.input}
  placeholder={
    searchType === 'room' ? t('enterRoomNumber') : t('enterGuestName')
  }
  value={searchText}
  onChangeText={(text) => {
  setSearchText(text);
  setSelectedBooking(null);
}}
/>

<TouchableOpacity
  style={styles.saveButton}
  onPress={handleSearchHost}
>
  <Text style={styles.saveButtonText}>
    {t('searchGuest')}
  </Text>
</TouchableOpacity>

{selectedBooking && (
  <View
    style={{
      marginTop: 15,
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#EAFBF0',
      borderWidth: 1,
      borderColor: '#35C759',
    }}
  >
    <Ionicons
      name="checkmark-circle"
      size={22}
      color="#35C759"
    />

    <Text
      style={{
        fontWeight: '700',
        marginTop: 8,
      }}
    >
      {t('guestFound')}
    </Text>

    <Text>{selectedBooking.guest.fullName}</Text>

    <Text>{t('roomNumber')} {selectedBooking.roomNo}</Text>
  </View>
)}
<Text style={styles.label}>
  {t('visitorName')}
</Text>

<TextInput
  style={styles.input}
  placeholder={t('enterVisitorName')}
  value={visitorName}
  onChangeText={(text) =>
  setVisitorName(
    text.replace(/[^A-Za-z\s.'-]/g, '')
  )
}
/>
          {/* Mobile */}

          <Text style={styles.label}>
            {t('mobileNumber')}
          </Text>

          <TextInput
  style={styles.input}
  placeholder={t('enterMobileNumber')}
  keyboardType="phone-pad"
  maxLength={10}
  value={mobile}
  onChangeText={(text) =>
  setMobile(text.replace(/[^0-9]/g, ''))
}
/>

          {/* ID Type */}

          <Text style={styles.label}>
            {t('idType')}
          </Text>

          <View style={styles.idRow}>
            {[
              'Aadhar',
              'Passport',
              'Driving License',
            ].map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.idButton,
                  idType === item &&
                    styles.idButtonActive,
                ]}
                onPress={() => setIdType(item)}
              >
                <Text
                  style={[
                    styles.idText,
                    idType === item &&
                      styles.idTextActive,
                  ]}
                >
                  {
  item === 'Aadhar'
    ? t('aadhaar')
    : item === 'Passport'
    ? t('passport')
    : t('drivingLicense')
}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
                    {/* ID Number */}

          <Text style={styles.label}>
            {t('idNumber')}
          </Text>

          <TextInput
  style={styles.input}
  placeholder={
  idType === 'Aadhar'
    ? t('enter12DigitAadhaar')
    : idType === 'Passport'
    ? t('enterPassportNumber')
    : t('enterDrivingLicenseNumber')
}
  autoCapitalize="characters"
  value={idNumber}
  onChangeText={setIdNumber}
/>

          {/* Person to Meet */}

          

          {/* Purpose */}

          <Text style={styles.label}>
            {t('purposeOfVisit')}
          </Text>

          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={t('enterPurposeOfVisit')}
            multiline
            value={purpose}
            onChangeText={setPurpose}
          />

          {/* Visit Details */}

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color="#1A1A4E"
              />
              <Text style={styles.infoTitle}>
                {t('date')}
              </Text>
              <Text style={styles.infoValue}>
                {visitDate}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Footer */}

      <View style={styles.footer}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.backButtonText}>
      {t('back')}
    </Text>
  </TouchableOpacity>

   <TouchableOpacity
    style={[
      styles.saveButton,
      (!canGenerate || loading) && { opacity: 0.5 },
    ]}
    disabled={!canGenerate || loading}
    onPress={handleSave}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <>
        <Ionicons
          name="person-add"
          size={18}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.saveButtonText}>
          {t('generatePass')}
        </Text>
      </>
    )}
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
    letterSpacing: 1,
  },

  headerStep: {
    color: '#BFC3E2',
    fontSize: 12,
    marginTop: 2,
  },

  content: {
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0EC',
    elevation: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9D9E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    fontSize: 14,
  },

  multilineInput: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  idButton: {
    flex: 1,
    height: 42,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  idButtonActive: {
    backgroundColor: '#1A1A4E',
    borderColor: '#1A1A4E',
  },

  idText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },

  idTextActive: {
    color: '#fff',
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },

  infoCard: {
    flex: 1,
    backgroundColor: '#F7F8FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4F2',
  },

  infoTitle: {
    marginTop: 8,
    color: '#666',
    fontSize: 13,
  },

  infoValue: {
    marginTop: 4,
    fontWeight: '700',
    color: '#1A1A4E',
    fontSize: 15,
  },

  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
    gap: 12,
  },

  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
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

  saveButton: {
    flex: 2,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  headerRight: {
  width: 40,
},
});