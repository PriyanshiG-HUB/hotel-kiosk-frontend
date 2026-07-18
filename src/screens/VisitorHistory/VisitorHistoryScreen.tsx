import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../../hooks/useTranslation';
import { getVisitors } from '../../api/visitorApi';

export default function VisitorHistoryScreen({ navigation }: any) {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchVisitors = async () => {
    try {
      const data = await getVisitors();
      setVisitors(data || []);
    } catch (error) {
      console.log('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const checkedInCount = visitors.filter(
    visitor => visitor.status === 'Checked In').length;

  const checkedOutCount = visitors.filter(
    visitor => visitor.status === 'Checked Out').length;

  const renderVisitor = ({ item }: any) => (
    <View style={styles.visitorCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.visitorId}>
            {item.visitorId}
          </Text>

          <Text style={styles.visitorName}>
            {item.fullName}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            item.status === 'Checked In'
              ? styles.checkedInBadge
              : styles.checkedOutBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Checked In'
                ? styles.checkedInText
                : styles.checkedOutText,
            ]}
          >
            {
  item.status === 'Checked In'
    ? t('checkedIn')
    : t('checkedOut')
}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="bed-outline"
          size={18}
          color="#666"
        />
        <Text style={styles.infoText}>
          {t('roomNumber')} {item.hostRoom}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="person-outline"
          size={18}
          color="#666"
        />
        <Text style={styles.infoText}>
          {t('host')}: {item.hostGuest}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color="#666"
        />
        <Text style={styles.infoText}>
          {t('visitDate')}: {item.visitDate} • {t('visitTime')}: {item.visitTime}
        </Text>
      </View>

      {item.checkOutTime ? (
        <View style={styles.infoRow}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#666"
          />
          <Text style={styles.infoText}>
            {t('checkout')}: {item.checkOutTime}
          </Text>
        </View>
      ) : null}
    </View>
  );

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
            {t('visitorHistory')}
          </Text>
          <Text style={styles.headerStep}>
            {t('visitorRecords')}
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {visitors.length}
            </Text>
            <Text style={styles.statLabel}>
              {t('totalVisitors')}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {checkedInCount}
            </Text>
            <Text style={styles.statLabel}>
              {t('checkedIn')}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {checkedOutCount}
            </Text>
            <Text style={styles.statLabel}>
              {t('checkedOut')}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {t('visitorRecords')}
        </Text>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <ActivityIndicator size="large" color="#1A1A4E" />
          </View>
        ) : visitors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-circle-outline"
              size={90}
              color="#C5C5D2"
            />

            <Text style={styles.emptyTitle}>
              {t('noVisitorsFound')}
            </Text>

            <Text style={styles.emptyText}>
              {t('visitorRecordsWillAppearHere')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={[...visitors].reverse()}
            keyExtractor={(item) => item.visitorId}
            renderItem={renderVisitor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          />
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
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
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

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5F0',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A4E',
  },

  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A4E',
    marginBottom: 16,
  },

  visitorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E4E4EF',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  visitorId: {
    fontSize: 12,
    color: '#777',
    fontWeight: '600',
  },

  visitorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A4E',
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  checkedInBadge: {
    backgroundColor: '#DFF7E5',
  },

  checkedOutBadge: {
    backgroundColor: '#FFE3E3',
  },

  checkedInText: {
    color: '#2E9E50',
  },

  checkedOutText: {
    color: '#D94A4A',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
  },

  emptyText: {
    marginTop: 8,
    color: '#777',
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
    borderColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    color: '#1A1A4E',
    fontWeight: '700',
    fontSize: 15,
  },
});