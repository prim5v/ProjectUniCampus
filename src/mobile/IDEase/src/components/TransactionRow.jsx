import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, radii, spacing } from '../styles/theme';

/**
 * TransactionRow
 * Single row inside the Recent Transactions card.
 * `direction` is either "incoming" (green, +) or "outgoing" (dark, -).
 */
const TransactionRow = ({ icon, title, time, amount, direction, isLast }) => {
  const isIncoming = direction === 'incoming';

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={18} color={colors.textPrimary} />
      </View>

      <View style={styles.textGroup}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <Text style={[styles.amount, isIncoming && styles.amountIncoming]}>
        {isIncoming ? '+ ' : '- '}
        {amount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    fontSize: 15,
  },
  time: {
    ...typography.caption,
    marginTop: 2,
  },
  amount: {
    ...typography.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  amountIncoming: {
    color: colors.success,
  },
});

export default TransactionRow;