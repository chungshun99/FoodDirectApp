import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo, useRef } from 'react'
import { BottomSheet, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler'

const BottomSheetScreen = () => {
    //const bottomSheetModalRef = useRef(null);

    const bottomSheetModalRef = useRef(null);

    // variables
    const snapPoints = ["30%", "70%"];

    // callbacks
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index) => {
      //bottomSheetModalRef.current?.dismiss();
      console.log('handleSheetChanges', index);
    }, []);
    

  return (  
    <View style={styles.container}>
      <Button
        onPress={handlePresentModalPress}
        title="Present Modal"
        color="black"
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheetModal>
    </View>
  )
}

export default BottomSheetScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
})