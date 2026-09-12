// ```jsx
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { colors, typography, radii, spacing, shadow } from '../styles/theme';
import { router } from 'expo-router';
import { useConn } from '../contexts/ConnContext';
const ActivityScreen = () => {
  // ============================================================
  // ACTIVITY DATA
  // ============================================================

  // const activities = [
  //   // {
  //   //   id: '1',
  //   //   type: 'library',
  //   //   title: 'Library Entry',
  //   //   time: 'Today, 10:21 AM',
  //   //   icon: 'checkmark-circle-outline',
  //   // },
  //   // {
  //   //   id: '2',
  //   //   type: 'hostel',
  //   //   title: 'Hostel Gate',
  //   //   time: 'Today, 08:12 AM',
  //   //   icon: 'home-outline',
  //   // },
  //   // {
  //   //   id: '3',
  //   //   type: 'payment',
  //   //   title: 'Meal Payment',
  //   //   amount: 'KSh 120.00',
  //   //   time: 'Yesterday, 12:45 PM',
  //   //   icon: 'wallet-outline',
  //   // },
  //   // {
  //   //   id: '4',
  //   //   type: 'transport',
  //   //   title: 'Bus Access',
  //   //   time: 'Yesterday, 07:10 AM',
  //   //   icon: 'bus-outline',
  //   // },
  //   // {
  //   //   id: '5',
  //   //   type: 'printing',
  //   //   title: 'Printing',
  //   //   time: 'Yesterday, 09:02 AM',
  //   //   icon: 'print-outline',
  //   // },
  // ];

  const [activities, setActivities] = useState([]);
  const {fetchActivities} = useConn();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() =>{
    const loadActivities = async () =>{
      try {
        const response = await fetchActivities();
        setActivities(response);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    loadActivities();
  },[]);


  const onRefresh = async () =>{
    try {
      setRefreshing(true);
      const response = await fetchActivities();
      setActivities(response);
    } catch (error) {
      console.error("Activities refresh failed:", error);
    }finally{
      setRefreshing(false);
    }
  }

  // ============================================================
  // ICON
  // ============================================================

  const getActivityIcon = (activity) => {
    return activity.icon;
  };

  // ============================================================
  // ACTIVITY CARD
  // ============================================================

  const ActivityCard = ({ activity }) => {
    return (
      <TouchableOpacity
        style={styles.activityCard}
        activeOpacity={0.75}
      >
        {/* ICON */}
        <View style={styles.iconWrapper}>
          <Ionicons
            name={getActivityIcon(activity)}
            size={27}
            color={colors.textPrimary}
          />
        </View>

        {/* ACTIVITY INFORMATION */}
        <View style={styles.activityInfo}>
          <Text
            style={styles.activityTitle}
            numberOfLines={1}
          >
            {activity.title}
          </Text>

          {activity.amount && (
            <Text style={styles.activityAmount}>
              {activity.amount}
            </Text>
          )}

          <Text style={styles.activityTime}>
            {activity.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ============================================================
  // EMPTY STATE
  // ============================================================

  const EmptyActivityState = () => {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconWrapper}>
          <Ionicons
            name="time-outline"
            size={30}
            color={colors.textSecondary}
          />
        </View>

        <Text style={styles.emptyTitle}>
          No recent activities
        </Text>

        <Text style={styles.emptyDescription}>
          Your recent campus activity will appear here.
        </Text>
      </View>
    );
  };

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <View style={styles.screen}>

      {/* HEADER */}

      <ScreenHeader
        title="Recent Activity"
        onBackPress={() => router.back()}
      />

      {/* CONTENT */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              />
        }
      >

        {/* ACTIVITY LIST / EMPTY STATE */}

        {activities.length > 0 ? (
          <View style={styles.activityList}>
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </View>
        ) : (
          <EmptyActivityState />
        )}

        {/* VIEW ALL */}

        {activities.length > 0 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            activeOpacity={0.75}
            // onPress={() => {
            //   router.push('/activityAll');
            // }}
          >
            <Text style={styles.viewAllText}>
              View All
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },

  activityList: {
    gap: spacing.md,
  },

  activityCard: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadow.subtle,
  },

  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  activityInfo: {
    flex: 1,
    minWidth: 0,
  },

  activityTitle: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  activityAmount: {
    ...typography.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 3,
  },

  activityTime: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
  },

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  emptyState: {
    flex: 1,
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  emptyIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadow.subtle,
  },

  emptyTitle: {
    ...typography.bodyMedium,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  emptyDescription: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  // ==========================================================
  // VIEW ALL
  // ==========================================================

  viewAllButton: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    ...shadow.subtle,
  },

  viewAllText: {
    ...typography.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default ActivityScreen;

