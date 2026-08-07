/**
 * theme.js
 * Centralized design tokens for the UniCampus app.
 * Keeping colors, spacing, radii and typography here avoids
 * duplicated magic numbers across screens/components.
 */

export const colors = {
  primary: '#0F8A5F',
  primaryMuted: '#E6F4EE', // soft tint of primary, used for icon backgrounds/badges
  background: '#F7F8FA',
  card: '#FFFFFF',
  textPrimary: '#1C1C1E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  overlay: 'rgba(28, 28, 30, 0.04)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
};

export const typography = {
  largeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  captionLarge: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
};

export const shadow = {
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
};