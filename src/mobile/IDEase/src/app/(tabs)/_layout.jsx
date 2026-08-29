import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { colors } from "../../styles/theme";
import LoadingScreen from "../../screens/LoadingScreen";
import { Image } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import BiometricScreen from "../../screens/BiometricScreen";
import { useBiometric } from "@/contexts/BiometricContext";
// import { useAuth } from '@/contexts/AuthContext';
// import { platform, StatusBar, StyleSheet } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


const TabsLayout = () =>{
    const Signedin= true;
    // const loading = true;
    const { isLoggedIn, authReady, loading, authStatus, user } = useAuth();
    const {isAuthenticated } = useBiometric();
    // const { user } = useAuth()

    const SignedIn = isLoggedIn && authReady;

    const userProfileUri = user.user.image_url;

    if(!SignedIn){
        return <Redirect href="/(auth)" />;
    }
    
    if(SignedIn && loading){
        return <LoadingScreen/>;
    }
    
    if(!authStatus){
        return <BiometricScreen/>;
    }
    // if(!isAuthenticated){
    //     return <BiometricScreen/>;
    // }

    return(
        <Tabs
        screenOptions={{
            headerShown:false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textPrimary,
            tabBarLabelStyle:{
                fontSize:12,
                fontWeight:"600",
            },
            tabBarStyle:{
                backgroundColor: colors.border,
                borderTopWidth: 0,
            },
            tabBarItemStyle: {
                flex: 1,
                minWidth: 0,
                },
            
        }}
        >
            {/* Home */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({color, size}) =>(
                        <Ionicons name="home" size={size} color={color}/>
                    ),
                }}
            />

            {/* e-id */}
            <Tabs.Screen
                name="eId"
                options={{
                    title: "eID",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="radio-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* Activity */}
            <Tabs.Screen 
                name="activity"
                options={{
                    title:"Activity",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="notifications-outline" size={size} color={color} />
                    ),
                }}
            />


            {/* Wallet */}
            <Tabs.Screen 
                name="wallet"
                options={{
                    title:"Wallet",
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="wallet-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* more */}
            <Tabs.Screen 
                name="more"
                options={{
                    title:"You",
                    tabBarIcon: ({color, size}) => (
                        // <Ionicons name="grid-outline" size={size} color={color} />
                        userProfileUri ? (
                            <Image 
                                source={{ uri: userProfileUri }} 
                                style={{ width: size, height: size, borderRadius: size / 2 }} 
                            />
                        ) : (
                            // Fallback icon when no profile image exists
                            <Ionicons name="person-circle-outline" size={size} color={color} />
                        )
                    ),
                }}
            />

        </Tabs>
    );
};

export default TabsLayout


// for more ie cog, cog-outline,  options/ -outline, person-circle/ -outline
// list /-outline  ellipis-horizontal/ -vertical /-circle /-outline 

// wifi , radio /-outline, scan/ -outline
// activity:bell, more: 4 boxes

// import React, {useEffect} from "react";
// import {router} from 'expo-router';

// export default function Index() {
//   useEffect(() => {
//     router.replace('/SplashScreen') //quuick redirect
//   }, []);

//   return null;
// }