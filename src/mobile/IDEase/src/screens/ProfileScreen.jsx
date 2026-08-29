import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';

import ScreenHeader from '../components/ScreenHeader';
import FeatureCard from '../components/FeatureCard';
import { colors, typography, radii, spacing, shadow } from '../styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import { router } from "expo-router";
import StudentIDCard from '../components/StudentIDCard';
/**
 * ProfileScreen
 * UI only — no navigation, no state, no NFC logic.
 * Bottom navigation bar intentionally omitted (handled elsewhere).
 */
const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [showIDPreview, setShowIDPreview] = React.useState(false);
  const features = [
    { icon: 'person-outline',
      label: 'Personal Info',
      available: false,
    },
    { icon: 'call-outline',
      label: 'Contact',
      available: false,
    },
    { icon: 'school-outline', 
      label: 'Programme',
      available: false,
    },
    { icon: 'card-outline',
      label: 'Payments',
      available: true,
      route: "/wallet",
    },
    { icon: 'key-outline', 
      label: 'Access',
      available: false,
    },
    { icon: 'checkmark-done-outline', 
      label: 'Attendance',
      available: false,
    },
    { icon: 'book-outline', 
      label: 'Library',
      available: false,
    },
    { icon: 'bed-outline', 
      label: 'Hostels',
      available: false,
    },
    { icon: 'bus-outline', 
      label: 'Transport',
      available: false,
    },
  ];

  const copyAdmissionNumber = async () => {
  if (!user?.user?.admission_number) {
    return;
  }

  await Clipboard.setStringAsync(user.user.admission_number);

  console.log('[Profile] Admission number copied.');
};

const handleFeaturePress = (feature) => {
  if (feature.available) {
    router.push(feature.route);
  } else {
    alert(`${feature.label} feature is coming soon `);
  }
};

const handleLogout = async () => {
  try {
    await logout();
    // router.replace("/(auth)");
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

  return (
    <View style={styles.screen}>
      {/* <ScreenHeader title="My Profile" rightIcon="settings-outline" /> */}
      <ScreenHeader
      title="My ID"
      rightIcon="settings-outline"
      onBackPress={() => router.back()}
      onSettingsPress={() => router.push('/settings')}
      onLogoutPress={handleLogout}
    />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Student ID Card */}
        {/* <View style={styles.idCard}> */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowIDPreview(true)}
        >
          <View style={styles.idCard}>
            <View style={styles.idCardTopRow}>
            {/* <View style={styles.avatar}>
              <Ionicons name="person" size={50} color={colors.textSecondary} />
            </View> */}
            <View style={styles.avatar}>
            {user?.user?.image_url ? (
              <Image
                source={{ uri: user.user.image_url }}
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

            <View style={styles.idCardInfo}>
              <Text style={styles.studentName}>{user?.user?.name || 'Unknown'}</Text>

              <View style={styles.admissionRow}>
                <Text style={styles.programmeText}>{user?.user?.admission_number || 'Nulll'}</Text>
                <TouchableOpacity
                  onPress={copyAdmissionNumber}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name="copy-outline"
                    size={15}
                    color={colors.textSecondary}
                    style={styles.copyIcon}
                  />
                </TouchableOpacity>
                
              </View>
              {/* add here */}
              <Text style={styles.admissionNumber}> {user?.user?.course || 'Not Available'}</Text>
              <Text style={styles.yearText}>{user?.user?.year || ''}</Text>

              <View style={styles.idCardDivider} />

              <Text style={styles.universityText}>{user?.user?.university_name || 'Not Available'}</Text>
              
            </View>

            {/* divider here */}

            <View style={styles.nfcBadge}>
              <Ionicons
                name="wifi"
                size={28}
                color={colors.primary}
                style={styles.nfcBadgeIcon}
              />
              <Text style={styles.nfcBadgeText}>NFC e-ID{'\n'}Active</Text>
            </View>
          </View>

          {/* <View style={styles.idCardDivider} /> */}

          <View style={styles.idCardDetails}>
            {/* <Text style={styles.programmeText}>BSc. Computer Science</Text> */}
            {/* <Text style={styles.yearText}>3rd Year</Text> */}
          </View>
          {/* <Text style={styles.universityText}>Kenyatta University</Text> */}
        </View>
        </TouchableOpacity>

        {/* NFC Status Card */}
        <TouchableOpacity style={styles.nfcStatusCard} activeOpacity={0.7}
          onPress={() => router.push("/nfc-eid")}
        >
          <View style={styles.nfcStatusIconWrapper}>
            <MaterialCommunityIcons
              name="wifi"
              size={20}
              color={colors.primary}
            />
          </View>

          <View style={styles.nfcStatusTextGroup}>
            <Text style={styles.nfcStatusTitle}>NFC e-ID Active</Text>
            <Text style={styles.nfcStatusSubtitle}>Tap to view or use</Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.label}
              icon={feature.icon}
              label={feature.label}
              // onPress={feature.onPress}
              onPress={() => handleFeaturePress(feature)}
            />
          ))}
        </View>


{/* ============================================================
    STUDENT WELCOME HERO
    Temporary replacement for the feature grid.
    ============================================================ */}

{/* <View style={styles.welcomeHero}>
  <View style={styles.welcomeHeroContent}>
    <Text style={styles.welcomeEyebrow}>
      Welcome back
    </Text>

    <Text style={styles.welcomeName}>
      {user?.user?.name?.split(' ')[0] || 'Student'}
    </Text>

    <Text style={styles.welcomeDescription}>
      Your campus, your identity, your experience.
    </Text>
  </View>

  <Image
    source={require('../../assets/images/student-welcome.png')}
    style={styles.welcomeHeroImage}
    resizeMode="contain"
  />
</View> */}


      </ScrollView>
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
      onPress={(e)=>e.stopPropagation()}
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

  /* Student ID Card */
  idCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    minHeight: 210,
    marginTop: spacing.md,
    ...shadow.soft,

    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // gap: 12,
  },
 idCardTopRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  // flex: 1,
  // gap: spacing.md,
},

avatar: {
  width: 120,
  height: 170,
  borderRadius: radii.lg,
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: 'center',
  justifyContent: 'center',
},

idCardInfo: {
  flex: 1,
  marginLeft: spacing.md,
  marginRight: spacing.sm,
  minWidth: 0,
},

studentName: {
    ...typography.largeTitle,
    fontSize: 15,
    marginBottom: 4,
  },
  admissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  admissionNumber: {
    ...typography.captionLarge,
    color: colors.textSecondary,
  },
  copyIcon: {
    marginLeft: spacing.xs,
  },

nfcBadge: {
  width: 60,
  alignItems: 'center',
  justifyContent: 'center',
},

nfcBadgeIcon: {
  marginBottom: 4,
  transform: [{ rotate: '90deg' }],
},

nfcBadgeText: {
  fontSize: 11,
  color: colors.primary,
  textAlign: 'center',
  lineHeight: 16,
},
  idCardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  idCardDetails: {
    marginBottom: spacing.md,
  },
  programmeText: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: 3,
    fontSize: 13,
  },
  yearText: {
    ...typography.captionLarge,
    color: colors.textSecondary,
    paddingLeft: 3,
  },
  universityText: {
    ...typography.sectionTitle,
    fontSize: 12,
  },

  /* NFC Status Card */
  nfcStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...shadow.subtle,
  },
  nfcStatusIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  nfcStatusTextGroup: {
    flex: 1,
  },
  nfcStatusTitle: {
    ...typography.bodyMedium,
    fontSize: 15,
  },
  nfcStatusSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },

  /* Feature Grid */
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    rowGap: spacing.md,
  },
  welcomeHero: {
  minHeight: 190,

  marginTop: spacing.xl,

  borderRadius: radii.lg,

  backgroundColor: colors.primaryMuted,

  overflow: 'hidden',

  flexDirection: 'row',
  alignItems: 'center',
},

welcomeHeroContent: {
  flex: 1,

  paddingLeft: spacing.lg,
  paddingVertical: spacing.xl,

  zIndex: 2,
},

welcomeEyebrow: {
  ...typography.captionLarge,

  color: colors.textSecondary,

  marginBottom: 3,
},

welcomeName: {
  ...typography.largeTitle,

  fontSize: 26,
  fontWeight: '700',

  color: colors.textPrimary,

  marginBottom: spacing.sm,
},

welcomeDescription: {
  ...typography.caption,

  color: colors.textSecondary,

  lineHeight: 18,

  maxWidth: 180,
},

welcomeHeroImage: {
  width: 170,
  height: 190,

  marginRight: -5,
},
avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: radii.lg,
},
previewBackground:{
 flex:1,
 justifyContent:'center',
 alignItems:'center',
 backgroundColor:'rgba(0,0,0,0.5)',
},

previewCard:{
 width:'90%',
 borderRadius:20,
 backgroundColor:colors.card,
 padding:20,
 ...shadow.soft,
 transform:[
   {
    scale:1.05
   }
 ]
},
previewContainer:{
  width:"92%",
  transform:[
    {
      scale:1.15
    }
  ],
},

});

export default ProfileScreen;