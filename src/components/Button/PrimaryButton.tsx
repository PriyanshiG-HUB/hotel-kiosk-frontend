import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = true,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading || disabled}
      onPress={onPress}
      style={[
        styles.primaryButton,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.content}>
          {iconLeft && (
            <Ionicons
              name={iconLeft}
              size={20}
              color="white"
              style={styles.leftIcon}
            />
          )}

          <Text style={styles.primaryText}>
            {title}
          </Text>

          {iconRight && (
            <Ionicons
              name={iconRight}
              size={20}
              color="white"
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;