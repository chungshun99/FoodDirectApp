import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthProvider';
import firestore from '@react-native-firebase/firestore';

import FirstRegistrationStack from './FirstRegistrationStack';
import AppStack from './AppStack';
import { NavigationContainer } from '@react-navigation/native';
import DonorStack from './DonorStack';
import RequesterStack from './RequesterStack';
import AdminStack from './AdminStack';

const LoginRoute = () => {
  const {user} = useContext(AuthContext);

  //const [userVerification, setUserVerification] = useState(false);
  const [userVerification, setUserVerification] = useState(null);
  const [userRole, setUserrole] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect (() => {
    checkVerifiedUser();
  }, []) 
  
  // const checkVerifiedUser = async () => {
  //   await firestore().collection("Users")
  //   .where('userId', '==', user.uid)
  //   .get()
  //   .then(collectionSnapshot => {
  //     console.log('Total users: ', collectionSnapshot.size);        
      
  //     if (collectionSnapshot.size > 0) {
  //       setUserVerification(true);
  //     }
  //   });

  //   if (initializing) setInitializing(false);

  // }

  const checkVerifiedUser = async () => {
    await firestore().collection("Users")
    .doc(user.uid)
    .get()
    .then(documentSnapshot => { 
      if (documentSnapshot.exists) {
        //console.log('User data from Firestore: ', documentSnapshot.data());
        setUserVerification(documentSnapshot.data().userVerification);
        setUserrole(documentSnapshot.data().userRole);
      }

      // if (collectionSnapshot.size > 0) {
      //   setUserVerification(true);
      // }
    });

    if (initializing) setInitializing(false);

  }

  if (initializing) return null;

  if (userRole === 'Admin') {
    return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      { userVerification !== 'Unverified' ? <AppStack /> : <FirstRegistrationStack /> }
    </NavigationContainer>
  )

  // if (userRole === 'Donor') {
  //   return (
  //     <NavigationContainer>
  //       { userVerification !== 'Unverified' ? <DonorStack /> : <FirstRegistrationStack /> }
  //     </NavigationContainer>
  //   )
  // } else if (userRole === 'Requester') {
  //   return (
  //     <NavigationContainer>
  //       { userVerification !== 'Unverified' ? <RequesterStack /> : <FirstRegistrationStack /> }
  //     </NavigationContainer>
  //   )
  // } else if (userRole === 'Admin') {
  //   return (
  //     <NavigationContainer>
  //       <AdminStack />
  //     </NavigationContainer>
  //   )
  // }

  

  // if (userVerification) {
  //   return ( <AppStack /> )
  // }
  // else {
  //   return <FirstRegistrationStack />
  // }
}

export default LoginRoute

const styles = StyleSheet.create({})