import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import NfcEidScreen from '../../screens/NfcEidScreen';

const eId = () => {
  return (
    // <SafeAreaView>
    // <View>
    //   <Text>eId</Text>
    // </View>
    // </SafeAreaView>
    <NfcEidScreen/>
  )
}

export default eId