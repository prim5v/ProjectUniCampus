// import "@/lib/sentry";
import * as WebBrowser from "expo-web-browser";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import * as Notifications from "expo-notifications";

import { ApiProvider } from "@/contexts/ApiContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BiometricProvider } from "../contexts/BiometricContext";
import { ConnProvider } from "../contexts/ConnContext";
import { NetworkProvider } from "../contexts/NetworkContext";
import { useNotificationListeners } from "@/hooks/useNotificationListeners";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// WebBrowser.maybeCompleteAuthSession();

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// if (!publishableKey) {
//   throw new Error("Add your Clerk Publishable Key to the .env file");
// }

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useNotificationListeners();

  useEffect(() => {
    // small delay ensures router + native + clerk boot correctly
    const t = setTimeout(() => {
      setReady(true);
    }, 50);

    return () => clearTimeout(t);
  }, []);

//   useEffect(() => {
//   const subscription =
//     Notifications.addNotificationReceivedListener((notification) => {
//       console.log(
//         "🔔 NOTIFICATION RECEIVED:",
//         notification
//       );
//     });

//   return () => {
//     subscription.remove();
//   };
// }, []);

useEffect(() => {
  const subscription =
    Notifications.addNotificationReceivedListener((notification) => {
      console.log(
        "🔔 NOTIFICATION:",
        JSON.stringify(
          {
            identifier: notification.request.identifier,
            title: notification.request.content.title,
            body: notification.request.content.body,
            data: notification.request.content.data,
            sound: notification.request.content.sound,
            priority: notification.request.content.priority,
            channelId: notification.request.content.android?.channelId,
          },
          null,
          2
        )
      );
    });

  return () => subscription.remove();
}, []);


// useEffect(() => {
//   const setupNotifications = async () => {
//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         // sound: "default",
//       });
//     }
//   };

//   setupNotifications();
// }, []);


// useEffect(() => {
//   const setupNotifications = async () => {
//     if (Platform.OS !== "android") return;

//     // General notifications
//     await Notifications.setNotificationChannelAsync("general", {
//       name: "General",
//       importance: Notifications.AndroidImportance.HIGH,
//       vibrationPattern: [0, 150, 150, 150],
//     });

//     // Access notifications
//     await Notifications.setNotificationChannelAsync("access", {
//       name: "Access",
//       importance: Notifications.AndroidImportance.HIGH,
//       vibrationPattern: [0, 150, 150, 150],
//       sound: "access.wav",
//     });

//     // Payment notifications
//     await Notifications.setNotificationChannelAsync("payments", {
//       name: "Payments",
//       importance: Notifications.AndroidImportance.HIGH,
//       vibrationPattern: [0, 250, 250, 250],
//       sound: "payment.wav",
//     });
//   };

//   setupNotifications();
// }, []);


useEffect(() => {
  const setupNotifications = async () => {
    if (Platform.OS !== "android") return;

    try {
      // General notifications
      await Notifications.setNotificationChannelAsync("general", {
        name: "General",
        description: "General IDEase notifications and updates",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 150, 150],
        enableVibrate: true,
        enableLights: false,
        showBadge: true,
      });

      // Access notifications
      await Notifications.setNotificationChannelAsync("access", {
        name: "Access",
        description: "Campus access, NFC ID, and security notifications",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 150, 100, 150],
        sound: "access.wav",
        enableVibrate: true,
        enableLights: true,
        showBadge: true,
      });

      // Payment notifications
      await Notifications.setNotificationChannelAsync("payments", {
        name: "Payments",
        description: "M-Pesa and campus payment notifications",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 150, 250],
        sound: "payment.wav",
        enableVibrate: true,
        enableLights: true,
        showBadge: true,
      });

      // NOW inspect the channel AFTER creating it
      const channel =
        await Notifications.getNotificationChannelAsync("payments");

      console.log(
        "💳 PAYMENTS CHANNEL AFTER SETUP:",
        JSON.stringify(channel, null, 2)
      );
    } catch (error) {
      console.error("❌ NOTIFICATION SETUP ERROR:", error);
    }
  };

  setupNotifications();
}, []);



  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000A04" }}>
        <ActivityIndicator color="#2E7D32" />
      </View>
    );
  }

  return (
    // <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <SafeAreaProvider>
      <ApiProvider>
        <BiometricProvider>
        <AuthProvider>
          <ConnProvider>
            <NetworkProvider>
          
          {/* <SafeAreaView> */}
          <Slot />
          
          </NetworkProvider>
          {/* </SafeAreaView> */}
          </ConnProvider>
        </AuthProvider>
        </BiometricProvider>
      </ApiProvider>
      </SafeAreaProvider>
    // </ClerkProvider>
  );
}


// {/* <Stack screenOptions={{headerShown:false}} > */}
  // {/* default landing */}
  // <Stack.Screen name="(auth)/_layout.jsx" />
// </Stack>

// this is the code