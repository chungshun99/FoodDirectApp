import { Keyboard, ToastAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import { FloatingLabelInput } from 'react-native-floating-label-input';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

const ManageFoodListScreen = ({route, navigation}) => {
  const { foodlist } = route.params;

  useEffect(() => {
    setFoodList(foodlist);
  }, []);

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

  const updateRequestList = () => {
    if (foodList.length > 0) {
      //route.params.updateRequestlist(foodList);
      const { updateRequestlist } = route.params;
      updateRequestlist(foodList);
      navigation.goBack();
    } else {
      ToastAndroid.show('Food request list cannot be empty!', ToastAndroid.LONG,);
    }
  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.input}>     
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
          <View style={styles.subButtonRow}>
            <Entypo name="add-to-list" color="black" size={20} style={styles.subButtonRowIcon} />
            <Text style={styles.subButtonRowText}>Add</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Request List:</Text>
            
        {foodList.map((item,index) => (
            <View key={index} style={styles.listRow}>
                <Text style={styles.food}>{'\u2022'} {item}</Text>
                <TouchableOpacity onPress={() => deleteItem(index)} >
                    <Feather name="trash-2" color="black" size={22} style={styles.deleteIcon} />
                </TouchableOpacity>
            </View>
        ))}

        <View style={styles.buttonView}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => updateRequestList()} >
              <Text style={styles.buttonText}>Confirm Changes</Text>
            </TouchableOpacity>
          </View>
        </View>


    </ScrollView>
  )
}

export default ManageFoodListScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,  
    },
    input: {
        //paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 3,
    },
    inputContainerStyle: {
        borderBottomWidth: 1.5,
        //paddingHorizontal: 10,
    },
    inputLabelFocusedStyle: {
        //colorFocused: '#0b16e0',
        fontSizeFocused: 15,
        //fontSizeBlurred: 25,
    },
    inputLabelStyle: {
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
        marginVertical: -8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#cdcfd1',
        backgroundColor: '#cdcfd1',
        borderRadius: 10,
        //justifyContent: "space-between",
    },
    subButtonRowIcon: {
        marginTop: 1,
    },
    subButtonRowText: {
        color:"black", 
        fontSize: 15, 
        marginLeft: 14,
        fontWeight: '700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 10,
        color: 'black', 
        fontSize: 23,
        marginBottom: 10,
    },
    food: {
        flex: 1,
        color: 'black',
        fontSize: 17,
    },
    deleteIcon: {
        //flex: 1,  
        //flexDirection: 'row-reverse',
        //alignItems: 'flex-end',
    },
    listRow: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
        marginTop: 5,
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
})