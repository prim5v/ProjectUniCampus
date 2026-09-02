import React from "react";

import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

import { colors, typography, spacing } from "../styles/theme";


const LoadingSpinner = ({
  visible = true,
  message = "Loading...",
  fullscreen = false,
  size = "large",
}) => {


  if (!visible) return null;



  return (

    <View
      style={[
        styles.container,
        fullscreen && styles.fullscreen
      ]}
    >

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

  );

};


const styles = StyleSheet.create({


container: {

  flexDirection:"row",

  alignItems:"center",

  justifyContent:"center",

},



fullscreen: {

  position:"absolute",

  top:0,

  left:0,

  right:0,

  bottom:0,

  backgroundColor:"rgba(0,0,0,0.25)",

  flexDirection:"column",

  zIndex:999,

},



text: {

  ...typography.caption,

  marginTop:spacing.md,

  color:colors.textPrimary,

},



});


export default LoadingSpinner;