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
import UserApprovalScreen from '../screens/admin/UserApprovalScreen';
import UserDetails from '../screens/admin/UserDetails';
import ViewAllUsersScreen from '../screens/admin/ViewAllUsersScreen';
import UsersListScreen from '../screens/admin/UsersListScreen';
import ViewUserDonationListScreen from '../screens/admin/ViewUserDonationListScreen';
import DonationHistoryDetails from '../screens/donor/DonationHistoryDetails';
import ViewUserRequestListScreen from '../screens/admin/ViewUserRequestListScreen';
import RequestHistoryDetails from '../screens/requester/RequestHistoryDetails';
import ViewAllDonationScreen from '../screens/admin/ViewAllDonationScreen';
import ViewAllDonationList from '../screens/admin/ViewAllDonationList';
import ViewDonationDetails from '../screens/admin/ViewDonationDetails';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const UserApprovalStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="User Approval" component={UserApprovalScreen} />
      <Stack.Screen name="User Details" component={UserDetails}  />
    </Stack.Navigator>
  )
}

const UserListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="View All Users" component={ViewAllUsersScreen} />
      <Stack.Screen name="User Lists" component={UsersListScreen} options={({route}) => ({title: route.params.headerTitle})} />
      <Stack.Screen name="User Details 2" component={UserDetails} options={({route}) => ({title: route.params.headerTitle})} />
      <Stack.Screen name="User Donation List" component={ViewUserDonationListScreen} options={({route}) => ({title: route.params.headerTitle})} />
      <Stack.Screen name="Donation Details" component={DonationHistoryDetails} />
      <Stack.Screen name="User Request List" component={ViewUserRequestListScreen} options={({route}) => ({title: route.params.headerTitle})} />
      <Stack.Screen name="Request Details" component={RequestHistoryDetails} />
    </Stack.Navigator>
  )
}

const DonationListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="View All Donations" component={ViewAllDonationScreen} />
      <Stack.Screen name="View All Donations List" component={ViewAllDonationList} options={({route}) => ({title: route.params.headerTitle})} />
      <Stack.Screen name="View Donation Details" component={ViewDonationDetails} options={({route}) => ({title: route.params.headerTitle})} />
    </Stack.Navigator>
  )
}

const AdminTabNavigator = () => {
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

      <Tab.Screen name="UserApprovalStack" component={UserApprovalStack} options={({route}) => ({
        tabBarStyle: [styles.tabStyle, {
          display: getTabBarVisibility(route),
          //backgroundColor: '#AD40AF',
        }],
        tabBarIcon: ({color, size}) => (
          <Feather name='user-check' color={color} size={size} />
        ),
        headerShown: false, 
      })} />

      <Tab.Screen name="UserListStack" component={UserListStack} options={({route}) => ({
        tabBarStyle: [styles.tabStyle, {
          display: getTabBarVisibility(route),
          //backgroundColor: '#AD40AF',
        }],
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name='account-group-outline' color={color} size={size} />
        ),
        headerShown: false, 
      })} />

      <Tab.Screen name="DonationListStack" component={DonationListStack} options={({route}) => ({
        tabBarStyle: [styles.tabStyle, {
          display: getTabBarVisibility(route),
          //backgroundColor: '#AD40AF',
        }],
        tabBarIcon: ({color, size}) => (
          <Feather name='list' color={color} size={size} />
        ),
        headerShown: false, 
      })} />

    </Tab.Navigator>
  )
}

const getTabBarVisibility = route => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  if( routeName == 'User Details' ) {
    return 'none';
  } else if ( routeName == 'User Lists') {
    return 'none';
  }
  else if ( routeName == 'User Details 2') {
    return 'none';
  }
  else if ( routeName == 'User Donation List') {
    return 'none';``
  }
  else if ( routeName == 'Donation Details') {
    return 'none';
  }
  else if ( routeName == 'User Request List') {
    return 'none';
  }
  else if ( routeName == 'Request Details') {
    return 'none';
  }
  else if ( routeName == 'View All Donations List') {
    return 'none';
  }
  else if ( routeName == 'View Donation Details') {
    return 'none';
  }
  return 'flex';
};

export default AdminTabNavigator

const styles = StyleSheet.create({
  tabStyle: {
    height: 53,
    backgroundColor: '#acfad3',
  },
})