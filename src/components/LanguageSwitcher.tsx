import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import useTranslation from '../hooks/useTranslation';

export default function LanguageSwitcher() {
  const { language, setLanguage } =
    useTranslation();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[
          styles.btn,
          language === 'en' && styles.active,
        ]}
        onPress={() => setLanguage('en')}
      >
        <Text
  style={[
    styles.text,
    language === 'en' && styles.activeText,
  ]}
>
  English
</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          language === 'hi' && styles.active,
        ]}
        onPress={() => setLanguage('hi')}
      >
        <Text
  style={[
    styles.text,
    language === 'hi' && styles.activeText,
  ]}
>
  हिन्दी
</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          language === 'ar' && styles.active,
        ]}
        onPress={() => setLanguage('ar')}
      >
        <Text
  style={[
    styles.text,
    language === 'ar' && styles.activeText,
  ]}
>
  العربية
</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          language === 'fr' && styles.active,
        ]}
        onPress={() => setLanguage('fr')}
      >
        <Text
  style={[
    styles.text,
    language === 'fr' && styles.activeText,
  ]}
>
  Français
</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },

  btn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 70,
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

  active: {
    backgroundColor: '#5B4BDB',
  },

  text: {
    color: '#5B4BDB',
    fontWeight: '700',
    fontSize: 14,
  },

  activeText: {
    color: '#FFFFFF',
  },
});