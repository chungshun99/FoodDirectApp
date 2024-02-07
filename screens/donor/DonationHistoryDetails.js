import { Alert, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import ImageView from "react-native-image-viewing";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import { AuthContext } from '../../navigation/AuthProvider';

const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];

const appendLeadingZeroes = (n) => {
  if(n <= 9){
    return "0" + n;
  }
  return n
}

const DonationHistoryDetails = ({route, navigation}) => {
  const { donationId } = route.params;
  const { userRole} = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [requestedFood, setRequestedFood] = useState([]);
  const [requesterProfile, setRequesterProfile] = useState(null);
  const [acceptedDate, setAcceptedDate] = useState(null);
  const [completedDate, setCompletedDate] = useState(null);
  const [statusCompleted, setStatusCompleted] = useState(null);
  const [visible, setVisible] = useState(false);

  const [completionPhoto, setCompletionPhoto] = useState([{
    uri: null,
  }]);

  useEffect(() => {
    getDonationDetails();
  }, []);

  const getDonationDetails = async () => {

    await firestore().collection("DonationRequests")
    .doc(donationId)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        setDetails(documentSnapshot.data());
        setRequestedFood(documentSnapshot.data().itemList);
        
        var acceptDate = new Date(documentSnapshot.data().donationAcceptTime.seconds * 1000 + documentSnapshot.data().donationAcceptTime.nanoseconds/1000000);
        let formattedAcceptdate = acceptDate.getDate() + " " + months[acceptDate.getMonth()] + " " + acceptDate.getFullYear(); 
        var acceptdateText = formattedAcceptdate.toString();

        if (documentSnapshot.data().donationCompleteTime) {
          var completeDate = new Date(documentSnapshot.data().donationCompleteTime.seconds * 1000 + documentSnapshot.data().donationCompleteTime.nanoseconds/1000000);
          let formattedCompletedate = completeDate.getDate() + " " + months[completeDate.getMonth()] + " " + completeDate.getFullYear(); 
          var completedateText = formattedCompletedate.toString();

          setCompletedDate(completedateText);
        }
        
        setAcceptedDate(acceptdateText);

        if (documentSnapshot.data().donationState !== 'Completed') {
          setStatusCompleted(false);
        } else if (documentSnapshot.data().donationState === 'Completed') {
          setStatusCompleted(true);
          setCompletionPhoto([{
            uri: documentSnapshot.data().donationCompletePhoto,
          }])
        }

        getRequesterProfile(documentSnapshot.data().requesterID);  
      }
    });
  }

  const getRequesterProfile = async (requesterid) => {
    //console.log("requesterID: ", requesterid);
    await firestore().collection("Users")
    .doc(requesterid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        //console.log('User data from Firestore: ', documentSnapshot.data());
        setRequesterProfile(documentSnapshot.data());
      }
    });    
  } 

  //Confirmation Alert Box
  const showCancelConfirmDialog = () => {
    return Alert.alert(
      "Donation Job Cancellation",
      "Are you sure that you want to cancel this donation job?",
      [
        {
          text: "Back",
        },
        {
          text: "Confirm",
          onPress: () => {
            cancelDonation();
          },
        },
        
      ]
    );
  };

  const cancelDonation = async () => {
    await firestore().collection("DonationRequests")
    .doc(donationId)
    .update({
      donationState: 'Available',
      donorID: '',
      donationAcceptTime: '',
    })
    .then(() => {
      ToastAndroid.show('Donation job cancelled.', ToastAndroid.LONG,);
      navigation.navigate("Donation History");
    });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileContainer}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View>
            <Image style={styles.profileImage} 
            source={{uri: requesterProfile ? requesterProfile.userPic || 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6' 
            : 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6'}}
            />
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={{padding: 15}}>
          <Text style={{color: 'black', fontSize: 21, textDecorationLine: 'underline', fontWeight: 'bold', }}>Donation Request Information:</Text>
 
          <View style={{marginTop: 15}}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="attachment" color="black" size={22}/>
              <Text style={styles.rowText}>
                Donation ID: #{donationId}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="account" color="black" size={22}/>
              <Text style={styles.rowText}>
                {requesterProfile ? requesterProfile.userFirstName : ''} {requesterProfile ? requesterProfile.userLastName : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker-radius" color="black" size={22}/>
              <Text style={styles.rowText}>
                {details ? details.donationAddress : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="phone-dial" color="black" size={22}/>
              <Text style={styles.rowText}>
                {requesterProfile ? requesterProfile.userPhoneNum : ''}
              </Text>
            </View>
          </View>

          {/* Status Section */}
          <Text style={{color: 'black', fontSize: 18, textDecorationLine: 'underline', fontWeight: 'bold', }}>Donation Status:</Text>
          
          <View style={{marginTop: 10}}>
            <View style={styles.row}>
              <Feather name="info" color="black" size={22}/> 
              <Text style={styles.rowText}>
                Status: {details ? details.donationState : ''}
              </Text>
            </View>

            <View style={styles.row}>
              <Feather name="plus-circle" color="black" size={22}/> 
              <Text style={styles.rowText}>
                Accept Date:  {acceptedDate}
              </Text>
            </View>

            <View style={styles.row}>
              <Feather name="check-circle" color="black" size={22}/> 
              <Text style={styles.rowText}>
                Completion Date:  {completedDate}
              </Text>
            </View>

          </View>

          {/* Food Requested Section */}
          <Text style={{color: 'black', fontSize: 21, textDecorationLine: 'underline', fontWeight: 'bold', marginTop: 15 }}>Food Requested:</Text>
          
          <View style={{marginTop: 8}}>

            {requestedFood.map((food,index) => (
              <Text style={styles.foodlist} key={index}>{'\u2022'} {food}</Text>
            ))}

          </View>

          {/* Button Section */}
          {!statusCompleted && userRole === 'Donor' ?
          <View style={styles.buttonView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Donation Job Completion", {donationId: donationId})} >
                <Text style={styles.buttonText}>Complete Donation Job</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => showCancelConfirmDialog()} >
                <Text style={styles.buttonText}>Cancel Donation Job</Text>
              </TouchableOpacity>
            </View>

          </View> 
          : null }

          {statusCompleted && 
          <View style={styles.buttonView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setVisible(true)} >
                <Text style={styles.buttonText}>View Donation Complete Photo</Text>
              </TouchableOpacity>
            </View>

          </View> 
          }

          {/* {!statusCompleted &&
          <View style={styles.buttonView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Donation Job Completion", {donationId: donationId})} >
                <Text style={styles.buttonText}>Complete Donation Job</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => showCancelConfirmDialog()} >
                <Text style={styles.buttonText}>Cancel Donation Job</Text>
              </TouchableOpacity>
            </View>

          </View>
          } */}
          

        </View>
      </View>
      
      <ImageView
        //images={{uri: userICPic}}
        images={completionPhoto}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />

    </ScrollView>

  )
}

export default DonationHistoryDetails

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
    marginBottom: 22,
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
  testHeader: {
    flex: 1,
  },
  testrow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  testrowheader: {
    color: 'black',
    fontSize: 15,
    marginLeft: 12,
    //fontWeight: '400',
  },
  testFooter: {
    flex: 2,
  },
  testrowText: {
    backgroundColor: 'white',
  },
  foodlist: {
    color: 'black',
    fontSize: 17,
    //marginTop: -5,
    marginBottom: 10,
    paddingHorizontal: 8,
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
})