import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

import ScreenHeader from '../components/ScreenHeader';
import { colors, typography, radii, spacing, shadow } from '../styles/theme';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const student = user?.user;

  // --------------------------------------------------
  // USER DATA
  // --------------------------------------------------

  const name = student?.name || 'Unknown Student';

  const admissionNumber =
    student?.admission_number || 'Not Available';

  const faculty =
    student?.faculty || 'Not Available';

  const programme =
    student?.course || 'Not Available';

  const year =
    student?.year || 'Not Available';

  const email =
    student?.email || 'Not Available';

  const imageUrl =
    student?.image_url || null;

  // --------------------------------------------------
  // ACTIONS
  // --------------------------------------------------

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleFacultyPress = () => {
    Alert.alert(
      'Faculty',
      'Faculty editing will be available here.'
    );
  };

  const handleProgrammePress = () => {
    Alert.alert(
      'Programme',
      'Programme editing will be available here.'
    );
  };

  const handleYearPress = () => {
    Alert.alert(
      'Year',
      'Year editing will be available here.'
    );
  };

  const handleEmailPress = () => {
    Alert.alert(
      'Email',
      'Email editing will be available here.'
    );
  };

  // --------------------------------------------------
  // PROFILE ROW
  // --------------------------------------------------

  const ProfileRow = ({
    label,
    value,
    onPress,
  }) => {
    return (
      <TouchableOpacity
        style={styles.profileRow}
        activeOpacity={0.65}
        onPress={onPress}
      >
        <View style={styles.profileRowContent}>
          <Text style={styles.rowLabel}>
            {label}
          </Text>

          <Text
            style={[
              styles.rowValue,
              value === 'Not Available' &&
                styles.unavailableValue,
            ]}
            numberOfLines={1}
          >
            {value}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>

      {/* ==================================================
          HEADER
          ================================================== */}

      <ScreenHeader
        title="Profile Details"
        rightIcon="ellipsis-horizontal"
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ==================================================
            PROFILE IDENTITY
            ================================================== */}

        <View style={styles.identitySection}>

          <View style={styles.profileImageWrapper}>

            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person-outline"
                size={42}
                color={colors.textSecondary}
              />
            )}

          </View>

          <Text
            style={styles.studentName}
            numberOfLines={1}
          >
            {name}
          </Text>

          <Text style={styles.admissionNumber}>
            {admissionNumber}
          </Text>

        </View>


        {/* ==================================================
            PROFILE INFORMATION
            ================================================== */}

        <View style={styles.detailsContainer}>

          <ProfileRow
            label="Faculty"
            value={faculty}
            onPress={handleFacultyPress}
          />

          <View style={styles.divider} />

          <ProfileRow
            label="Programme"
            value={programme}
            onPress={handleProgrammePress}
          />

          <View style={styles.divider} />

          <ProfileRow
            label="Year"
            value={year}
            onPress={handleYearPress}
          />

          <View style={styles.divider} />

          <ProfileRow
            label="Email"
            value={email}
            onPress={handleEmailPress}
          />

        </View>


        {/* ==================================================
            EDIT PROFILE
            ================================================== */}

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.75}
        //   onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },


  // --------------------------------------------------
  // IDENTITY
  // --------------------------------------------------

  identitySection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  profileImageWrapper: {
    width: 82,
    height: 82,
    borderRadius: 41,

    backgroundColor: colors.card,

    borderWidth: 1.2,
    borderColor: colors.textPrimary,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    ...shadow.subtle,
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  studentName: {
    ...typography.largeTitle,

    fontSize: 17,
    fontWeight: '600',

    color: colors.textPrimary,

    marginTop: spacing.md,

    textAlign: 'center',
  },

  admissionNumber: {
    ...typography.captionLarge,

    fontSize: 13,

    color: colors.textSecondary,

    marginTop: 3,

    textAlign: 'center',
  },


  // --------------------------------------------------
  // DETAILS
  // --------------------------------------------------

  detailsContainer: {
    backgroundColor: colors.card,

    borderRadius: radii.lg,

    borderWidth: 1,
    borderColor: colors.border,

    overflow: 'hidden',

    ...shadow.subtle,
  },

  profileRow: {
    minHeight: 68,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },

  profileRowContent: {
    flex: 1,

    minWidth: 0,
  },

  rowLabel: {
    ...typography.caption,

    fontSize: 12,

    color: colors.textPrimary,

    marginBottom: 3,
  },

  rowValue: {
    ...typography.body,

    fontSize: 13,

    color: colors.textPrimary,

    paddingRight: spacing.md,
  },

  unavailableValue: {
    color: colors.textSecondary,
  },

  divider: {
    height: 1,

    backgroundColor: colors.border,

    marginLeft: spacing.lg,
    marginRight: spacing.lg,
  },


  // --------------------------------------------------
  // EDIT BUTTON
  // --------------------------------------------------

  editButton: {
    height: 44,

    borderRadius: 22,

    borderWidth: 1,

    borderColor: colors.textPrimary,

    backgroundColor: colors.card,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: spacing.xl,

    ...shadow.subtle,
  },

  editButtonText: {
    ...typography.bodyMedium,

    fontSize: 13,

    color: colors.textPrimary,

    fontWeight: '600',
  },

});

export default Profile;