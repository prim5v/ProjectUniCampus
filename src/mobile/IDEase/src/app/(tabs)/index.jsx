import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProfileScreen from '../../screens/ProfileScreen';

const index = () => {
  return (
    // <SafeAreaView>
    <>
      {/* <Text>index</Text> */}
      <ProfileScreen/>
    </>
    // </SafeAreaView>
  )
}

export default index


// import { View, Text } from 'react-native'
// // import React from 'react'
// import React, { useEffect } from 'react'
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import ProfileScreen from '../../screens/ProfileScreen';
// import { useAuth } from '../../contexts/AuthContext';


// const index = () => {
//   const { initializeAuthentication, getProfile, authReady, accessToken , authStatus, user} = useAuth();

//   // run useEffect for initialization
//    useEffect(() => {
//     console.log("[Auth] AuthContext authReady:", authReady);

//             if (!authReady) {
//                 return;
//             }

//             initializeAuthentication(); //issue is not here authStatus is already false

//         }, [
//             authReady,
//             initializeAuthentication,
//         ]);
//         console.log("[auth] initializeAuthentication() called in index.jsx");
//         console.log("[Auth] AuthContext authStatus:", authStatus); //here authStatus is true


//   // run useEffect for fetching profile
//       useEffect(() => {
//         if(accessToken){
//             getProfile();
//             console.log("[Auth] Access token exists, fetching profile...", user);
//         }
//     }, [getProfile]);
//     console.log("[auth] getProfile() called in index.jsx");
//     console.log("[Auth] AuthContext accessToken:", accessToken);
//     console.log("[Auth] AuthContext authStatus:", authStatus); 


//   return (
//     // <SafeAreaView>
//     <>
//       {/* <Text>index</Text> */}
//       <ProfileScreen/>
//     </>
//     // </SafeAreaView>
//   )
// }

// export default index