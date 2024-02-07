import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigation/AuthProvider';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ViewUserDonationListScreen = ({route, navigation}) => {
  const { userId, userRole } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [temphistoryList, setTempHistoryList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  
  useEffect (() => {
    getTempDonationHistory();
    setRefreshing(false);
  }, []) 

  useEffect (() => {
    if (temphistoryList.length > 0) {
      getHistoryList();
    } 
  }, [temphistoryList]) 

  const getHistoryList = async () => {
    var fullhistorylist = [];
    await firestore().collection("Users")
    .get()
    .then(collectionSnapshot => {  

      collectionSnapshot.forEach(userSnapshot => {
        temphistoryList.forEach((history) => {
          if (userSnapshot.id === history.requesterID) {
            var fullhistory = {};
            fullhistory = history;
            fullhistory['requesterName'] = userSnapshot.data().userFirstName + " " + userSnapshot.data().userLastName;
            fullhistorylist.push(fullhistory);
            //console.log("fullhistorylist", fullhistorylist);
          }
        })
      });
    });
    
    setRefreshing(false);
    setHistoryList(fullhistorylist);
  }

  const getTempDonationHistory = async () => {
    setTempHistoryList([]);
    setHistoryList([]);
    var donationList = [];
    setRefreshing(true);

    await firestore().collection("DonationRequests")
    .where(userRole, '==', userId)
    .orderBy('donationAcceptTime', 'desc')
    .get()
    .then(collectionSnapshot => {
      console.log('Total donations: ', collectionSnapshot.size);        
      
      collectionSnapshot.forEach(donationRequestSnapshot => {
        //var date = donationRequestSnapshot.data().donationAcceptTime;
        var date = new Date(donationRequestSnapshot.data().donationAcceptTime.seconds * 1000 + donationRequestSnapshot.data().donationAcceptTime.nanoseconds/1000000);
        let formatted_date = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(); 
        var datetext = formatted_date.toString();
        
        donationList.push({ ...donationRequestSnapshot.data(), donationAcceptdate: datetext, id: donationRequestSnapshot.id });
        console.log("donationList: ", donationList);
      });
    });

    setTempHistoryList(donationList);
    
  }
  
  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={getTempDonationHistory}
        />
      }
    >
      {historyList.map((history) => {
        return (
          <TouchableOpacity key={history.id} onPress={() => navigation.navigate("Donation Details", {donationId: history.id})}>
            <View
              style={history.donationState == 'Completed' ? styles.completedHistoryContainer : styles.pendingHistoryContainer}
            >
              <View style={styles.listRow}>
                <View style={styles.details}>
                  <Text style={styles.detailsHeaderText}>Donation ID: </Text>
                  <Text style={styles.detailsText}>#{history.id}</Text>

                  <View style={styles.iconRow}>
                    <Feather name="user" color="black" size={20} style={styles.iconRowIcon} />
                    <Text style={styles.iconRowText}>{history.requesterName}</Text>
                  </View>

                  <View style={styles.iconRow}>
                    <Feather name="info" color="black" size={20} style={styles.iconRowIcon} />
                    <Text style={styles.iconRowText}>{history.donationState}</Text>
                  </View>

                  <View style={styles.iconRow}>
                    <AntDesign name="calendar" color="black" size={20} style={styles.iconRowIcon} />
                    <Text style={styles.iconRowText}>{history.donationAcceptdate}</Text>
                  </View>
                </View>
                <MaterialIcons name="navigate-next" color="black" size={25} style={styles.rowIcon} />
              </View>
            </View>
          </TouchableOpacity>
        )
      })}

    </ScrollView>
  )
}

export default ViewUserDonationListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f2ebfc',
  },
  completedHistoryContainer: {
    backgroundColor: '#d1f0d9',
    padding: 13, 
    borderRadius: 15,
    marginBottom: 15,
    // borderColor: '#000000',
    // borderWidth: 0.8,
  },
  acceptedHistoryContainer: {
    backgroundColor: '#f5f384',
    padding: 13, 
    borderRadius: 15,
    marginBottom: 15,
    // borderColor: '#000000',
    // borderWidth: 0.8,
  },
  pendingHistoryContainer: {
    backgroundColor: '#cfcfcf',
    padding: 13, 
    borderRadius: 15,
    marginBottom: 15,
    // borderColor: '#000000',
    // borderWidth: 0.8,
  },
  details: {
    flex: 1,
  },
  detailsHeaderText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
  },
  detailsText: {
    color: 'black',
    fontSize: 16,
    marginTop: 5,
  },
  rowIcon: {
    //flex: 1,  
    //flexDirection: 'row-reverse',
    //alignItems: 'flex-end',
  },
  listRow: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 7,
    marginTop: 10,
    //paddingVertical: 8,
    //paddingHorizontal: 15,
  },
  iconRowIcon: {
    //marginTop: 1,
  },
  iconRowText: {
    color:"black", 
    fontSize: 14, 
    marginLeft: 10,
    //fontWeight: '400',
    justifyContent: 'center',
    alignItems: 'center',
  },
})