import { Alert, Keyboard, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import Geocoder from 'react-native-geocoding';
import { mapStyle } from '../../constants/mapStyle';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AuthContext } from '../../navigation/AuthProvider';

import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ActivityIndicator } from 'react-native-paper';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';

Geocoder.init("");

const RequestDonationScreen = ({navigation, route}) => {
  
  const {user} = useContext(AuthContext);
  const mapRef = useRef(null);
  
  const [userVerified, setUserVerified] = useState(false);

  const [firstRun, setFirstRun] = useState(true);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({  
    latitude: 3.1390,
    longitude: 101.6869,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const [formattedAddress, setFormattedAddress] = useState(null);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);


  // useEffect (() => {
  //   setUserVerified(false);
  //   setFirstRun(true);
  //   getUserVerification();
  //   navigation.addListener("focus", () => setRefresh(!refresh));
  // }, [navigation, refresh])

  //Get location on first run
  useEffect (() => {
    if (userVerified) {
      getLocation();
    }
  }, [userVerified])

  useEffect(() => {
    if (location) {
      console.log("Animate Map Check");
      mapRef.current.animateToRegion({
        region
      })
    }
  }, [region]);

  // const getUserVerification = async () => {
  //   await firestore().collection("Users")
  //   .doc(user.uid)
  //   .get()
  //   .then(documentSnapshot => {
  //     if (documentSnapshot.exists) {
  //       if (documentSnapshot.data().userVerification === 'Verified') {
  //         setUserVerified(true);
  //       }
  //     }
  //   });  
  // }

  //Address text changes
  useEffect(() => {
    if (!firstRun) {
      const timer = setTimeout(() => {
        getLocationFromText();
      }, 800)

      return () => clearTimeout(timer)
    }
    
  }, [formattedAddress])


  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
  
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        })
        //console.log("Get Location Function: ", position);
        
        Geocoder.from(position.coords.latitude, position.coords.longitude)
        .then(json => {
          //console.log("Geocoder json: ", json);

          setFormattedAddress(json.results[0].formatted_address);
          console.log("Formatted Address: ", json.results[0].formatted_address);
          
          // var addressComponent = json.results[0].address_components;
          // console.log("addressComponent: ", addressComponent);

          //get lat and long
          var location = json.results[0].geometry.location;
          setLat(location.lat);
          setLong(location.lng);
          // console.log("Location: ", location);

		    })
		    .catch(error => console.warn(error));
        
      },
      (error) => {
        Alert.alert('Code ${error.code}', error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        //enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        //forceLocationManager: useLocationManager,
        showLocationDialog: true,
      },
    );

    setFirstRun(false);
  };
  
  const getLocationFromText = () => {
    Geocoder.from(formattedAddress)
    .then(json => {
      //console.log("Geocoder json: ", json);

      //get lat and long
      var newLocation = json.results[0].geometry.location;
      setLat(newLocation.lat);
      setLong(newLocation.lng);
      console.log("Lat Long from new Address: ", newLocation);

      setRegion({
        latitude: newLocation.lat,
        longitude: newLocation.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      })

    })
    .catch(error => console.warn(error));
  }

  const getLatLongFromAddress = () => {
    Geocoder.from(formattedAddress)
    .then(json => {
      //console.log("Geocoder json: ", json);

      //get lat and long
      var location = json.results[0].geometry.location;
      console.log("Lat Long from Address: ", location);

    })
    .catch(error => console.warn(error));
  }

  const hasLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  //Get user details
  const [userProfile, setUserProfile] = useState(null);
  const [refresh, setRefresh] = useState(true);

  useEffect (() => {
    //setUserVerified(false);
    setFirstRun(true);
    getUserProfile();
    navigation.addListener("focus", () => setRefresh(!refresh));
  }, [navigation, refresh]) 

  const getUserProfile = async () => {
    await firestore().collection("Users")
    .doc(user.uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        //console.log('User data from Firestore: ', documentSnapshot.data());
        setUserProfile(documentSnapshot.data());
        if (documentSnapshot.data().userVerification === 'Verified') {
          setUserVerified(true);
        }
        else {
          setUserVerified(false);
        }
      }
    });    
  }

  //Bottom Sheet
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["70%"];

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const [inserting, setInserting] = useState(false);
  const [foodList, setFoodList] = useState([]);
  const [food, setFood] = useState('');

  const deleteItem = (index) => {
    let itemsCopy = [...foodList];
    itemsCopy.splice(index, 1);
    setFoodList(itemsCopy);
  }

  const addItem = () => {
    if (food) {
      setFoodList([...foodList, food]);
    }
    setFood(null);
  }

  //Confirmation Alert Box
  const showConfirmDialog = () => {
    return Alert.alert(
      "Donation Request Confirmation",
      "Are you confirmed with the donation request details?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            insertRequestToDatabase();
          },
        },
      ]
    );
  };

  const insertRequestToDatabase = async () => {
    setInserting(true);
    var pass = true;
    if (formattedAddress == "") {
      pass = false;
      ToastAndroid.show('Address cannot be empty!', ToastAndroid.SHORT,);
    } else if (food.length == 0) {
      pass = false;
      ToastAndroid.show('Food request list cannot be empty!', ToastAndroid.SHORT,);
    }
    if (pass) {
      firestore().collection('DonationRequests').add({
        requesterID: user.uid,
        mapLatitude: lat,
        mapLongitude: long,
        itemList: foodList,
        donorID: '',
        donationAddress: formattedAddress,
        donationState: 'Available',
        donationRequestTime: firestore.Timestamp.fromDate(new Date()),
        donationAcceptTime: '',
        donationCompleteTime: '',
        donationCompletePhoto: '',
      })
      .then(() => { 
        console.log('Donation Requested!');
        ToastAndroid.show('Donation Requested.', ToastAndroid.SHORT,);
      });
    } 
    
    setInserting(false);
  }

  if (!userVerified) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'black', padding: 15, fontSize: 20, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
          Kindly wait for admin approval.
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        //index={1}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableDismissOnClose={true}
      >
        <BottomSheetScrollView style={styles.contentContainer}>
          <View style={styles.bottomSheetInput}>     
            <FloatingLabelInput 
              label="Click add to insert food into request list"
              staticLabel
              value={food}
              onChangeText={text => setFood(text)}
              leftComponent={<MaterialCommunityIcons name="food-outline" color="black" size={25}/>} 
              containerStyles={styles.inputContainerStyle}
              customLabelStyles={styles.inputLabelFocusedStyle}
              labelStyles={styles.inputLabelStyle}
              inputStyles={styles.inputStyle}
            />
          </View>
          
          <TouchableOpacity onPress={() => addItem()}>
            <View style={styles.bottomSheetsubButtonRow}>
              <Entypo name="add-to-list" color="black" size={20} style={styles.bottomSheetsubButtonRowIcon} />
              <Text style={styles.bottomSheetsubButtonRowText}>Add</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.bottomSheettitle}>Request List:</Text>
              
          {foodList.map((item,index) => (
            <View key={index} style={styles.bottomSheetlistRow}>
              <Text style={styles.bottomSheetfood}>{'\u2022'} {item}</Text>
              <TouchableOpacity key={index} onPress={() => deleteItem(index)} >
                <Feather name="trash-2" color="black" size={22} />
              </TouchableOpacity>
            </View>
          ))}   
        </BottomSheetScrollView> 
      </BottomSheetModal>

      <View style={styles.header} pointerEvents="none">
        <MapView
          ref={mapRef}
          customMapStyle={mapStyle}
          style={styles.map}
          region={region}
          //showsUserLocation={true}
        >  
          {lat && long && 
            <Marker coordinate={{latitude: lat, longitude: long}}>
              <FontAwesome5 name="map-pin" size={25} color="red" />
            </Marker>
          }
        </MapView>
      </View>
      <View style={styles.bottomView}> 
        
        <View style={styles.input}>     
          <FloatingLabelInput 
            label="Address"
            staticLabel
            multiline={true}
            value={formattedAddress}
            onChangeText={(text) => setFormattedAddress(text)}
            leftComponent={ <Feather name="map-pin" color="black" size={25}/>} 
            containerStyles={styles.inputContainerStyle}
            customLabelStyles={styles.inputLabelFocusedStyle}
            labelStyles={styles.inputLabelStyle}
            inputStyles={styles.inputStyle}
          />
        </View>
        

        <TouchableOpacity onPress={() => getLocation()} >
          <View style={styles.subButtonRow}>
            <MaterialIcons name="location-searching" color="black" size={20} />
            <Text style={styles.subButtonRowText}>Get Current Location</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Donation Info: </Text>
      
        <View style={styles.row}>
          <AntDesign name="user" color="black" size={25} style={styles.rowIcon} />
          <Text style={styles.rowText}>
            {userProfile ? userProfile.userFirstName : ''} {userProfile ? userProfile .userLastName : ''}
          </Text>
        </View>

        <View style={styles.row}>
          <Feather name="phone" color="black" size={25} style={styles.rowIcon} />
          <Text style={styles.rowText}>
            {userProfile ? userProfile.userPhoneNum : ''}
          </Text>
        </View>

        <TouchableOpacity onPress={() => handlePresentModalPress()} >
          <View style={styles.subButtonRow}>
            <Entypo name="list" color="black" size={20} />
            <Text style={styles.subButtonRowText}>Manage Food Request List</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.buttonView}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => showConfirmDialog()} >
              <Text style={styles.buttonText}>Request Donation</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {inserting &&
        <View style={styles.loading}>
          <ActivityIndicator size={80} color={'#d5f5db'} />
        </View>
      }
    </SafeAreaView>    

  )
}

export default RequestDonationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2ebfc',
  },
  header: {
    flex: 1,
    backgroundColor: '#f2ebfc',
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 5,
  },
  bottomView: {
    flex: 3.5,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f2ebfc',
  },
  inputContainer: {
    width: '85%',
  },
  map: {
    height: '100%',
  },
  input: {
    paddingVertical: 5,
    marginBottom: 3,
  },
  inputContainerStyle: {
    borderBottomWidth: 1.5,
  },
  inputLabelFocusedStyle: {
    //colorFocused: '#0b16e0',
    fontSizeFocused: 14,
    fontSizeBlurred: 12,
  },
  inputLabelStyle: {
    //backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  inputStyle: {
    color: 'black',
    paddingHorizontal: 10,
    fontSize: 15,
  },
  subButtonRow: {
    flexDirection: 'row',
    marginBottom: 7,
    //marginVertical: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#cdcfd1',
    backgroundColor: '#cdcfd1',
    borderRadius: 10,
    //justifyContent: "space-between",
  },
  subButtonRowText: {
    color:"black", 
    fontSize: 15, 
    marginLeft: 14,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',         
    marginTop: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    //marginTop: 15,
    marginVertical: 5,
    paddingVertical: 5,
    //paddingHorizontal: 10,
    borderBottomWidth: 1.5,
    //borderEndWidth: 2,
    //borderStartWidth: 2,
    //borderRadius: 20,
    //padding: 10,
    //justifyContent: "space-between",
  },
  rowIcon: {
    marginTop: 1,
  },
  rowText: {
    color:"black", 
    fontSize: 19, 
    marginLeft: 14,
    fontWeight: '600',
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
    marginTop: 15,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  bottomSheetInput: {
    //paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 3,
  },
  bottomSheetsubButtonRow: {
    flexDirection: 'row',
    marginBottom: 7,
    marginVertical: -8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#cdcfd1',
    backgroundColor: '#cdcfd1',
    borderRadius: 10,
    //justifyContent: "space-between",
  },
  bottomSheetsubButtonRowIcon: {
    marginTop: 1,
  },
  bottomSheetsubButtonRowText: {
    color:"black", 
    fontSize: 15, 
    marginLeft: 14,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheettitle: {
    marginTop: 10,
    color: 'black', 
    fontSize: 21,
    textDecorationLine: 'underline',
    marginBottom: 3,
  },
  bottomSheetfood: {
    flex: 1,
    color: 'black',
    fontSize: 17,
  },
  bottomSheetlistRow: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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