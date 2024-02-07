import { Dimensions, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Text, View, Picker} from 'react-native'
import React, { createContext, useContext, useState } from 'react'
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { AuthContext } from '../navigation/AuthProvider';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import DropDownPicker from 'react-native-dropdown-picker';

import showPassword from '../images/passwordHide.png';
import hidePassword from '../images/passwordShow.png';


const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  const [confirmPassword, setConfirmPassword] = useState('') 

  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState(null);
  const [items, setItems] = useState([
    {label: 'Donor', value: 'Donor'},
    {label: 'Requester', value: 'Requester'}
  ]);


  const {register} = useContext(AuthContext);

  return (
    <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
      <ImageBackground style={styles.backgroundImage} source={require('../images/mintGreen2.jpg')}>
         <View>
             
         </View>
      </ImageBackground>

      {/* Bottom View */}
      <View style={styles.bottomView}>
          {/* Welcome View */}
          <View style={{padding: 40}}>
            <Text style={styles.welcomeMessage}>Registration</Text>
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

              <View style={styles.input}>
                <FloatingLabelInput label="Confirm Password" value={confirmPassword} staticLabel hintTextColor={'#aaa'}
                    containerStyles={styles.inputContainerStyle}
                    customLabelStyles={styles.inputLabelFocusedStyle}
                    labelStyles={styles.inputLabelStyle}
                    inputStyles={styles.inputStyle}
                    onChangeText={text => setConfirmPassword(text)} 
                    isPassword={true}
                    customShowPasswordImage={showPassword}
                    customHidePasswordImage={hidePassword}
                />
              </View>

              <View style={styles.input}>
                <DropDownPicker
                  placeholder="Register as"
                  open={open}
                  value={roles}
                  items={items}
                  setOpen={setOpen}
                  setValue={setRoles}
                  setItems={setItems}
                  listMode="SCROLLVIEW"
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                disabled={email && password && confirmPassword && roles ? false : true} 
                style={email && password && confirmPassword && roles ? styles.buttonEnabled : styles.buttonDisabled} 
                onPress={() => register(email, password, confirmPassword, roles)} >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>

          </View>
      </View>
    </ScrollView>
  )
}

export default RegisterScreen

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