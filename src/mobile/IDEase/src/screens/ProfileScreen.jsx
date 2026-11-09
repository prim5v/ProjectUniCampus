
import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  NativeModules,
  ImageBackground,
} from 'react-native';

import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ScreenHeader from '../components/ScreenHeader';
import FeatureCard from '../components/FeatureCard';

import {
  colors,
  typography,
  radii,
  spacing,
  shadow,
} from '../styles/theme';

import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

import StudentIDCard from '../components/StudentIDCard';

const { UniCampusHCE } = NativeModules;

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const student = user?.user;

  const [showIDPreview, setShowIDPreview] = React.useState(false);
  const [nfcActive, setNfcActive] = React.useState(false);
  const [credentialsReady, setCredentialsReady] = React.useState(false);

  // Both conditions must be satisfied before showing NFC as ready.
  // const nfcReady = nfcActive && credentialsReady;
  const nfcReady = true;
  const isReady = UniCampusHCE.hasStoredCredentials();

  // --------------------------------------------------
  // FEATURES
  // --------------------------------------------------

  const features = [
    {
      icon: 'person-outline',
      label: 'Personal Info',
      available: true,
      route: '/more',
    },
    {
      icon: 'time-outline',
      label: 'Recents',
      available: true,
      route: '/activity',
    },
    {
      icon: 'card-outline',
      label: 'Payments',
      available: true,
      route: '/wallet',
    },
  ];

  // --------------------------------------------------
  // NFC STATUS
  // --------------------------------------------------

  const checkNfcStatus = async () => {
    try {
      if (!UniCampusHCE) {
        console.log('UniCampusHCE native module unavailable');

        setNfcActive(false);
        setCredentialsReady(false);
        return;
      }

      const hasHce = await UniCampusHCE.hasHce();

      if (!hasHce) {
        console.log('Device does not support HCE');

        setNfcActive(false);
        setCredentialsReady(false);
        return;
      }

      const enabled = await UniCampusHCE.isNfcEnabled();

      // This follows the synchronous API usage in your original code.
      const credentials = UniCampusHCE.hasStoredCredentials();

      setNfcActive(Boolean(enabled));
      setCredentialsReady(Boolean(credentials));

      console.log('NFC enabled:', enabled);
      console.log('Credentials ready:', credentials);

    } catch (error) {
      console.error('Failed to check NFC status:', error);

      setNfcActive(false);
      setCredentialsReady(false);
    }
  };

  React.useEffect(() => {
    checkNfcStatus();
  }, []);

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const handleFeaturePress = (feature) => {
    if (feature.available && feature.route) {
      router.push(feature.route);
    } else {
      alert(`${feature.label} feature is coming soon`);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // --------------------------------------------------
  // ID CARD
  // --------------------------------------------------

  return (
    <View style={styles.screen}>

      <ScreenHeader
        title="My ID"
        rightIcon="ellipsis-horizontal"
        onBackPress={() => router.back()}
        onLogoutPress={handleLogout}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ==========================================
            PHYSICAL ZETECH STUDENT ID
        ========================================== */}

        <TouchableOpacity
          style={styles.idCardWrapper}
          activeOpacity={0.95}
          onPress={() => setShowIDPreview(true)}
        >

          <ImageBackground
            source={require('../../assets/images/files/zetech_id.png')}
            style={styles.idCard}
            imageStyle={styles.idCardBackground}
            resizeMode="stretch"
          >

            {/* STUDENT PHOTO AND DETAILS */}

            <View style={styles.idCardContent}>

              {/* Student photograph */}

              <View style={styles.avatar}>

                {student?.image_url ? (

                  <Image
                    source={{ uri: student.image_url }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />

                ) : (

                  <Ionicons
                    name="person"
                    size={50}
                    color={colors.textSecondary}
                  />

                )}

              </View>

              {/* Student information */}

              <View style={styles.idCardInfo}>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Name:
                  </Text>
                <Text
                  // style={styles.studentName}
                  style={styles.detailValue}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {student?.name || 'Student Name'}
                </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Faculty/Dept:
                  </Text>

                  <Text
                    style={styles.detailValue}
                    numberOfLines={1}
                  >
                    {student?.faculty_department || '—'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Course:
                  </Text>

                  <Text
                    style={styles.detailValue}
                    numberOfLines={1}
                  >
                    {student?.course || '—'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Adm No:
                  </Text>

                  <Text
                    style={styles.detailValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {student?.admission_number || '—'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Expiry:
                  </Text>

                  <Text style={styles.detailValue}>
                    {student?.expiry_date || '—'}
                  </Text>
                </View>

              </View>

            </View>

            {/* ==================================
                NFC DIGITAL SECURITY MARK
            ================================== */}

            <View style={styles.nfcMark}>

              <Ionicons
                name="wifi"
                size={23}
                color={isReady ? '#55B8E8' : '#B9BBC5'}
                style={styles.nfcIcon}
              />

            </View>

          </ImageBackground>

        </TouchableOpacity>


        {/* ==========================================
            FEATURE GRID
        ========================================== */}

        <View style={styles.featureGrid}>

          {features.map((feature) => (

            <FeatureCard
              key={feature.label}
              icon={feature.icon}
              label={feature.label}
              onPress={() => handleFeaturePress(feature)}
            />

          ))}

        </View>

      </ScrollView>


      {/* ==========================================
          EXPANDED ID PREVIEW
      ========================================== */}

      <Modal
        visible={showIDPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIDPreview(false)}
      >

        <Pressable
          style={styles.previewBackground}
          onPress={() => setShowIDPreview(false)}
        >

          <BlurView
            intensity={100}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          <Pressable
            style={styles.previewContainer}
            onPress={(e) => e.stopPropagation()}
          >

            <StudentIDCard
              user={user}
              expanded={true}
            />

          </Pressable>

        </Pressable>

      </Modal>

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


  // ==========================================
  // STUDENT ID CARD
  // ==========================================

  idCard: {
    width: '100%',
    // height:240,
    aspectRatio: 1.586,

    marginTop: spacing.md,

    borderRadius: radii.lg,
    overflow: 'hidden',
    minHeight:240,  

    position: 'relative',

    ...shadow.soft,
  },

  idCardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  

  idCardBackground: {
    borderRadius: radii.lg,
  },


  // Main content positioning

  idCardContent: {
    position: 'absolute',

    top: '35%',
    bottom: '9%',

    left: '7%',
    right: '6%',

    flexDirection: 'row',
    alignItems: 'center',

    gap: spacing.md,
  },


  // Student photograph

  avatar: {
    width: '32%',
    height: '100%',

    overflow: 'hidden',

    borderRadius: 4,

    borderWidth: 1,
    borderColor: '#252525',

    backgroundColor: '#EAEAEA',

    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },


  // Student information

  idCardInfo: {
    flex: 1,
    minWidth: 0,

    justifyContent: 'center',

    gap: 4,
  },

  studentName: {
    fontSize: 11,
    fontWeight: '700',

    color: '#151515',

    marginBottom: 3,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: 10,
    fontWeight: '700',

    color: '#151515',
  },

  detailValue: {
    flex: 1,
    minWidth: 0,

    fontSize: 10,

    color: '#222222',
  },


  // NFC mark

  nfcMark: {
    position: 'absolute',

    right: '3%',
    bottom: '3%',

    width: 27,
    height: 27,

    alignItems: 'center',
    justifyContent: 'center',
  },

  nfcIcon: {
    transform: [{ rotate: '90deg' }],
  },


  // ==========================================
  // FEATURE GRID
  // ==========================================

  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginTop: spacing.xl,

    rowGap: spacing.md,
  },


  // ==========================================
  // EXPANDED ID PREVIEW
  // ==========================================

  previewBackground: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  previewContainer: {
    width: '92%',
    maxWidth: 600,
  },

});

export default ProfileScreen;
