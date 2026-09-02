import React from "react";

import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

import { colors, typography, spacing, radii } from "../styles/theme";


const LoadingSpinner = ({
  visible = true,
  message = "Loading...",
  fullscreen = false,
  size = "large",
}) => {


  if (!visible) return null;



  return (

    <View
      pointerEvents="none"
      style={[
        styles.container,
        fullscreen && styles.fullscreen
      ]}
    >


      <View style={styles.spinnerBox}>

        <ActivityIndicator

          size={size}

          color={colors.primary}

        />


        {
          message && (

            <Text style={styles.text}>
              {message}
            </Text>

          )
        }


      </View>


    </View>

  );

};




const styles = StyleSheet.create({


container: {

  alignItems:"center",

  justifyContent:"center",

},



fullscreen: {

  position:"absolute",

  top:0,

  left:0,

  right:0,

  bottom:0,

  zIndex:999,

},



spinnerBox: {

  backgroundColor: colors.card,

  paddingHorizontal: spacing.xl,

  paddingVertical: spacing.lg,

  borderRadius: radii.lg,

  alignItems:"center",

  justifyContent:"center",

  shadowColor:"#000",

  shadowOpacity:0.15,

  shadowRadius:10,

  elevation:5,

},



text: {

  ...typography.caption,

  marginTop:spacing.md,

  color:colors.textPrimary,

},


});


export default LoadingSpinner;