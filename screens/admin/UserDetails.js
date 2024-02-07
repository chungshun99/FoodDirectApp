import { Alert, Image, Modal, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import ImageView from "react-native-image-viewing";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { AuthContext } from '../../navigation/AuthProvider';

const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];


const UserApprovalDetails = ({route, navigation}) => {
  const { userId, navigateFrom } = route.params;
  const { userRole } = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [userDate, setUserDate] = useState(null);
  const [role, setRole] = useState(null);
  const [ICVisible, setICVisible] = useState(false);
  const [PaySlipVisible, setPaySlipVisible] = useState(false);
  const [hasPaySlip, setHasPaySlip] = useState(false);

  //const [image, setImage] = useState([]);
  const [userICPic, setUserICPic] = useState([{
    uri: null,
  }]);

  const [userPaySlipPic, setUserPaySlipPic] = useState([{
    uri: null,
  }]);

  useEffect(() => {
    getUserDetails();
  }, []);

  // useEffect(() => {
  //   if (image) {
  //     console.log("Image: ", image);
  //   }
  // }, [image]);

  const getUserDetails = async () => {
    await firestore().collection("Users")
    .doc(userId)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        //console.log('User data from Firestore: ', documentSnapshot.data());

        setDetails(documentSnapshot.data());
        setRole(documentSnapshot.data().userRole);

        setUserICPic([{
          uri: documentSnapshot.data().userIC,
        }])

        if (documentSnapshot.data().userExtraDocument) {
          setUserPaySlipPic([{
            uri: documentSnapshot.data().userExtraDocument,
          }])
          setHasPaySlip(true);
        }
        
        //var ic = [];
        //var icobject = {};
        //icobject["uri"] = documentSnapshot.data().userIC;
        //ic.push(icobject);
        //console.log("ic:", ic);
        //setImage(ic);
        //console.log("Image: ", image);

        var createdDate = new Date(documentSnapshot.data().userCreatedDate.seconds * 1000 + documentSnapshot.data().userCreatedDate.nanoseconds/1000000);
        let formattedCreateddate = createdDate.getDate() + " " + months[createdDate.getMonth()] + " " + createdDate.getFullYear(); 
        var createddateText = formattedCreateddate.toString();
        setUserDate(createddateText);
      }
    });   
    
  }

  const showCancelConfirmDialog = () => {
    return Alert.alert(
      "Approve User",
      "Approve this user?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            approveUser();
          },
        },
        
      ]
    );
  };

  const approveUser = async () => {
    await firestore().collection("Users")
    .doc(userId)
    .update({
      userVerification: 'Verified',
    })
    .then(() => {
      ToastAndroid.show('User Approved.', ToastAndroid.LONG,);
      navigation.navigate("User Approval");
    });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileContainer}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View>
            <Image style={styles.profileImage} 
            source={{uri: details ? details.userPic || 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6' 
            : 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6'}}
            />
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={{padding: 15}}>
          <Text style={{color: 'black', fontSize: 21, textDecorationLine: 'underline', fontWeight: 'bold', }}>User Information:</Text>
 
          <View style={{marginTop: 15}}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="attachment" color="black" size={22}/>
              <Text style={styles.rowText}>
                {userId}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="account" color="black" size={22}/>
              <Text style={styles.rowText}>
                {details ? details.userFirstName : ''} {details ? details.userLastName : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <AntDesign name="idcard" color="black" size={22}/>
              <Text style={styles.rowText}>
                {details ? details.userICNum : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker-radius" color="black" size={22}/>
              <Text style={styles.rowText}>
                {details ? details.userAddress : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="phone-dial" color="black" size={22}/>
              <Text style={styles.rowText}>
                {details ? details.userPhoneNum : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialIcons name="alternate-email" color="black" size={22}/>
              <Text style={styles.rowText}>
                {details ? details.userEmail : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <AntDesign name="calendar" color="black" size={22}/> 
              <Text style={styles.rowText}>
                {userDate}
              </Text>
            </View>
          </View>

          {/* Button Section */}
          {navigateFrom === 'ApprovalScreen' && 
          <View style={styles.buttonView}>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setICVisible(true)} >
                <Text style={styles.buttonText}>View User Identification Card</Text>
              </TouchableOpacity>
            </View>

            {hasPaySlip &&  
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setPaySlipVisible(true)} >
                  <Text style={styles.buttonText}>View User Pay Slip</Text>
                </TouchableOpacity>
              </View>
            }

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => showCancelConfirmDialog()} >
                <Text style={styles.buttonText}>Approve User</Text>
              </TouchableOpacity>
            </View>

          </View> 
          }

        </View>
      </View>

      {role === 'Donor' && navigateFrom === 'UserListScreen' &&
      <TouchableOpacity onPress={() => navigation.navigate("User Donation List", {userId: userId, userRole: 'donorID', headerTitle: details.userFirstName +"'s Donation Jobs"})}>
        <View style={styles.subButtonRow}>
          <Text style={styles.subButtonRowText}>View User's Accepted Donation Jobs</Text>
          <AntDesign name="right" color="black" size={18} style={styles.subButtonRowIcon} />
        </View>
      </TouchableOpacity>
      }

      {role === 'Requester' && navigateFrom === 'UserListScreen' &&
      <TouchableOpacity onPress={() => navigation.navigate("User Request List", {userId: userId, userRole: 'requesterID', headerTitle: details.userFirstName +"'s Requested Donations"})}>
        <View style={styles.subButtonRow}>
          <Text style={styles.subButtonRowText}>View User's Donation Request List</Text>
          <AntDesign name="right" color="black" size={18} style={styles.subButtonRowIcon} />
        </View>
      </TouchableOpacity>
      }

      <ImageView
        //images={{uri: userICPic}}
        images={userICPic}
        imageIndex={0}
        visible={ICVisible}
        onRequestClose={() => setICVisible(false)}
      />

      <ImageView
        //images={{uri: userICPic}}
        images={userPaySlipPic}
        imageIndex={0}
        visible={PaySlipVisible}
        onRequestClose={() => setPaySlipVisible(false)}
      />
 
      {/* <Modal visible={visible} transparent={true}>
        <ImageZoom uri={details ? details.userIC : ''} />
      </Modal> */}

    </ScrollView>
    
  )
}

export default UserApprovalDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    //justifyContent: 'center',
    //backgroundColor: '#edf7df',
    backgroundColor: '#f2ebfc',
  },
  profileContainer: {
    paddingHorizontal: 35,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'grey',
  },
  profileImage: {
    width: 185,
    height: 185,
    borderRadius: 180/2,
  },
  detailsContainer: {
    paddingHorizontal: 8,
    marginBottom: 30,
    backgroundColor: '#d1cfcf',
    borderRadius: 15,
  },
  titleRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  titleRowText: {
    color: 'black',
    fontSize: 21,
    marginLeft: 12,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    //fontWeight: '400',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  rowText: {
    color: 'black',
    fontSize: 15,
    marginLeft: 12,
    //fontWeight: '400',
  },
  buttonView: {
    //flex: 1,
    //padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'white',
  },
  buttonContainer: {
    width: '88%',         
    marginTop: 12,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 13,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  subButtonRow: {
    flexDirection: 'row',
    //justifyContent: 'flex-start',
    marginBottom: 25,
    marginTop: -15,
    paddingVertical: 28,
    paddingHorizontal: 8,
    backgroundColor: '#93e3f5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  subButtonRowIcon: {
    //marginTop: 1,
  },
  subButtonRowText: {
    flex: 1,
    color: "black", 
    fontSize: 15, 
    marginLeft: 8,
    fontWeight: '600',
    justifyContent: 'center',
    //textAlign: 'center',
  },
})