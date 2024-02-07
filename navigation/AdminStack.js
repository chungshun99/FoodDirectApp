import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminTabNavigator from './AdminTabNavigator';

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={AdminTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default AdminStack

const styles = StyleSheet.create({})