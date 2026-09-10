import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { router, useLocalSearchParams } from "expo-router";

// import { socket } from "../services/socket";
import { socket } from "../services/socket"

import {
  colors,
  typography,
  radii,
  spacing,
  shadow,
} from "../styles/theme";


const ConfirmationScreen = () => {

  const { invoice_id } = useLocalSearchParams();

  const [status, setStatus] = useState("waiting");

  const [receiptNumber, setReceiptNumber] = useState(null);

  const [resultCode, setResultCode] = useState(null);

//   const SOCKET_URL = "http://192.168.100.X:5000";

  useEffect(() => {

    if (!invoice_id) {
      console.log("❌ No invoice ID received");
      setStatus("failed");
      return;
    }


    console.log("🔌 Connecting payment socket...");
    console.log("🧾 Invoice ID:", invoice_id);


    // Make sure socket is connected
    if (!socket.connected) {
      socket.connect();
    }


    // Join the payment room
    socket.emit("join_payment_room", {
      room: invoice_id,
    });


    console.log("🏠 Joined payment room:", invoice_id);


    // Listen for backend payment callback
    const handlePaymentStatus = (data) => {

      console.log("📡 Payment status received:", data);


      if (data.status === "success") {

        setReceiptNumber(
          data.MpesaReceiptNumber
        );

        setStatus("success");

      }


      else if (data.status === "failed") {

        setResultCode(
          data.ResultCode
        );

        setStatus("failed");

      }

    };


    socket.on(
      "callback:status",
      handlePaymentStatus
    );


    // Cleanup when screen unmounts
    return () => {

      console.log(
        "🧹 Removing payment socket listener"
      );

      socket.off(
        "callback:status",
        handlePaymentStatus
      );

    };

  }, [invoice_id]);


  const handleDone = () => {

    router.replace("/wallet");

  };


  // --------------------------------
  // WAITING
  // --------------------------------

  if (status === "waiting") {

    return (

      <View style={styles.container}>

        <View style={styles.iconCircle}>

          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

        </View>


        <Text style={styles.title}>
          Waiting for payment
        </Text>


        <Text style={styles.description}>
          Check your phone and complete the
          M-Pesa payment request.
        </Text>


        <View style={styles.invoiceBox}>

          <Text style={styles.invoiceLabel}>
            Payment Reference
          </Text>

          <Text style={styles.invoice}>
            {invoice_id}
          </Text>

        </View>

      </View>

    );

  }


  // --------------------------------
  // SUCCESS
  // --------------------------------

  if (status === "success") {

    return (

      <View style={styles.container}>

        <View
          style={[
            styles.iconCircle,
            styles.successCircle,
          ]}
        >

          <Ionicons
            name="checkmark"
            size={50}
            color={colors.success}
          />

        </View>


        <Text style={styles.title}>
          Payment Successful
        </Text>


        <Text style={styles.description}>
          Your M-Pesa payment has been
          received successfully.
        </Text>


        {receiptNumber && (

          <View style={styles.receiptBox}>

            <Text style={styles.receiptLabel}>
              M-Pesa Receipt
            </Text>

            <Text style={styles.receiptNumber}>
              {receiptNumber}
            </Text>

          </View>

        )}


        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleDone}
        >

          <Text style={styles.primaryButtonText}>
            Done
          </Text>

        </TouchableOpacity>

      </View>

    );

  }


  // --------------------------------
  // FAILED
  // --------------------------------

  return (

    <View style={styles.container}>

      <View
        style={[
          styles.iconCircle,
          styles.failedCircle,
        ]}
      >

        <Ionicons
          name="close"
          size={50}
          color="#E74C3C"
        />

      </View>


      <Text style={styles.title}>
        Payment Failed
      </Text>


      <Text style={styles.description}>
        We couldn't complete your M-Pesa
        payment.
      </Text>


      {resultCode !== null && (

        <View style={styles.receiptBox}>

          <Text style={styles.receiptLabel}>
            Result Code
          </Text>

          <Text style={styles.receiptNumber}>
            {resultCode}
          </Text>

        </View>

      )}


      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.85}
        onPress={handleDone}
      >

        <Text style={styles.primaryButtonText}>
          Back to Wallet
        </Text>

      </TouchableOpacity>

    </View>

  );
};


const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: colors.background,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: spacing.xl,

  },


  iconCircle: {

    width: 90,

    height: 90,

    borderRadius: 45,

    backgroundColor: colors.card,

    borderWidth: 1,

    borderColor: colors.border,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: spacing.xl,

    ...shadow.subtle,

  },


  successCircle: {

    backgroundColor: colors.background,

  },


  failedCircle: {

    backgroundColor: colors.background,

  },


  title: {

    ...typography.largeTitle,

    fontSize: 28,

    textAlign: "center",

  },


  description: {

    ...typography.body,

    color: colors.textSecondary,

    textAlign: "center",

    marginTop: spacing.md,

    lineHeight: 24,

    maxWidth: 320,

  },


  invoiceBox: {

    width: "100%",

    backgroundColor: colors.card,

    borderWidth: 1,

    borderColor: colors.border,

    borderRadius: radii.lg,

    padding: spacing.lg,

    marginTop: spacing.xl,

    alignItems: "center",

  },


  invoiceLabel: {

    ...typography.caption,

    color: colors.textSecondary,

  },


  invoice: {

    ...typography.bodyMedium,

    marginTop: spacing.sm,

  },


  receiptBox: {

    width: "100%",

    backgroundColor: colors.card,

    borderWidth: 1,

    borderColor: colors.border,

    borderRadius: radii.lg,

    padding: spacing.lg,

    marginTop: spacing.xl,

    alignItems: "center",

  },


  receiptLabel: {

    ...typography.caption,

    color: colors.textSecondary,

  },


  receiptNumber: {

    ...typography.bodyMedium,

    fontSize: 18,

    marginTop: spacing.sm,

  },


  primaryButton: {

    width: "100%",

    backgroundColor: colors.primary,

    borderRadius: radii.pill,

    paddingVertical: spacing.md,

    alignItems: "center",

    marginTop: spacing.xl,

  },


  primaryButtonText: {

    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "600",

  },

});


export default ConfirmationScreen;