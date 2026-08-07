import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  // SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../../contexts/AuthContext';

// ==================================================
// COLOR SPEC — taken directly from the reference
// ==================================================
const COLORS = {
  cream: '#EEF1D5',      // upper zone background
  white: '#FFFFFF',       // login lower zone
  lightGreen: '#A9C77A',  // welcome / signup lower zone
  darkGreen: '#315F32',   // primary buttons
  inputFill: '#DCE3C0',   // input rectangles
  textDark: '#1A2314',
  textMuted: '#3A4433',
  lightGray: '#D3D3D3',
  darkGray: '#A9A9A9',
  gray: '#808080'
};

// const COLORS = {
//   background: "#F4F8F1",
//   green: "#2E8B3A",
//   lightGreen: "#A9CC7A",
//   input: "#E8F0E3",
//   text: "#142016",
//   muted: "#687268",
//   white: "#FFFFFF",
// };
export default function AuthScreen() {
  const [screen, setScreen] = useState('welcome'); // 'welcome' | 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {login} = useAuth();

  return (

<View style={styles.root}>

  <GeometricBackground
    variant={screen === 'login' ? 'white' : 'green'}
  />

  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >

      {screen === 'welcome' && (
        <WelcomeContent
          onLogin={() => setScreen('login')}
          onSignUp={() => setScreen('signup')}
        />
      )}

      {screen === 'login' && (
        <LoginContent
          onBack={() => setScreen('welcome')}
          onSignUp={() => setScreen('signup')}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((v) => !v)}
        />
      )}

      {screen === 'signup' && (
        <SignUpContent
          onBack={() => setScreen('welcome')}
          onLogin={() => setScreen('login')}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((v) => !v)}
          showConfirmPassword={showConfirmPassword}
          onToggleConfirmPassword={() =>
            setShowConfirmPassword((v) => !v)
          }
        />
      )}

    </KeyboardAvoidingView>
  </SafeAreaView>

</View>
  );
}

// ==================================================
// GEOMETRIC ARTWORK — full-bleed diagonal + circles
// ==================================================
function GeometricBackground({ variant }) {
  const lowerColor = variant === 'white' ? COLORS.white : COLORS.lightGreen;

  return (
    <View style={styles.geoContainer} pointerEvents="none">
      {/* Large rotated rectangle creates the diagonal split.
          It starts partway down the screen and is tall/wide enough
          that only its TOP edge is ever visible — the diagonal. */}
      <View
        style={[
          styles.diagonalShape,
          { backgroundColor: lowerColor },
        ]}
      />

      {/* Organic circles that bleed off the composition edges */}
      {/* <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleLowerLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} /> */}
    </View>
  );
}

// ==================================================
// HEADER — upper-left heading block, shared shape
// ==================================================
function Header({ title, subtitle, onBack }) {
  return (
    <View style={styles.headerBlock}>
      {onBack && (
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onBack}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.subheading}>{subtitle}</Text>
    </View>
  );
}

// ==================================================
// WELCOME SCREEN
// ==================================================
function WelcomeContent({ onLogin, onSignUp }) {
  return (

    <View style={styles.screenFlex}>
      <Header
        title="Welcome"
        subtitle={'Create an account or Log into your\naccount.'}
      />

      <View style={styles.spacer} />

      <View style={styles.welcomeButtonBlock}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={onLogin}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, styles.secondarySpacing]}
          activeOpacity={0.85}
          // onPress={onSignUp}
        >
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================================================
// LOGIN SCREEN
// ==================================================

function LoginContent({
  onBack,
  onSignUp,
  showPassword,
  onTogglePassword,
}) {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Clear previous error
    setErrorMessage(null);

    // Basic validation
    if (!username.trim()) {
      setErrorMessage('Please enter your username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      await login(
        username.trim(),
        password
      );

    } catch (error) {
      console.log('[Login UI] Login failed:', error);

      /*
       * Try to get the useful message from Flask/Axios.
       *
       * Expected examples:
       * {
       *   error: "Invalid username or password"
       * }
       *
       * or:
       *
       * {
       *   message: "Invalid username or password"
       * }
       */

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Unable to sign in. Please try again.';

      setErrorMessage(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenFlex}>

      <Header
        title="Login"
        subtitle="Log into your account"
        onBack={onBack}
      />

      <View style={styles.spacer} />

      <View style={styles.formBlock}>

        <Field
          label="Username"
          placeholder=""
          value={username}
          onChangeText={(text) => {
            setUsername(text);

            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
          editable={!loading}
        />

        <PasswordField
          label="Password"
          visible={showPassword}
          onToggle={onTogglePassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);

            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
          editable={!loading}
        />

        {/* ==============================
            SUBTLE LOGIN ERROR
        ============================== */}

        {errorMessage && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIndicator} />

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            loading && styles.primaryButtonDisabled,
          ]}
          activeOpacity={0.85}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPasswordWrapper}
          activeOpacity={0.7}
          onPress={() => {
            // TODO: connect forgot password flow later
          }}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>
            Forgot Password
          </Text>
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            Don't have an account?{' '}
          </Text>

          <TouchableOpacity
            // onPress={onSignUp}
            disabled={loading}
          >
            <Text style={styles.switchAction}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}


// ==================================================
// SIGN UP SCREEN — scrolls on smaller devices
// ==================================================
function SignUpContent({
  onBack,
  onLogin,
  showPassword,
  onTogglePassword,
  showConfirmPassword,
  onToggleConfirmPassword,
}) {
  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.signUpScrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Sign Up"
        subtitle="Create your account to get started"
        onBack={onBack}
      />

      <View style={styles.signUpSpacer} />

      <View style={styles.formBlock}>
        <Field label="Full Name" placeholder="" />
        <Field label="Username" placeholder="" />
        <Field label="Email" placeholder="" keyboardType="email-address" />
        <PasswordField
          label="Password"
          visible={showPassword}
          onToggle={onTogglePassword}
        />
        <PasswordField
          label="Confirm Password"
          visible={showConfirmPassword}
          onToggle={onToggleConfirmPassword}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => {
            // TODO: hook up sign up logic later
          }}
        >
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.switchAction}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ==================================================
// Reusable field components — simple rectangles,
// no borders, no floating labels, no icons
// ==================================================

function Field({
  label,
  placeholder,
  keyboardType,
  value,
  onChangeText,
  editable = true,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        returnKeyType="next"
      />
    </View>
  );
}



function PasswordField({
  label,
  visible,
  onToggle,
  value,
  onChangeText,
  editable = true,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={!visible}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          returnKeyType="done"
        />

        <TouchableOpacity
          onPress={onToggle}
          style={styles.eyeButton}
          activeOpacity={0.7}
          disabled={!editable}
        >
          <Text style={styles.eyeText}>
            {visible ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================================================
// STYLES
// ==================================================
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  screenFlex: {
    flex: 1,
    paddingHorizontal: 26,
  },

  // ---------- Geometric artwork ----------
  geoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  diagonalShape: {
    position: 'absolute',
    width: '160%',
    height: '200%',
    left: '-30%',
    top: '35%',
    transform: [{ rotate: '-7deg' }],
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: COLORS.darkGreen,
    opacity: 0.55,
  },
  circleTopRight: {
    width: 70,
    height: 70,
    top: '20%',
    right: -30,
    backgroundColor: COLORS.lightGreen,
    opacity: 0.9,
  },
  circleLowerLeft: {
    width: 110,
    height: 110,
    top: '46%',
    left: -50,
  },
  circleBottomRight: {
    width: 150,
    height: 150,
    bottom: -60,
    right: -50,
  },

  // ---------- Header ----------
  headerBlock: {
    paddingTop: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginBottom: 6,
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.textDark,
  },
  heading: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 18,
  },

  // ---------- Spacers push content to lower zone ----------
  spacer: {
    flex: 1,
  },
  signUpSpacer: {
    height: 90,
  },
  signUpScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingBottom: 40,
  },

  // ---------- Welcome buttons ----------
  welcomeButtonBlock: {
    paddingBottom: 60,
  },
  secondarySpacing: {
    marginTop: 14,
  },

  // ---------- Form ----------
  formBlock: {
    paddingBottom: 48,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  pwd:{
    backgroundColor:COLORS.gray,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.inputFill,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputFill,
    borderRadius: 8,
    paddingRight: 6,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
  },
  eyeButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  eyeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.darkGreen,
  },

  // ---------- Buttons ----------
  primaryButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },

  // ---------- Forgot password ----------
  forgotPasswordWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },
  forgotPasswordText: {
    color: COLORS.textDark,
    fontSize: 12,
  },

  // ---------- Switch row ----------
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  switchText: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  switchAction: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.darkGreen,
  },

  errorContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(139, 54, 54, 0.08)',
  borderRadius: 8,
  paddingHorizontal: 11,
  paddingVertical: 9,
  marginTop: -2,
  marginBottom: 8,
},

errorIndicator: {
  width: 4,
  height: 4,
  borderRadius: 2,
  backgroundColor: '#8B3636',
  marginRight: 8,
},

errorText: {
  flex: 1,
  fontSize: 12,
  lineHeight: 16,
  color: '#713333',
},

primaryButtonDisabled: {
  opacity: 0.55,
},
});