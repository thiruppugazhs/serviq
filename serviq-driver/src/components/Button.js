import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

export const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'success'
  size = 'large', // 'small', 'medium', 'large'
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSuccess = variant === 'success';
  const isSecondary = variant === 'secondary';

  let bg = COLORS.primary;
  let textColor = COLORS.textInverse;
  let borderColor = 'transparent';

  if (isSecondary) {
    bg = COLORS.primaryMuted;
    textColor = COLORS.primary;
  } else if (isOutline) {
    bg = 'transparent';
    textColor = COLORS.primary;
    borderColor = COLORS.primary;
  } else if (isDanger) {
    bg = COLORS.danger;
    textColor = COLORS.textInverse;
  } else if (isSuccess) {
    bg = COLORS.success;
    textColor = COLORS.textInverse;
  }

  if (disabled) {
    bg = COLORS.disabled;
    textColor = '#94A3B8';
    borderColor = 'transparent';
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        { backgroundColor: bg, borderColor },
        isOutline && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline || isSecondary ? COLORS.primary : COLORS.textInverse}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              { color: textColor },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  outline: {
    borderWidth: 1.5,
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minHeight: 46,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    minHeight: 52,
  },
  // Text sizes
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  text_small: {
    fontSize: 13,
  },
  text_medium: {
    fontSize: 15,
  },
  text_large: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
});
