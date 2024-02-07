import { Button, ToastAndroid, Dimensions, TouchableOpacity, TextInput, ImageBackground, ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { FloatingLabelInput } from 'react-native-floating-label-input';

import { AuthContext } from '../../navigation/AuthProvider';

import showPassword from '../../images/passwordHide.png';
import hidePassword from '../../images/passwordShow.png';

const Register2Screen = ({navigation}) => {
    const {user, logout} = useContext(AuthContext);

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('') 
    const [address, setAddress] = useState('') 
    const [IC, setIC] = useState('') 
    const [phonenum, setPhonenum] = useState('') 

    const {register} = useContext(AuthContext);

    const validate = () => {
        console.log("validate")
        var pass = true;
        if (firstName == null) {
            ToastAndroid.show('First name cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (lastName == null) {
            ToastAndroid.show('Last name cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (address == null) {
            ToastAndroid.show('Address cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (IC == null) {
            ToastAndroid.show('IC cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (IC.length < 14) {
            ToastAndroid.show('Invalid IC.', ToastAndroid.SHORT,);
            pass = false;
        }
        if (phonenum == null) {
            ToastAndroid.show('Phone number cannot be empty.', ToastAndroid.SHORT,);
            pass = false;
        }

        if (pass) {
            navigation.navigate("UploadICScreen", {firstname: firstName, lastname: lastName, address: address, phonenum: phonenum, icnumber: IC});
        } 
        else {
            return null;
        }
    }

    return (
        <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
        <ImageBackground style={styles.backgroundImage} source={require('../../images/mintGreen2.jpg')}>
        </ImageBackground>

        {/* Bottom View */}
        <View style={styles.bottomView}>
            {/* Welcome View */}
            <View style={{padding: 40}}>
                <Text style={styles.welcomeMessage}>Account Verification</Text>
                <Text style={{fontSize:15, color:"black"}}>Kindly fill in the details below for verification and safety purposes.</Text>
                <Text style={{fontSize:15, color:"black", fontStyle:"italic", fontWeight: 'bold'}}>All information provided will be kept confidentially.</Text>
            </View>

            {/* Form View */}
            <View style={styles.formContainer}>    

                <View style={styles.inputContainer}>
                    <View style={styles.input}>     
                        <FloatingLabelInput label="First Name" value={firstName} staticLabel hintTextColor={'#aaa'}
                            containerStyles={styles.inputContainerStyle}
                            customLabelStyles={styles.inputLabelFocusedStyle}
                            labelStyles={styles.inputLabelStyle}
                            inputStyles={styles.inputStyle}
                            onChangeText={text => setFirstName(text)}
                        />
                    </View>

                    <View style={styles.input}>
                        <FloatingLabelInput label="Last Name" value={lastName} staticLabel hintTextColor={'#aaa'}
                            containerStyles={styles.inputContainerStyle}
                            customLabelStyles={styles.inputLabelFocusedStyle}
                            labelStyles={styles.inputLabelStyle}
                            inputStyles={styles.inputStyle}
                            onChangeText={text => setLastName(text)} 
                        />
                    </View>

                    <View style={styles.input}>
                        <FloatingLabelInput label="Address" value={address} staticLabel hintTextColor={'#aaa'}
                            containerStyles={styles.inputContainerStyle}
                            customLabelStyles={styles.inputLabelFocusedStyle}
                            labelStyles={styles.inputLabelStyle}
                            inputStyles={styles.inputStyle}
                            onChangeText={text => setAddress(text)} 
                        />
                    </View>

                    <View style={styles.input}>
                        <FloatingLabelInput label="Phone Number" value={phonenum} staticLabel hintTextColor={'#aaa'}
                            containerStyles={styles.inputContainerStyle}
                            customLabelStyles={styles.inputLabelFocusedStyle}
                            labelStyles={styles.inputLabelStyle}
                            inputStyles={styles.inputStyle}
                            onChangeText={text => setPhonenum(text)}
                            mask="999-9999999"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.input}>
                        <FloatingLabelInput label="Identification Card Number" value={IC} staticLabel hintTextColor={'#aaa'}
                            containerStyles={styles.inputContainerStyle}
                            customLabelStyles={styles.inputLabelFocusedStyle}
                            labelStyles={styles.inputLabelStyle}
                            inputStyles={styles.inputStyle}
                            onChangeText={text => setIC(text)}
                            mask="999999-99-9999"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        disabled={firstName && lastName && address && phonenum && IC ? false : true} 
                        style={firstName && lastName && address && phonenum && IC ? styles.buttonEnabled : styles.buttonDisabled} 
                        onPress={() => validate()}
                        // onPress={() => navigation.navigate("UploadICScreen", {firstname: firstName, lastname: lastName, address: address, phonenum: phonenum, icnumber: IC})}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
        </ScrollView>
    )
}

export default Register2Screen

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImage: {
        height: Dimensions.get('window').height / 2.5,
    },
    bottomView: {
        flex: 3,
        backgroundColor: 'white',
        bottom: 200,
        borderTopStartRadius: 60,
        borderTopEndRadius: 60,
    },
    welcomeMessage: {
        color: '#4632A1',
        fontSize: 40,
        marginBottom: 5,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: 5,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
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
        borderWidth: 2,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderColor: '#7df5d5',
        borderRadius: 10,
    },
    inputLabelFocusedStyle: {
        colorFocused: '#0b16e0',
        fontSizeFocused: 18,
    },
    inputLabelStyle: {
        backgroundColor: '#fff',
        paddingHorizontal: 5,
    },
    inputStyle: {
        color: 'black',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop: 5,
    },
    buttonEnabled: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#717a8a',
        width: '100%',
        padding: 15,
        borderRadius: 14,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    },
    buttonOutlineText: {
    color: '#0782F9',
    fontSize: 16,
    fontWeight: '700',
    },
})