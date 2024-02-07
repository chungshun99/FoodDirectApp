import { Alert, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import ImageView from "react-native-image-viewing";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../navigation/AuthProvider';

const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];

const RequestHistoryDetails = ({route, navigation}) => {
  const { donationId } = route.params;
  const { userRole} = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [requestedFood, setRequestedFood] = useState([]);
  const [donorProfile, setDonorProfile] = useState(null);
  const [requestedDate, setRequestedDate] = useState(null);
  const [acceptedDate, setAcceptedDate] = useState(null);
  const [completedDate, setCompletedDate] = useState(null);
  const [status, setStatus] = useState(null);

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

        //Set Request Date
        var requestDate = new Date(documentSnapshot.data().donationRequestTime.seconds * 1000 + documentSnapshot.data().donationRequestTime.nanoseconds/1000000);
        let formattedRequestdate = requestDate.getDate() + " " + months[requestDate.getMonth()] + " " + requestDate.getFullYear(); 
        var requestdateText = formattedRequestdate.toString();
        setRequestedDate(requestdateText);
        
        //Set Accept Date (if any)
        if (documentSnapshot.data().donationAcceptTime) {
          var acceptDate = new Date(documentSnapshot.data().donationAcceptTime.seconds * 1000 + documentSnapshot.data().donationAcceptTime.nanoseconds/1000000);
          let formattedAcceptdate = acceptDate.getDate() + " " + months[acceptDate.getMonth()] + " " + acceptDate.getFullYear(); 
          var acceptdateText = formattedAcceptdate.toString();
          
          setAcceptedDate(acceptdateText);
        }
        
        //Set Complete Date (if any)
        if (documentSnapshot.data().donationCompleteTime) {
          var completeDate = new Date(documentSnapshot.data().donationCompleteTime.seconds * 1000 + documentSnapshot.data().donationCompleteTime.nanoseconds/1000000);
          let formattedCompletedate = completeDate.getDate() + " " + months[completeDate.getMonth()] + " " + completeDate.getFullYear(); 
          var completedateText = formattedCompletedate.toString();

          setCompletedDate(completedateText);
        }
        
        //Set complete status to false
        if (documentSnapshot.data().donationState !== 'Available') {
          getDonorProfile(documentSnapshot.data().donorID);  
          //setStatusCompleted(true);
        }
        
        setStatus(documentSnapshot.data().donationState);
        if (documentSnapshot.data().donationState === 'Completed') {
          setCompletionPhoto([{
            uri: documentSnapshot.data().donationCompletePhoto,
          }])
        }
        
      }
    });
  }
    
  const getDonorProfile = async (donorid) => {
    //console.log("requesterID: ", requesterid);
    await firestore().collection("Users")
    .doc(donorid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        //console.log('User data from Firestore: ', documentSnapshot.data());
        setDonorProfile(documentSnapshot.data());
      }
    });    
  } 

  const updateFoodlist = async (updatedFoodlist) => { // the callback
    await firestore().collection("DonationRequests")
    .doc(donationId)
    .update({
      itemList: updatedFoodlist,
    })
    .then(() => {
      ToastAndroid.show('Updated food request list.', ToastAndroid.LONG,);
    });

    setRequestedFood(updatedFoodlist);
  };
    
  //Confirmation Alert Box
  const showCancelConfirmDialog = () => {
    return Alert.alert(
      "Donation Request Cancellation",
      "Are you sure that you want to cancel this donation request?",
      [
        {
          text: "Back",
        },
        {
          text: "Confirm",
          onPress: () => {
          cancelDonationRequest();
          },
        },
      ]
    );
  };
    
  const cancelDonationRequest = async () => {
    await firestore().collection("DonationRequests")
    .doc(donationId)
    .delete()
    .then(() => {
      ToastAndroid.show('Donation request deleted.', ToastAndroid.LONG,);
      navigation.navigate("Donation Requests History");
    });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileContainer}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <View>
            <Image style={styles.profileImage} 
            source={{uri: donorProfile ? donorProfile.userPic || 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6' 
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
              <MaterialCommunityIcons name="map-marker-radius" color="black" size={22}/>
              <Text style={styles.rowText}>
                {details ? details.donationAddress : ''}
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
          <Text style={{color: 'black', fontSize: 18, textDecorationLine: 'underline', fontWeight: 'bold', marginTop: 15 }}>Food Requested:</Text>
          
          <View style={{marginTop: 8}}>

            {requestedFood.map((food,index) => (
              <Text style={styles.foodlist} key={index}>{'\u2022'} {food}</Text>
            ))}

          </View>


          {/* Donor Information Section */}
          {status !== 'Available' ?
          <View>
            <Text style={{color: 'black', fontSize: 21, textDecorationLine: 'underline', fontWeight: 'bold', marginTop: 15 }}>Donor Details:</Text>
            
            <View style={{marginTop: 15}}>

              <View style={styles.row}>
                <MaterialCommunityIcons name="account" color="black" size={22}/>
                <Text style={styles.rowText}>
                  {donorProfile ? donorProfile.userFirstName : ''} {donorProfile ? donorProfile.userLastName : ''}
                </Text>
              </View>

              <View style={styles.row}>
                <MaterialCommunityIcons name="phone-dial" color="black" size={22}/>
                <Text style={styles.rowText}>
                  {donorProfile ? donorProfile.userPhoneNum : ''}
                </Text>
              </View>
            </View>
          </View>
          : null }

          {/* Button Section */}
          {status === 'Available' && userRole === 'Requester' ?
          <View style={styles.buttonView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Manage Food Request List", {foodlist: requestedFood, updateRequestlist: (updatedfoodlist) => updateFoodlist(updatedfoodlist) } )} >
                <Text style={styles.buttonText}>Edit Food Request List</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => showCancelConfirmDialog()} >
                <Text style={styles.buttonText}>Cancel Donation Request</Text>
              </TouchableOpacity>
            </View>

          </View> 
          : null } 

          {status === 'Completed' &&
          <View style={styles.buttonView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setVisible(true)} >
                <Text style={styles.buttonText}>View Donation Complete Photo</Text>
              </TouchableOpacity>
            </View>
          </View> 
          }        

        </View>
      </View>

      <ImageView
        images={completionPhoto}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
      
    </ScrollView>
  )
}

export default RequestHistoryDetails

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