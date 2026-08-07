import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WalletScreen from '../../screens/WalletScreen';


const wallet = () => {
  return (
    // <SafeAreaView>
    // {/* <View>
    //   <Text>wallet</Text>
    // </View> */}
    <>
    <WalletScreen/>
    </>
    // </SafeAreaView>
  )
}

export default wallet