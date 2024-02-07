import { Button, StyleSheet, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

const HomeScreen = ({navigation}) => {

  const {user, logout, userRole} = useContext(AuthContext);
  const [name, setName] = useState(null);

  useEffect (() => {
    getUserName();
    console.log("userRole Home:",userRole);
  }, []) 

  const getUserName = async () => {
    await firestore().collection("Users")
    .doc(user.uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        setName(documentSnapshot.data().userFirstName);
      }
    });    
  }


  {}
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <Image style={styles.logoImage} source={require('../images/FoodDirectIcon4.png')} />
      </View>

      <Text style={styles.welcomeText}>Welcome back, {name}</Text>

      {userRole === 'Donor' &&
      <View style={styles.bottomContainer}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'Donation Map' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>Find Donation Jobs</Text>
              <Feather name="send" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'DonationHistoryStack' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View My Donation Jobs</Text>
              <Feather name="clipboard" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'Profile' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View My Profile</Text>
              <AntDesign name="idcard" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => logout()} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>Sign Out</Text>
              <AntDesign name="logout" color="black" size={23} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

      </View>
      }

      {userRole === 'Requester' &&
      <View style={styles.bottomContainer}>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'RequestDonation' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>Make a Donation Request</Text>
              <Feather name="send" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'RequestHistory' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View My Donation Requests</Text>
              <Feather name="clipboard" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'Profile' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View My Profile</Text>
              <AntDesign name="idcard" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => logout()} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>Sign Out</Text>
              <AntDesign name="logout" color="black" size={23} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

      </View>
      }

      {userRole === 'Admin' &&
      <View style={styles.bottomContainer}>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'UserApprovalStack' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>Approve User Registration</Text>
              <Feather name="user-check" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'UserListStack' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View All Registered Users</Text>
              <Octicons name="people" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen', { screen: 'DonationListStack' })} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View All Donations</Text>
              <Feather name="clipboard" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => logout()} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>Sign Out</Text>
              <AntDesign name="logout" color="black" size={23} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

      </View>
      }  


    </ScrollView>
    
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2ebfc',
  },
  welcomeText: {
    fontSize: 22,
    color: 'black',
    fontWeight: '600',
    //paddingHorizontal: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    //marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: 140,
  },
  bottomContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#cebfff',
    width: '100%',
    padding: 45,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a387ff',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginLeft: 12,
    //marginTop: 1,
  },
  rowText: {
    color:"black", 
    fontSize: 16, 
    marginLeft: 12,
    fontWeight: '500',
  },
})