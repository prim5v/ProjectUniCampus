import React from "react";

import {
  View,
  Image,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Redirect, Tabs } from "expo-router";

import { colors } from "../../styles/theme";

import { useAuth } from "@/contexts/AuthContext";

import BiometricScreen from "../../screens/BiometricScreen";

import { useBiometric } from "@/contexts/BiometricContext";

import LoadingSpinner from "../../components/LoadingSpinner";



const TabsLayout = () => {


    const {
      isLoggedIn,
      authReady,
      loading,
      authStatus,
      user
    } = useAuth();



    const { isAuthenticated } = useBiometric();



    const SignedIn = isLoggedIn && authReady;



    const userProfileUri = user?.user?.image_url;




    if(!SignedIn){

        return <Redirect href="/(auth)" />;

    }




    if(!authStatus){

        return <BiometricScreen/>;

    }




    return (

      <View style={styles.container}>


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

                borderTopWidth:0,

            },


            tabBarItemStyle: {

                flex:1,

                minWidth:0,

            },


        }}



        >



            {/* Home */}

            <Tabs.Screen

                name="index"

                options={{

                    title:"Home",

                    tabBarIcon: ({color,size}) => (

                        <Ionicons

                          name="home"

                          size={size}

                          color={color}

                        />

                    ),

                }}

            />





            {/* eID */}

            <Tabs.Screen

                name="eId"

                options={{

                    title:"eID",

                    tabBarIcon: ({color,size}) => (

                        <Ionicons

                          name="radio-outline"

                          size={size}

                          color={color}

                        />

                    ),

                }}

            />





            {/* Activity */}

            <Tabs.Screen

                name="activity"

                options={{

                    title:"Activity",

                    tabBarIcon: ({color,size}) => (

                        <Ionicons

                          name="notifications-outline"

                          size={size}

                          color={color}

                        />

                    ),

                }}

            />





            {/* Wallet */}

            <Tabs.Screen

                name="wallet"

                options={{

                    title:"Wallet",

                    tabBarIcon: ({color,size}) => (

                        <Ionicons

                          name="wallet-outline"

                          size={size}

                          color={color}

                        />

                    ),

                }}

            />





            {/* More */}

            <Tabs.Screen

                name="more"

                options={{

                    title:"You",

                    tabBarIcon: ({color,size}) => (


                        userProfileUri ? (


                            <Image

                              source={{
                                uri:userProfileUri
                              }}

                              style={{
                                width:size,

                                height:size,

                                borderRadius:size / 2

                              }}

                            />


                        ) : (


                            <Ionicons

                              name="person-circle-outline"

                              size={size}

                              color={color}

                            />


                        )


                    ),

                }}

            />



        </Tabs>






        {
          loading && (

            <LoadingSpinner

              fullscreen

              message="Loading..."

            />

          )
        }





      </View>

    );

};






const styles = StyleSheet.create({

  container:{

    flex:1,

  },


});





export default TabsLayout;