import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { NeedHelpProvider } from './src/context/NeedHelpContext';
import { ServiceRequestProvider } from './src/context/ServiceRequestContext';
import { LanguageProvider } from './src/context/LanguageContext';
export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
          <NeedHelpProvider>
            <ServiceRequestProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
            </ServiceRequestProvider>
          </NeedHelpProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
