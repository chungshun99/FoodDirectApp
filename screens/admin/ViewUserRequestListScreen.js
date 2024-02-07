import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import firestore from '@react-native-firebase/firestore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ViewUserRequestListScreen = ({route, navigation}) => {
    const { userId } = route.params;

    const [refresh, setRefresh] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [historyList, setHistoryList] = useState([]);
  
    useEffect (() => {
        getDonationRequestHistory();
    }, []) 
  
    const getDonationRequestHistory = async () => {
        setHistoryList([]);
        var requestList = [];
        setRefreshing(true);
    
        await firestore().collection("DonationRequests")
        .where('requesterID', '==', userId)
        .orderBy('donationRequestTime', 'desc')
        .get()
        .then(collectionSnapshot => {
            console.log('Total requests: ', collectionSnapshot.size);        
            
            collectionSnapshot.forEach(document => {
            //var date = donationRequestSnapshot.data().donationAcceptTime;
            var date = new Date(document.data().donationRequestTime.seconds * 1000 + document.data().donationRequestTime.nanoseconds/1000000);
            let formatted_date = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();  
            
            var datetext = formatted_date.toString();
            
            requestList.push({ ...document.data(), donationRequestdate: datetext, id: document.id });
            console.log("requestList: ", requestList);
            });
        });
        
        setRefreshing(false);
        setHistoryList(requestList);    
    }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={getDonationRequestHistory}
        />
      }
    >
      {historyList.map((history) => {
        return (
          <TouchableOpacity key={history.id} onPress={() => navigation.navigate("Request Details", {donationId: history.id})}>
            <View
            style={history.donationState == 'Completed' ? styles.completedHistoryContainer : 
            history.donationState == 'Accepted' ? styles.acceptedHistoryContainer : 
            styles.pendingHistoryContainer}
            >
              <View style={styles.listRow}>
                <View style={styles.details}>
                  <Text style={styles.detailsHeaderText}>Donation Request ID: </Text>

                    <Text style={styles.detailsText}>#{history.id}</Text>

                  <View style={styles.iconRow}>
                    <Feather name="info" color="black" size={20} style={styles.iconRowIcon} />
                    <Text style={styles.iconRowText}>{history.donationState}</Text>
                  </View>

                  <View style={styles.iconRow}>
                    <AntDesign name="calendar" color="black" size={20} style={styles.iconRowIcon} />
                    <Text style={styles.iconRowText}>{history.donationRequestdate}</Text>
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

export default ViewUserRequestListScreen

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