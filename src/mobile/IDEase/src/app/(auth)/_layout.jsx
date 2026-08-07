// import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";



export default function AuthRoutesLayout() {
    const Signedin = true;
    const { isLoggedIn, authReady } = useAuth();
//   const { dbUser, authReady } = useAuthContext();
//   const { isSignedIn, isLoaded } = useAuth();



  const SignedIn = isLoggedIn && authReady;

  // if (!isLoaded || !authReady) return null; 

  if (SignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}