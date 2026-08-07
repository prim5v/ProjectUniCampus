import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const more = () => {
  return (
    <SafeAreaView>
    <View>
      <Text>more</Text>
    </View>
    </SafeAreaView>
  )
}

export default more