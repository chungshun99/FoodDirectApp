import { Alert, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';
import ImageView from "react-native-image-viewing";

const CompleteDonationScreen = ({route, navigation}) => {

  const {user} = useContext(AuthContext);
  const { donationId } = route.params;

  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageStorageUrl, setImageStorageUrl] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect (() => {
    console.log("uploaded state: ", uploaded);
    if (uploaded) {
      getImageStorageUrl();
    }
  }, [uploaded]) 

  useEffect (() => {
    if (imageStorageUrl) {
      updateDonation();
      setUploaded(false);
      setImageName('');
      setImageStorageUrl('');
    }
    
  }, [imageStorageUrl]) 

  const takePhotoFromCamera = async () => {
    try {
      await ImagePicker.openCamera({
        width: 2000,
        height: 3000,
        //cropping: true,
        compressImageQuality: 0.7,
      }).then(image => {
        console.log("Image: ", image);
        setImage(image.path);
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
        width: 2000,
        height: 3000,
        //cropping: true,
        compressImageQuality: 0.7,
      }).then(image => {
        //console.log(image);
        setImage(image.path);
      });
    } catch(error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return false;
      }
      console.log("Error:", error); 
    }
    
  }

  //Confirmation Alert Box
  const showConfirmDialog = () => {
    return Alert.alert(
      "Donation Job Completion",
      "Are you confirmed that the donation job is completed?",
      [
        {
          text: "Back",
        },
        {
          text: "Confirm",
          onPress: () => {
            uploadPhotoToDatabase();
          },
        },
        
      ]
    );
  };

  const uploadPhotoToDatabase = async () => {
    const photoUrl = image;
    let imagename = photoUrl.substring(photoUrl.lastIndexOf('/') + 1);
    console.log("imagename: ", imagename);
    setImageName(imagename);
    setProcessing(true);

    try {
      await storage().ref(imagename).putFile(photoUrl);
      console.log('Image Uploaded!', 'Your image has been uploaded to Cloud storage successfully.');
      setUploaded(true);
    } catch (error) {
      console.log(error);
    }

    // getImageStorageUrl();
    // updateDonation();

    setImage(null);
  }

  const getImageStorageUrl = async () => {
    //const photoUrl = image;
    const url = await storage().ref(imageName).getDownloadURL();
    console.log("getImageStorageUrl function: ", url);
    setImageStorageUrl(url);
  }

  const updateDonation = async () => {
    //console.log("insertData function: ", imageStorageUrl);
    await firestore().collection("DonationRequests")
    .doc(donationId)
    .update({
      donationState: 'Completed',
      donationCompleteTime: firestore.Timestamp.fromDate(new Date()),
      donationCompletePhoto: imageStorageUrl,
    })
    .then(() => {
      setProcessing(false);
      ToastAndroid.show('Donation job completed!', ToastAndroid.LONG,);
      navigation.navigate("Donation History");
    });

  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Kindly upload a photo evidence to show that the donation has been delivered to the requester:</Text>

      {/* <View style={styles.imageContainer}>
        {image != null ? 
          <Image style={styles.imageStyle} source={{uri: image}} /> 
          : <Image style={styles.imageStyle} source={require('../../images/noImage.jpg')}/> }
      </View> */}

      <TouchableOpacity disabled={image ? false : true} style={styles.imageContainer} onPress={() => setVisible(true)}>
        {image != null ? 
          <Image style={styles.imageStyle} source={{uri: image}} /> 
          :<Image style={styles.imageStyle} source={require('../../images/noImage.jpg')} />
        }
      </TouchableOpacity>

      <View style={styles.bottomContainer}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonEnabled} onPress={() => takePhotoFromCamera()} >
              <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonEnabled} onPress={() => uploadPhotoFromDevice()} >
              <Text style={styles.buttonText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            disabled={image ? false : true} 
            style={image ? styles.buttonEnabled : styles.buttonDisabled} 
            onPress={() => showConfirmDialog()} 
          >
              <Text style={styles.buttonText}>Confirm Donation Job Completion</Text>
          </TouchableOpacity>
        </View>

      </View>

      <ImageView
        images={[{uri: image}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />

      {processing &&
      <View style={styles.loading}>
        <ActivityIndicator size={80} color={'#d5f5db'} />
      </View>
      }

    </View>
  )
}

export default CompleteDonationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    //padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    flex: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c7c5c5',
    borderWidth: 2,
    marginBottom: 10,
  },
  imageStyle: {
    width: '100%',
    //position: 'absolute',
    height: '100%',
    //marginBottom: 15,
  },
  bottomContainer: {
    width: '100%',
    flex: 1.5,
    //marginTop: 20,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 10,
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
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