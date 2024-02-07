import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './AuthProvider';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import HomeScreen from '../screens/HomeScreen';
import UserprofileScreen from '../screens/UserprofileScreen';

import MapScreen from '../screens/donor/MapScreen';
import BottomSheetScreen from '../screens/BottomSheetScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import RequestDonationScreen from '../screens/requester/RequestDonationScreen';
import ManageFoodListScreen from '../screens/requester/ManageFoodListScreen';
import DonationHistory from '../screens/donor/DonationHistory';
import DonationHistoryDetails from '../screens/donor/DonationHistoryDetails';
import CompleteDonationScreen from '../screens/donor/CompleteDonationScreen';
import RequestHistoryScreen from '../screens/requester/RequestHistoryScreen';
import RequestHistoryDetails from '../screens/requester/RequestHistoryDetails';

import UserApprovalScreen from '../screens/admin/UserApprovalScreen';
import UserDetails from '../screens/admin/UserDetails';
import ViewAllUsersScreen from '../screens/admin/ViewAllUsersScreen';
import UsersListScreen from '../screens/admin/UsersListScreen';
import ViewUserDonationListScreen from '../screens/admin/ViewUserDonationListScreen';
import ViewUserRequestListScreen from '../screens/admin/ViewUserRequestListScreen';
import ViewAllDonationScreen from '../screens/admin/ViewAllDonationScreen';
import ViewAllDonationList from '../screens/admin/ViewAllDonationList';
import ViewDonationDetails from '../screens/admin/ViewDonationDetails';


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

//Requester Related Stack
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


//Donor Related Stack
const DonationHistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Donation History" component={DonationHistory} />
      <Stack.Screen name="Donation History Details" component={DonationHistoryDetails}  />
      <Stack.Screen name="Donation Job Completion" component={CompleteDonationScreen}  />
    </Stack.Navigator>
  )
}



// Admin Related Stack
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

const BottomTabNavigator = () => {
  const {user, userRole} = useContext(AuthContext);
  console.log("BottomTabNavigator User Role:", userRole);

  if (userRole === "Requester") {
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
          }],
          tabBarIcon: ({color, size}) => (
            <AntDesign name='form' color={color} size={size} />
          ),
          headerShown: false, 
        })} />

        <Tab.Screen name="RequestHistory" component={RequestHistoryStack} options={({route}) => ({
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
  else if (userRole === "Donor") {
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
  else if (userRole === "Admin") {
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
          }],
          tabBarIcon: ({color, size}) => (
            <Feather name='user-check' color={color} size={size} />
          ),
          headerShown: false, 
        })} />
  
        <Tab.Screen name="UserListStack" component={UserListStack} options={({route}) => ({
          tabBarStyle: [styles.tabStyle, {
            display: getTabBarVisibility(route),
          }],
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name='account-group-outline' color={color} size={size} />
          ),
          headerShown: false, 
        })} />
  
        <Tab.Screen name="DonationListStack" component={DonationListStack} options={({route}) => ({
          tabBarStyle: [styles.tabStyle, {
            display: getTabBarVisibility(route),
          }],
          tabBarIcon: ({color, size}) => (
            <Feather name='list' color={color} size={size} />
          ),
          headerShown: false, 
        })} />
  
      </Tab.Navigator>
    )
  }

  return null;
  // return (    
  //   <Tab.Navigator screenOptions={{
  //     tabBarShowLabel: false,
  //     headerShown: true,
  //     tabBarStyle: styles.tabStyle,
  //     tabBarInactiveTintColor: 'gray',
  //     tabBarHideOnKeyboard: true,
  //   }}>
  //     <Tab.Screen name="Home" component={HomeScreen} options={{
  //       tabBarIcon: ({color, size}) => (
  //         <AntDesign name='home' color={color} size={size} />
  //       ) 
  //     }} />
  //     <Tab.Screen name="Donation Map" component={MapScreen} options={{
  //       tabBarIcon: ({color, size}) => (
  //         <Feather name='map-pin' color={color} size={size} />
  //       ) 
  //     }} />
  //     <Tab.Screen name="RequestDonationStack" component={DonationRequestStack} options={({route}) => ({
  //       tabBarStyle: [styles.tabStyle, {
  //         display: getTabBarVisibility(route),
  //         //backgroundColor: '#AD40AF',
  //       }],
  //       tabBarIcon: ({color, size}) => (
  //         <AntDesign name='form' color={color} size={size} />
  //       ),
  //       headerShown: false, 
  //     })} />

  //     <Tab.Screen name="DonationHistoryStack" component={DonationHistoryStack} options={({route}) => ({
  //       tabBarStyle: [styles.tabStyle, {
  //         display: getTabBarVisibility(route),
  //         //backgroundColor: '#AD40AF',
  //       }],
  //       tabBarIcon: ({color, size}) => (
  //         <MaterialCommunityIcons name='history' color={color} size={size} />
  //       ),
  //       headerShown: false, 
  //     })} />

  //     <Tab.Screen name="RequestHistoryStack" component={RequestHistoryStack} options={({route}) => ({
  //       tabBarStyle: [styles.tabStyle, {
  //         display: getTabBarVisibility(route),
  //         //backgroundColor: '#AD40AF',
  //       }],
  //       tabBarIcon: ({color, size}) => (
  //         <MaterialCommunityIcons name='history' color={color} size={size} />
  //       ),
  //       headerShown: false, 
  //     })} />

  //     <Tab.Screen name="Profile" component={ProfileStack} options={({route}) => ({
  //       tabBarStyle: [styles.tabStyle, {
  //         display: getTabBarVisibility(route),
  //         //backgroundColor: '#AD40AF',
  //       }],
  //       tabBarIcon: ({color, size}) => (
  //         <Feather name='user' color={color} size={size} />
  //       ),
  //       headerShown: false, 
  //     })} />
  //   </Tab.Navigator>
  // )
};

const getTabBarVisibility = route => {
  // console.log(route);
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
  // console.log(routeName);

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
  else if( routeName == 'User Details' ) {
    return 'none';
  } 
  else if ( routeName == 'User Lists') {
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

export default BottomTabNavigator

const styles = StyleSheet.create({
  tabStyle: {
    //position: 'absolute',
    //bottom: 12,
    //left: 12,
    //right: 12,
    //borderRadius: 18,
    //borderTopLeftRadius: 18,
    //borderTopEndRadius: 18,
    height: 53,
    backgroundColor: '#acfad3',
  },
})