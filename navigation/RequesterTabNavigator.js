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
import UserprofileScreen from '../screens/UserprofileScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import RequestDonationScreen from '../screens/requester/RequestDonationScreen';
import ManageFoodListScreen from '../screens/requester/ManageFoodListScreen';
import RequestHistoryScreen from '../screens/requester/RequestHistoryScreen';
import RequestHistoryDetails from '../screens/requester/RequestHistoryDetails';


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

const DonationRequestStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Request Donation" component={RequestDonationScreen} />
            <Stack.Screen name="Manage Food Request List" component={ManageFoodListScreen}  />
        </Stack.Navigator>
    )
}

const RequestHistoryStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Donation Requests History" component={RequestHistoryScreen} />
            <Stack.Screen name="Donation Request Details" component={RequestHistoryDetails}  />
            <Stack.Screen name="Manage Food Request List" component={ManageFoodListScreen}  />
        </Stack.Navigator>
    )
}


const RequesterTabNavigator = () => {
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

        <Tab.Screen name="RequestDonation" component={DonationRequestStack} options={({route}) => ({
            tabBarStyle: [styles.tabStyle, {
            display: getTabBarVisibility(route),
            //backgroundColor: '#AD40AF',
            }],
            tabBarIcon: ({color, size}) => (
            <AntDesign name='form' color={color} size={size} />
            ),
            headerShown: false, 
        })} />

        <Tab.Screen name="RequestHistory" component={RequestHistoryStack} options={({route}) => ({
            tabBarStyle: [styles.tabStyle, {
            display: getTabBarVisibility(route),
            //backgroundColor: '#AD40AF',
            }],
            tabBarIcon: ({color, size}) => (
            <Octicons name='history' color={color} size={size} />
            ),
            headerShown: false, 
        })} />

        <Tab.Screen name="Profile" component={ProfileStack} options={({route}) => ({
            tabBarStyle: [styles.tabStyle, {
            display: getTabBarVisibility(route),
            //backgroundColor: '#AD40AF',
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
    else if( routeName == 'Manage Food Request List' ) {
      return 'none';
    }
    else if( routeName == 'Donation History Details' ) {
      return 'none';
    }
    else if( routeName == 'Donation Job Completion' ) {
      return 'none';
    }
    else if( routeName == 'Donation Request Details' ) {
      return 'none';
    }
    return 'flex';
};

export default RequesterTabNavigator

const styles = StyleSheet.create({
    tabStyle: {
        height: 53,
        backgroundColor: '#acfad3',
    },
})