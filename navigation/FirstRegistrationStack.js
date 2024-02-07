import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register2Screen from '../screens/firstregistration/Register2Screen';
import UploadICScreen from '../screens/firstregistration/UploadICScreen';
import BottomTabNavigator from './BottomTabNavigator';
import DonorTabNavigator from './DonorTabNavigator';
import RequesterTabNavigator from './RequesterTabNavigator';
import UploadDocumentScreen from '../screens/firstregistration/UploadDocumentScreen';

const Stack = createNativeStackNavigator();

const FirstRegistrationStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Register2Screen" component={Register2Screen} options={{headerShown: false}} />
        <Stack.Screen name="UploadICScreen" component={UploadICScreen} options={{headerTitle: "", headerTransparent: true}} />
        <Stack.Screen name="UploadDocumentScreen" component={UploadDocumentScreen} options={{headerTitle: "", headerTransparent: true}} />
        <Stack.Screen name="HomeScreen" component={BottomTabNavigator} options={{headerShown: false}} />
        <Stack.Screen name="DonorHome" component={DonorTabNavigator} options={{headerShown: false}} />
        <Stack.Screen name="RequesterHome" component={RequesterTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default FirstRegistrationStack

const styles = StyleSheet.create({})