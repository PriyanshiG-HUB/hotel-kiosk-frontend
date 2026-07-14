import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles';

interface Props {
  title: string;
  onPress: () => void;
}

const SecondaryButton: React.FC<Props> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.secondaryButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.secondaryText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;