import { Alert, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImageView from "react-native-image-viewing";

import { AuthContext } from '../../navigation/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';


const UploadDocumentScreen = ({route, navigation}) => {
  const {user,  userRole} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
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
      insertData();
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
        console.log(image);
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
        compressImageQuality: 0.7,
      }).then(image => {
        console.log(image);
        setImage(image.path);
      });
    } catch(error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        return false;
      }
      console.log("Error:", error); 
    }
  }

  const proceed = () => {
    if (image) {
      uploadPhotoToDatabase();
    } else {
      navigation.replace("RequesterHome");
    }
  }

  const uploadPhotoToDatabase = async () => {
    if (image) {
      console.log("uploadphoto to database start");
      const photoUrl = image;
      //console.log(image);
      let imagename = photoUrl.substring(photoUrl.lastIndexOf('/') + 1);
      setImageName(imagename);
      setUploading(true);

      try {
        await storage().ref(imagename).putFile(photoUrl);
        //setUploading(false);
        Alert.alert('Image Uploaded!', 'Your image has been uploaded to Cloud storage successfully.');
        setUploaded(true);
      } catch (error) {
        console.log(error);
      }


      setImage(null);
    } else {
      ToastAndroid.show('Kindly select a photo to upload by taking or choosing from gallery.', ToastAndroid.LONG,);
    }
    
  }

  const getImageStorageUrl = async () => {
    //const photoUrl = image;
    const url = await storage().ref(imageName).getDownloadURL();
    console.log("getImageStorageUrl function: ", url);
    setImageStorageUrl(url);
  }

  const insertData = async () => {
    console.log("insertData function: ", imageStorageUrl);
    if (userRole === 'Requester') {
      await firestore().collection('Users').doc(user.uid).update({
        userExtraDocument: imageStorageUrl,
      })
      .then(() => {
        setUploading(false);
        console.log('User Info Updated!');
        navigation.replace("HomeScreen");
      });
    }
  }

  return (
    <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
      <ImageBackground style={styles.backgroundImage} source={require('../../images/mintGreen2.jpg')}>
      </ImageBackground>

      {/* Bottom View */}
      <View style={styles.bottomView}>
        {/* Welcome View */}
        <View style={{padding: 40}}>
          <Text style={styles.welcomeMessage}>Upload Payslip</Text>
          <Text style={{fontSize:15, color:"black"}}>Please note that this is optional. You may choose to upload your payslip to speed up the verification process.</Text>
          <Text style={{fontSize:15, color:"black", fontStyle:"italic", fontWeight: 'bold'}}>All information provided will be kept confidentially.</Text>
        </View>

        {/* Form View */}
        <View style={styles.formContainer}>    

          {/* Picture View */}          
          <TouchableOpacity disabled={image ? false : true} style={styles.inputContainer} onPress={() => setVisible(true)}>
            {image != null ? 
              <Image style={styles.imageStyle} source={{uri: image}} /> 
              :<Image style={styles.imageStyle} source={require('../../images/noImage.jpg')} />
            }
          </TouchableOpacity>
          
          

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonEnabled} onPress={takePhotoFromCamera} >
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonEnabled} onPress={uploadPhotoFromDevice} >
              <Text style={styles.buttonText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonEnabled} onPress={() => proceed()}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <ImageView
        images={[{uri: image}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />

      {uploading &&
      <View style={styles.loading}>
        <ActivityIndicator size={80} color={'#d5f5db'} />
      </View>
      }
    </ScrollView> 
  )
}

export default UploadDocumentScreen

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
    fontSize: 40,
    marginBottom: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  inputContainer: {
    width: '95%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e64e515',
    borderWidth: 2,
    marginBottom: 10,
  },
  imageStyle: {
    width: '100%',
    height: 250,
    //marginBottom: 15,
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