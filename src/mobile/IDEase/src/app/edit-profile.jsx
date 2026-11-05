import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { router } from 'expo-router';

import ScreenHeader from '../components/ScreenHeader';
import { colors, typography, spacing } from '../styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';

const EditProfile = () => {

  const { user } = useAuth();
  const student = user?.user;
  const studentId = student?.student_id;

  const currentYear = student?.year;
  const { api } = useApi();

  const [year, setYear] = useState(
    currentYear ? String(currentYear) : ''
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const years = [1, 2, 3, 4, 5, 6];

  // UPDATE YEAR

  const handleYearUpdate = async () => {

    if (!studentId || !year) {
      Alert.alert('Error', 'Please select your year of study.');
      return;
    }

    if (year === String(currentYear)) return;

    setLoadingYear(true);

    try {

      const response = await api.post('/student/edit/profile', {
        student_id: studentId,
        year_of_study: Number(year),
      });

      if (response.data?.success) {
        Alert.alert('Success', 'Year of study updated.');
      } else {
        Alert.alert('Error', response.data?.message || 'Update failed.');
      }

    } catch (error) {

      console.error(error.response?.data || error);

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Unable to update year.'
      );

    } finally {
      setLoadingYear(false);
    }
  };

  // UPDATE PASSWORD

  const handlePasswordUpdate = async () => {

    if (!studentId) {
      Alert.alert('Error', 'Student ID unavailable.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert('Required', 'Complete both password fields.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Invalid Password', 'Use at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoadingPassword(true);

    try {

      const response = await api.post('/student/edit/profile', {
        student_id: studentId,
        new_pwd: newPassword,
      });

      if (response.data?.success) {

        setNewPassword('');
        setConfirmPassword('');

        Alert.alert('Success', 'Password updated successfully.');

      } else {

        Alert.alert('Error', response.data?.message || 'Update failed.');
      }

    } catch (error) {

      console.error(error.response?.data || error);

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Unable to update password.'
      );

    } finally {
      setLoadingPassword(false);
    }
  };

  return (

    <View style={styles.screen}>
    <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >

      <ScreenHeader
        title="Edit Profile"
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ACADEMIC INFORMATION */}

        <Text style={styles.sectionTitle}>
          Academic Information
        </Text>

        <Text style={styles.label}>
          Year of Study
        </Text>

        <View style={styles.yearContainer}>

          {years.map(item => (

            <TouchableOpacity
              key={item}
              onPress={() => setYear(String(item))}
              style={[
                styles.yearOption,
                year === String(item) && styles.selectedYear,
              ]}
            >

              <Text
                style={[
                  styles.yearText,
                  year === String(item) && styles.selectedYearText,
                ]}
              >
                {item}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleYearUpdate}
          disabled={
            loadingYear ||
            !year ||
            year === String(currentYear)
          }
        >

          {loadingYear ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}

        </TouchableOpacity>

        <View style={styles.divider} />

        {/* PASSWORD */}

        <Text style={styles.sectionTitle}>
          Change Password
        </Text>

        <Text style={styles.label}>
          New Password
        </Text>

        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>
          Confirm Password
        </Text>

        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handlePasswordUpdate}
          disabled={
            loadingPassword ||
            !newPassword ||
            !confirmPassword
          }
        >

          {loadingPassword ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}

        </TouchableOpacity>

      </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
};

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  sectionTitle: {
    ...typography.bodyMedium,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  yearContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  yearOption: {
    width: 43,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedYear: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  yearText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 14,
  },

  selectedYearText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
    backgroundColor: colors.card,
  },

  button: {
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  buttonText: {
    ...typography.bodyMedium,
    fontSize: 13,
    color: '#FFFFFF',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xxl,
  },

});

export default EditProfile;