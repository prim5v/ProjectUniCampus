// import "@/lib/sentry";
import * as WebBrowser from "expo-web-browser";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

import { ApiProvider } from "@/contexts/ApiContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BiometricProvider } from "../contexts/BiometricContext";
import { ConnProvider } from "../contexts/ConnContext";

// WebBrowser.maybeCompleteAuthSession();

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// if (!publishableKey) {
//   throw new Error("Add your Clerk Publishable Key to the .env file");
// }

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // small delay ensures router + native + clerk boot correctly
    const t = setTimeout(() => {
      setReady(true);
    }, 50);

    return () => clearTimeout(t);
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
          
          {/* <SafeAreaView> */}
          <Slot />
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