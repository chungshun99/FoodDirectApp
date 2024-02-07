
import React, { useState } from 'react';
import { StyleSheet, } from 'react-native';

import Providers from './navigation';

const App = () => {
  
  return (
    <Providers />
    // <View style={{ padding: 50, flex: 1, backgroundColor: '#fff' }}>
    //   <TouchableOpacity style={styles.button} onPress={() => console.log('Pressed.')}  >
    //     <Text style={styles.buttonText}>Login</Text>
    //   </TouchableOpacity>
    // </View>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
