import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import { FloatingLabelInput } from 'react-native-floating-label-input'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const resetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email)
      .then(data => {
        setSent(true);
      });
    } catch(error) {
      if (error.code === 'auth/invalid-email') {
        ToastAndroid.show('Invalid email address.', ToastAndroid.LONG,);
      }
      if (error.code === 'auth/user-not-found') {
        ToastAndroid.show('No record found. This email has not been registered as an account yet.', ToastAndroid.LONG,);
      }
      console.log("Login Error:", error); 
    }
    
  }

  return (
    <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
      <ImageBackground style={styles.backgroundImage} source={require('../images/mintGreen2.jpg')}></ImageBackground>

      {/* Bottom View */}
      <View style={styles.bottomView}>
          {/* Welcome View */}
          <View style={{padding: 40}}>
            <Text style={styles.welcomeMessage}>Forgot Password</Text>
          </View>

          {/* Form View */}
          <View style={styles.formContainer}>    

            <View style={styles.inputContainer}>
              <View style={styles.input}>     
                <FloatingLabelInput label="Email" value={email} staticLabel hintTextColor={'#aaa'}
                    containerStyles={styles.inputContainerStyle}
                    customLabelStyles={styles.inputLabelFocusedStyle}
                    labelStyles={styles.inputLabelStyle}
                    inputStyles={styles.inputStyle}
                    onChangeText={text => setEmail(text)}
                />
              </View>
              
              {sent &&
              <Text style={{color: 'black', fontSize: 15, justifyContent: 'center',marginBottom: 15}}>
                A password reset confirmation email has been sent to the email address.
              </Text>
              }

            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                disabled={email ? false : true} 
                style={email ? styles.buttonEnabled : styles.buttonDisabled} 
                onPress={() => resetPassword()} 
              >
                <Text style={styles.buttonText}>Reset My Password</Text>
              </TouchableOpacity>
            </View>

          </View>
      </View>
    </ScrollView>
  )
}

export default ForgotPasswordScreen

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
    fontSize: 45,
    marginBottom: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
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