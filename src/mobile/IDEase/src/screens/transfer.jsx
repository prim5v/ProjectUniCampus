import React from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";

import ScreenHeader from "../components/ScreenHeader";
import { colors, typography, radii, spacing, shadow } from "../styles/theme";


const Transfer = () => {

  return (
    <View style={styles.screen}>


      <ScreenHeader
        title="Transfer"
        onBackPress={() => router.back()}
      />



      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >



        {/* Recipient */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Recipient
          </Text>


          <View style={styles.inputContainer}>

            <Ionicons
              name="person-outline"
              size={20}
              color={colors.textSecondary}
            />


            <TextInput
              placeholder="Search student"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
            />

          </View>


        </View>




        {/* Amount */}

        <View style={styles.card}>


          <Text style={styles.sectionTitle}>
            Amount
          </Text>


          <View style={styles.inputContainer}>


            <TextInput
              placeholder="KSh 200"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              style={styles.input}
            />


          </View>


        </View>






        {/* Note */}

        <View style={styles.card}>


          <Text style={styles.sectionTitle}>
            Message (Optional)
          </Text>


          <View style={styles.noteContainer}>


            <TextInput
              placeholder="Add a note"
              placeholderTextColor={colors.textSecondary}
              multiline
              style={styles.noteInput}
            />


          </View>


        </View>






        {/* Transfer Summary */}

        <View style={styles.card}>


          <Text style={styles.sectionTitle}>
            Transfer Summary
          </Text>



          <View style={styles.summaryRow}>


            <Text style={styles.summaryLabel}>
              Recipient
            </Text>


            <Text style={styles.summaryValue}>
              John Doe
            </Text>


          </View>





          <View style={styles.divider}/>




          <View style={styles.summaryRow}>


            <Text style={styles.summaryLabel}>
              Amount
            </Text>


            <Text style={styles.summaryValue}>
              KSh 200.00
            </Text>


          </View>




        </View>






        {/* Continue */}

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.primaryButton}
        >

          <Ionicons
            name="send-outline"
            size={18}
            color="#FFFFFF"
          />


          <Text style={styles.primaryButtonText}>
            Continue
          </Text>


        </TouchableOpacity>



      </ScrollView>



    </View>
  );
};





const styles = StyleSheet.create({


  screen:{
    flex:1,
    backgroundColor:colors.background,
    paddingTop:50,
  },


  container:{
    paddingHorizontal:spacing.lg,
    paddingBottom:spacing.xxxl,
  },



  card:{
    backgroundColor:colors.card,
    borderRadius:radii.lg,
    borderWidth:1,
    borderColor:colors.border,
    padding:spacing.xl,
    marginTop:spacing.lg,
    ...shadow.subtle,
  },



  sectionTitle:{
    ...typography.sectionTitle,
  },



  inputContainer:{
    marginTop:spacing.md,
    height:55,
    flexDirection:"row",
    alignItems:"center",
    borderWidth:1,
    borderColor:colors.border,
    borderRadius:radii.md,
    paddingHorizontal:spacing.md,
  },



  input:{
    flex:1,
    marginLeft:spacing.sm,
    color:colors.textPrimary,
    fontSize:16,
  },



  noteContainer:{
    marginTop:spacing.md,
    minHeight:100,
    borderWidth:1,
    borderColor:colors.border,
    borderRadius:radii.md,
    padding:spacing.md,
  },


  noteInput:{
    color:colors.textPrimary,
    fontSize:16,
    textAlignVertical:"top",
  },



  summaryRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:spacing.lg,
  },



  summaryLabel:{
    ...typography.body,
    color:colors.textSecondary,
  },



  summaryValue:{
    ...typography.bodyMedium,
  },



  divider:{
    height:1,
    backgroundColor:colors.border,
    marginTop:spacing.lg,
  },



  primaryButton:{
    marginTop:spacing.xl,
    backgroundColor:colors.primary,
    borderRadius:radii.pill,
    paddingVertical:spacing.md,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },



  primaryButtonText:{
    color:"#FFFFFF",
    fontSize:16,
    fontWeight:"600",
    marginLeft:spacing.sm,
  },


});



export default Transfer;