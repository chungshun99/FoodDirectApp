import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/donor/MapScreen';
import DonationHistory from '../screens/donor/DonationHistory';
import DonationHistoryDetails from '../screens/donor/DonationHistoryDetails';
import CompleteDonationScreen from '../screens/donor/CompleteDonationScreen';
import UserprofileScreen from '../screens/UserprofileScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Profile" component={UserprofileScreen} />
      <Stack.Screen name="Edit Profile" component={UpdateProfileScreen}  />
    </Stack.Navigator>
  )
}

const DonationHistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Donation History" component={DonationHistory} />
      <Stack.Screen name="Donation History Details" component={DonationHistoryDetails}  />
      <Stack.Screen name="Donation Job Completion" component={CompleteDonationScreen}  />
    </Stack.Navigator>
  )
}

const DonorTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
        tabBarShowLabel: false,
        headerShown: true,
        tabBarStyle: styles.tabStyle,
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true,
    }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarIcon: ({color, size}) => (
            <AntDesign name='home' color={color} size={size} />
            ) 
        }} />
        <Tab.Screen name="Donation Map" component={MapScreen} options={{
            tabBarIcon: ({color, size}) => (
            <Feather name='map-pin' color={color} size={size} />
            ) 
        }} />

        <Tab.Screen name="DonationHistoryStack" component={DonationHistoryStack} options={({route}) => ({
            tabBarStyle: [styles.tabStyle, {
            display: getTabBarVisibility(route),
            }],
            tabBarIcon: ({color, size}) => (
            <Octicons name='history' color={color} size={size} />
            ),
            headerShown: false, 
        })} />

        <Tab.Screen name="Profile" component={ProfileStack} options={({route}) => ({
            tabBarStyle: [styles.tabStyle, {
            display: getTabBarVisibility(route),
            }],
            tabBarIcon: ({color, size}) => (
            <Feather name='user' color={color} size={size} />
            ),
            headerShown: false, 
        })} />
    </Tab.Navigator>
  )
}

const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
  
    if( routeName == 'Edit Profile' ) {
      return 'none';
    }
    else if( routeName == 'Donation History Details' ) {
      return 'none';
    }
    else if( routeName == 'Donation Job Completion' ) {
      return 'none';
    }
    return 'flex';
};

export default DonorTabNavigator

const styles = StyleSheet.create({
  tabStyle: {
    height: 53,
    backgroundColor: '#acfad3',
  },
})