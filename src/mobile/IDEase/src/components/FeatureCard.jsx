
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { typography, radii, spacing, shadow, colors , ZETECH} from '../styles/theme';

// const ZETECH = {
//   navy: '#11172F',
//   navyLight: '#252D49',
//   white: '#FFFFFF',
// };

const FeatureCard = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconWrapper}>
      <Ionicons
        name={icon}
        size={22}
        color={ZETECH.white}
      />
    </View>

    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexBasis: '31%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    ...shadow.subtle,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: ZETECH.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  label: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default FeatureCard;
