import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from "expo-router";

import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import TransactionRow from '../components/TransactionRow';
import { colors, typography, radii, spacing, shadow } from '../styles/theme';

/**
 * WalletScreen
 * UI only — no navigation, no state persistence, no wallet logic.
 * Local `useState` here is purely for the Switch's visual toggle,
 * as required for a functioning core RN component; no business logic attached.
 * Bottom navigation bar intentionally omitted (handled elsewhere).
 */
const WalletScreen = () => {
  const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(true);

  const transactions = [
    {
      icon: 'restaurant-outline',
      title: 'Cafeteria Payment',
      time: 'Today, 12:45 PM',
      amount: 'KSh 120.00',
      direction: 'outgoing',
    },
    {
      icon: 'bus-outline',
      title: 'Transport Payment',
      time: 'Today, 08:10 AM',
      amount: 'KSh 50.00',
      direction: 'outgoing',
    },
    {
      icon: 'book-outline',
      title: 'Library Fine',
      time: 'Yesterday, 04:30 PM',
      amount: 'KSh 30.00',
      direction: 'outgoing',
    },
    {
      icon: 'add-circle-outline',
      title: 'Funds Top-up',
      time: 'Yesterday, 09:15 AM',
      amount: 'KSh 500.00',
      direction: 'incoming',
    },
  ];

  const summaryStats = [
    { label: 'Total Top-ups', value: 'KSh 5,600' },
    { label: 'Total Spent', value: 'KSh 4,350' },
    { label: 'This Month', value: 'KSh 1,250' },
    { label: 'Transactions', value: '23' },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader 
      title="Closed Loop Account" 
      rightIcon="ellipsis-horizontal" 
      onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeaderRow}>
            <Text style={styles.balanceLabel}>Account Balance</Text>
          </View>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>KSh 1,250.00</Text>
            <TouchableOpacity
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.6}
            >
              <Ionicons
                name="eye-outline"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.availableBalanceText}>Available Balance</Text>

          <View style={styles.balanceButtonsRow}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Add Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
              <Ionicons
                name="swap-horizontal"
                size={18}
                color={colors.textPrimary}
              />
              <Text style={styles.secondaryButtonText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction, index) => (
            <TransactionRow
              key={transaction.title + index}
              icon={transaction.icon}
              title={transaction.title}
              time={transaction.time}
              amount={transaction.amount}
              direction={transaction.direction}
              isLast={index === transactions.length - 1}
            />
          ))}
        </View>

        {/* Account Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Summary</Text>

          <View style={styles.statsGrid}>
            {summaryStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </View>
        </View>

        {/* Auto Top-up Card */}
        <View style={styles.sectionCard}>
          <View style={styles.autoTopUpHeaderRow}>
            <View style={styles.autoTopUpTextGroup}>
              <Text style={styles.sectionTitle}>Auto Top-up</Text>
              <Text style={styles.autoTopUpDescription}>
                Keep your account funded automatically
              </Text>
            </View>

            <Switch
              value={autoTopUpEnabled}
              onValueChange={setAutoTopUpEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.border}
            />
          </View>

          <View style={styles.minBalanceRow}>
            <Text style={styles.minBalanceLabel}>Minimum Balance</Text>
            <Text style={styles.minBalanceValue}>KSh 300.00</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop:50,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  /* Balance Card */
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginTop: spacing.md,
    ...shadow.soft,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    ...typography.captionLarge,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  balanceValue: {
    ...typography.largeTitle,
    fontSize: 30,
    marginRight: spacing.sm,
  },
  availableBalanceText: {
    ...typography.caption,
    marginTop: 2,
  },
  balanceButtonsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },

  /* Shared Section Card */
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginTop: spacing.lg,
    ...shadow.subtle,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  viewAllText: {
    ...typography.captionLarge,
    color: colors.primary,
    fontWeight: '600',
  },

  /* Account Summary */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },

  /* Auto Top-up */
  autoTopUpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoTopUpTextGroup: {
    flex: 1,
    marginRight: spacing.md,
  },
  autoTopUpDescription: {
    ...typography.caption,
    marginTop: 4,
  },
  minBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  minBalanceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  minBalanceValue: {
    ...typography.bodyMedium,
  },
});

export default WalletScreen;