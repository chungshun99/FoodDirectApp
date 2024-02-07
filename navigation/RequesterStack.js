import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RequesterTabNavigator from './RequesterTabNavigator';

const Stack = createNativeStackNavigator();

const RequesterStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={RequesterTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default RequesterStack

const styles = StyleSheet.create({})