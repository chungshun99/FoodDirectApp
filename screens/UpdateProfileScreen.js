import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ActivityIndicator } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';


const UpdateProfileScreen = ({navigation}) => {
    const {user} = useContext(AuthContext);

    const [userProfile, setUserProfile] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect (() => {
        getUserProfile();
    }, []) 

    const getUserProfile = async () => {
        await firestore().collection("Users")
        .doc(user.uid)
        .get()
        .then(documentSnapshot => {
        if (documentSnapshot.exists) {
            console.log('User data from Firestore: ', documentSnapshot.data());
            setUserProfile(documentSnapshot.data());
        }
        });    
    };

    const updateProfile = async () => {
        var pass = true;
        if (userProfile.userFirstName == "") {
            ToastAndroid.show('First name cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (userProfile.userLastName == "") {
            ToastAndroid.show('Last name cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (userProfile.userLastName == "") {
            ToastAndroid.show('Address cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (userProfile.userLastName == "") {
            ToastAndroid.show('Phone number cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }

        if (pass) {
            setUpdating(true);
            await firestore().collection('Users')
            .doc(user.uid)
            .update({
                userFirstName: userProfile.userFirstName,
                userLastName: userProfile.userLastName,
                userAddress: userProfile.userAddress,
                userPhoneNum: userProfile.userPhoneNum,
            })
            .then(() => {
                setUpdating(false);
                //console.log('Profile picture updated!');
                ToastAndroid.show('Profile Updated!', ToastAndroid.SHORT,);
                navigation.navigate("My Profile");
            });
            setUpdating(false);
        }
    };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
            <Image style={styles.profileImage}
                source={{uri: userProfile ? userProfile.userPic || 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6' 
                : 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6'}}
            />
        </View> 
       
        <View style={styles.detailsContainer}>
            
            <View style={styles.input}>     
                <FloatingLabelInput 
                    label="First Name"
                    staticLabel
                    value={userProfile ? userProfile.userFirstName : ''}
                    onChangeText={(text) => setUserProfile({...userProfile, userFirstName: text})}
                    leftComponent={ <AntDesign name="user" color="black" size={30}/>} 
                    containerStyles={styles.inputContainerStyle}
                    customLabelStyles={styles.inputLabelFocusedStyle}
                    labelStyles={styles.inputLabelStyle}
                    inputStyles={styles.inputStyle}
                />
            </View>

            <View style={styles.input}>     
                <FloatingLabelInput 
                    label="Last Name"
                    staticLabel
                    value={userProfile ? userProfile.userLastName : ''}
                    onChangeText={(text) => setUserProfile({...userProfile, userLastName: text})}
                    leftComponent={ <AntDesign name="user" color="black" size={30}/>} 
                    containerStyles={styles.inputContainerStyle}
                    customLabelStyles={styles.inputLabelFocusedStyle}
                    labelStyles={styles.inputLabelStyle}
                    inputStyles={styles.inputStyle}
                />
            </View>
            
            <View style={styles.input}>     
                <FloatingLabelInput 
                    label="Address"
                    staticLabel
                    value={userProfile ? userProfile.userAddress : ''}
                    onChangeText={(text) => setUserProfile({...userProfile, userAddress: text})}
                    leftComponent={ <Feather name="map" color="black" size={30}/>} 
                    containerStyles={styles.inputContainerStyle}
                    customLabelStyles={styles.inputLabelFocusedStyle}
                    labelStyles={styles.inputLabelStyle}
                    inputStyles={styles.inputStyle}
                />
            </View>

            <View style={styles.input}>     
                <FloatingLabelInput 
                    label="Phone Number"
                    staticLabel
                    value={userProfile ? userProfile.userPhoneNum : ''}
                    onChangeText={(text) => setUserProfile({...userProfile, userPhoneNum: text})}
                    leftComponent={ <Feather name="phone" color="black" size={30}/>} 
                    containerStyles={styles.inputContainerStyle}
                    customLabelStyles={styles.inputLabelFocusedStyle}
                    labelStyles={styles.inputLabelStyle}
                    inputStyles={styles.inputStyle}
                    mask="999-9999999"
                    keyboardType="numeric"
                />
            </View>

        </View>  

        <View style={styles.buttonView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={updateProfile} >
                <Text style={styles.buttonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
        </View>
    
      </ScrollView>

      {updating &&
        <View style={styles.loading}>
          <ActivityIndicator size={80} color={'#d5f5db'} />
        </View>
      }

    </SafeAreaView>
  )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f2ebfc',
    },
    imageContainer: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        //paddingHorizontal: 35,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 200/2,
    },
    detailsContainer: {
        //paddingHorizontal: 30,
        //marginBottom: 25,
        flex: 1,
        marginVertical: 20,
        paddingHorizontal: 15,
        //padding: 10,
        //backgroundColor: '#e6e6e6',
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        //marginBottom: 10,
        padding: 10,
        //flex: 1,
    },
    textInput: {
        flex: 1,
        //marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: 'red',
        //borderBottomWidth: 1,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        //paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
    },
    inputContainerStyle: {
        borderBottomWidth: 2,
        //paddingHorizontal: 10,
        //backgroundColor: '#fff',
        //borderColor: '#7df5d5',
        //borderRadius: 2,
    },
    inputLabelFocusedStyle: {
        //colorFocused: '#0b16e0',
        fontSizeFocused: 15,
        fontSizeBlurred: 15,
        //topFocused: -25,
        //topBlurred: -10,
    },
    inputLabelStyle: {
        //backgroundColor: '#fff',
        paddingHorizontal: 18,
    },
    inputStyle: {
        color: 'black',
        paddingHorizontal: 10,
        fontSize: 16,
    },
    buttonView: {
        //flex: 1,
        //padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'white',
    },
    buttonContainer: {
        width: '80%',         
        marginTop: 5,
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#0782F9',
        padding: 18,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center'
    },
})