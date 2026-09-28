// import React, { useMemo } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
// } from "react-native";

// import Ionicons from "react-native-vector-icons/Ionicons";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// import {
//   colors,
//   typography,
//   radii,
//   spacing,
//   shadow,
// } from "../styles/theme";

// /**
//  * Deterministically turns a string (e.g. admission number) into
//  * a hue offset, so the same student always gets the same gradient,
//  * but different students get visually distinct cards.
//  */
// const seedToHueOffset = (seed = "") => {
//   let hash = 0;
//   for (let i = 0; i < seed.length; i++) {
//     hash = (hash << 5) - hash + seed.charCodeAt(i);
//     hash |= 0; // keep it a 32-bit int
//   }
//   return Math.abs(hash) % 40; // small offset so it stays on-brand
// };

// const StudentIDCard = ({ user, expanded = false }) => {
//   const seed = user?.user?.admission_number || user?.user?.name || "default";
//   const hueOffset = useMemo(() => seedToHueOffset(seed), [seed]);

//   // Gradient stops built from your existing brand colors, nudged by
//   // the per-user offset. Swap these for actual hue-rotated values
//   // from your theme if you want true per-user hue shifts.
//   const gradientColors = [
//     colors.primaryMuted,
//     colors.primary,
//     colors.card,
//   ];

//   return (
//     <View
//       style={[
//         styles.idCard,
//         expanded && styles.expandedCard,
//       ]}
//     >
//       <LinearGradient
//         colors={gradientColors}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={[
//           StyleSheet.absoluteFill,
//           { borderRadius: expanded ? 30 : radii.lg },
//         ]}
//       />

//       {/* Faint repeating watermark could go here as an SVG pattern,
//           layered above the gradient and below the content below */}

//       <View style={styles.idCardTopRow}>
//         {/* Avatar */}
//         <View style={styles.avatar}>
//           {user?.user?.image_url ? (
//             <Image
//               source={{ uri: user.user.image_url }}
//               style={styles.avatarImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <Ionicons name="person" size={50} color={colors.textSecondary} />
//           )}
//         </View>

//         {/* Glass panel behind the text so it stays legible over the gradient */}
//         <BlurView intensity={40} tint="light" style={styles.infoGlass}>
//           <View style={styles.idCardInfo}>
//             <Text style={styles.studentName}>
//               {user?.user?.name || "Unknown"}
//             </Text>

//             <Text style={styles.admission}>
//               {user?.user?.admission_number || "No admission number"}
//             </Text>

//             <Text style={styles.course}>
//               {user?.user?.course || "Course unavailable"}
//             </Text>

//             <Text style={styles.year}>{user?.user?.year || ""}</Text>

//             <View style={styles.divider} />

//             <Text style={styles.university}>
//               {user?.user?.university_name || "University"}
//             </Text>
//           </View>
//         </BlurView>

//         {/* NFC badge */}
//         <View style={styles.nfcBadge}>
//           <Ionicons
//             name="wifi"
//             size={30}
//             color={colors.primary}
//             style={{ transform: [{ rotate: "90deg" }] }}
//           />
//           <Text style={styles.nfcText}>NFC{"\n"}e-ID</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   idCard: {
//     borderRadius: radii.lg,
//     borderWidth: 1,
//     borderColor: colors.border,
//     padding: spacing.xl,
//     overflow: "hidden", // clips the gradient to the card's rounded corners
//     ...shadow.soft,
//   },

//   expandedCard: {
//     padding: 25,
//     borderRadius: 30,
//   },

//   idCardTopRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//   },

//   avatar: {
//     width: 120,
//     height: 170,
//     borderRadius: radii.lg,
//     backgroundColor: colors.background,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },

//   avatarImage: {
//     width: "100%",
//     height: "100%",
//   },

//   infoGlass: {
//     flex: 1,
//     marginLeft: spacing.md,
//     borderRadius: radii.md,
//     overflow: "hidden", // required for BlurView's own radius on Android
//   },

//   idCardInfo: {
//     padding: spacing.md,
//   },

//   studentName: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: colors.textPrimary,
//     marginBottom: 6,
//   },

//   admission: {
//     fontSize: 13,
//     color: colors.textSecondary,
//   },

//   course: {
//     fontSize: 14,
//     marginTop: 8,
//     color: colors.textPrimary,
//   },

//   year: {
//     fontSize: 13,
//     color: colors.textSecondary,
//     marginTop: 3,
//   },

//   divider: {
//     height: 1,
//     backgroundColor: colors.border,
//     marginVertical: 15,
//   },

//   university: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: colors.textPrimary,
//   },

//   nfcBadge: {
//     width: 60,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   nfcText: {
//     fontSize: 11,
//     color: colors.primary,
//     textAlign: "center",
//   },
// });

// export default StudentIDCard;

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
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
    // <View
    //   style={[
    //     styles.idCard,
    //     expanded && styles.expandedCard
    //   ]}
    // >
    <ImageBackground
        source={require("../../assets/images/files/img7.png")}
        style={[
          styles.idCard,
          expanded && styles.expandedCard
        ]}
        imageStyle={styles.idCardBackground}
        resizeMode="cover"
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


    {/* </View> */}
    </ImageBackground>
  );
};


const styles = StyleSheet.create({

  // idCard:{
  //   backgroundColor: colors.card,
  //   borderRadius:radii.lg,
  //   borderWidth:1,
  //   borderColor:colors.border,
  //   padding:spacing.xl,
  //   ...shadow.soft,
  // },
  idCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    overflow: "hidden",
    ...shadow.soft,
  },

  idCardBackground: {
    borderRadius: radii.lg,
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