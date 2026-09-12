import React from "react";
import NfcEidScreen from "../screens/NfcEidScreen";


export default function NfcEidRoute() {
    return <NfcEidScreen />;
}

// import React from "react";
// import NfcEidScreen from "../screens/NfcEidScreen";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import { StyleSheet } from "react-native";

// export default function NfcEidRoute() {
//   return (
//     <>
//       <StatusBar
//         style="light"
//         backgroundColor="#000A04"
//         translucent={false}
//       />

//       <SafeAreaView
//         edges={["top"]}
//         style={styles.safeArea}
//       >
//         <NfcEidScreen />
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#000A04",
//   },
// });