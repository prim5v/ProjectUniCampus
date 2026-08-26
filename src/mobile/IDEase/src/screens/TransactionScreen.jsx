import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";

import ScreenHeader from "../components/ScreenHeader";
import { colors, typography, radii, spacing, shadow } from "../styles/theme";


const TransactionScreen = () => {


  const transactions = [
    {
      icon: "restaurant-outline",
      title: "Cafeteria Payment",
      date: "Today, 12:45 PM",
      amount: "KSh 120.00",
      type: "Outgoing",
    },
    {
      icon: "bus-outline",
      title: "Transport Payment",
      date: "Today, 08:10 AM",
      amount: "KSh 50.00",
      type: "Outgoing",
    },
    {
      icon: "add-circle-outline",
      title: "Wallet Top-up",
      date: "Yesterday, 09:15 AM",
      amount: "KSh 500.00",
      type: "Incoming",
    },
    {
      icon: "book-outline",
      title: "Library Fine",
      date: "Yesterday, 04:30 PM",
      amount: "KSh 30.00",
      type: "Outgoing",
    },
  ];



  return (

    <View style={styles.screen}>


      <ScreenHeader
        title="Transactions"
        onBackPress={() => router.back()}
      />


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >



        {/* Summary */}


        <View style={styles.summaryCard}>


          <Text style={styles.summaryLabel}>
            Total Transactions
          </Text>


          <Text style={styles.summaryAmount}>
            23
          </Text>


          <Text style={styles.summaryDescription}>
            Wallet activity history
          </Text>


        </View>





        {/* Filters */}


        <View style={styles.filters}>


          <TouchableOpacity style={styles.activeFilter}>
            <Text style={styles.activeFilterText}>
              All
            </Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>
              Incoming
            </Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>
              Outgoing
            </Text>
          </TouchableOpacity>


        </View>






        {/* Transactions */}


        <View style={styles.card}>


          {
            transactions.map((transaction,index)=>(


              <View
                key={index}
                style={[
                  styles.transactionRow,
                  index !== transactions.length -1 && styles.border
                ]}
              >


                <View style={styles.iconBox}>

                  <Ionicons
                    name={transaction.icon}
                    size={22}
                    color={colors.primary}
                  />

                </View>





                <View style={styles.transactionInfo}>


                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>


                  <Text style={styles.transactionDate}>
                    {transaction.date}
                  </Text>


                </View>





                <View style={styles.amountContainer}>


                  <Text
                    style={[
                      styles.amount,
                      transaction.type === "Incoming"
                      ? styles.income
                      : styles.expense
                    ]}
                  >
                    {transaction.type === "Incoming" ? "+" : "-"}
                    {transaction.amount}
                  </Text>


                  <Text style={styles.status}>
                    Completed
                  </Text>


                </View>



              </View>


            ))
          }


        </View>




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


summaryCard:{
  backgroundColor:colors.card,
  borderRadius:radii.lg,
  borderWidth:1,
  borderColor:colors.border,
  padding:spacing.xl,
  marginTop:spacing.lg,
  ...shadow.soft,
},


summaryLabel:{
  ...typography.captionLarge,
},


summaryAmount:{
  ...typography.largeTitle,
  fontSize:34,
  marginTop:spacing.sm,
},


summaryDescription:{
  ...typography.caption,
  marginTop:4,
},


filters:{
  flexDirection:"row",
  marginTop:spacing.lg,
},


filter:{
  borderWidth:1,
  borderColor:colors.border,
  borderRadius:radii.pill,
  paddingHorizontal:spacing.lg,
  paddingVertical:spacing.sm,
  marginRight:spacing.sm,
},


activeFilter:{
  backgroundColor:colors.primary,
  borderRadius:radii.pill,
  paddingHorizontal:spacing.lg,
  paddingVertical:spacing.sm,
  marginRight:spacing.sm,
},


filterText:{
  color:colors.textPrimary,
},


activeFilterText:{
  color:"#FFFFFF",
},


card:{
  backgroundColor:colors.card,
  borderRadius:radii.lg,
  borderWidth:1,
  borderColor:colors.border,
  marginTop:spacing.lg,
  paddingHorizontal:spacing.xl,
  ...shadow.subtle,
},


transactionRow:{
  flexDirection:"row",
  alignItems:"center",
  paddingVertical:spacing.lg,
},


border:{
  borderBottomWidth:1,
  borderBottomColor:colors.border,
},


iconBox:{
  width:45,
  height:45,
  borderRadius:22,
  backgroundColor:colors.background,
  alignItems:"center",
  justifyContent:"center",
},


transactionInfo:{
  flex:1,
  marginLeft:spacing.md,
},


transactionTitle:{
  ...typography.bodyMedium,
},


transactionDate:{
  ...typography.caption,
  marginTop:4,
},


amountContainer:{
  alignItems:"flex-end",
},


amount:{
  fontWeight:"600",
},


income:{
  color:"green",
},


expense:{
  color:colors.textPrimary,
},


status:{
  ...typography.caption,
  marginTop:3,
},


});


export default TransactionScreen;