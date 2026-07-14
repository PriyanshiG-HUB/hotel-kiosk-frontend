import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import useTranslation from '../../hooks/useTranslation';

import {
  useVisitor,
  Visitor,
} from '../../context/VisitorContext';

export default function VisitorPassScreen({ navigation }: any) {
  const {
    findVisitorById,
    findVisitorByName,
  } = useVisitor();
const { t } = useTranslation();
  const [searchType, setSearchType] =
    useState<'id' | 'name'>('id');

  const [searchText, setSearchText] =
    useState('');

  const [visitor, setVisitor] =
    useState<Visitor | null>(null);

  const handleSearch = () => {
  const result =
    searchType === 'id'
      ? findVisitorById(searchText)
      : findVisitorByName(searchText);

  if (!result) {
    Alert.alert(
      t('notFound'),
      t('noVisitorPassFound')
    );
    return;
  }

  setVisitor(result);
};

  const handlePrint = () => {
    Alert.alert(
      t('printVisitorPass'),
      t('visitorPassPrintedSuccessfully')
    );
  };

  const handleEmail = () => {
    Alert.alert(
      t('emailVisitorPass'),
      t('visitorPassEmailedSuccessfully')
    );
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
            {t('visitorPass')}
          </Text>

          <Text style={styles.headerStep}>
            {t('searchVisitorPass')}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.searchCard}>

          <Text style={styles.searchTitle}>
            {t('searchVisitor')}
          </Text>

          <View style={styles.toggleRow}>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                searchType === 'id' &&
                  styles.toggleButtonActive,
              ]}
              onPress={() => setSearchType('id')}
            >
              <Text
                style={[
                  styles.toggleText,
                  searchType === 'id' &&
                    styles.toggleTextActive,
                ]}
              >
                {t('visitorId')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                searchType === 'name' &&
                  styles.toggleButtonActive,
              ]}
              onPress={() =>
                setSearchType('name')
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  searchType === 'name' &&
                    styles.toggleTextActive,
                ]}
              >
                {t('visitorName')}
              </Text>
            </TouchableOpacity>

          </View>

          <TextInput
            style={styles.input}
            placeholder={
              searchType === 'id'
                ? t('enterVisitorId')
                : t('enterVisitorName')
            }
            value={searchText}
            onChangeText={setSearchText}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Ionicons
              name="search"
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />

            <Text style={styles.searchButtonText}>
              {t('searchPass')}
            </Text>
          </TouchableOpacity>

        </View>
       
        {!visitor && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="card-outline"
              size={70}
              color="#CCCCCC"
            />

            <Text style={styles.emptyTitle}>
              {t('searchVisitorPass')}
            </Text>

            <Text style={styles.emptyText}>
              {t('searchVisitorPassDescription')}
            </Text>
          </View>
        )} 

        {visitor && (
  <View style={styles.passCard}>

    {/* Header */}

    <View style={styles.passHeader}>
      <View>
        <Text style={styles.passHotelName}>
          {t('hotelName')}  
        </Text>

        <Text style={styles.passHotelSub}>
           {t('hotelAddress')}
        </Text>
      </View>

      <View>
        <Text style={styles.passType}>
          {t('visitorPass')}
        </Text>

        <View style={styles.approvedBadge}>
          <Text style={styles.approvedText}>
            {t('approved')}
          </Text>
        </View>
      </View>
    </View>

    {/* Details */}

    <View style={styles.passBody}>

      {[
  [t('visitorId'), visitor.visitorId],
  [t('visitorName'), visitor.fullName],
  [t('mobileNumber'), visitor.mobile],
  [
    t('host'),
    `${visitor.hostGuest} (${t('roomNumber')} ${visitor.hostRoom})`,
  ],
  [t('purpose'), visitor.purpose],
  [t('idType'), visitor.idType],
  [t('idNumber'), visitor.idNumber],
  [t('visitDate'), visitor.visitDate],
  [t('visitTime'), visitor.visitTime],
].map(([label, value], index) => (
        <React.Fragment key={label}>
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>
              {label}
            </Text>

            <Text style={styles.passValue}>
              {value}
            </Text>
          </View>

          {index < 8 && (
            <View style={styles.passDivider} />
          )}
        </React.Fragment>
      ))}

    </View>

    {/* QR */}

    <View style={styles.qrSection}>

      <View style={styles.qrBox}>
        <QRCode
          value={JSON.stringify(visitor)}
          size={95}
          color="#1A1A4E"
          backgroundColor="#FFFFFF"
        />
      </View>

      <Text style={styles.qrHint}>
        {t('showQrCode')}
      </Text>

    </View>

  </View>
)}
</ScrollView>
      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePrint}
        >
          <Ionicons
            name="print"
            size={18}
            color="#5B4BDB"
            style={{ marginRight: 6 }}
          />

          <Text style={styles.backButtonText}>
            {t('print')}  
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleEmail}
        >
          <Ionicons
            name="mail"
            size={18}
            color="#5B4BDB"
            style={{ marginRight: 6 }}
          />

          <Text style={styles.backButtonText}>
            {t('email')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() =>
            navigation.navigate('ThankYou', {
              title: t('visitorPassReady'),
              message: t('visitorPassGenerated'),
              icon: 'people',
              iconColor: '#5B4BDB',
              showRating: false,
            })
          }
        >
          <Ionicons
            name="checkmark-circle"
            size={18}
            color="#fff"
            style={{ marginRight: 6 }}
          />

          <Text style={styles.doneButtonText}>
            {t('done')}
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
    color: '#BFC3E2',
    marginTop: 2,
    fontSize: 12,
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },

  searchTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#1A1A4E',
  },

  toggleRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  toggleButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5B4BDB',
    borderRadius: 10,
    marginHorizontal: 4,
  },

  toggleButtonActive: {
    backgroundColor: '#5B4BDB',
  },

  toggleText: {
    color: '#5B4BDB',
    fontWeight: '700',
  },

  toggleTextActive: {
    color: '#fff',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  searchButton: {
    height: 50,
    backgroundColor: '#5B4BDB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A4E',
  },

  emptyText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
    lineHeight: 22,
  },

  passCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0EC',
  },

  passHeader: {
    backgroundColor: '#1A1A4E',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  passHotelName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  passHotelSub: {
    color: '#BFC3E2',
    marginTop: 4,
    fontSize: 12,
  },

  passType: {
    color: '#FFB648',
    fontWeight: '700',
    fontSize: 14,
  },

  approvedBadge: {
    marginTop: 8,
    backgroundColor: '#35C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  approvedText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
  },

  passBody: {
    padding: 20,
  },

  passRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  passLabel: {
    color: '#666',
    flex: 1,
    fontSize: 14,
  },

  passValue: {
    color: '#1A1A4E',
    flex: 1,
    textAlign: 'right',
    fontWeight: '700',
  },

  passDivider: {
    height: 1,
    backgroundColor: '#EFEFF5',
  },

  qrSection: {
    alignItems: 'center',
    backgroundColor: '#F7F8FD',
    padding: 24,
  },

  qrBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
  },

  qrHint: {
    marginTop: 15,
    textAlign: 'center',
    color: '#666',
  },

  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8F0',
  },

  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5B4BDB',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  backButtonText: {
    color: '#5B4BDB',
    fontWeight: '700',
  },

  doneButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#5B4BDB',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  doneButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});