import { Alert, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, SafeAreaView, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { BottomSheetModal, BottomSheetBackdrop  } from '@gorhom/bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';

import { AuthContext } from '../navigation/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';

const UserprofileScreen = ({navigation, route}) => {
  
  const {user, logout} = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [verification, setVerification] = useState(null);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getUserProfile = async () => {
    setRefreshing(true);
    await firestore().collection("Users")
    .doc(user.uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        console.log('User data from Firestore: ', documentSnapshot.data());
        setUserProfile(documentSnapshot.data());
        setRole(documentSnapshot.data().userRole);
        setVerification(documentSnapshot.data().userVerification);
      }
    });
    setRefreshing(false);    
  }

  useEffect (() => {
    console.log('Useeffect start');
    if (userProfile == null || profileUpdated ) {
      getUserProfile();
      setProfileUpdated(false);
      //console.log("User Data in userProfile state: ", userProfile);
    }
    navigation.addListener("focus", () => setProfileUpdated(true));
  }, [profileUpdated, navigation]) 
  
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const takePhotoFromCamera = async () => {
    try {
      await ImagePicker.openCamera({
        width: 500,
        height: 600,
        cropping: true,
        cropperCircleOverlay: true,
        useFrontCamera: true,
        compressImageQuality: 0.7,
      }).then(image => {
        console.log(image);
        setImage(image.path);
        updateProfilePic(image.path);
      });
    } catch(error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return false;
      }
      console.log("Error:", error); 
    }

  }

  const uploadPhotoFromDevice = async () => {
    try {
      await ImagePicker.openPicker({
        width: 500,
        height: 600,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.7,
      }).then(image => {
        //console.log(image);
        setImage(image.path);
        updateProfilePic(image.path);
      });
    } catch(error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return false;
      }
      console.log("Error:", error); 
    }
    
  }

  const updateProfilePic = async (imagePath) => {
    bottomSheetModalRef.current?.dismiss();
    setUploading(true);
    
    //delete image from cloud storage
    if (userProfile.userPic) {
      let imageUrlRef = storage().refFromURL(userProfile.userPic);
      imageUrlRef.delete()
      .then(() => {
        console.log('Original profile picture has been deleted from storage successfully.');
      })
      .catch((e) => console.log('Error while deleting profile picture: ', e));
    }
    

    //upload to cloud storage
    console.log("uploadphoto to database start");
    const photoUrl = image;
    let imagename = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    

    try {
      await storage().ref(imagename).putFile(imagePath);
      
      //Alert.alert('Image Uploaded!', 'Your image has been uploaded to Cloud storage successfully.');
      setUploaded(true);
      
      //get uploaded image url
      const url = await storage().ref(imagename).getDownloadURL();
      console.log("New Profile Picture URL: ", url);
     
      firestore().collection('Users')
      .doc(user.uid)
      .update({
        userPic: url,
      })
      .then(() => {
        console.log('Profile picture updated!');
        ToastAndroid.show('Profile Picture Updated!', ToastAndroid.LONG,);
        setProfileUpdated(true);
        
      });
    
    } catch (error) {
      console.log(error);
    }

    setImage(null);
    setUploaded(false);
    setUploading(false);
  }

  const loadingtest = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
    }, 3000);
  }


  //Bottom Sheet
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["30%"];

  const handlePresentModalPress = useCallback(() => {
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

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetButtonContainer}>
              {/* <TouchableOpacity style={styles.bottomSheetButton} onPress={uploadPhotoFromDevice} > */}
              <TouchableOpacity style={styles.bottomSheetButton} onPress={uploadPhotoFromDevice} >
                <Text style={styles.bottomSheetButtonText}>Upload Photo From Device</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSheetButtonContainer}>
              <TouchableOpacity style={styles.bottomSheetButton} onPress={takePhotoFromCamera} >
                <Text style={styles.bottomSheetButtonText}>Take Photo From Camera</Text>
              </TouchableOpacity>
            </View>
            
        </View>
      </BottomSheetModal>

      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getUserProfile}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
        
          <TouchableOpacity onPress={() => handlePresentModalPress()}>
            <Image style={styles.profileImage}
                source={{uri: userProfile ? userProfile.userPic || 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6' 
                : 'https://firebasestorage.googleapis.com/v0/b/fooddirect-f00d0.appspot.com/o/emptyProfilePic.jpg?alt=media&token=fba90def-6dbb-4523-89da-719602c8e4a6'}}
            />
          </TouchableOpacity>
        </View> 

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <AntDesign name="user" color="black" size={23} style={styles.rowIcon} />
            <Text style={styles.rowText}>
              {userProfile ? userProfile.userFirstName || 'firstname' : 'firstname'} {userProfile ? userProfile .userLastName || 'lastname' : 'lastname'}
            </Text>
          </View>

          <View style={styles.row}>
            <Feather name="map" color="black" size={23} style={styles.rowIcon} />
            <Text style={styles.rowText}>{userProfile ? userProfile.userAddress || 'address' : 'address'}</Text>
          </View>

          <View style={styles.row}>
            <Feather name="phone" color="black" size={23} style={styles.rowIcon} />
            <Text style={styles.rowText}>{userProfile ? userProfile.userPhoneNum || 'phone number' : 'phone number'}</Text>
          </View>

          <View style={styles.row}>
            <AntDesign name="mail" color="black" size={23} style={styles.rowIcon} />
            <Text style={styles.rowText}>{user ? user.email || 'email' : 'email'}</Text>
          </View>

          {role === 'Requester' &&
          <View style={styles.row}>
            <Octicons name="verified" color="black" size={23} style={styles.rowIcon} />
            <Text style={styles.rowText}>{userProfile ? userProfile.userVerification || '' : ''}</Text>
          </View>
          }

          {/* Button View */}
          <View style={styles.buttonView}>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Edit Profile")} >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => logout()} >
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>        
      </ScrollView>

      
      {uploading &&
        <View style={styles.loading}>
          <ActivityIndicator size={80} color={'#d5f5db'} />
        </View>
      }
    </SafeAreaView>
  )
}

export default UserprofileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2ebfc',
  },
  imageContainer: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    //paddingHorizontal: 35,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 200/2,
  },
  detailsContainer: {
    //paddingHorizontal: 30,
    //marginBottom: 25,
    marginVertical: 20,
    paddingHorizontal: 8,
    //padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    //marginTop: 15,
    marginVertical: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    //borderEndWidth: 2,
    //borderStartWidth: 2,
    borderRadius: 10,
    //borderStyle: 'dashed',
    //padding: 10,
    //justifyContent: "space-between",
  },
  rowIcon: {
    marginTop: 1,
  },
  rowText: {
    color:"black", 
    fontSize: 16, 
    marginLeft: 12,
    fontWeight: '500',
  },
  bottomSheetContainer: {
    //flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'white',
  },
  bottomSheetButtonContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 5,
    marginBottom: 8,
  },
  bottomSheetButton: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
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
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
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