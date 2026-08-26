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


const AddFunds = () => {

  return (
    <View style={styles.screen}>

      <ScreenHeader
        title="Add Funds"
        onBackPress={() => router.back()}
      />


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >


        {/* Current Balance */}

        <View style={styles.card}>

          <Text style={styles.label}>
            Current Balance
          </Text>

          <Text style={styles.balance}>
            KSh 1,250.00
          </Text>

        </View>



        {/* Amount Input */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Enter Amount
          </Text>


          <View style={styles.inputContainer}>

            <TextInput
              placeholder="KSh 500"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              style={styles.input}
            />

          </View>


        </View>



        {/* Payment Methods */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Payment Method
          </Text>



          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.paymentCard}
          >

            <View style={styles.iconBox}>
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color={colors.primary}
              />
            </View>


            <View>
              <Text style={styles.paymentTitle}>
                M-Pesa
              </Text>

              <Text style={styles.paymentDescription}>
                Safaricom Mobile Money
              </Text>
            </View>


          </TouchableOpacity>




          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.paymentCard}
          >

            <View style={styles.iconBox}>
              <Ionicons
                name="card-outline"
                size={24}
                color={colors.primary}
              />
            </View>


            <View>
              <Text style={styles.paymentTitle}>
                Card
              </Text>

              <Text style={styles.paymentDescription}>
                Debit or Credit Card
              </Text>
            </View>


          </TouchableOpacity>


        </View>




        {/* Continue Button */}

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.primaryButton}
        >

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


  label:{
    ...typography.captionLarge,
    color:colors.textSecondary,
  },


  balance:{
    ...typography.largeTitle,
    fontSize:32,
    marginTop:spacing.sm,
  },


  sectionTitle:{
    ...typography.sectionTitle,
  },


  inputContainer:{
    marginTop:spacing.md,
    borderWidth:1,
    borderColor:colors.border,
    borderRadius:radii.md,
    paddingHorizontal:spacing.md,
  },


  input:{
    height:55,
    color:colors.textPrimary,
    fontSize:18,
  },


  paymentCard:{
    flexDirection:"row",
    alignItems:"center",
    borderWidth:1,
    borderColor:colors.border,
    borderRadius:radii.md,
    padding:spacing.md,
    marginTop:spacing.md,
  },


  iconBox:{
    width:45,
    height:45,
    borderRadius:22,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:colors.background,
    marginRight:spacing.md,
  },


  paymentTitle:{
    ...typography.bodyMedium,
  },


  paymentDescription:{
    ...typography.caption,
    marginTop:3,
  },


  primaryButton:{
    backgroundColor:colors.primary,
    borderRadius:radii.pill,
    paddingVertical:spacing.md,
    alignItems:"center",
    marginTop:spacing.xl,
  },


  primaryButtonText:{
    color:"#FFFFFF",
    fontSize:16,
    fontWeight:"600",
  },


});


export default AddFunds;