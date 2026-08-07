import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../styles/theme';

const ScreenHeader = ({
  title,
  rightIcon,
  onBackPress,
  onSettingsPress,
  onLogoutPress,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSettingsPress = () => {
    setMenuVisible(false);
    onSettingsPress?.();
  };

  const handleLogoutPress = () => {
    setMenuVisible(false);
    onLogoutPress?.();
  };

  return (
    <View style={styles.wrapper}>

      {/* HEADER */}
      <View style={styles.container}>

        {/* BACK */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBackPress}
          activeOpacity={0.6}
          hitSlop={{
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
          }}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {/* TITLE */}
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* RIGHT ACTION */}
        {rightIcon ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setMenuVisible(prev => !prev)}
            activeOpacity={0.6}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Ionicons
              name={rightIcon}
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

      </View>

      {/* DROPDOWN */}
      {menuVisible && (
        <>
          {/* PRESSING OUTSIDE CLOSES MENU */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setMenuVisible(false)}
          />

          <View style={styles.dropdown}>

            {/* SETTINGS */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.65}
              onPress={handleSettingsPress}
            >
              <Ionicons
                name="settings-outline"
                size={19}
                color={colors.textPrimary}
                style={styles.menuIcon}
              />

              <Text style={styles.menuText}>
                Settings
              </Text>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.65}
              onPress={handleLogoutPress}
            >
              <Ionicons
                name="log-out-outline"
                size={19}
                color="#D32F2F"
                style={styles.menuIcon}
              />

              <Text
                style={[
                  styles.menuText,
                  styles.dangerText,
                ]}
              >
                Logoutt
              </Text>
            </TouchableOpacity>

          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 100,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  iconButton: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...typography.screenTitle,
    flex: 1,
    textAlign: 'center',
  },

  backdrop: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: -1000,

    zIndex: 10,
  },

  dropdown: {
    position: 'absolute',

    top: 52,
    right: spacing.lg,

    minWidth: 180,

    backgroundColor: '#FFFFFF',

    borderRadius: 12,

    paddingVertical: 6,

    zIndex: 20,

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingVertical: 13,
  },

  menuIcon: {
    marginRight: 12,
  },

  menuText: {
    ...typography.body,
    color: colors.textPrimary,
  },

  dangerText: {
    color: '#D32F2F',
  },
});

export default ScreenHeader;