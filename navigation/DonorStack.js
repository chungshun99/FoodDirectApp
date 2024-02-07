import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DonorTabNavigator from './DonorTabNavigator';

const Stack = createNativeStackNavigator();

const DonorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={DonorTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default DonorStack

const styles = StyleSheet.create({})