import { StyleSheet } from 'react-native';
import {
  Colors,
  Radius,
  Typography,
} from '../../theme';

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  primaryText: {
    color: Colors.white,
    fontSize: Typography.body,
    fontWeight: '700',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftIcon: {
    marginRight: 10,
  },

  rightIcon: {
    marginLeft: 10,
  },

  secondaryButton: {
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },

  secondaryText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
});

export default styles;