
import React from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  ImageBackground,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';


const {UniCampusHCE} = NativeModules;

import {
  colors,
  typography,
  radii,
  spacing,
  shadow,
} from '../styles/theme';


const StudentIDCard = ({
  user,
  expanded = false,
  nfcReady = false,
}) => {

  const student = user?.user;
  const isReady = UniCampusHCE.hasStoredCredentials();

  return (
    <View style={styles.idCardWrapper}>

    <ImageBackground
      source={require('../../assets/images/files/zetech_id.png')}
      style={[
        styles.idCard,
        expanded && styles.expandedCard,
      ]}
      imageStyle={styles.idCardBackground}
      resizeMode="stretch"
    >

      {/* ======================================
          STUDENT PHOTO AND INFORMATION
      ====================================== */}

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
              size={expanded ? 65 : 50}
              color={colors.textSecondary}
            />

          )}

        </View>


        {/* Student information */}

        <View style={styles.idCardInfo}>

          {/* Name */}

          <View style={styles.detailRow}>

            <Text style={styles.detailLabel}>
              Name:
            </Text>

            <Text
              style={styles.detailValue}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {student?.name || 'Student Name'}
            </Text>

          </View>


          {/* Faculty / Department */}

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


          {/* Course */}

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


          {/* Admission Number */}

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


          {/* Expiry */}

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


      {/* ======================================
          NFC DIGITAL SECURITY MARK
      ====================================== */}

      <View style={styles.nfcMark}>

        <Ionicons
          name="wifi"
          size={expanded ? 30 : 23}
          color={isReady ? '#55B8E8' : '#B9BBC5'}
          style={styles.nfcIcon}
        />

      </View>

    </ImageBackground>
    </View>
  );
};


// ==============================================
// STYLES
// ==============================================

const styles = StyleSheet.create({

  // ID CARD

  idCard: {
    width: '100%',
    aspectRatio: 1.586,

    minHeight: 240,

    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,

    overflow: 'hidden',
    position: 'relative',

    ...shadow.soft,
  },

  idCardWrapper:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },

  idCardBackground: {
    borderRadius: radii.lg,
  },


  // EXPANDED CARD

  expandedCard: {
    aspectRatio: 1.586,
    borderRadius: 20,
  },


  // CONTENT POSITIONING

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


  // STUDENT PHOTO

  avatar: {
    width: '32%',
    height: '100%',

    backgroundColor: '#EAEAEA',

    borderRadius: 4,

    borderWidth: 1,
    borderColor: '#252525',

    overflow: 'hidden',

    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },


  // STUDENT INFORMATION

  idCardInfo: {
    flex: 1,
    minWidth: 0,

    justifyContent: 'center',

    gap: 4,
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


  // NFC MARK

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

});

export default StudentIDCard;
