import { PermissionsAndroid, Platform, StyleSheet, Text, ToastAndroid, View, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { mapStyle } from "../../constants/mapStyle";
import MarkerDetailsContent from './MarkerDetailsContent';
import { AuthContext } from '../../navigation/AuthProvider';

const MapScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const mapRef = useRef(null);
  
  const [refresh, setRefresh] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState(null);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);
  const [region, setRegion] = useState({  
    latitude: 3.1390,
    longitude: 101.6869,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [accepted, setAccepted] = useState(false);

  const donationAcceptCall = (index) => { // the callback
    setAccepted(index);
  };

  useEffect (() => {
    if (accepted) {
      showConfirmDialog();
      
      //console.log("Donation Job Accept!");
    }
  }, [accepted])

  useEffect (() => {
    getLocation();
    //getMarkers();
    navigation.addListener("focus", () => setRefresh(!refresh));
  }, [navigation, refresh])
  

  // useEffect(() => {
  //   console.log("isOpen: ",isOpen);
  // }, [isOpen]);

  // useEffect(() => {
  //   if (location) {
  //     console.log("Animate Map Check");
  //     mapRef.current.animateToRegion({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //       latitudeDelta: 0.015,
  //       longitudeDelta: 0.0121,
  //     })
  //     getMarkers();
  //   }
  // }, [region]);

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }
  
    Geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        setLocation(position);
        // setRegion({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        //   latitudeDelta: 0.015,
        //   longitudeDelta: 0.0121,
        // })
        
        mapRef.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        })
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

    getMarkers();
  };
  
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

  // const getMarkers = () => {
    
  //   var markersList = [];
  //   console.log('Get markers function called.'); 
  //   firestore().collection("DonationRequests")
  //   .where('donationState', '==', 'Available')
  //   .onSnapshot(collectionSnapshot => {
  //     setMarkers([]);
  //     console.log('Total markers: ', collectionSnapshot.size);        

  //     collectionSnapshot.forEach(documentSnapshot => {      
  //       markersList.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
  //     });
  //   });
  //   //console.log("markersList: ", markersList);
  //   setMarkers(markersList);
  // };

  //Confirmation Alert Box
  const showConfirmDialog = () => {
    return Alert.alert(
      "Accept Donation Job",
      "Are you sure you want to accept this donation job?",
      [
        {
          text: "Cancel",
          onPress: () => {
            setAccepted(false);
          },
        },
        {
          text: "Confirm",
          onPress: () => {
            accceptDonation();
            bottomSheetModalRef.current?.dismiss();
          },
        },
        
      ]
    );
  };

  const accceptDonation = async () => {
    await firestore().collection('DonationRequests')
    .doc(markerId)
    .update({
        donorID: user.uid,
        donationState: "Accepted",
        donationAcceptTime: firestore.Timestamp.fromDate(new Date()),
    })
    .then(() => {
        setMarkers([]);
        setAccepted(false);
        //console.log('Profile picture updated!');
        ToastAndroid.show('Donation accepted!', ToastAndroid.LONG,);
        getMarkers();
    });
    setAccepted(false);
    console.log("test");
  }
  
  const getMarkers = async () => {
    var markersList = [];
    const data = await firestore().collection("DonationRequests")
    .where('donationState', '==', 'Available')
    .get()
    .then(collectionSnapshot => {
      console.log('Total markers: ', collectionSnapshot.size);        
      
      collectionSnapshot.forEach(documentSnapshot => {
        markersList.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
      });
    });

    setMarkers(markersList);
  };

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["70%"];
  const [isOpen, setIsOpen] = useState(false); 
  const [markerId, setMarkerId] = useState('');

  const handlePresentModalPress = useCallback((markerid) => {
    bottomSheetModalRef.current?.dismiss();
    console.log(markerid);
    setMarkerId(markerid);
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
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
    //bottomSheetModalRef.current?.dismiss();
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        //index={1}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableDismissOnClose={true}
        onDismiss={() => setIsOpen(false)}
      >
        <BottomSheetScrollView style={styles.contentContainer}>
          {/* <MarkerDetailsContent /> */}
          {/* <MarkerDetailsContent markerid={markerId} /> */}
          {markerId != '' ? <MarkerDetailsContent markerid={markerId} donationAcceptCall={donationAcceptCall} /> : <MarkerDetailsContent /> }
          
        </BottomSheetScrollView> 
      </BottomSheetModal>


      <MapView
        ref={mapRef}
        customMapStyle={mapStyle}
        style={styles.map}
        //region={region}
        moveOnMarkerPress={false}
        //showsUserLocation={true}
      >
        {lat && long && 
          <Marker coordinate={{latitude: lat, longitude: long}}>
            <MaterialIcons name="location-history" size={30} color="blue" />
          </Marker>
        }

        {markers.map((marker) => {
          return (
            <Marker key={marker.id} 
              coordinate={{latitude: marker.mapLatitude, longitude: marker.mapLongitude}}
              onPress={() => handlePresentModalPress(marker.id)}
              //title="My location"
            >
              <FontAwesome5 name="map-marker" size={30} color="red" />
            </Marker>
          )
        })}   
      </MapView>

      <TouchableOpacity onPress={() => getLocation()} >
        <View style={styles.subButtonRow}>
          <MaterialIcons name="location-searching" color="black" size={20} />
          <Text style={styles.subButtonRowText}>Get Current Location & Refresh Map</Text>
        </View>
      </TouchableOpacity>
     </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2ebfc',
    //padding: 24,
    //justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    //backgroundColor: 'white',
  },
  map: {
    height: '90%',
    //marginTop: 20,
  },
  subButtonRow: {
    flexDirection: 'row',
    //marginBottom: 7,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 10,
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
})