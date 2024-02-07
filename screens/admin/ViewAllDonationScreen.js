import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ViewAllDonationScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.bottomContainer}> 

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("View All Donations List", {status: "Available", headerTitle: "Pending Donation List"})} >
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View All Pending Donation Request</Text>
              <Feather name="loader" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}> 
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("View All Donations List", {status: "Accepted", headerTitle: "Accepted Donation List"})}>
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View All Accepted Donation Jobs</Text>
              <Feather name="check-circle" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}> 
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("View All Donations List", {status: "Completed", headerTitle: "Completed Donation List"})}>
            <View style={styles.row}> 
              <Text style={styles.buttonText}>View All Completed Donation Jobs</Text>
              <MaterialIcons name="done-all" color="black" size={29} style={styles.rowIcon} />
            </View>
          </TouchableOpacity>
        </View>

      </View>

    </ScrollView>
  )
}

export default ViewAllDonationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2ebfc',
    },
    bottomContainer: {
        flex: 1,
        padding: 5,
        paddingVertical: 15,
        marginTop: 45,
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
        padding: 50,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a387ff',
    },
    buttonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
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