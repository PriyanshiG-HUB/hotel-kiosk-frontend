import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home/HomeScreen';
import RoomSelectionScreen from '../screens/RoomSelection/RoomSelectionScreen';
import GuestInformationScreen from '../screens/GuestInformation/GuestInformationScreen';
import IDVerificationScreen from '../screens/IDVerification/IDVerificationScreen';
import BookingInformationScreen from '../screens/BookingInformation/BookingInformationScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import RoomConfirmationScreen from '../screens/RoomConfirmation/RoomConfirmationScreen';
import CheckoutSummaryScreen from '../screens/CheckoutSummary/CheckoutSummaryScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccess/PaymentSuccessScreen';
import ThankYouScreen from '../screens/ThankYou/ThankYouScreen';
import VisitorManagementScreen from '../screens/VisitorManagement/VisitorManagementScreen';
import VisitorRegistrationScreen from '../screens/VisitorRegistration/VisitorRegistrationScreen';
import VisitorPassScreen from '../screens/VisitorPass/VisitorPassScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';

// New Screens
import NeedHelpScreen from '../screens/NeedHelp/NeedHelpScreen';
import SelectServiceScreen from '../screens/SelectService/SelectServiceScreen';
import HelpConfirmationScreen from '../screens/HelpConfirmation/HelpConfirmationScreen';
import RoomExtensionScreen from '../screens/RoomExtension/RoomExtensionScreen';
import RoomExtensionSummaryScreen from '../screens/RoomExtensionSummary/RoomExtensionSummaryScreen';
import ServiceRequestScreen from '../screens/ServiceRequest/ServiceRequestScreen';
import ServiceRequestDetailsScreen from '../screens/ServiceRequestDetails/ServiceRequestDetailsScreen';
import ServiceConfirmationScreen from '../screens/ServiceConfirmation/ServiceConfirmationScreen';
import VisitorSuccessScreen from '../screens/VisitorSuccess/VisitorSuccessScreen';
import VisitorHistoryScreen from '../screens/VisitorHistory/VisitorHistoryScreen';
import VisitorCheckoutScreen from '../screens/VisitorCheckout/VisitorCheckoutScreen';
import CheckInOptionsScreen from '../screens/CheckInOptions/CheckInOptionsScreen';
import ReservationLookupScreen from '../screens/ReservationLookup/ReservationLookupScreen';
import ReservationReviewScreen from '../screens/ReservationReview/ReservationReviewScreen';
import ReservationNotFoundScreen from '../screens/ReservationNotFound/ReservationNotFoundScreen';
import RoomAssignedScreen from '../screens/RoomAssigned/RoomAssignedScreen';
import KeyDeliveryScreen from '../screens/KeyDelivery/KeyDeliveryScreen';


export type RootStackParamList = {
  Home: undefined;
  RoomSelection: undefined;
  GuestInformation: undefined;
  IDVerification: undefined;
  BookingInformation: undefined;
  Payment: undefined;
  RoomConfirmation: undefined;
  CheckoutSummary: undefined;
  PaymentSuccess: undefined;
  VisitorSuccess: undefined;
  ThankYou: {
  title?: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  bookingId?: string;
  guestName?: string;
  roomNumber?: string;
  extraInfo?: string;
  showRating?: boolean;
  clearBooking?: boolean;
} | undefined;

  VisitorManagement: undefined;
  VisitorRegistration: undefined;
  VisitorPass: undefined;
  Dashboard: undefined;

  // Need Help
  NeedHelp: undefined;
  SelectService: {
    service: any;
  };
  HelpConfirmation: undefined;

  // Room Extension
  RoomExtension: undefined;
  RoomExtensionSummary: undefined;

  // Service Request
  ServiceRequest: undefined;
  ServiceRequestDetails: {
    category: any;
  };
  ServiceConfirmation: undefined;
  VisitorHistory: undefined;
VisitorCheckout: undefined;
CheckInOptions: undefined;
ReservationLookup: undefined;
ReservationReview: undefined;
ReservationNotFound: undefined;
RoomAssigned: undefined;
KeyDelivery: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Existing Screens */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RoomSelection" component={RoomSelectionScreen} />
      <Stack.Screen name="GuestInformation" component={GuestInformationScreen} />
      <Stack.Screen name="IDVerification" component={IDVerificationScreen} />
      <Stack.Screen name="BookingInformation" component={BookingInformationScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="RoomConfirmation" component={RoomConfirmationScreen} />
      <Stack.Screen name="CheckoutSummary" component={CheckoutSummaryScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="ThankYou" component={ThankYouScreen} />
      <Stack.Screen name="VisitorManagement" component={VisitorManagementScreen} />
      <Stack.Screen name="VisitorRegistration" component={VisitorRegistrationScreen} />
      <Stack.Screen name="VisitorPass" component={VisitorPassScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />

      {/* Need Help Flow */}
      <Stack.Screen name="NeedHelp" component={NeedHelpScreen} />
      <Stack.Screen name="SelectService" component={SelectServiceScreen} />
      <Stack.Screen name="HelpConfirmation" component={HelpConfirmationScreen} />

      {/* Room Extension Flow */}
      <Stack.Screen name="RoomExtension" component={RoomExtensionScreen} />
      <Stack.Screen name="RoomExtensionSummary" component={RoomExtensionSummaryScreen} />

      {/* Service Request Flow */}
      <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
      <Stack.Screen name="ServiceRequestDetails" component={ServiceRequestDetailsScreen} />
      <Stack.Screen name="ServiceConfirmation" component={ServiceConfirmationScreen} />
      <Stack.Screen name="VisitorSuccess" component={VisitorSuccessScreen} />
      <Stack.Screen
  name="VisitorHistory"
  component={VisitorHistoryScreen}
/>

<Stack.Screen
  name="VisitorCheckout"
  component={VisitorCheckoutScreen}
/>
    <Stack.Screen
  name="CheckInOptions"
  component={CheckInOptionsScreen}
/>
<Stack.Screen
  name="ReservationLookup"
  component={ReservationLookupScreen}
/>
<Stack.Screen
  name="ReservationReview"
  component={ReservationReviewScreen}
/>
<Stack.Screen
  name="ReservationNotFound"
  component={ReservationNotFoundScreen}
/>
<Stack.Screen
  name="RoomAssigned"
  component={RoomAssignedScreen}
/>
<Stack.Screen
  name="KeyDelivery"
  component={KeyDeliveryScreen}
/>

    </Stack.Navigator>
  );
}
