import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const COLORS = {
  cream: '#EEF1D5',
  darkGreen: '#315F32',
};

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      
      <View style={styles.center}>
        <Text style={styles.logo}>UniCampus</Text>

        <ActivityIndicator
          size="small"
          color={COLORS.darkGreen}
          style={styles.loader}
        />

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },

  center: {
    alignItems: 'center',
  },

  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.darkGreen,
    letterSpacing: -1,
  },

  loader: {
    marginTop: 24,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.darkGreen,
    fontWeight: '500',
  },
});