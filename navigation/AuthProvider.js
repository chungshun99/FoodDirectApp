import React, { Children, createContext, useContext, useState } from "react";
import auth from '@react-native-firebase/auth';
import { Alert, ToastAndroid } from "react-native";
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const addUserIntoDatabase = async (userid, email, role) => {
        await firestore().collection('Users').doc(userid).set({
            userId: userid,
            userEmail: email,
            userFirstName: '',
            userLastName: '',
            userAddress: '',
            userPhoneNum: '',
            userICNum: '',
            userIC: '',
            userPic: '',
            userVerification: 'Unverified',
            userRole: role,
            userCreatedDate: firestore.Timestamp.fromDate(new Date()),
        });
        // .then(() => {
        //     console.log('Data added!');
        //     //navigation.replace("HomeScreen");
        // });
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                userRole,
                setUserRole,
                login: async (email, password) => {
                    try {
                        if (email && password) {
                            await auth().signInWithEmailAndPassword(email, password)
                        } else {
                            ToastAndroid.show('Email/Password cannot be empty.', ToastAndroid.LONG,);
                        }
                    } catch(error) {
                        if (error.code === 'auth/invalid-email') {
                            ToastAndroid.show('Invalid email address.', ToastAndroid.LONG,);
                        }
                        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                            ToastAndroid.show('Wrong user email/password. Kindly enter a valid email/password.', ToastAndroid.LONG,);
                        }
                        console.log("Login Error:", error); 
                    }
                },
                register: async (email, password, confirmpassword, role) => {
                    try {
                        if (password == confirmpassword) {
                            await auth().createUserWithEmailAndPassword(email, password)
                            .then(data => {
                                addUserIntoDatabase(data.user.uid, email, role); 
                            });
                            
                            // await auth()
                            // .createUserWithEmailAndPassword(email, password)
                            // .then(() => {
                            //     console.log('Data added!');
                            // });
                            ToastAndroid.show('Registration Successful! You May Login Now.', ToastAndroid.LONG,);
                            //Alert.alert("Registration Successful! You May Login Now.");
                        }
                        else {
                            ToastAndroid.show('Password does not match with confirm password! Please enter the correct password.', ToastAndroid.LONG,);
                            //Alert.alert("Password does not match with confirm password! Please enter the correct password.");
                        }
                    } catch(error) {
                        if (error.code === 'auth/invalid-email') {
                            ToastAndroid.show('Invalid email address.', ToastAndroid.LONG,);
                        }
                        if (error.code === 'auth/email-already-in-use') {
                            ToastAndroid.show('This email has already in used. Kindly enter a new valid email.', ToastAndroid.LONG,);
                        }
                        if (error.code === 'auth/weak-password') {
                            ToastAndroid.show('Invalid password. Password requires to be at least 6 characters.', ToastAndroid.LONG,);
                        }
                        console.log("Login Error:", error); 
                    }
                },
                logout: async () => {
                    try {
                        console.log("Logout button pressed.");
                        await auth().signOut();
                        ToastAndroid.show('Signed Out!', ToastAndroid.LONG,);
                    } catch(error) {
                        console.log(error);
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    )
}