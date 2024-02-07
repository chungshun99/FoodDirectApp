import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import { AuthContext } from './AuthProvider';
import LoginStack from './LoginStack';
import LoginRoute from './LoginRoute';
import FirstRegistrationStack from './FirstRegistrationStack';
import AppStack from './AppStack';

const Routes = () => {
    const {user, setUser, userRole, setUserRole} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    const onAuthStateChanged = (user) => {
        setUser(user);
        getUserRole(user);
        if (initializing) setInitializing(false);
    }

    const getUserRole = async (user) => {
        console.log("user Route: ", user);
        var userrole = null;
        if (user) {
            await firestore().collection("Users")
            .doc(user.uid)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    userrole = documentSnapshot.data().userRole;
                    setUserRole(documentSnapshot.data().userRole);
                }
            });
        }
        else {
            setUserRole(null);
            return null;
        }
        setUserRole(userrole);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                {/* <NavigationContainer> */}
                    {/* <FirstRegistrationStack /> */}
                    {/* <AppStack /> */}
                    
                    { user ? <LoginRoute /> : <LoginStack /> }
                {/* </NavigationContainer> */}
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default Routes;