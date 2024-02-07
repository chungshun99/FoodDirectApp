import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

const AppStack = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={BottomTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default AppStack

const styles = StyleSheet.create({})