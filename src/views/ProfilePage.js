import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import AddButton from '../components/AddButton.js';

const resizeMode = 'center';

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);

  }
  
  render() {
    return (
      <View style={styles.container}>
       
        <ImageBackground
            style={styles.pattern}
            source={require('../images/profile_bg.jpg')}
          >
         
         
          <Image style= {styles.avatar} source={require('../images/blank.jpg')} />
          <Text> {this.props.name} </Text>
          <View style={styles.locationbar}>
            <Icon name='rocket' />
            <Text>Hails from: {this.props.location}</Text>
          </View>
        </ImageBackground> 

        <View >
          <AddButton />
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

  avatar: {
    height: 30,
    width: 30
  },

  locationbar: {
    flexDirection: 'row'
  },

  pattern: {
    backgroundColor: '#ccc',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '30%',
    justifyContent: 'center',
  }

})


