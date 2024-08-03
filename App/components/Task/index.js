import React, { Component } from 'react'
import { Text, View ,ImageBackground,Button} from 'react-native'
import styles from './style'
// const image = require('./icon.png')
const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};

export default function Task ({navigation}) {
    return (
      // <>
      // <ImageBackground resizeMode='cover' source={image} style={styles.image}>
      //           <View style={styles.container}>

      //     <Button
      //       title="Go to Details"
      //       onPress={() => navigation.navigate('Details')}
      //     />
      //           </View>

      //   </ImageBackground>
      
      // </>
       <View style={styles.container}>
    <ImageBackground source={image} style={styles.image}>
      <Text style={styles.text}>Inside</Text>
    </ImageBackground>
  </View>
  );
};