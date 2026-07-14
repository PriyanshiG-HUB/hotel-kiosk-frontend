import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { BookingProvider } from './src/context/BookingContext';
import { VisitorProvider } from './src/context/VisitorContext';
import { NeedHelpProvider } from './src/context/NeedHelpContext';
import { ServiceRequestProvider } from './src/context/ServiceRequestContext';
import { RoomExtensionProvider } from './src/context/RoomExtensionContext';
import { LanguageProvider } from './src/context/LanguageContext';
export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
      <BookingProvider>
        <VisitorProvider>
          <NeedHelpProvider>
            <ServiceRequestProvider>
              <RoomExtensionProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </RoomExtensionProvider>
            </ServiceRequestProvider>
          </NeedHelpProvider>
        </VisitorProvider>
      </BookingProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
