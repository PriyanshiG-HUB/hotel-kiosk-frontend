//import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import  useTranslation  from '../../hooks/useTranslation';
const HomeScreen = ({ navigation }: any) => {
  const { t, setLanguage, language } =
    useTranslation();

  const menuItems = [
{
title:'checkIn',
subtitle:'startStay',
icon:'bed',
color:'#6C63FF',
screen:'CheckInOptions',
},
{
title:'checkOut',
subtitle:'completeCheckout',
icon:'log-out',
color:'#5B4BDB',
screen:'CheckoutSummary',
},
{
title:'roomExtension',
subtitle:'extendBooking',
icon:'time',
color:'#7C4DFF',
screen:'RoomExtension',
},
{
title:'visitorManagement',
subtitle:'registerVisitors',
icon:'people',
color:'#6A5AE0',
screen:'VisitorManagement',
},
];

  const features = [
    {
      title: 'smart',
      icon: 'hardware-chip',
    },
    {
      title: 'secure',
      icon: 'shield-checkmark',
    },
    {
      title: 'fast',
      icon: 'flash',
    },
    {
      title: 'seamless',
      icon: 'sparkles',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor="#5B4BDB"
        barStyle="light-content"
      />

      <LinearGradient
        colors={['#4533C6','#5B4BDB','#7C67F8','#9B7BFF']}
        style={styles.gradient}
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom:40,paddingTop:10,}}
        >

          {/* LOGO */}

          <View style={styles.logoContainer}>

            <View style={styles.logoCircle}>

              <Ionicons
                name="business"
                size={60}
                color="#5B4BDB"
              />

            </View>

            <Text style={styles.hotelName}>
              ROYAL INN
            </Text>

            <Text style={styles.hotelSubtitle}>
  {t('hotelKiosk')}
</Text>

          </View>

          {/* FEATURES */}

          <View style={styles.featureRow}>

            {features.map((item) => (

              <View
                key={item.title}
                style={styles.featureCard}
              >

                <Ionicons
                  name={item.icon as any}
                  size={26}
                  color="#5B4BDB"
                />

                <Text style={styles.featureText}>
  {t(item.title)}
</Text>

              </View>

            ))}

          </View>

          {/* WELCOME */}

          <Text style={styles.welcome}>
            {t('welcome')}
          </Text>

          <Text style={styles.subtitle}>
            {t('chooseOption')}
          </Text>

          {/* MENU */}

          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
  <TouchableOpacity
    key={item.screen}
    activeOpacity={0.75}
    style={styles.menuCard}
    onPress={() => navigation.navigate(item.screen)}
  >
    <View
      style={[
        styles.iconContainer,
        {
          backgroundColor: item.color,
        },
      ]}
    >
      <Ionicons
        name={item.icon as any}
        size={34}
        color="#fff"
      />
    </View>

    <View style={styles.menuTextContainer}>
      <Text style={styles.menuTitle}>
        {t(item.title)}
      </Text>

      <Text style={styles.menuDescription}>
        {t(item.subtitle)}
      </Text>
    </View>

    <Ionicons
      name="chevron-forward-circle"
      size={32}
      color="#5B4BDB"
    />
  </TouchableOpacity>
))}

</View>

{/* NEED HELP */}

<TouchableOpacity
  style={styles.helpButton}
  activeOpacity={0.8}
  onPress={() => navigation.navigate('NeedHelp')}
>
  <Ionicons
    name="help-circle"
    size={26}
    color="#fff"
  />
  <Text style={styles.helpText}>{t('needHelp')}</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.serviceButton}
  activeOpacity={0.8}
  onPress={() => navigation.navigate('ServiceRequest')}
>
  <Ionicons name="layers" size={26} color="#fff" />
  <Text style={styles.helpText}>{t('serviceRequest')}</Text>
</TouchableOpacity>

{/* LANGUAGE */}

<View style={{ marginHorizontal: 22, marginTop: 28 }}>
  <Text style={styles.languageTitle}>
    {t('selectLanguage')}
  </Text>

  <LanguageSwitcher />
</View>

{/* HARDWARE */}

<View style={styles.hardwareContainer}>

  <Text style={styles.hardwareTitle}>
    {t('hardwareStatus')}
  </Text>

  <View style={styles.hardwareRow}>

    <View style={styles.hardwareCard}>
      <Ionicons
        name="qr-code"
        size={34}
        color="#5B4BDB"
      />
      <Text style={styles.hardwareText}>
        {t('qrScanner')}
      </Text>
    </View>

    <View style={styles.hardwareCard}>
      <Ionicons
        name="print"
        size={34}
        color="#5B4BDB"
      />
      <Text style={styles.hardwareText}>
        {t('receiptPrinter')}
      </Text>
    </View>

    <View style={styles.hardwareCard}>
      <Ionicons
        name="card"
        size={34}
        color="#5B4BDB"
      />
      <Text style={styles.hardwareText}>
        {t('cardReader')}
      </Text>
    </View>

  </View>

</View>

<Text style={styles.footer}>
  {t('copyright')}
</Text>

</ScrollView>

</LinearGradient>

</SafeAreaView>
);

};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#F5F7FB',
},

gradient: {
  flex: 1,
},

logoContainer: {
  alignItems: 'center',
  marginTop: 25,
  marginBottom: 25,
},

logoCircle: {
  width: 110,
  height: 110,
  borderRadius: 55,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
  elevation: 8,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 4,
  },
},

hotelName: {
  fontSize: 42,
  color: '#FFFFFF',
  fontWeight: 'bold',
  letterSpacing: 2,
},

hotelSubtitle: {
  marginTop: 8,
  color: '#FFFFFF',
  fontSize:16,
  fontWeight:'600',
  letterSpacing: 1,
},

featureRow: {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  marginBottom: 30,
  paddingHorizontal: 15,
},

featureCard: {
  backgroundColor: '#FFFFFF',
  width: 95,
  height: 95,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 4,
},

featureText: {
  marginTop: 8,
  fontWeight: '600',
  color: '#555',
  fontSize: 12,
},

welcome: {
  color: '#FFFFFF',
  fontSize:42,
  textAlign: 'center',
  fontWeight: 'bold',
},

subtitle: {
  textAlign: 'center',
  color: '#F3F3F3',
  fontSize: 18,
  marginTop: 8,
  marginBottom: 25,
},

menuContainer: {
  paddingHorizontal: 22,
},

menuCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical:22,
  paddingHorizontal:20,
  marginBottom: 18,
  elevation: 5,
},

iconContainer: {
  width: 65,
  height: 65,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
},

menuTextContainer: {
  flex: 1,
  marginLeft: 18,
},

menuTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#333333',
},

menuDescription: {
  marginTop: 5,
  color: '#8B8B8B',
  fontSize: 14,
},

helpButton: {
  marginHorizontal: 22,
  marginTop: 12,
  backgroundColor: '#FF6B6B',
  height: 62,
  borderRadius: 18,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},

helpText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '700',
  marginLeft: 10,
},
  serviceButton: {
    marginHorizontal: 22,
    marginTop: 10,
    backgroundColor: '#4D8BFF',
    height: 62,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

languageContainer: {
  marginHorizontal: 22,
  marginTop: 28,
},

languageTitle: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 15,
},

languageRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
},

languageButton: {
  backgroundColor: '#FFFFFF',
  paddingVertical: 12,
  paddingHorizontal: 18,
  borderRadius: 12,
  marginBottom: 12,
  minWidth: 100,
  alignItems: 'center',
  elevation: 3,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 4,
  shadowOffset: {
    width: 0,
    height: 2,
  },
},

languageText: {
  color: '#5B4BDB',
  fontWeight: '700',
  fontSize: 14,
},

hardwareContainer: {
  marginTop: 30,
  marginHorizontal: 22,
  backgroundColor: 'rgba(255,255,255,0.15)',
  borderRadius: 22,
  padding: 20,
},

hardwareTitle: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 18,
},

hardwareRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

hardwareCard: {
  backgroundColor: '#FFFFFF',
  width: '31%',
  borderRadius: 18,
  paddingVertical: 25,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: {
    width: 0,
    height: 3,
  },
},

hardwareText: {
  marginTop: 12,
  textAlign: 'center',
  color: '#444',
  fontWeight: '600',
  fontSize: 13,
},

footer: {
  textAlign: 'center',
  color: '#FFFFFF',
  fontSize: 14,
  marginTop: 30,
  marginBottom: 25,
  opacity: 0.9,
},
activeLanguageButton: {
  backgroundColor: '#5B4BDB',
},
});