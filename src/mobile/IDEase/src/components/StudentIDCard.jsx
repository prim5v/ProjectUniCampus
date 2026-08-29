import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import {
  colors,
  typography,
  radii,
  spacing,
  shadow,
} from "../styles/theme";


const StudentIDCard = ({ user, expanded = false }) => {

  return (
    <View
      style={[
        styles.idCard,
        expanded && styles.expandedCard
      ]}
    >

      <View style={styles.idCardTopRow}>

        {/* Avatar */}
        <View style={styles.avatar}>

          {user?.user?.image_url ? (

            <Image
              source={{
                uri: user.user.image_url
              }}
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


        {/* Student details */}
        <View style={styles.idCardInfo}>

          <Text style={styles.studentName}>
            {user?.user?.name || "Unknown"}
          </Text>


          <Text style={styles.admission}>
            {user?.user?.admission_number || "No admission number"}
          </Text>


          <Text style={styles.course}>
            {user?.user?.course || "Course unavailable"}
          </Text>


          <Text style={styles.year}>
            {user?.user?.year || ""}
          </Text>


          <View style={styles.divider}/>


          <Text style={styles.university}>
            {user?.user?.university_name || "University"}
          </Text>


        </View>


        {/* NFC badge */}
        <View style={styles.nfcBadge}>

          <Ionicons
            name="wifi"
            size={30}
            color={colors.primary}
            style={{
              transform:[
                {
                  rotate:"90deg"
                }
              ]
            }}
          />


          <Text style={styles.nfcText}>
            NFC{"\n"}e-ID
          </Text>


        </View>


      </View>


    </View>
  );
};


const styles = StyleSheet.create({

  idCard:{
    backgroundColor: colors.card,
    borderRadius:radii.lg,
    borderWidth:1,
    borderColor:colors.border,
    padding:spacing.xl,
    ...shadow.soft,
  },


  expandedCard:{
    padding:25,
    borderRadius:30,
  },


  idCardTopRow:{
    flexDirection:"row",
    alignItems:"flex-start",
  },


  avatar:{
    width:120,
    height:170,
    borderRadius:radii.lg,
    backgroundColor:colors.background,
    justifyContent:"center",
    alignItems:"center",
    overflow:"hidden",
  },


  avatarImage:{
    width:"100%",
    height:"100%",
  },


  idCardInfo:{
    flex:1,
    marginLeft:spacing.md,
  },


  studentName:{
    fontSize:18,
    fontWeight:"700",
    color:colors.textPrimary,
    marginBottom:6,
  },


  admission:{
    fontSize:13,
    color:colors.textSecondary,
  },


  course:{
    fontSize:14,
    marginTop:8,
    color:colors.textPrimary,
  },


  year:{
    fontSize:13,
    color:colors.textSecondary,
    marginTop:3,
  },


  divider:{
    height:1,
    backgroundColor:colors.border,
    marginVertical:15,
  },


  university:{
    fontSize:13,
    fontWeight:"600",
    color:colors.textPrimary,
  },


  nfcBadge:{
    width:60,
    alignItems:"center",
    justifyContent:"center",
  },


  nfcText:{
    fontSize:11,
    color:colors.primary,
    textAlign:"center",
  },


});


export default StudentIDCard;