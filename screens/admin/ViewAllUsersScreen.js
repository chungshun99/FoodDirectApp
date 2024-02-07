import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ViewAllUsersScreen = ({navigation}) => {
   
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.bottomContainer}> 

        <View style={styles.buttonContainer}> 
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("User Lists", {role: "Donor", headerTitle: "All Donor List"})}>
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View All Donors</Text>
              <FontAwesome5 name="people-carry" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("User Lists", {role: "Requester", headerTitle: "All Requester List"})} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View All Requesters</Text>
              <FontAwesome5 name="people-carry" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

      </View>

    </ScrollView>
  )
}

export default ViewAllUsersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2ebfc',
  },
  bottomContainer: {
    flex: 1,
    padding: 5,
    paddingVertical: 15,
    marginTop: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#cebfff',
    width: '100%',
    padding: 65,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a387ff',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginLeft: 12,
    //marginTop: 1,
  },
  rowText: {
    color:"black", 
    fontSize: 16, 
    marginLeft: 12,
    fontWeight: '500',
  },
})