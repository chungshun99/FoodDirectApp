import { Dimensions, TouchableOpacity, TextInput, ImageBackground, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { AuthContext } from '../navigation/AuthProvider';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';

import showPassword from '../images/passwordHide.png';
import hidePassword from '../images/passwordShow.png';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  
  const {login} = useContext(AuthContext);

  return (
    <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
      <ImageBackground style={styles.backgroundImage} source={require('../images/mintGreen2.jpg')}>
         <View style={styles.logoContainer}>
           <Image style={styles.logoImage} source={require('../images/FoodDirectIcon2.png')} />
           {/* <Text style={{marginTop: -50, fontSize: 40}}>Food Direct</Text>  */}
         </View>
      </ImageBackground>

      {/* Bottom View */}
      <View style={styles.bottomView}>
          {/* Welcome View */}
          <View style={{padding: 40}}>
            <Text style={styles.welcomeMessage}>Welcome</Text>
            <Text style={{fontSize:15, color:"black"}}>Don't have an account? 
                <Text style={{color:'red', fontStyle: 'italic'}} onPress={ () => navigation.navigate("RegisterScreen")}> 
                  {''} Register now
                </Text>
            </Text>
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

              <View style={styles.input}>
                <FloatingLabelInput label="Password" value={password} staticLabel hintTextColor={'#aaa'}
                    containerStyles={styles.inputContainerStyle}
                    customLabelStyles={styles.inputLabelFocusedStyle}
                    labelStyles={styles.inputLabelStyle}
                    inputStyles={styles.inputStyle}
                    onChangeText={text => setPassword(text)} 
                    isPassword={true}
                    customShowPasswordImage={showPassword}
                    customHidePasswordImage={hidePassword}
                />
              </View>
            </View>

          </View>

            <Text 
              style={{paddingHorizontal: 40,fontSize:15, color:'red', fontStyle: 'italic', textAlign: 'left'}}
              onPress={ () => navigation.navigate("ForgotPasswordScreen")}
            >
              Forgot Password 
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => login(email, password)} >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
    
          
      </View>
    </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    height: Dimensions.get('window').height / 2.5,
  },
  logoContainer: {
    //width: 50,
    //height: 80,
    //marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 260,
    height: 260,
  },
  bottomView: {
    flex: 1.5,
    backgroundColor: 'white',
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  welcomeMessage: {
    color: '#4632A1',
    fontSize: 34,
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
    marginTop: 15,
    marginHorizontal: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
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