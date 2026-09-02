import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import ScreenHeader from "../components/ScreenHeader";
import { colors, typography, radii, spacing, shadow } from "../styles/theme";
import { useConn } from "../contexts/ConnContext";


const AddFunds = () => {

  const { walletData, stkpush } = useConn();


  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  const [savedPhone, setSavedPhone] = useState(null);
  const [useSavedPhone, setUseSavedPhone] = useState(true);



  useEffect(() => {
    loadPhone();
  }, []);



  const loadPhone = async () => {

    try {

      const storedPhone = await AsyncStorage.getItem("phone");

      if (storedPhone) {

        setSavedPhone(storedPhone);
        setPhone(storedPhone);

      }

    } catch(error){

      console.log("Phone loading error:", error);

    }

  };





  const handleAddFunds = async () => {


    const payload = {

      amount: amount,

      phone: phone

    };


    try {

      const result = await stkpush(payload);

      console.log(
        "STK Push result:",
        result?.data
      );


    } catch(error){


      console.error(
        "STK Push error:",
        error?.response?.data || error.message
      );


    }

  };





  return (

    <View style={styles.screen}>


      <ScreenHeader

        title="Add Funds"

        onBackPress={() => router.replace("/wallet")}

      />



      <ScrollView

        showsVerticalScrollIndicator={false}

        contentContainerStyle={styles.container}

      >



        {/* Balance */}

        <View style={styles.card}>

          <Text style={styles.label}>
            Current Balance
          </Text>


          <Text style={styles.balance}>

            {walletData?.balance || "KSh 0"}

          </Text>


        </View>







        {/* Amount */}

        <View style={styles.card}>


          <Text style={styles.sectionTitle}>
            Enter Amount
          </Text>



          <View style={styles.inputContainer}>


            <TextInput

              placeholder="KSh 500"

              placeholderTextColor={colors.textSecondary}

              keyboardType="numeric"

              value={amount}

              onChangeText={setAmount}

              style={styles.input}

            />


          </View>



        </View>







        {/* M-Pesa */}

        <View style={styles.card}>


          <View style={styles.methodHeader}>


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



          </View>





          <Text style={styles.sectionTitle}>
            Phone Number
          </Text>




          {
            savedPhone && useSavedPhone ? (


              <View>


                <TouchableOpacity

                  activeOpacity={0.8}

                  style={styles.savedPhoneBox}

                  onPress={() => setUseSavedPhone(true)}

                >


                  <Ionicons

                    name="phone-portrait-outline"

                    size={22}

                    color={colors.primary}

                  />



                  <View style={styles.savedPhoneText}>


                    <Text style={styles.paymentTitle}>

                      Using saved number

                    </Text>



                    <Text style={styles.paymentDescription}>

                      {savedPhone}

                    </Text>


                  </View>



                  <Ionicons

                    name="checkmark-circle"

                    size={22}

                    color={colors.success}

                  />



                </TouchableOpacity>





                <TouchableOpacity

                  style={styles.changeNumber}

                  onPress={() => {

                    setUseSavedPhone(false);

                    setPhone("");

                  }}

                >

                  <Text style={styles.changeNumberText}>

                    Use another number

                  </Text>

                </TouchableOpacity>



              </View>



            )

            :


            (

              <View style={styles.inputContainer}>


                <TextInput


                  placeholder="07XX XXX XXX"


                  placeholderTextColor={colors.textSecondary}


                  keyboardType="phone-pad"


                  value={phone}


                  onChangeText={setPhone}


                  style={styles.input}


                />


              </View>


            )


          }



        </View>







        {/* Continue */}


        <TouchableOpacity


          activeOpacity={0.85}


          style={styles.primaryButton}


          onPress={handleAddFunds}


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

  marginTop:spacing.md,


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





methodHeader:{


  flexDirection:"row",

  alignItems:"center",


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





savedPhoneBox:{


  flexDirection:"row",

  alignItems:"center",

  borderWidth:1,

  borderColor:colors.border,

  borderRadius:radii.md,

  padding:spacing.md,

  marginTop:spacing.md,


},





savedPhoneText:{


  flex:1,

  marginLeft:spacing.md,


},





changeNumber:{


  marginTop:spacing.md,

  alignItems:"center",


},





changeNumberText:{


  color:colors.primary,

  fontWeight:"600",


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