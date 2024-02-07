import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerTitle: "", headerTransparent: true}} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{headerTitle: "", headerTransparent: true}} />     
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default LoginStack

const styles = StyleSheet.create({})