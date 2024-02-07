import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];

const UserApprovalScreen = ({navigation}) => {

  const [approvalList, setApprovalList] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect (() => {
    getApprovalList();
    navigation.addListener("focus", () => setRefresh(!refresh));
  }, [navigation, refresh]) 

  const getApprovalList = async () => {
    setApprovalList([]);
    var approvallist = [];
    setRefreshing(true);

    await firestore().collection("Users")
    .where('userVerification', '==', 'Pending')
    .get()
    .then(collectionSnapshot => {
      console.log('Total pending users: ', collectionSnapshot.size);        

      collectionSnapshot.forEach(documentSnapshot => {
        var createdDate = new Date(documentSnapshot.data().userCreatedDate.seconds * 1000 + documentSnapshot.data().userCreatedDate.nanoseconds/1000000);
        let formattedCreateddate = createdDate.getDate() + " " + months[createdDate.getMonth()] + " " + createdDate.getFullYear(); 
        var createddateText = formattedCreateddate.toString();
        
        approvallist.push({ ...documentSnapshot.data(), userRegisterDate: createddateText, id: documentSnapshot.id });
        
        //approvallist.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
      });
    });
    
    setRefreshing(false);
    setApprovalList(approvallist);
  
  } 

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={getApprovalList}
        />
      }
    >
      {approvalList.map((user) => {
        return (
          <TouchableOpacity key={user.id} onPress={() => navigation.navigate("User Details", {userId: user.id, navigateFrom: 'ApprovalScreen'})}>
            <View
              style={styles.pendingContainer}
            >
              <View style={styles.listRow}>
                <View style={styles.details}>
                  <Text style={styles.detailsHeaderText}>User ID: </Text>
                  <Text style={styles.detailsText}>#{user.id}</Text>

                  <View style={styles.iconRow}>
                    <Feather name="user" color="black" size={20} style={styles.iconRowIcon} />
                    <Text style={styles.iconRowText}>{user.userFirstName} {user.userLastName}</Text>
                  </View>

                  <View style={styles.iconRow}>
                    <AntDesign name="calendar" color="black" size={20} style={styles.iconRowIcon} />
                    <Text style={styles.iconRowText}>{user.userRegisterDate}</Text>
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

export default UserApprovalScreen

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
  pendingContainer: {
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