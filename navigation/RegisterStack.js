import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register2Screen from '../screens/Register2Screen';

const Stack = createNativeStackNavigator();

const RegisterStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Register2Screen" component={Register2Screen} options={{headerShown: false}} />     
    </Stack.Navigator>
  )
}

export default RegisterStack

const styles = StyleSheet.create({})