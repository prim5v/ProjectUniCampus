import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const activity = () => {
  return (
    <SafeAreaView>
    <View>
      <Text>activity</Text>
    </View>
    </SafeAreaView>
  )
}

export default activity