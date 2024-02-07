import { FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../navigation/AuthProvider';

const MarkerDetailsContent = ({markerid, donationAcceptCall}) => {
    const {user} = useContext(AuthContext);

    const [details, setDetails] = useState(null);
    const [requestedFood, setRequestedFood] = useState([]);
    const [requesterProfile, setRequesterProfile] = useState(null);
    const [updating, setUpdating] = useState(false);

    //const [markerID, setMarkerID] = useState('');
    useEffect(() => {
        //setMarkerID(markerid.markerid);
        getMarkerDetails();
    }, []);

    const getMarkerDetails = async () => {
        console.log("Marker ID from MarkerDetailsContent.js: ", markerid);

        await firestore().collection("DonationRequests")
        .doc(markerid)
        .get()
        .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              console.log('Marker Data: ', documentSnapshot.data());
              setDetails(documentSnapshot.data());
              setRequestedFood(documentSnapshot.data().itemList);
              getRequesterProfile(documentSnapshot.data().requesterID);
                
            }
        });
    }

    const getRequesterProfile = async (requesterid) => {
        console.log("requesterID: ", requesterid);

        await firestore().collection("Users")
        .doc(requesterid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            console.log('User data from Firestore: ', documentSnapshot.data());
            setRequesterProfile(documentSnapshot.data());
          }
        });    
    } 
    

    // const accceptDonation = async () => {
    //     setUpdating(true);
    //     firestore().collection('DonationRequests')
    //     .doc(markerid)
    //     .update({
    //         donorID: user.uid,
    //         donationState: "Accepted",
    //     })
    //     .then(() => {
    //         setUpdating(false);
    //         //console.log('Profile picture updated!');
    //         ToastAndroid.show('Donation accepted!', ToastAndroid.LONG,);
    //     });
    //     setUpdating(false);
    // }

    // const getMarkerDetails = async () => {
    //     console.log("Marker ID from MarkerDetailsContent.js: ", markerid.markerid);
    //     var userList = [];
    //     const data = await firestore().collection("MapMarkerDetails")
    //     .where('MarkerID', '==', markerid.markerid)
    //     .get()
    //     .then(collectionSnapshot => {
    //       console.log('Total data: ', collectionSnapshot.size);        
          
    //       collectionSnapshot.forEach(documentSnapshot => {
    //         console.log('Marker data: ', documentSnapshot.data());  
    //         userList.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
    //       });
    //     });

    //     setDetails(userList);
    // }


  return (
    <View style={styles.container}>
        <View style={styles.profileContainer}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
                <View style={{marginRight: 15}}>
                    <Image style={styles.profileImage} 
                    source={{uri: requesterProfile ? requesterProfile.userPic || 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6' 
                    : 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6'}}
                    />
                </View>
                <View style={{marginLeft: 14}}>
                    <Text style={{color: 'black', marginTop: 30, fontSize: 13, fontStyle:"italic"}} >Requested by:</Text>
                    <Text style={{color: 'black', marginTop: 5, fontSize: 22, justifyContent: 'center'}}>
                        {requesterProfile ? requesterProfile.userFirstName : ''} {requesterProfile ? requesterProfile.userLastName : ''}
                    </Text> 
                </View>
            </View>
        </View>

        <View style={styles.detailsContainer}>
            <View style={{padding: 15}}>
                <Text style={{color: 'black', fontSize: 23, textDecorationLine: 'underline', fontWeight: 'bold', }}>Donation Request Details:</Text>
                
                <View style={{marginTop: 15}}>
                    <View style={styles.row}>
                        <Icon name="map-marker-radius" color="black" size={22}/>
                        <Text style={styles.rowText}>
                            {details ? details.donationAddress : ''}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Icon name="phone-dial" color="black" size={22}/>
                        <Text style={styles.rowText}>
                            {requesterProfile ? requesterProfile.userPhoneNum : ''}
                        </Text>
                    </View>
                </View>

                {/* Food Requested Section */}
                <Text style={{color: 'black', fontSize: 23, textDecorationLine: 'underline', fontWeight: 'bold', }}>Food Requested:</Text>
                
                <View style={{marginTop: 8}}>

                    {requestedFood.map((food,index) => (
                        <Text style={styles.foodlist} key={index}>{'\u2022'} {food}</Text>
                    ))}

                </View>

                {/* Button Section */}
                <View style={styles.buttonView}>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => donationAcceptCall(true)} >
                        <Text style={styles.buttonText}>Accept Donation</Text>
                    </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    </View>
  )
}

export default MarkerDetailsContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        //justifyContent: 'center',
        //backgroundColor: 'white',
    },
    profileContainer: {
        paddingHorizontal: 35,
        marginBottom: 25,
        //backgroundColor: 'grey',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 120/2,
        marginLeft: -25,
    },
    detailsContainer: {
        paddingHorizontal: 8,
        //marginBottom: 25,
        backgroundColor: '#e6e6e6',
        borderRadius: 10,
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
    foodlist: {
        color: 'black',
        fontSize: 18,
        //marginTop: -5,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    buttonView: {
        //flex: 1,
        //padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'white',
    },
    buttonContainer: {
        width: '68%',         
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